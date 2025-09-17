import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { Contacts } from "../models/contact.js";
import { Category } from "../models/category.js";

// 1) SMTP transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  connectionTimeout: 15000, greetingTimeout: 10000, socketTimeout: 20000,
});
transporter.verify().then(() => console.log("SMTP ready"))
  .catch(e => console.error("SMTP verify failed:", e.message));

// 2) Production handler: save + respond + email in background
export const contact = async (req, res) => {
  try {
    let { name, email, phone, message, category } = req.body;
    if (!name || !email || !message || !category) {
      return res.status(400).json({ success:false, message:"name, email, message, category is required" });
    }

    // ensure category is ObjectId (fallback: resolve by name)
    if (!mongoose.Types.ObjectId.isValid(category)) {
      const cat = await Category.findOne({ name: category.trim() }).select("_id");
      if (!cat) return res.status(400).json({ success:false, message:"Invalid category" });
      category = cat._id;
    }

    const doc = await Contacts.create({ name, email, phone, message, category });
    console.log("💾 saved contact:", doc._id?.toString());

    // respond first (no timeout)
    res.status(201).json({ success:true, message:"Contact submitted successfully" });

    // fire-and-forget email
    process.nextTick(async () => {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.RECIVER_EMAIL,
          subject: `New Contact from ${name}`,
          text:
            `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\n` +
            `Category: ${category}\nMessage:\n${message}\n`,
          replyTo: email,
        });
        console.log("✅ email sent");
      } catch (e) {
        console.error("❌ email failed:", e.message);
      }
    });

  } catch (err) {
    console.error("💥 contact error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ success:false, message: err?.message || "Server error" });
    }
  }
};