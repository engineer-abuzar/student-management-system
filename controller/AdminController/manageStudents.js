import connectDB from "../../Database.js"

const manageStudentsGET=async(req,res)=>{
if(req.cookies.smsShobhitUniversity){
    try {
        const query='select * from student_details'
        const connection = await connectDB()
        const [results]= await connection.execute(query)
        console.log(results)
      return  res.render('adminViews/manageStudents',{title:'manageStudents',results})
    } catch (error) {
        console.log('Error manageStudents GET',error)
        return res.redirect('/api/admin/dashboard?error=DATABASE_ERROR_PLEASE_TRY_AGAIN')
    }
}
else{
   return res.redirect('/?error=Login_first')
}

   
}
const studentAddmission = async (req, res) => {

    if(req.cookies.smsShobhitUniversity){
        const connection = await connectDB();
        try {
            const {
                category, religion, country, state, district, department, programme, admissionType,
                hostelRequired, transportationRequired, gender, firstName, middleName, lastName, email,
                mobileNumber, dob, aadharNumber, address, pincode, fatherOccupation, fatherName,
                gurdianMobileNumber, motherName , twelfthStream, tenthGrade, tenthPassingYear,
                tenthBoard, twelfthGrade, twelfthPassingYear, twelfthBoard, graduationGrade ,
                graduationPassingYear, graduationUniversity ,
            } = req.body;
    //pdf/image files 
    const profileImage = req.files?.profileImage?.[0]?.buffer || null;
    const documents = req.files?.documents?.[0]?.buffer || null;
          
    console.log(profileImage,documents)
            // Generate required values
            const addmissionStatus = 1;
            const registrationStatus = 1;
            const isAddmissionFormFilled = 1;
            const documentStatus = 1;
            const semester = 1;
            const currentYear = new Date().getFullYear();
            const batchYear = currentYear;
            const session = `${currentYear}-${currentYear + 1}`;
            const addmissionDate = new Date().toISOString().split('T')[0]; 
            const defaultPassword = String(mobileNumber);
            
            // Generate unique IDs
            const generateAddmissionNumber = () => `ADM${Date.now()}`;
            const generateEnrollmentNumber = () => `ENR${currentYear}${Math.floor(1000 + Math.random() * 9000)}`;
            const generateRollNumber = () => `${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
    
            const addmissionNumber = generateAddmissionNumber().toString();
            const enrollmentNumber = generateEnrollmentNumber().toString();
            const rollNumber = generateRollNumber().toString();
    
            const query = 
            `INSERT INTO student_details (
                category, religion, country, state, district, department, programme,admissionType,
                hostelRequired, transportationRequired, gender, firstName, middleName, lastName, email,
                mobileNumber, dob, aadharNumber, address, pincode, fatherOccupation, fatherName,
                gurdianMobileNumber, motherName, twelfthStream, tenthGrade, tenthPassingYear,
                tenthBoard, twelfthGrade, twelfthPassingYear, twelfthBoard, graduationGrade,
                graduationPassingYear, graduationUniversity, profileImage, admissionNumber, 
                enrollmentNumber, rollNumber, batchYear, semester, session, password,
                registrationStatus, isAddmissionFormFilled, documentStatus, addmissionStatus, addmissionDate
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?
            )`;
        
    
            const values = [
                category, religion, country, state, district, department, programme,admissionType,
                hostelRequired, transportationRequired, gender, firstName, middleName, lastName, email,
                mobileNumber, dob, aadharNumber, address, pincode, fatherOccupation, fatherName,
                gurdianMobileNumber, motherName, twelfthStream, tenthGrade, tenthPassingYear,
                tenthBoard, twelfthGrade, twelfthPassingYear, twelfthBoard, graduationGrade,
                graduationPassingYear, graduationUniversity, profileImage, addmissionNumber,
                enrollmentNumber, rollNumber, batchYear, semester, session, defaultPassword,
                registrationStatus, isAddmissionFormFilled, documentStatus, addmissionStatus, addmissionDate
            ];
    
            // Debug: Log the values to check for undefined
            console.log("Values to be inserted:", values);
    
          
            const [result] = await connection.execute(query, values);
            const documentsquery=`insert into student_documents (pdfFile,mobileNumber,email,aadharNumber,fileStatus) values(?,?,?,?,?)`
            const fileStatus=1
            const documentsvalues=[documents,mobileNumber,email,aadharNumber,fileStatus]
            await connection.execute(documentsquery,documentsvalues)
            // Redirect on success
            return res.redirect(`/api/admin/manageStudents?success=addmission_SUCCESS&studentId=${result.insertId}&addmissionNumber=${addmissionNumber}&enrollmentNumber=${enrollmentNumber}&rollNumber=${rollNumber}`);
    
        } catch (error) {
            console.error("Error saving student addmission data:", error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        } finally {
            connection.end(); 
        }
    }else{
        return res.redirect('/?error=Login_first')
    }
  
};



export default {manageStudentsGET,studentAddmission}