import jwt from 'jsonwebtoken'
import connectDB from '../../Database.js'
const SECRET_KEY=process.env.JWT_SECRET
const profile=async (req,res) => {
const token=req.cookies.smsShobhitUniversity
const userDetails=jwt.verify(token,SECRET_KEY)
try {
    const connection=await connectDB()

    const query=`select * from student_details where email=? or mobileNumber=?`
    const value=[userDetails.email,userDetails.phone]
    const [results]= await connection.execute(query,value)
    
   return res.render('profile',{title:'profile',user:results[0]},)
} catch (error) {
    console.log('Error',error)
    return res.redirect('/?error=Login_First')
}
    
}

export default profile