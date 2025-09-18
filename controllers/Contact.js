// controllers/contact.js
import { Resend } from "resend";
import { Contacts } from "../models/contact.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const contact = async (req, res) => {
  try {
    const { name, email, phone, message, category } = req.body;

    if (!name || !email || !message || !category) {
      return res.status(400).json({
        success: false,
        message: "name, email, message, category is required",
      });
    }

    // DB save
    const doc = await Contacts.create({ name, email, phone, message, category });

    // Email send
    await resend.emails.send({
      from: "onboarding@resend.dev", // default sender (free plan)
      to: process.env.RECIVER_EMAIL, // tumhari receiving email
      subject: `New Contact from ${name} (${category})`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || "-"}
        Category: ${category}
        Message: ${message}
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Contact submitted & email sent ✅",
      contact: doc,
    });
  } catch (err) {
    console.error("💥 Contact error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Email sending failed ❌",
    });
  }
};