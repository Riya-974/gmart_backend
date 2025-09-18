import { Resend } from "resend";
import { Contacts } from "../models/contact.js";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/v1/contacts/contact
export const contact = async (req, res) => {
  console.log("CONTACT v3 (resend-bg) route hit"); // version marker

  try {
    const { name, email, phone, message, category } = req.body;
    if (!name || !email || !message || !category) {
      return res.status(400).json({ success:false, message:"name, email, message, category is required" });
    }

    // 1) Save to DB
    const doc = await Contacts.create({ name, email, phone, message, category });

    // 2) Respond immediately (no timeouts on client)
    res.status(201).json({ success:true, message:"Contact submitted ✅", id: doc._id });
    console.log("📤 response sent → sending email in background…");

    // 3) Email in background (never blocks/never affects response)
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
        // sirf log; client ko kabhi error mat bhejo
        console.error("❌ Resend email failed:", e?.message || e);
      }
    });

  } catch (err) {
    console.error("💥 contact error:", err?.message || err);
    if (!res.headersSent) {
      return res.status(201).json({ success:true, message:"Contact submitted ✅ (email queued)" });
    }
  }
};