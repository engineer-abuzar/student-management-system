import connectDB from '../../Database.js'
import jwt from 'jsonwebtoken'
const SECRET_KEY=process.env.JWT_SECRET
const addmissionFormGET=async (req,res)=>{
 
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
        const disabledStatus=studentDetails[0].isAddmissionFormFilled?'disabled':'required'
        const formStatus=studentDetails[0].isAddmissionFormFilled

        
     
    return res.render('addmissionForm',{title:'addmissionForm',isloggedIn:true, studentDetails: studentDetails.length ? studentDetails[0] : null ,formStatus,disabledStatus})
     

    } catch (error) {
        console.error("❌ Error fetching student details:", error.message);
        return res.redirect('/error=LogIn_First')
    }

   
}
const addmissionFormPOST=async(req,res)=>{
    const {
        category,
        religion,
        country,
        state,
        district,
        department,
        programme,
        admissionType,
        hostelRequired,
        transportationRequired,
        gender,
        firstName,
        middleName,
        lastName,
        email,
        mobileNumber,
        dob,
        aadharNumber,
        address,
        pincode,
        fatherOccupation,
        fatherName,
        gurdianMobileNumber,
        motherName,
        twelfthStream,
        tenthGrade,
        tenthPassingYear,
        tenthBoard,
        twelfthGrade,
        twelfthPassingYear,
        twelfthBoard,
        graduationGrade,
        graduationPassingYear,
        graduationUniversity,
      } = req.body;
      const isAddmissionFormFilled=1
      const updateQuery = `
      UPDATE student_details 
      SET 
        category = ?, 
        religion = ?, 
        country = ?, 
        state = ?, 
        district = ?, 
        department = ?, 
        programme = ?, 
        admissionType = ?, 
        hostelRequired = ?, 
        transportationRequired = ?, 
        gender = ?, 
        firstName = ?, 
        middleName = ?, 
        lastName = ?, 
        mobileNumber = ?, 
        dob = ?, 
        aadharNumber = ?, 
        address = ?, 
        pincode = ?, 
        fatherOccupation = ?, 
        fatherName = ?, 
        gurdianMobileNumber = ?, 
        motherName = ?, 
        twelfthStream = ?, 
        tenthGrade = ?, 
        tenthPassingYear = ?, 
        tenthBoard = ?, 
        twelfthGrade = ?, 
        twelfthPassingYear = ?, 
        twelfthBoard = ?, 
        graduationGrade = ?, 
        graduationPassingYear = ?, 
        graduationUniversity = ?, 
        isAddmissionFormFilled = ?
      WHERE email = ?
    `;
    

      const values = [
        category,
        religion,
        country,
        state,
        district,
        department,
        programme,
        admissionType,
        hostelRequired,
        transportationRequired,
        gender,
        firstName,
        middleName,
        lastName,
  
        mobileNumber,
        dob,
        aadharNumber,
        address,
        pincode,
        fatherOccupation,
        fatherName,
        gurdianMobileNumber,
        motherName,
        twelfthStream,
        tenthGrade,
        tenthPassingYear,
        tenthBoard,
        twelfthGrade,
        twelfthPassingYear,
        twelfthBoard,
        graduationGrade,
        graduationPassingYear,
        graduationUniversity,
        isAddmissionFormFilled,
        email
      ];

      try {
        const connection= await connectDB()
        const [result] = await connection.execute(updateQuery, values);
        await connection.end()
        return res.redirect('/api/user/addmissionForm?success=Addmission_sumbitted_successfully')

      } catch (error) {
        console.log('Error',error)
        return res.redirect('/api/user/addmissionform?error=Error_sumbttting_form_please_try_again')
        
      }
    
    
}


export default {addmissionFormGET,addmissionFormPOST}