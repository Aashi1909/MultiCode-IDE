var express = require('express');
var router = express.Router();

const {signUp} = require("../controllers/userController")
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
})

router.post("/signUp", signUp);
router.post("/login", login);

module.exports = router;