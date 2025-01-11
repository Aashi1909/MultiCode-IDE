const userModel = require("../models/userModel")
const projectModel = require("../models/projectModel")
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


function getStartupCode(language) {
    if (language.toLowerCase() === "python") {
      return 'print("Hello World")';
    } else if (language.toLowerCase() === "java") {
      return 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }';
    } else if (language.toLowerCase() === "javascript") {
      return 'console.log("Hello World");';
    } else if (language.toLowerCase() === "cpp") {
      return '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}';
    } else if (language.toLowerCase() === "c") {
      return '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}';
    } else if (language.toLowerCase() === "go") {
      return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}';
    } else if (language.toLowerCase() === "bash") {
      return 'echo "Hello World"';
    } else {
      return 'Language not supported';
    }
  }

const secret = process.env.SECRET;
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
                let token = jwt.sign({userId : user._id}, secret);
                res.status(200).json({success: true, msg: "Login Successfully", token})
            }else{
                res.status(400).json({success: false, msg: "Invalid credentials"})
            }
        });

    }catch(error){
        return res.status(500).json({success: false, msg: error.message})
    }
}

exports.createProject = async(req, res) => {
    try{
        let {name, projectType, token} = req.body;
        let decoded = jwt.verify(token, secret)
        let user = await userModel.findOne({ _id: decoded.userId });        
        if(!user){
            res.status(400).json({success: false, msg: "User not found"})
        }
        let project = await projectModel.create({
            name: name,
            projectType: projectType,
            createdBy: user._id,
            code: getStartupCode(projectType)
        })
        return res.status(200).json({success: true, msg: "Project created Successfully", projectId : project._id})

    }catch(error){
        return res.status(500).json({success: false, msg: error.message})
    }

}

exports.saveProject = async(req, res) => {
    try{
        let {token , projectId, code} = req.body;
        let decoded = jwt.verify(token, secret)
        let user = await userModel.findOne({ _id: decoded.userId });
        if(!user){
            res.status(400).json({success: false, msg: "User not found"})
        }
        let project = await projectModel.findOne({ _id: projectId });
        if(!project){
            res.status(400).json({success: false, msg: "Project not found"})
        }
        project.code = code;
        await project.save();
        return res.status(200).json({success: true, msg: "Project saved Successfully"})

    }catch(error){
        return res.status(500).json({success: false, msg: error.message})
    }

}

exports.getProjects = async(req, res) => {
    try {
        let {token} = req.body;
        let decoded = jwt.verify(token, secret)
        let user = await userModel.findOne({ _id: decoded.userId });
        if(!user){
            res.status(400).json({success: false, msg: "User not found"})
        }
        let projects = await projectModel.find({ createdBy: user._id });
        return res.status(200).json({success: true, msg: "Projects fetched Successfully", projects:projects})

    } catch (error) {
        res.status(500).json({success: false, msg: error.message})
        
    }
}

exports.getOneProject = async(req, res) => {
    try {
        let {token, projectId} = req.body;
        let decoded = jwt.verify(token, secret)
        let user = await userModel.findOne({ _id: decoded.userId });
        if(!user){
            res.status(400).json({success: false, msg: "User not found"})
        }
        let project = await projectModel.findOne({ _id: projectId });
        if(!project){
            res.status(400).json({success: false, msg: "Project not found"})
        }
        return res.status(200).json({success: true, msg: "Project fetched Successfully", project:project})
    } catch (error) {
        res.status(500).json({success: false, msg: error.message})
        
    }

}