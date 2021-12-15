require('express-async-errors');
const Post=require('../models/Post');
const customError=require('../helpers/customError');

module.exports= async(req,res,next)=>{

    const postId=req.params.id;
    const userId=req.userId;
    const post=await Post.findById(postId);
    if(!post.userId.equals(userId)){
        throw customError(403,'no authorization')
     
    }
    next()
}