const mongoose= require("mongoose")
const express= require("express")

const connectDb= async(req,res)=>{
   try {
    await mongoose.connect("mongodb://localhost:27017/paytm")
    console.log("connected to db")
    
   } catch (error) {
    console.log(error)
    comsole.log("failure: cant connect to db")
   }
}

module.exports={connectDb}