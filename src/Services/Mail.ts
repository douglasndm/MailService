import nodemailder from 'nodemailer';

const transporter = nodemailder.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    secure: false,
    logger: true,
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});

export default transporter;
