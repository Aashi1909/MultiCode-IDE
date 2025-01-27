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
  editProject
} = require("../controllers/userController");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/createProject", createProject);
router.post("/saveProject", saveProject);
router.post("/getProjects", getProjects);
router.post("/getOneProject", getOneProject);
router.post("/deleteProject", deleteProject);
router.post("/editProject", editProject);
// router.post("/generateLink", generateLink);

module.exports = router;
