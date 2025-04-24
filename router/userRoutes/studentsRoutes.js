import express from 'express'
import multer from 'multer';
import EmailOtpRegistration from '../../controller/StudentController/EmailOtpRegistration.js';
import connectDB from '../../Database.js';
import initialRegistration from '../../controller/StudentController/enrollment.js';
import verifyOtp from '../../src/services/VerifyOtp.js'
import dashboardGET from '../../controller/StudentController/dashboard.js';
import addmissionForm from '../../controller/StudentController/addmissionForm.js';
import uploadDocuments from '../../controller/StudentController/uploadDocuments.js';
import login from '../../controller/StudentController/login.js';
import profile from '../../controller/StudentController/profile.js';
import getPdfFile from '../../controller/StudentController/getPdfFile.js';
import classroomGET from '../../controller/StudentController/classroom.js';
const storage=multer.memoryStorage()
const upload=multer({storage:storage})
const router = express.Router();
import authentication from '../../middlewares/authentication.js';
connectDB()
import jwt from 'jsonwebtoken'
const SECRET_KEY=process.env.JWT_SECRET
function countAttendanceByCourse(data) {
    const attendanceSummary = {};
  
    data.forEach(record => {
      const course = record.course;
  
      if (!attendanceSummary[course]) {
        attendanceSummary[course] = { present: 0, absent: 0 };
      }
  
      if (record.status === "Present") {
        attendanceSummary[course].present++;
      } else if (record.status === "Absent") {
        attendanceSummary[course].absent++;
      }
    });
  
    return attendanceSummary;
  }



router.get('/dashboard',authentication,dashboardGET)

router.get('/addmissionForm',authentication,addmissionForm.addmissionFormGET)
router.post('/addmissionForm',authentication,addmissionForm.addmissionFormPOST)
router.get('/uploadDocuments',authentication,uploadDocuments.uploadDocumentsGet)
router.post('/uploadDocuments',authentication,upload.single('pdfFile'),uploadDocuments.uploadDocumentsPost)
router.get('/getPdf',authentication,getPdfFile)
router.get('/classroom',authentication,classroomGET)
router.get('/profile',authentication,profile)

router.get('/academicCalendar',authentication,(req,res)=>{
    res.render('academicCalendar')
})
router.get('/mentorDetails',authentication,(req,res)=>{
    res.render('mentorDetails',{title:'mentorDetails',isloggedIn:true})
})

//initial registration form route
router.get('/enrollment',initialRegistration.enrollmentGet)
router.post('/enrollment',verifyOtp,upload.single('profilePicture'),initialRegistration.enrollmentPost);


router.get('/getAttendance',authentication,async(req,res)=>{
    const {rollNumber} = req.query
    console.log(rollNumber)
    const connection= await connectDB()
    try {
const query='select * from student_attendance where rollNumber=?'
const [results]= await connection.execute(query,[rollNumber])
const data=countAttendanceByCourse(results)
console.log(data)
return res.status(200).json(data)
    } catch (error) {
        
        console.log('error in attendance',error)
       return res.status(500).json({ error: "Internal Server Error" });
    }
})



router.get('/getResourse',authentication, async (req, res) => {
  const { courseCode } = req.query;
  console.log("Requested Course Code:", courseCode);
  
  if (!courseCode) {
    return res.status(400).json({ error: 'Course code is required' });
  }

  const connection = await connectDB();
  
  try {
    const query = 'SELECT * FROM student_resources WHERE course = ?'; 
    const [results] = await connection.execute(query, [courseCode]);

    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No resources found for this course code' });
    }
    const resources = results.map(resource => ({
      ...resource,
      resourceFile: resource.resourceFile.toString('base64')
    }));
    console.log(resources)
    return res.json({data: resources });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) {
      await connection.end(); 
    }
  }
});




router.post('/sendOtp',EmailOtpRegistration)
router.post('/login',login)
router.get('/logout',(req,res)=>{
   if(req.cookies.smsShobhitUniversity){
    res.clearCookie('smsShobhitUniversity')
   return res.redirect('/?success=Logout_successfully')
   }
return res.redirect('/?error=Login_first')
})


router.get('/getSubjects',authentication,(req,res)=>{
  const semester=req.query
  console.log(semester)
const token=req.cookies.smsShobhitUniversity
const data=jwt.verify(token,SECRET_KEY)
console.log('getstudent logs',data)


})


export default router