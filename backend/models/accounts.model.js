const mongoose= require("mongoose")
const accountsSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
        required:true

    }, 
    balance:{
        type:Number,
        required:true}
})
const Accounts= mongoose.model("accounts", accountsSchema)
module.exports= Accounts