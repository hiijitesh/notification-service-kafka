require("dotenv").config();
const nodemailer = require("nodemailer");

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

// async..await is not allowed in global scope, i'm must use a wrapper
async function main(message) {
    // send mail with defined transport object
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

let subject = "Hello From Node Mailer 2.0";
let message = {
    from: '"Jitesh Kumar" <jiteshece@gmail.email>', // sender address
    to: "jitesbharti@gmail.com", // list of receivers
    bcc: "vinishbhaskar321@gmail.com,soorajyadav137@gmail.com",
    subject: subject, // Subject line
    text: "Hello Bros, sup? !!!", // plain text body
    html: "<b>Hello world?</b>", // html body
};

main(message).catch(console.error);
