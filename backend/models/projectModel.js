const mongoose = require("mongoose");

let projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        required: true,
        enum:["python", "java", "cpp", "c", "javascript", "go", "bash"]
    },
    code:{
        type: String,
        required: true,
    },
    version :{
        type : "String",
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    },
    createdBy:{
        type: String,
        required: true
    }

});

module.exports = mongoose.model("Project", projectSchema);