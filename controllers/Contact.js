import nodemailer from "nodemailer";

export const contact = async (req, res) => {
  try {
    const { name, email, category, message } = req.body;

    // Transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Gmail App Password
      },
    });

    // Mail options
    const mailOptions = {
      from: `"Gmart Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIVER_EMAIL,
      subject: `New Contact from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Category: ${category}
        Message: ${message}
      `,
    };

    // Send mail with debug
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send error:", error); // Logs full error
        return res.status(500).json({
          success: false,
          message: "Email not sent",
          error: error.message,
        });
      }
      console.log("Email sent successfully:", info.response); // Logs success
      return res.status(200).json({
        success: true,
        message: "Contact submitted and email sent successfully",
      });
    });

  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};