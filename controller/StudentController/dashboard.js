import connectDB from "../../Database.js";
import jwt from 'jsonwebtoken'
const SECRET_KEY=process.env.JWT_SECRET
const dashboardGET = async (req, res) => {
    
    const data=jwt.verify(req.cookies.smsShobhitUniversity,SECRET_KEY)

    const studentId = data.id

    try {

        const connection = await connectDB();

     
        const [studentDetails] = await connection.execute(
            "SELECT * FROM student_details WHERE id = ?", 
            [studentId]
        );

  
        await connection.end();
console.log(studentDetails[0])
     const profileImage=studentDetails[0].profileImage.toString("base64")
     

       return res.render('dashboard', { 
            title: 'Dashboard', 
            isloggedIn: true, 
            studentDetails: studentDetails.length ? studentDetails[0] : null ,
            profileImage
        });

    } catch (error) {
        console.error("❌ Error fetching student details:", error.message);
        return res.redirect('/error=LogIn_First')
    }
};

export default dashboardGET;
