const User=require('../models/User');
const customError=require("../helpers/customError")
module.exports= async (req,res,next)=>{
 const token=req.headers.authorization;
 if(!token){
 throw customError (400,' please login first') 
    }
 const currentUser= await User.getUserFromToken(token)
//add to req properties currentUser based on token 
req.currentUser=currentUser;
next();
  

}