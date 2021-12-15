require('./db')
require('dotenv').config
require('cors')
require('express-async-errors');

var express = require('express');
//var bodyParser = require('body-parser');

var app = express();
app.use(cors())
let userRouters=require('./routes/user');
let postRouters=require('./routes/post');
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/users',userRouters)
app.use('/posts',postRouters)



///global error handeler
app.use((err,req,res,next)=>{
let statusCode=err.statusCode||500
if(statusCode>=500){
   return res.status(statusCode).json({
message:"some thing is worng",
type:"INTERNAL ERROR SERVER",
details:[]
   }) 
}
   res.status(statusCode).json({
       message:err.message,
       type:err.type,
       details:err.details

   })


})

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
