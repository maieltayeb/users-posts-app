const mongoose=require('mongoose')
const validator=require('validator')

const PostSchema= new mongoose.Schema({
    postTitle:{
        type:String,
        required:true,
        
    },
    postBody:{
        type:String,
        required:true,
        minlength:10
    },
    userId:{
        type:mongoose.ObjectId,
        ref:'User',
    }

    
})

 const Post=mongoose.model('Post',PostSchema)



 module.exports=Post;