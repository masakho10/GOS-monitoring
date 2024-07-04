// src/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'metzozibaka@protonmail.com', // Remplacez par votre email
    pass: '5Ngs4RT4dg7E2r',    // Remplacez par votre mot de passe
  },
});

const sendErrorEmail = (subject, text) => {
  const mailOptions = {
    from: 'metzozibaka@protonmail.com', // Remplacez par votre email
    to: 'metzozibaka@gmail.com',  // Remplacez par l'email du destinataire
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendErrorEmail;
