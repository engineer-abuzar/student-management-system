import express from 'express'
import adminDashboard from '../../controller/AdminController/dashboard.js'
import manageStudents from '../../controller/AdminController/manageStudents.js'
import multer from 'multer'
import connectDB from '../../Database.js'
import authentication from '../../middlewares/authentication.js'
const router=express.Router()
const upload = multer({
    storage: multer.memoryStorage(),
  
  });

router.get('/dashboard',authentication,adminDashboard)
router.get('/manageStudents',authentication,manageStudents.manageStudentsGET)


router.post('/studentAddmission',authentication,upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'documents', maxCount: 1 }
  ]),manageStudents.studentAddmission)




router.post('/deleteStudent',authentication,async(req,res)=>{

    const { studentId } = req.body; 

    if (!studentId) {
        return res.status(400).json({ success: false, message: "Student ID is required" });
    }
    const connection = await connectDB()
    try {
        const [result] = await connection.execute(
            "DELETE FROM student_details WHERE id = ?", 
            [studentId]
        );
        await connection.execute('delete from student_documents where id=?',[studentId])
        if (result.affectedRows > 0) {
            return res.redirect('/api/admin/manageStudents?success=Student_deleted_successfully')
        } else {
            return res.redirect('/api/admin/manageStudents?error=Student_not_found')
        }
    } catch (error) {
        console.error("Error deleting student:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }finally{
        await connection.end()
    }


})
router.post('/updateStudent',authentication,async(req,res)=>{
    console.log(req.body)
const {fieldName,editValue,studentId}=req.body
const connection=await connectDB()
try {
    const query = `UPDATE student_details SET ${fieldName} = ? WHERE id = ?`;
    const values = [editValue, studentId];

    const [results]= await connection.execute(query,values)
    res.redirect('/api/admin/manageStudents?success="value_updated_successfully"')
} catch (error) {
    console.log('error',error)
    res.redirect('/api/admin/manageStudents?error="error_update_failed"')
}

})

router.get('/getStudent/:id',authentication,async(req,res)=>{
 const studentId=req.params.id
const connection= await connectDB()
    try {
        
        const query = "SELECT * FROM student_details WHERE id = ?";
        const [results] = await connection.query(query, [studentId]);

        if (results.length > 0) {
             results[0].profileImage = results[0].profileImage.toString('base64');
            return res.json(results[0])
        } else {
            res.send("Student not found");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/updateAddmissionStatus',authentication, async (req, res) => {
    const { addmissionStatus, studentId } = req.body;
    const connection = await connectDB();

    try {
        if (addmissionStatus === 'Approve') {
          

            // Generate required values
            const registrationStatus = 1;
            const isAddmissionFormFilled = 1;
            const documentStatus = 1;
            const semester = 1;
            const currentYear = new Date().getFullYear();
            const batchYear = currentYear;
            const session = `${currentYear}-${currentYear + 1}`;
            const addmissionDate = new Date().toISOString().split('T')[0]; 
          

            // Generate unique IDs
            const generateAddmissionNumber = () => `ADM${Date.now()}`;
            const generateEnrollmentNumber = () => `ENR${currentYear}${Math.floor(1000 + Math.random() * 9000)}`;
            const generateRollNumber = () => `${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;

            const addmissionNumber = generateAddmissionNumber();
            const enrollmentNumber = generateEnrollmentNumber();
            const rollNumber = generateRollNumber();

        
            const query = `
                UPDATE student_details 
                SET 
                    addmissionStatus = ?,
                    registrationStatus = ?,
                    isAddmissionFormFilled = ?,
                    documentStatus = ?,
                    semester = ?,
                    batchYear = ?,
                    session = ?,
                    addmissionDate = ?,
                    admissionNumber = ?,
                    enrollmentNumber = ?,
                    rollNumber = ?
             
                WHERE id = ?
            `;

            const values = [
                1,  // Admission approved
                registrationStatus,
                isAddmissionFormFilled,
                documentStatus,
                semester,
                batchYear,
                session,
                addmissionDate,
                addmissionNumber,
                enrollmentNumber,
                rollNumber,
        
                studentId
            ];

            const [results] = await connection.execute(query, values);

            if (results.affectedRows > 0) {
                return res.redirect('/api/admin/manageStudents?success=Admission Approved');
            } else {
                return res.redirect('/api/admin/manageStudents?error=No changes made');
            }
        } else {
            // If rejected, only update admission status
            const query = 'UPDATE student_details SET addmissionStatus = ? WHERE id = ?';
            const values = [0, studentId];

            const [results] = await connection.execute(query, values);

            if (results.affectedRows > 0) {
                return res.redirect('/api/admin/manageStudents?success=Admission Rejected');
            } else {
                return res.redirect('/api/admin/manageStudents?error=No changes made');
            }
        }
    } catch (error) {
        console.error('Error updating admission status:', error);
        return res.redirect('/api/admin/manageStudents?error=Something went wrong');
    } finally {
        await connection.end(); // Close the database connection
    }
});





router.get('/attendance',authentication,(req,res)=>{
    res.render('adminViews/attendance',{title:'attendance'})
})

router.get("/getStudents",authentication,async (req, res) => {
    const { programme, semester, course } = req.query;

  console.log(programme,semester,course)

  const query = "SELECT rollNumber, firstName,id FROM student_details WHERE programme = ? AND semester = ?";
  const connection= await connectDB()
  try {
   
    const [results] = await connection.execute(query, [programme, semester]);
console.log(results)
    res.json(results);
} catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
} finally {
    if (connection) connection.end(); 
}

});



router.post("/markAttendance",authentication, async (req, res) => {
    try {
        const { programme, semester, course, ...students } = req.body;

        if (!programme || !semester || !course || Object.keys(students).length === 0) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // getting student IDs and their statuses
        const attendanceRecords = Object.entries(students).map(([studentId, status]) => ({
            studentId,
            status
        }));

        // Connect to the database
        const connection = await connectDB();

        // Fetch roll numbers for student IDs
        const studentIds = attendanceRecords.map((s) => s.studentId);
        const [rows] = await connection.query(
            `SELECT id, rollNumber FROM student_details WHERE id IN (?)`, 
            [studentIds]
        );

        // Create attendance records with roll numbers
        const attendanceData = rows.map(student => {
            const status = students[student.id]; // Get the status for this student
            return [student.id, student.rollNumber, programme, semester, course, new Date().toISOString().slice(0, 10), status];
        });
        console.log(attendanceData)

        // Insert attendance into `student_attendance`
        const query = `INSERT INTO student_attendance (studentId, rollNumber, programme, semester, course, date, status) VALUES ?`;
        await connection.query(query, [attendanceData]);

        res.redirect('/api/admin/markAttendance?success=Attendance_marked_successfully')

    } catch (error) {
        console.error("Error marking attendance:", error);
        res.redirect('/api/admin/markAttendance?success=internal_server_error')
    }
});



router.get('/classWork',authentication,(req,res)=>{
    res.render('adminViews/classWork',{title:'classWork'})
})



// Route to handle file upload
router.post('/uploadRecources',authentication, upload.single('resource'), async (req, res) => {
    console.log(req.file);
    console.log(req.body);

    const { course } = req.body;
    const resource = req.file.buffer; 
    const fileName = req.file.originalname;

    // Establish database connection
    const connection = await connectDB();

    try {
        const query = 'INSERT INTO student_resources (fileName, resourcefile, course) VALUES (?, ?, ?)';
        await connection.query(query, [fileName, resource, course]); 

        res.send({ message: 'Resource uploaded successfully!' });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).send({ error: "Internal Server Error" });
    } finally {
        connection.end(); 
    }
});


export default router