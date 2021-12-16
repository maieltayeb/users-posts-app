const mongoose=require('mongoose');
require('dotenv').config();
const MONGO_URI=process.env.MONGO_URI;

mongoose.connect(MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    
    console.info("connected to mongodb success")

})
.catch((err)=>{
    console.error(err);
    process.exit(1)
})
;

