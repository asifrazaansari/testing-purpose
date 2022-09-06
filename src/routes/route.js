const express = require('express');
const router = express.Router();

const authorController = require("../controller/authorController")
const blogController = require('../controller/blogController')
const middleware = require('../middleware/auth')

router.post('/authors', authorController.createAuthor)

router.post("/blogs", middleware.authentication, blogController.createBlogs)

router.get('/blogs', middleware.authentication, blogController.getBlog)

router.put('/blogs/:blogId', middleware.authorization, blogController.updateBlogs)


module.exports = router;