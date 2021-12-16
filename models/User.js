const mongoose=require('mongoose')
const validator=require('validator')
const _=require('lodash')
const bcrypt=require('bcrypt')

const jwt=require('jsonwebtoken')
const util = require('util');
const customError=require('../helpers/customError');
require('dotenv').config();
/////////////
const jwtSecret=process.env.jwtSecret
const saltRounds=7;
const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true
        
    },
    email:{
        type:String,
required:true,
validate:(v)=>{
    return validator.isEmail(v)
}

    },
    password:{
        type:String,
        required:true
    }

    
},{timestamps:true,
toJSON:{
    virtuals:true,
 transform:(doc)=>{
     return _.pick(doc,["id","username","userPosts","email"])
     } //to pick specified fields from doc

} 

})

//userSchema.set('toJSON',{virtuals:true})//to return virtual fields

userSchema.virtual("userPosts",{
    ref:'Post',
    localField:'_id',
    foreignField:'postedBy'
})



userSchema.pre('save',async function(){
    const doc=this;
    if(doc.isModified('password')){
    doc.password=await bcrypt.hash(doc.password,saltRounds) 
    }

})
// add method to doc
userSchema.methods.comparePassword= function(passwordPlainText){ 
       const userInstance=this
   return bcrypt.compare(passwordPlainText,userInstance.password)

}

//fun generate token

userSchema.methods.generateUserToken=function(){
    const userInstance=this;
    return sign({userId:userInstance.id},jwtSecret)
}

//fun verfiy 
userSchema.statics.getUserFromToken= async function(token){
      const user=this;
      const payloadData=await  verfiy(token,jwtSecret);
      const currentUser=await user.findById(payloadData.userId);
      if(!currentUser){
     
          throw customError(400,'there is no user wthi these data ')
      }
      return currentUser;
}
//use promise
// const sign=(payload,secretKey,option)=>new Promise((resolve,reject)=>{

//     jwt.sign(payload,secretKey,option,(error,token)=>{
//         if(error){
//             return  reject(error)
//         }
//        return  resolve(token)
       
//     })

// })
//***use bulit in function util***************************************
const sign=util.promisify(jwt.sign)
// sign(payload,secretKey)
// .then(token=>{
//    return token 
// })
// .catch((err)=>{
//     console.error(err)
// })
//****use callback***************************************
// jwt.sign({userId:"123"},jwtSecret,(error,token)=>{
//     console.log("token",token)
// })

//**use promise **************************************

// const sign=(payload,secretKey,option)=>new Promise((resolve,reject)=>{

//     jwt.sign(payload,secretKey,option,(error,token)=>{
//         if(error){
//             return  reject(error)
//         }
//        return  resolve(token)
       
//     })

// })


//***use callback***************************
// jwt.verify('token string',jwtSecret,(err,dataPayload)=>{
// console.log("payload",dataPayload);
// })

///**** use promise********** *******************************/
// const verfiy=(tokenString,secretKey)=>new Promise((resolve,reject)=>{
// jwt.verify(tokenString,secretKey,(err,dataPayload)=>{
//     if(err){
//         return reject(err)
//     }
//     resolve(dataPayload)

// })
// })
// use util to support promisify take function take call back and return fun take promise*****************************
const verfiy=util.promisify(jwt.verify)

// verfiy(tokenString,secretKey)
// .then((data)=>{
//     return data
// })
// .catch((err)=>{
// console.error(err)
// })


 const User=mongoose.model('User',userSchema)



 module.exports=User;