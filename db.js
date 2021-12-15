const mongoose=require('mongoose');

const dbLink=process.env.dbURI
mongoose.connect(dbLink,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.info("connected to mongodb success")

})
.catch((err)=>{
    console.error(err);
    process.exit(1)
})
;

