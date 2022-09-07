const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const authorModel = require("../models/authorModel")
const isvalidEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let email = req.body.email
        if (!isvalidEmail.test(email)) {
            return res.status(400).send({ msg: "please enter valid email", status: false })
        }

        const createdata = await authorModel.create(data)
        return res.status(201).send({ msg: "Author Created", status: true, data: createdata })
    }
    catch (err) {
        return res.status(500).send({ error: err.message, status: false })
    }
}

const loginUser = async function (req, res) {
    try {
        let emailId = req.body.email
        let password = req.body.password

        const author = await authorModel.findOne({ email: emailId, password: password })
        if (!author) {
            return res.status(400).send({ status: false, msg: "Username or Password is not correct" })
        } else {
            const token = jwt.sign({
                authorId: author._id.toString(),
                batch: "Plutonium Group66",
                Organisation: "FunctionUp",
            }, "Group66-Project-Blog");
            res.setHeader("x-api-key", token);
            res.status(200).send({ status: true, data: token })
        }
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }

}

module.exports.createAuthor = createAuthor
module.exports.loginUser = loginUser