import connectDB from "../../Database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const SECRET_KEY = process.env.JWT_SECRET;

const login = async (req, res) => {
    try {
        console.log("Login Attempt:", req.body);

        const { role,username, password } = req.body;

        if (!username || !password) {
            return res.redirect('/?error=All_Fields_Required');
        }
        if(role==='admin'){
            const db = await connectDB();

            // 🔍 Query to check if user exists
            const query = "SELECT * FROM instructors WHERE email = ? OR phone = ?";
            const [results] = await db.execute(query, [username, username]);
    console.log(results)
            if (results.length === 0) {
                return res.redirect('/?error=Invalid_email_or_password');
            }
    
       
    
            const user = results[0];
    
            // 🔑 Password check (Plain text)
            if (user.password !== password) {
                return res.redirect('/?error=Incorrect_Password_Or_Email');
            }
    console.log(user)
            // 🔥 Generate JWT Token
            const payload = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                phone: user.phone,
                id: user.instructor_id,
                department:user.department
            };
    
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "100h" });
    
           
            res.cookie("smsShobhitUniversity", token, { httpOnly: true });
    
            console.log("JWT Generated:", token);
    
            // ✅ Redirect to Dashboard
           return res.redirect('/api/admin/manageStudents');
    
  
        }

        
        const db = await connectDB();

        // 🔍 Query to check if user exists
        const query = "SELECT * FROM student_details WHERE email = ? OR mobileNumber = ?";
        const [results] = await db.execute(query, [username, username]);

        if (results.length === 0) {
            return res.redirect('/?error=Student_Not_Found');
        }

   

        const user = results[0];

        // 🔑 Password check (Plain text)
        if (user.password !== password) {
            return res.redirect('/?error=Incorrect_Password_Or_Email');
        }

        // 🔥 Generate JWT Token
        const payload = {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.mobileNumber,
            semester:user.semester,
            id: user.id
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "100h" });

       
        res.cookie("smsShobhitUniversity", token, { httpOnly: true });

        console.log("JWT Generated:", token);

        // ✅ Redirect to Dashboard
        res.redirect('/api/user/dashboard');

    } catch (error) {
        console.error("Login Error:", error);
        res.redirect('/?error=Try_Again_Later');
    }
};

export default login;
