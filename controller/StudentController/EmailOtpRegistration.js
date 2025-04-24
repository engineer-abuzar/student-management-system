import dotenv from 'dotenv';
dotenv.config();
import sendEmail from '../../src/services/EmailOtpRegistration.js';
import otpGenerator from "otp-generator";
import jwt from 'jsonwebtoken'
const SECRET_KEY = process.env.JWT_SECRET



const EmailOtpRegistration = (req, res) => {
    const { email } = req.body;

    // Generate a 6-digit numeric OTP
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });

    console.log("Generated OTP:", otp);

    // Send OTP to email
    sendEmail(email, otp);

    // Encrypt OTP before storing it in a cookie
  const payload={otp:otp}
  const encryptedOtp=jwt.sign(otp,SECRET_KEY)
    console.log(encryptedOtp)

    res.cookie("id", encryptedOtp, { httpOnly: true, secure: true });

    res.json({ message: "OTP sent successfully!" });
};





export default EmailOtpRegistration;
