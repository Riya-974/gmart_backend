// controllers/contact.js
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

    // save
    const doc = await Contacts.create({ name, email, phone, message, category });

    // (optional) populate safely if category is ObjectId, else skip
    // const saved = await Contacts.findById(doc._id).populate("category");

    // mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIVER_EMAIL,
      subject: `New Contact from ${name} (${category})`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || "-"}\n` +
        `Category: ${category}\n` +
        `Message: ${message}\n`,
      replyTo: email,
    };

    await transporter.sendMail(mailOption);

    return res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      // contact: saved ?? doc
    });
  } catch (err) {
    console.error("contact error:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server error. Please try later.",
    });
  }
};