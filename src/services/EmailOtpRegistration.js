import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'faltufaltu929@gmail.com',
        pass: process.env.APP_PASSWORD, 
    },
});

const sendEmail = async (userEmail, otp) => {
    const mailOptions = {
        from: 'faltufaltu929@gmail.com',
        to: userEmail,  
        subject: 'Shobhit University Student Registration',
        text: `Thank you for Registration! Your OTP is ${otp}`,
    };

    try {
        const info = await transport.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error:', error);
    }
};

export default sendEmail
