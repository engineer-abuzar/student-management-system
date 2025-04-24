import jwt from 'jsonwebtoken'
const SECRET_KEY=process.env.JWT_SECRET
import connectDB from '../../Database.js'
const uploadDocumentsGet=(req,res)=>{
    res.render('uploadDocuments',{title:'uploadDocuments',isloggedIn: true, })
}

const uploadDocumentsPost=async(req,res)=>{
 if(!req.file){
    return res.redirect('/api/user/uploadDocumens?error=Documents_file_required')
 }
    const pdfBuffer=req.file.buffer
    const userData=jwt.verify(req.cookies.smsShobhitUniversity,SECRET_KEY)
    try {
        const connection = await connectDB(); // Assuming connectDB() returns a MySQL connection
        const documentStatus=1
        const insertQuery = "INSERT INTO student_documents (pdfFile, email, mobileNumber,fileStatus) VALUES (?, ?, ?,?)";
        const values = [pdfBuffer, userData.email, userData.phone,documentStatus];

        const [result] = await connection.execute(insertQuery, values);
        console.log("Data inserted successfully, ID:", result.insertId);
     
        const updateQuery = "UPDATE student_details SET documentStatus = ? WHERE email = ?";
        const updateValues = [documentStatus, userData.email];

        const [updateResult] = await connection.execute(updateQuery, updateValues);

        if (updateResult.affectedRows > 0) {
            console.log(`Updated ${updateResult.affectedRows} record(s) successfully.`);
        } else {
            console.log("No record found with the given email.");
        }

        await connection.end(); // Close connection after execution
       return res.redirect('/api/user/uploadDocuments?success=Documents_uploaded_successfully')
    } catch (error) {
        console.error("Error inserting document:", error);
        if(error.code==='ER_DUP_ENTRY'){
            const msg='file_already_uploaded'
            return res.redirect(`/api/user/uploadDocuments?error=${msg}`)
        }
        return res.redirect(`/api/user/uploadDocuments?error=Please_try_again`)
        

    }
}
    


export default {uploadDocumentsGet,uploadDocumentsPost}