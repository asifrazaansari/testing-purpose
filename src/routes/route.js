const express = require('express');
const router = express.Router();

const authorController = require("../controller/authorController")
const blogController = require('../controller/blogController')
const middleware = require('../middleware/auth')

router.post('/authors', authorController.createAuthor)

router.post("/blogs", middleware.authentication, blogController.createBlogs)

router.get('/blogs', middleware.authentication, blogController.getBlog)

router.put('/blogs/:blogId', middleware.authorization, blogController.updateBlogs)

router.post('/login', authorController.loginUser)

router.delete('/blogs/:blogId', blogController.deleteBlog)

router.delete('/blogs', blogController.deleteByQuery)


module.exports = router;