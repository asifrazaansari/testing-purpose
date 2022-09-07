const jwt = require("jsonwebtoken")
const blogModel = require('../models/blogModel')

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]

        if (!token) return res.status(400).send({ status: false, msg: "Token must be present in the request header" })

        jwt.verify(token, "Group66-Project-Blog", (error, decodedToken) => {
            if (error) {
                return res.status(401).send({ status: false, msg: "Token is Invalid" })
            }
            else {
                res.setHeader("x-api-key", token)
                req.decodedToken = decodedToken
                console.log(decodedToken)
                next()
            }
        })
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

const authorization = async function (req, res, next) {
    try {
        let decoded = req.decodedToken
        let paramsBlogId = req.params.blogId
        let userLoggedIn = decoded.authorId
        let blog = await blogModel.findById(paramsBlogId)
        if(!blog){
            return res.status(404).send({status: false, msg: "Blog not Found"})
        }
        const blogAuthorId = (blog.authorId).toString()
        console.log(blogAuthorId, paramsBlogId, userLoggedIn)
        if(blogAuthorId !== userLoggedIn)
        {
            return res.status(403).send({status: false, msg: "You are not authorised Person"})
        }
        next()
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.authentication = authentication
module.exports.authorization = authorization
