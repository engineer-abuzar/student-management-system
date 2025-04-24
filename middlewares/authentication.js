const authentication=(req,res,next)=>{
    if(req.cookies.smsShobhitUniversity){
        next()
    }else {
        res.redirect('/?error=Login_first')
    }
}

export default authentication