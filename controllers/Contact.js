// controllers/contact.js  (just replace your current sendMail block)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,           // STARTTLS works better on Railway
  secure: false,       // because 587
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,   // 16-char App Password
  },
  // extra visibility:
  logger: true,
  debug: true,
  connectionTimeout: 20000,
  socketTimeout: 20000,
});

const mailOptions = {
  from: `"G-Mart Contact" <${process.env.EMAIL_USER}>`,
  to: process.env.RECIVER_EMAIL,          // (your env key spelling matches code)
  replyTo: email,
  subject: `New Contact from ${name}`,
  text:
`Name: ${name}
Email: ${email}
Phone: ${phone || "-"}
Category: ${category}
Message: ${message}`,
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("❌ Email error:", err);
  } else {
    console.log("✅ Email accepted by SMTP:", {
      messageId: info.messageId,
      envelope: info.envelope,
      response: info.response,
    });
  }
});
