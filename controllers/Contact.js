
import nodemailer from "nodemailer";
import { Contacts } from "../models/contact.js";

const STEP = 1; // 👉 Isko 1,2,3 karke change karo test ke liye

// ✅ Nodemailer transporter (sirf STEP 3 ke liye useful)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Gmail App Password
  },
  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

export const contact = async (req, res) => {
  console.log("📩 Contact route hit, body:", req.body);

  try {
    // STEP 1: Sirf route test
    if (STEP === 1) {
      return res.status(200).json({ success: true, message: "Route working ✅" });
    }

    // STEP 2: DB save test (email skip)
    if (STEP === 2) {
      const doc = await Contacts.create(req.body);
      console.log("💾 DB saved:", doc._id);
      return res.status(201).json({ success: true, message: "Saved to DB ✅" });
    }

    // STEP 3: Full (DB + Email non-blocking)
    if (STEP === 3) {
      const doc = await Contacts.create(req.body);
      console.log("💾 DB saved:", doc._id);

      // Pehle response bhej do (fast)
      res.status(201).json({ success: true, message: "Contact submitted ✅" });
      console.log("📤 Response sent to frontend");

      // Email ko background me bhejo
      process.nextTick(async () => {
        try {
          console.log("📧 Sending email...");
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.RECIVER_EMAIL,
            subject: `New Contact from ${req.body.name} (${req.body.category})`,
            text: JSON.stringify(req.body, null, 2),
            replyTo: req.body.email,
          });
          console.log("✅ Email sent");
        } catch (mailErr) {
          console.error("❌ Email send failed:", mailErr.message);
        }
      });
    }
  } catch (err) {
    console.error("💥 Contact route error:", err.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: err?.message || "Server error",
      });
    }
  }
};