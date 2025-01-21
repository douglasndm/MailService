import nodemailder from 'nodemailer';

const transporter = nodemailder.createTransport({
    host: process.env.SMTP_MAIL_HOST,
    port: process.env.SMTP_MAIL_PORT,
    auth: {
        user: process.env.SMTP_MAIL_USER,
        pass: process.env.SMTP_MAIL_PASS,
    },
    secure: true,
    logger: true,
    tls: {
        ciphers: 'SSLv3',
    },
});

export default transporter;
