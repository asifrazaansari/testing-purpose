const express = require('express');
const router = express.Router();

const autherController=require("../controller/authorController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/authors',autherController.createAuther)



module.exports = router;