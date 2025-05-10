const JWT_SECRET = require("../config")
const jwt= require("jsonwebtoken")
function authMiddleware(req,res,next){
    // console.log(req.headers)
    // console.log(req.headers.authorization)
    // console.log(req.headers.authorization.startsWith('Bearer '))
    try{if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')){
    return res.status(403).json({message:"user not verified"})
}

const token= req.headers.authorization.split(" ")[1]
const decoded= jwt.verify(token, JWT_SECRET)
if(!decoded){
    return  res.status(403).json("token not verified")
}
req.id= decoded.userId
next()}
catch(error){
    return res.status(403).json({message:"error occured"})
}
}

module.exports= authMiddleware