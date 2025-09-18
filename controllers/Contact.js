import nodemailer from "nodemailer";

export const contact = async (req, res) => {
  try {
    const { name, email, category, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
      logger: true,
      debug: true,
      connectionTimeout: 20000,
      socketTimeout: 20000,
    });

    const mailOptions = {
      from: `"G-Mart Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIVER_EMAIL, // env key spelling yahi hai na? (RECIVER_EMAIL)
      replyTo: email,
      subject: `New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCategory: ${category}\nMessage: ${message}`,
    };

    // ✅ DEBUG: promise style so we can print exact reason
    transporter
      .sendMail(mailOptions)
      .then((info) => {
        console.log("✅ SMTP OK:", {
          response: info.response,
          messageId: info.messageId,
          envelope: info.envelope,
        });
        return res.json({ success: true, message: "Email sent successfully 🚀" });
      })
      .catch((err) => {
        console.error("❌ SMTP ERR:", {
          message: err.message,
          code: err.code,
          command: err.command,
          response: err.response,
        });
        // TEMP: user ko exact reason dikhado (debug ke liye)
        return res
          .status(500)
          .json({ success: false, message: `Email not sent: ${err.message}` });
      });
  } catch (error) {
    console.error("❌ Controller error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};