const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendInviteEmail = async ({ email, permission, workspace }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Workspace Invitation',
      html: `
        <h1>You've been invited!</h1>
        <p>You have been invited to join the workspace with ${permission} permissions.</p>
        <p>Workspace ID: ${workspace}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

module.exports = { sendInviteEmail };