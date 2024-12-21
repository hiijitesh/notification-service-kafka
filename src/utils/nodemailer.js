require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "jiteshece@gmail.com",
        pass: process.env.GOOGLE_MAIL_PASS,
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    let message = {
        from: '"Jitesh Kumar" <jiteshece@gmail.email>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    };

    // send mail with defined transport object
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
