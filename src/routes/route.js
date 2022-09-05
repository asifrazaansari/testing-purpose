const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const blogController = require('../controller/blogController')

router.post("/blogs", blogController.createBlogs)
=======
const autherController=require("../controller/authorController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/authors',autherController.createAuther)

>>>>>>> 97c0c65691d40007c8fb78d109ab5b14ec4c2242

module.exports = router;