var express = require("express");
var router = express.Router();

const {
  signUp,
  login,
  createProject,
  saveProject,
  getProjects,
  getOneProject,
  deleteProject,
  editProject,
  generateLink,
  getDocumentByHash,
  saveProject
} = require("../controllers/userController");


router.get("/", function (req, res) {
  res.json({ message: "Welcome to MultiCode-IDE API!" });
});


router.post("/signUp", signUp);
router.post("/login", login);
router.post("/createProject", createProject);
router.post("/saveProject", saveProject);
router.post("/getProjects", getProjects);
router.post("/getOneProject", getOneProject);
router.post("/deleteProject", deleteProject);
router.post("/editProject", editProject);
router.post("/generateLink", generateLink);
// router.get("/getDocumentByHash", getDocumentByHash);
router.get("/share/:hash", getDocumentByHash); 



module.exports = router;
