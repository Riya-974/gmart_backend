import nodemailer from "nodemailer";
import { Contacts } from "../models/contact.js";

export const contact = async (req, res) => {
  try {
    const { name, email, phone, message, category } = req.body;

    if (!name || !email || !message || !category) {
      return res.status(400).json({
        success: false,
        message: "name, email, message, category is required",
      });
    }

    // 1. Save in DB
    await Contacts.create({ name, email, phone, message, category });

    // 2. Respond fast
    res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
    });

    // 3. Send email in background
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,      // STARTTLS (works better on Railway/Render)
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Gmail App Password
      },
    });

    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: process.env.RECIVER_EMAIL,
        subject: `New Contact from ${name}`,
        text: `Name: ${name}
Email: ${email}
Phone: ${phone || "-"}
Category: ${category}
Message: ${message}`,
        replyTo: email,
      },
      (err, info) => {
        if (err) {
          console.error("❌ Email error:", err.message);
        } else {
          console.log("✅ Email sent:", info.response);
        }
      }
    );
  } catch (err) {
    console.error("💥 Contact error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};