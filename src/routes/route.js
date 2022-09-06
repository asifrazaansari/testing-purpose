const express = require('express');
const router = express.Router();

const authorController = require("../controller/authorController")
const blogController = require('../controller/blogController')

router.post('/authors', authorController.createAuthor)

router.post("/blogs", blogController.createBlogs)

router.get('/blogs', blogController.getBlog)

router.put('/blogs/:blogId', blogController.updateBlogs)


module.exports = router;