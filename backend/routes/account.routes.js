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

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // await session.startTransaction();
    const { amount, to } = req.body;
    console.log(req.id);
    const userId = new mongoose.Types.ObjectId(req.id);
    // console.log(session)
    await session.withTransaction(async (req, res) => {
      console.log(userId);
      const testUser0 = await User.findOne({ _id: userId });
      console.log(testUser0);
      const testUser = await User.findOne({ _id: userId }).session(session);
      console.log(testUser);
      const account = await Accounts.findOne({ user: userId }).session(session);
      console.log(account);
      if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.json({ message: "insufficiet balance" });
      }
      const toUser = await User.findOne({ _id: to }).session(session);
      if (!toUser) {
        return res.json({ message: "invalid account" });
      }
      await Accounts.updateOne(
        { user: userId },
        { $inc: { balance: -amount } }
      ).session(session);
      await Accounts.updateOne(
        { user: to },
        { $inc: { balance: amount } }
      ).session(session);
    //   await session.commitTransaction();
      
    });
    return res.json({ message: "transfer successful" });
  } catch (error) {
    console.log(error);
    return res.json({ message: "error" });
  }
});


  

  
module.exports = router;
