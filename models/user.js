const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({

    userId:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    password:{
        type:String,
        // hash : true,
        required: true
    },
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    age :{
        type: Number,
        required:false
    },
    phone:{
        type: String,
        required:false
    },
    sex:{
        type: String,
        required:false
    },
    hash : String, 
    salt : String 

})

userSchema.methods.setPassword = function(password) { 
    // Creating a unique salt for a particular user 
       this.salt = crypto.randomBytes(16).toString('hex'); 
       // Hashing user's salt and password with 1000 iterations, 
       this.hash = crypto.pbkdf2Sync(password, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
   }; 

   userSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}; 



module.exports = mongoose.model("user",userSchema)