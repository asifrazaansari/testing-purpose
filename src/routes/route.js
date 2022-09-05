const express = require('express');
const router = express.Router();

const autherController=require("../controller/authorController")
const blogController = require('../controller/blogController')

router.post("/blogs", blogController.createBlogs)

router.post('/authors',autherController.createAuther)



module.exports = router;