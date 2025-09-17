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

    // 2. Fast response
    res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
    });

    // 3. Email (verbose for debugging)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      logger: true,
      debug: true,
      connectionTimeout: 20000,
      socketTimeout: 20000,
    });

    const mailOptions = {
      from: `"G-Mart Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIVER_EMAIL,
      replyTo: email,
      subject: `New Contact from ${name}`,
      text: `Name: ${name}
Email: ${email}
Phone: ${phone || "-"}
Category: ${category}
Message: ${message}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Email error:", err.message);
      } else {
        console.log("✅ Email accepted by SMTP:", info.response);
      }
    });

  } catch (err) {
    console.error("💥 Contact error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};