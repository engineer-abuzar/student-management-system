
import connectDB from '../../Database.js'
import jwt from 'jsonwebtoken'
const SECRET_KEY=process.env.JWT_SECRET



const enrollmentGet = (req, res) => {

    res.clearCookie("id", { httpOnly: true, secure: true });
    res.render('enrollment', { title: 'enrollment', isloggedIn: false });
};

const enrollmentPost = async (req, res) => {
    console.log(req.file);
    const imageBuffer = req.file ? req.file.buffer : null; // Ensure req.file exists before accessing buffer

    const { first_name, middle_name, last_name, dob, email, phone,password, street_address, district, state, country, zip, department, programme, userInput } = req.body;
console.log(req.body)
    // Check if any field is missing
    if (!first_name || !last_name || !dob || !email || !phone || !password || !street_address || !district || !state || !country || !zip || !department || !programme || !userInput) {
        return res.redirect('/api/user/enrollment?error=All_fields_are_required!');
    }

    // ✅ Validate OTP
    const generatedOtp = req.otp;
    if (generatedOtp !== userInput) {
        return res.redirect('/api/user/enrollment?error=Invalid_Otp');
    }

    // ✅ Age validation
    const todayYear = new Date().getFullYear();
    const birthYear = parseInt(dob.split('-')[0], 10);
    const age = todayYear - birthYear;
    if (age < 18) {
        return res.redirect('/api/user/enrollment?error=Student_age_should_be_greater_than_18');
    }

    try {
        // ✅ Establish DB Connection
        const connection = await connectDB();

        // ✅ INSERT Query
        const insertQuery = `
    INSERT INTO student_details 
    (firstName, middleName, lastName, dob, email, mobileNumber, address, district, state, country, pincode, department, programme, profileImage, password, registrationStatus) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;


        const registrationStatus=1
        const values = [first_name, middle_name, last_name, dob, email, phone, street_address, district, state, country, zip, department, programme, imageBuffer,password,registrationStatus];

        // ✅ Execute Query
        const [result] = await connection.execute(insertQuery, values);

        console.log('✅ Student registered successfully:', result.insertId);
        await connection.end(); // ✅ Close connection
        const payload={
            name:first_name+last_name,
            email:email,
            phone:phone,
            id:result.insertId
        }
        const token=jwt.sign(payload,SECRET_KEY)
        res.cookie('smsShobhitUniversity',token)

        return res.redirect('/api/user/dashboard');
    } catch (error) {
        console.error('❌ Error inserting data:', error.message,error);
        return res.redirect('/api/user/enrollment?error=Error_inserting_data');
    }
};

export default { enrollmentGet, enrollmentPost };
