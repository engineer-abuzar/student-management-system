import jwt from 'jsonwebtoken'
import connectDB from '../../Database.js'
const SECRET_KEY=process.env.JWT_SECRET
const getPdfFile=async (req,res) => {
    
    const userdata=jwt.verify(req.cookies.smsShobhitUniversity,SECRET_KEY)
    console.log(userdata)
    const email=userdata.email
    const mobileNumber=userdata.phone

    try {
        const connection=await connectDB()
        const query='select * from student_documents where email=? or mobileNumber=?'
        const values=[email,mobileNumber]
        const [result]=await connection.execute(query,values)
        console.log(result[0])
        const base64Pdf = result[0].pdfFile.toString('base64');
       return res.json({ pdf: base64Pdf });
    } catch (error) {
        console.log('error getting file',error)
        
    }

    
}

export default getPdfFile