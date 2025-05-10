// const express= require("express")
// const router= express.Router()
// const User= require("../models/user.model.js")
// const JWT_SECRET = require("../config")

// router.post("/signup", async(req,res)=>{
//     try{
//         const entered_user= {firstName, LastName, username, password}= req.body
//         const Checkuser= User.findOne({username})
//         if(Checkuser){
//             return res.json("user already exists")
//         }
//         const user= await User.create(entered_user)
//         const token= jwt.sign({username}, JWT_SECRET)
//         return res.json("success: user created, here is the token", {token})
//     }catch(error){
// return res.json("failure:cant create user")
//     }
// })
// router.post("/signin", async(req,res)=>{
//     try {
//         const {username, password}= req.body
//         const CheckUser= User.findOne({username})
//         if(!CheckUser){
//             return res.json("failure:invalid credentials")
//         }

//         const dbPassword= CheckUser.password

//         if(password==dbPassword){
//             return res.json("user logged in")
//         }
//         return res.json("failure:invalid credentials")
//     } catch (error) {
//         return res.json("failure:cant login user")
//     }
// })
// module.exports=router

const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { User } = require("../models/user.model.js");
const JWT_SECRET = require("../config.js");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware.js");
const Accounts = require("../models/accounts.model.js");

router.post("/signup", async (req, res) => {
  try {
    const requiredBody = z.object({
      firstName: z.string().max(50).trim(),
      lastName: z.string().max(50).trim(),
      userName: z.string().email().min(3).max(30).trim().toLowerCase(),
      password: z.string().min(6),
    });

    const { firstName, lastName, userName, password } = req.body;
    const result = requiredBody.safeParse(req.body);
    const user = await User.findOne({ userName });

    if (!result.success || user) {
      return res
        .status(411)
        .json({ message: "incorrect creds/email already taken" });
    }

    const data = result.data;
    const dbUser = await User.create(data);
    const userId = dbUser._id;
    console.log(Accounts);
    const account = await Accounts.create({
      user: userId,
      balance: 1 + 10000 * Math.random(),
    });
    console.log(account);
    console.log("hello");
    return res.status(200).json({
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "cant signup" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const requiredBody = z.object({
      userName: z.string().email().min(3).max(30).trim().toLowerCase(),
      password: z.string().min(6),
    });
    const result = requiredBody.safeParse(req.body);
    const { userName, password } = req.body;
    const user = await User.findOne({ userName, password });

    if (!result.success || !user) {
      return res.status(411).json({
        message: "error while logging in",
      });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    return res.status(200).json({
      message: "logged in",
      token,
    });
  } catch (error) {
    return res.json({ message: "cant signin" });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    // console.log(req.id)
    // console.log("in route handler")

    const requiredBody = z.object({
      password: z.string().min(6).optional(),
      firstName: z.string().max(50).trim().optional(),
      lastName: z.string().max(50).trim().optional(),
    });
    // console.log("hey")
    // console.log(req.body)
    const result = requiredBody.safeParse(req.body);
    // console.log("before updateid")
    // const {updateid} = req.params;
    // console.log(updateid)
    if (!result.success) {
      return res.json({ message: "enter valid details" });
    }
    // console.log(updateid)
    // console.log(req.id)
    await User.findByIdAndUpdate(req.id, result.data, { new: true });
    return res.json({ message: "user updated" });
  } catch (error) {
    console.error("Update route error:", error);
    return res.status(500).json({ message: "can't update user" });
  }
});

router.get("/bulk/search", authMiddleware, async (req, res) => {
  try {
    const value = req.query.filter || "";
    const users = await User.find({
      $or: [
        { firstName: { $regex: value, $options: "i" } },
        { lastName: { $regex: value, $options: "i" } },
      ],
    }).select("firstName lastName userName _id");
    if (!users) {
      return res.json({ message: "no user found" });
    }
    res.json({
      message: "found users successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "cant show users" });
  }
});
module.exports = router;
