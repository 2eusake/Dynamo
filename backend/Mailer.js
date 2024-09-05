const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Yahoo, Outlook, etc.
  auth: {
    user: "vhuhuludzhivhuhok@gmail.com",
    pass: "nyasivhavhone",
  },
});

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: "vhuhuludzhivhuhok@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendMail;
