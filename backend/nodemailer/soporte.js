import nodemailer from 'nodemailer';

const SoporteMailer = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  name: 'smtp.forwardemail.net',
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

export default SoporteMailer;