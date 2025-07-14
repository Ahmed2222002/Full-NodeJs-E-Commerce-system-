import nodemailer from 'nodemailer';
import { IEmailOptions } from '../interfaces/emailInterface';
async function sendEmail(options : IEmailOptions) {

    // Create a transporter for SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST as string,
        port: process.env.SMTP_PORT as unknown as number,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    //2-define mail options
    const mailOptions = {
        from: process.env.SMTP_FROM_NAME,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
}

export { sendEmail };