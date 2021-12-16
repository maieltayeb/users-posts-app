require('express-async-errors');
const Post=require('../models/Post');
const customError=require('../helpers/customError');

module.exports= async(req,res,next)=>{

    const postId=req.params.id;
   // const  {_doc:{_id:userCurrentId}}=req.currentUser

    // let userId=userCurrentId.toHexString()
    // const userId=req.userId;
    let userId=req.currentUser.id;
    const post=await Post.findById(postId);
    if(!post.postedBy.equals(userId)){
        throw customError(403,'no authorization')
     
    }
    next()
}