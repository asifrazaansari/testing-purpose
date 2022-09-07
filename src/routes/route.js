const express = require('express');
const router = express.Router();

const authorController = require("../controller/authorController")
const blogController = require('../controller/blogController')

router.post('/authors', authorController.createAuthor)

router.post("/blogs", blogController.createBlogs)

router.get('/blogs', blogController.getBlog)

router.put('/blogs/:blogId', blogController.updateBlogs)

router.post('/login', authorController.loginUser)

router.delete('/blogs/:blogId', blogController.deleteBlog)

router.delete('/blogs', blogController.deleteByQuery)


module.exports = router;