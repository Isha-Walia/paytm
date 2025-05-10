const express= require("express")
const {connectDb}= require("./database/db.js")
const mainRouter= require("./routes/index.js")
const userRouter= require("./routes/user.routes.js")
const cors= require("cors")

const app= express()
app.use(cors())
app.use(express.json())

app.use("/api/v1", mainRouter)

connectDb()
.then(app.listen(3000,()=>{
    console.log("server listening on port 3000")
}))
