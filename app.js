const express = require("express")
const mongoose = require("mongoose")
const url = "mongodb://127.0.0.1:27017/tuto"

const app = express()

mongoose.connect(url,{useNewUrlParser:true})
const con = mongoose.connection
con.on("open",() =>{
    console.log("Connecteeed")
})
app.use(express.json())

const userRouter = require("./routers/users")
app.use("/users",userRouter)
app.listen(9000, () => {
    console.log("CONNEXION STARTED WITH THE PORT")
})