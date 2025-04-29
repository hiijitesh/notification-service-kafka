require("dotenv").config();

// const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// const client = new twilio(accountSid, authToken);
const client = require("twilio")(accountSid, authToken);

function sendSMS(obj) {
    const { body, to, from } = obj;
    client.messages
        .create({
            body,
            from: from ?? "+12183876177",
            to: to || "+918873585848",
        })
        .then((message) => console.log(message.sid));
}

module.exports = sendSMS;
