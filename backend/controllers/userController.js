const userModel = require("../models/userModel")
var bcrypt = require('bcryptjs');
exports.signUp = async(req, res) => {
    try{

        let {email,password, name } = req.body;
        let emailCon = await userModel.findOne({email: email})
        if(emailCon){
            res.status(400).json({success: false, msg: "Email already exists"})
        }

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                let user = await userModel.create({
                    email:email, 
                    password:hash,
                    name:name 
                })
                res.status(200).json({success: true, msg: "User created successfully"})
            })

        })
       

    }catch(error){
        res.status(500).json({success: false, msg: error.message})
    }

}

exports.login = async(req, res) => {
    try{
        let {email,password} = req.body;
        let user = await userModel.findOne({email: email})
        if(!user){
            res.status(400).json({success: false, msg: "User not found"})
        }
        bcrypt.compare(password, user.password, function(err, result) {
            if(result){
                res.status(200).json({success: true, msg: "Login Successfully"})
            }else{
                res.status(400).json({success: false, msg: "Invalid credentials"})
            }
        });

    }catch(error){
        return res.status(500).json({success: false, msg: error.message})
    }
}
