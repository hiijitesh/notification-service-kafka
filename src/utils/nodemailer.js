require("dotenv").config();
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, i'm must use a wrapper
async function sendEmail(message) {
    const transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: "jiteshece@gmail.com",
            pass: process.env.GOOGLE_MAIL_PASS,
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail(message);

    console.log("EMAIL sent ======>>", info.messageId);

    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports = sendEmail;
