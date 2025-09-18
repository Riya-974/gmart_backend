import { Resend } from "resend";
import { contact} from "../models/contact.js";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/v1/contacts/contact
export const contact = async (req, res) => {
  try {
    const { name, email, phone, message, category } = req.body;
    if (!name || !email || !message || !category) {
      return res.status(400).json({ success:false, message:"name, email, message, category is required" });
    }

    // DB save
    const doc = await Contacts.create({ name, email, phone, message, category });

    // ✅ Send response FIRST (so frontend never times out)
    res.status(201).json({ success:true, message:"Contact submitted ✅", id: doc._id });
    console.log("📤 response sent, sending email in background…");

    // 📨 Email in background (no await)
    setImmediate(async () => {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: process.env.RECIVER_EMAIL,
          reply_to: email,
          subject: `New Contact from ${name} (${category})`,
          text:
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone || "-"}\n` +
            `Category: ${category}\n` +
            `Message:\n${message}\n`,
        });
        console.log("✅ Resend: email dispatched");
      } catch (e) {
        console.error("❌ Resend email failed:", e?.message || e);
      }
    });
  } catch (err) {
    console.error("💥 contact error:", err?.message || err);
    if (!res.headersSent) {
      return res.status(500).json({ success:false, message:"Server error" });
    }
  }
};