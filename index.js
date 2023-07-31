// I have used Comments to Seperate my imports and for Better Understanding of code

const express = require("express")
var jwt = require('jsonwebtoken');
require("dotenv").config()
const cors = require("cors")
const bcrypt = require('bcrypt');
// --------- NODE PACKAGES 


const {connection} = require("./Config/db")
const {UserModel} = require("./Model/UserModel")
const { blogRouter } = require("./Routes/Blog.Router");
const {authentication} = require("./Middlewares/Authentication")
// ---------- Module Exports js way 



const app = express();
app.use(express.json())
app.use(cors())
// ------ BodyParser express



app.get('/' , (req, res)=>{
    try {
        res.send({Message: "BASE SERVER FOR YOUR API"})
    } catch (error) {
       console.log(error)
    }
})

app.post('/signup' ,async(req, res)=>{
   var {name , email , password, age , phonenumber} = req.body;
   bcrypt.hash(password,5 , async function(err, hash) {
    const newuser = new UserModel({
        name ,
        email , 
        password : hash,
   })
   await newuser.save()
   res.send({Message: "SignUP Successful"})
});          
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.send({ Message: "Please Signup First" });
    } else {
        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                var token = jwt.sign({ user_id: user._id }, process.env.secretkey);
                res.send({ Message: "Login Successful", token: token });
            } else {
                res.send({ Message: "Invalid Credentials" });
            }
        } catch (error) {
            res.status(500).send({ Message: "Internal Server Error" });
        }
    }
});

     app.use("/blogs" ,authentication, blogRouter)
app.listen(8080 , async(req , res)=>{
    try {
        await connection;
       
    } catch (error) {
        console.log("Server Error Connection")
    }
            console.log("Server Running On Port 8080")
})