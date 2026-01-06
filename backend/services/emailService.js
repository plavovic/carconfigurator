const nodemailer = require('nodemailer');

const {
  EMAIL_USER = 'carconfdealer@gmail.com',
  EMAIL_PASS,
} = process.env;

let transporter = null;
function getTransport() {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('Email disabled: missing EMAIL_USER or EMAIL_PASS');
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
  return transporter;
}

async function sendOrderConfirmation({ to, userName, order }) {
  if (!to) throw new Error('Missing recipient email');
  const t = getTransport();
  if (!t) {
    console.warn('Skipping email send; transporter not configured');
    return null;
  }

  const createdAt = order.created_at || order.createdAt || new Date();
  const status = (order.status || 'PENDING').toString().toUpperCase();

  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject: 'Your car order is confirmed 🚗',
    text: `Hi ${userName || 'there'},\n\nYour order ${order.order_number || order.id} has been successfully placed.\n\nOrder date: ${new Date(createdAt).toLocaleString()}\nCurrent status: ${status}\n\nYou can track your order by logging into your account:\nhttps://yourapp.com/profile\n\nThanks,\nCar Configurator Team`,
  };

  return t.sendMail(mailOptions);
}

module.exports = {
  sendOrderConfirmation,
};
