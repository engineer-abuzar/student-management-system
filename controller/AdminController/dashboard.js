const adminDashboard=(req,res)=>{
    res.render('adminViews/dashboard',{title:'dashboard',isloggedIn:true})
    }


export default adminDashboard