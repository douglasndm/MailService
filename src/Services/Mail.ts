import nodemailder from 'nodemailer';

const transporter = nodemailder.createTransport({
    host: process.env.SMTP_MAIL_HOST,
    port: process.env.SMTP_MAIL_PORT,
    auth: {
        user: process.env.SMTP_MAIL_USER,
        pass: process.env.SMTP_MAIL_PASS,
    },
    secure: false,
    logger: true,
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});

export default transporter;
