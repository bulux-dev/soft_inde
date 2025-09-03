import nodemailer from 'nodemailer';

const Mailer = nodemailer.createTransport({
  name: 'smtp.forwardemail.net',
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    user: `soporte@${process.env.DOMAIN}`,
    pass: 'R00t2024$'
  },
  tls: {
    rejectUnauthorized: false,
  }
});

export default Mailer;