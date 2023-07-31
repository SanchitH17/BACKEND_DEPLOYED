const mongoose = require("mongoose")

const userSchema = ({
    name:String,
    email:String,
    password:String
})

const UserModel = new mongoose.model('user' , userSchema);
module.exports = {UserModel}