import jwt from 'jsonwebtoken'
import connectDB from '../../Database.js'


const SECRET_KEY=process.env.JWT_SECRET
const classroomGET=async (req,res)=>{
    if(!req.cookies.smsShobhitUniversity){
        return res.redirect('/?error=Login_first')
    }
    const userdata=jwt.verify(req.cookies.smsShobhitUniversity,SECRET_KEY)
    try {
        const query='select * from student_details where id=?'
        const connection= await connectDB()
        const [results]= await connection.execute(query,[userdata.id])
console.log('classroom logs',results[0])
const addmissionStatus=results[0].addmissionStatus
const semester=results[0].semester
 return res.render('classRoom',{title:'classroom',addmissionStatus,semester})

    } catch (error) {
        console.log('Error in classroom controller',error)
       return res.redirect('/api/user/dashboard?error=Try_again_later')
    }
    
    
}

export default classroomGET