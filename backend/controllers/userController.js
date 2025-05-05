const userModel = require("../models/userModel")
const projectModel = require("../models/projectModel")
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require("crypto");

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
            return res.status(400).json({success: false, msg: "Email already exists"})
        }

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                let user = await userModel.create({
                    email:email, 
                    password:hash,
                    name:name 
                })
                return res.status(200).json({success: true, msg: "User created successfully"})
            })

        })
       

    }catch(error){
        return res.status(500).json({success: false, msg: error.message})
    }

}

exports.login = async(req, res) => {
    try{
        let {email,password} = req.body;
        let user = await userModel.findOne({email: email})
        if(!user){
            return res.status(400).json({success: false, msg: "User not found"})
        }
        bcrypt.compare(password, user.password, function(err, result) {
            if(result){
                let token = jwt.sign({userId : user._id}, secret);
                return res.status(200).json({success: true, msg: "Login Successfully", token})
            }else{
                return res.status(400).json({success: false, msg: "Invalid credentials"})
            }
        });

    }catch(error){
        return  res.status(500).json({success: false, msg: error.message})
    }
}

exports.createProject = async(req, res) => {
    try{
        let {name, projectType, token, version} = req.body;
        let decoded = jwt.verify(token, secret)
        let user = await userModel.findOne({ _id: decoded.userId });        
        if(!user){
            return res.status(400).json({success: false, msg: "User not found"})
        }
        let project = await projectModel.create({
            name: name,
            projectType: projectType,
            createdBy: user._id,
            code: getStartupCode(projectType),
            version: version
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
            return res.status(400).json({success: false, msg: "User not found"})
        }
        let project = await projectModel.findOneAndUpdate({ _id: projectId}, {code : code});
        return  res.status(200).json({success: true, msg: "Project saved Successfully"})

    }catch(error){
        return  res.status(500).json({success: false, msg: error.message})
    }

}

exports.getProjects = async(req, res) => {
    try {
        let {token} = req.body;
        let decoded = jwt.verify(token, secret)
        let user = await userModel.findOne({ _id: decoded.userId });
        if(!user){
            return res.status(400).json({success: false, msg: "User not found"})
        }
        let projects = await projectModel.find({ createdBy: user._id });
        return  res.status(200).json({success: true, msg: "Projects fetched Successfully", projects:projects})

    } catch (error) {
        return res.status(500).json({success: false, msg: error.message})
        
    }
}

exports.getOneProject = async(req, res) => {
    try {
        let {token, projectId} = req.body;
        let decoded = jwt.verify(token, secret)
        let user = await userModel.findOne({ _id: decoded.userId });
        if(!user){
            return res.status(400).json({success: false, msg: "User not found"})
        }
        let project = await projectModel.findOne({ _id: projectId });
        if(!project){
            return res.status(400).json({success: false, msg: "Project not found"})
        }
        return  res.status(200).json({success: true, msg: "Project fetched Successfully", project:project})
    } catch (error) {
        return res.status(500).json({success: false, msg: error.message})
        
    }

}

exports.deleteProject = async(req,res) =>{
    try{
        let {token, projectId} = req.body;
        let decoded = jwt.verify(token, secret)
        let user = await userModel.findOne({_id: decoded.userId})
        if(!user){
            return res.status(400).json({success: false, msg: "User not found"})
        }
        let project= await projectModel.findOneAndDelete({_id:projectId})
        return  res.status(200).json({success:true, msg: "Project Deleted Successfully"})


    }catch(error){
        return res.status(500).json({success: false, msg: error.message})
    }

}

exports.editProject = async(req,res) =>{
    try{
        let {token, projectId, name } = req.body
        let decoded = jwt.verify(token, secret)
        let user = await userModel.findOne({_id: decoded.userId})
        if(!user){
            return  res.status(404).json({success:false, msg:"User Not Found!"})
        }
        let project = await projectModel.findOne({_id:projectId})
        if(project){
            project.name = name;
            await project.save()
            return  res.status(200).json({success:true, msg:"Project Edited Successfully!"})


        }else{
            return  res.status(404).json({success:false, msg: "Project Not Found!"})
        }

    }catch(error)
    {
        return res.status(500).json({success: false, msg: error.message})
    }

}

const links = new Map(); 

exports.generateLink = async (req, res) => {
  const { projectId } = req.body;
  
  if (!projectId) {
    return res.status(400).json({ success: false, message: "Project ID required!" });
  }

  try {
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const hash = crypto.randomBytes(16).toString("hex");
    const link = `${req.protocol}://${req.headers.host}/share/${hash}`;

    links.set(hash, {
      projectId: project._id,
      created: Date.now()
    });

    console.log(`Generated link: ${hash} -> ${project._id}`); 
    return res.json({ success: true, link });

  } catch (error) {
    console.error("Generate link error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getDocumentByHash = async (req, res) => {
  const { hash } = req.params;
  console.log(`Looking up hash: ${hash}`); 

  if (!links.has(hash)) {
    console.log(`Hash not found: ${hash}`); 
    return res.status(404).json({ success: false, message: "Invalid link" });
  }

  try {
    const { projectId } = links.get(hash);
    console.log(`Found project ID: ${projectId} for hash: ${hash}`); 

    const project = await projectModel.findById(projectId);
    if (!project) {
      console.log(`Project not found: ${projectId}`); 
      return res.status(404).json({ success: false, message: "Project deleted" });
    }

    return res.json({ success: true, project });

  } catch (error) {
    console.error("Get document error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

