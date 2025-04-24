import jwt from 'jsonwebtoken'
const SECRET_KEY=process.env.JWT_SECRET
const verifyOtp=(req,res,next)=>{
    const otp=req.cookies.id
    jwt.verify(otp,SECRET_KEY,(err,decoded)=>{
        if(err){
            res.redirect('/api/user/enrollment?error=invalid_otp')
            return
        }
        req.otp=decoded
        next()
    })
}

export default verifyOtp