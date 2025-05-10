const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Accounts = require("../models/accounts.model");
const { User } = require("../models/user.model");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const user = await Accounts.findOne({ user: req.id });
    if (!user) {
      return res.json({ message: "user doesnt exist" });
    }
    res.json({ balance: user.balance });
  } catch (error) {
    console.log(error);
    res.json({ message: "cant get balance" });
  }
});

router.post("/transfer", authMiddleware, async(req,res)=>{
try{
const session= await mongoose.startSession()
await session.startTransaction()
const {amount, to}= req.body
const userId= new mongoose.Types.ObjectId(req.id)
console.log(userId)
const account= await Accounts.findOne({user:userId}).session(session)
console.log(account)
if(!account || account.balance<amount){
  await session.abortTransaction()
  return res.json({message:"insufficient balance"})
}
const toUser= await User.fineOne({_id:to}).session(session)
console.log(toUser)
if(!toUser){
  await session.abortTransaction()
  return res.json({message:"invalid user"})
}
await Accounts.updateOne({user:userId}, {$inc:{balance:-amount}}).session(session)
await Accounts.updateOne({user:to}, {$inc:{balance:amount}}).session(session)
await session.commitTransaction()
return res.json({message:"transfer successful"})
}catch(error){
console.log(error)
return res.json({message:"error occured"})
}
})


  

  
module.exports = router;
