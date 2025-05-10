const express= require("express")
const router= express.Router()
const userRouter= require("../routes/user.routes.js")
const authMiddleware = require("../middleware/authMiddleware.js")
const accountRouter= require("../routes/account.routes.js")

router.use("/user", userRouter)
router.use("/account", accountRouter)

module.exports= router