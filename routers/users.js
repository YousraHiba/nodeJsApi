const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require("../models/user");
const crypto = require('crypto');

// ---- GET ALL users ---- //
router.get("/",async(req,res) =>{
    try{
        const users = await User.find()
        res.json(users)

    }catch(err){
        res.json("err",err)
    }
})


// ---- authentification -- //
router.post("/authentification",async(req,res) =>{
    if(req.body.email && req.body.password){
        const  email = req.body.email;
        const password = req.body.password;
    
        try{
            const user = await User.findOne({email});
            if( user && user.salt && validPassword(password, user.password , user.salt)){
                console.log(' user ',user);
                res.status(404).send({
                    message:'  authentication succed',
                    user: user
                });

            }else{
                res.status(403).send({
                    message:' invalid user name or password'
            });
        }
           
        }catch(err){
            console.log(' error on authentication');
            res.status(403).send({
                message:'  authentication failed'
            });

        }
    }else{
        res.status(403).send({
            message:' messing name or password'
        });
    }

    
})


// ---- find user by id ---- //
router.get("/:id",async(req,res) =>{
    try{
        const user = await User.findById(req.params.id)
        res.json(user)

    }catch(err){
        res.json("err",err)
    }


   // res.send("GET REQUEST")
})


// ---- add user ---- //
router.post("/", async(req,res)=>{
 if( req.body.email && req.body.userName  && req.body.password && req.body.firstName && req.body.lastName ){

    const email = req.body.email;
    const userName = req.body.userName;
  
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userId =  uuidv4();
    const salt = crypto.randomBytes(16).toString('hex'); 
    const password = setPassword(req.body.password,salt)
    

    try{

        const user = new User({
            email,
            userName,
            firstName,
            lastName,
            userId,
            password,
            salt
         });


         



         console.log(' user ',user)


        const addedUser = await user.save()

        console.log(' user added ',user);
     
         res.status(200).send({
             message:' user was added ',
             addedUser
         });

    }catch(err){

        console.log(' error on add user ',err)
        res.status(500).send({
            message:' error on add user ',
            error : err
        });
    }

     



 }else{

    res.status(403).send({
        message:' messing require  properties '
    });

 }


})


 // ---- UPDATE USER ---- //
router.patch("/:id", async(req,res) =>{

    try{
        const user = await User.findById(req.params.id)
        console.log("req.params.id",req.params.id)
        user.name = req.body.name
        console.log("user.name",user.name)
        const userUpdated = await user.save()
        res.json(userUpdated)
    }catch{
     res.send("error")
    }
})



// ---- DELETE USER ---- //
router.delete("/:id", async(req,res) =>{

    try{
        const user = await User.findById(req.params.id)
        console.log("req.params.id",req.params.id)
        user.name = req.body.name
        console.log("user.name",user.name)
        const userUpdated = await user.delete()
        res.json(userUpdated)
    }catch{
     res.send("error")
    }
})






//  ------ crypte Password ------ //
setPassword = (password, salt) => { 
       // Hashing user's salt and password with 1000 iterations, 
       const hash = crypto.pbkdf2Sync(password, salt,  
       1000, 64, `sha512`).toString(`hex`); 
       return hash
}; 


//  ------ decrypter Password ------ //
validPassword = (newPassword, hasedPassword, salt) => { 
    const hash = crypto.pbkdf2Sync(newPassword,  salt, 1000, 64, `sha512`).toString(`hex`); 
    console.log(' newPassword ',newPassword)
    console.log(' newHasedPassword ',hash)
    console.log( ' hasedPassword ',hasedPassword)

    return hasedPassword === hash; 
}; 




module.exports = router