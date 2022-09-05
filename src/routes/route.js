const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController')

router.post("/blogs", blogController.createBlogs)

module.exports = router;