const User=require('../models/user');
module.exports=(req,res,next)=>{
 const token=req.headers.authorization;
 if(!token){
 throw new Error ('login first') 
    }
 const currentUser= User.getUserFromToken(token)
//add to req properties currentUser based on token 
req.currentUser=currentUser;
next();
  

}