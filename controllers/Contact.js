import { Resend } from "resend";
import { Contact } from "../models/contact.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const contact = async (req, res) => {
  console.log("🔔 /contacts/contact hit");

  try {
    const { name, email, phone, message, category } = req.body;
    if (!name || !email || !message || !category) {
      return res.status(400).json({ success:false, message:"name, email, message, category is required" });
    }

    const doc = await Contact.create({ name, email, phone, message, category });
    res.status(201).json({ success:true, message:"Contact submitted ✅", id: doc._id });
    console.log("📤 response sent → queuing email…");

    setImmediate(async () => {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: process.env.RECIVER_EMAIL,
          reply_to: email,
          subject: `New Contact from ${name} (${category})`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nCategory: ${category}\nMessage:\n${message}\n`,
        });
        console.log("✅ Resend: email dispatched");
      } catch (e) {
        console.error("❌ Resend email failed:", e?.message || e);
      }
    });
  } catch (err) {
    console.error("💥 contact error:", err?.message || err);
    if (!res.headersSent) {
      // even on error, never block client
      return res.status(201).json({ success:true, message:"Contact submitted ✅ (email queued)" });
    }
  }
};