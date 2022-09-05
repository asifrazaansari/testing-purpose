const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')

const createBlogs = async function (req, res) {
    try {
        let bodyData = req.body
        if (!bodyData.authorId) {
            res.status(400).send({ status: false, data: "Please Enter Author Id" })
        }
        else {
            let authorId = await authorModel.find({_id: bodyData.authorId})
            if (authorId.length <= 0) {
                res.status(404).send({ status: false, data: "Author ID not Found.....please Enter valid Author ID" })
            }
            else {
                let createData = await blogModel.create(bodyData)
                res.status(201).send({ status: true, data: createData })
            }
        }
    }
    catch (err) {
        res.status(400).send({ status: false, error: err.message })
    }
}

const getBlog = async function (req, res) {
    try {
        let getData = await blogModel.find({ isDeleted: false, isPublished: false })          //.populate("authorId")
        if (getData.length <= 0) {
            res.status(404).send({ status: false, msg: "Data Not Found" })
        }
        else {
            let AuthorId = req.query.authorId
            let Tags = req.query.tags
            let Category = req.query.category
            let Subcategory = req.query.subcategory
            if (AuthorId || Tags || Category || Subcategory) {
                let getDataByFilter = await blogModel.find({ $or: [{ authorId: AuthorId }, { tags: Tags }, { category: Category }, { subcategory: Subcategory }] })
                res.status(200).send({ status: true, data: getDataByFilter })
            }
            else {
                let getDataByFilter = await blogModel.find().count()
                res.status(200).send({ status: true, data: getDataByFilter })
            }
        }
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.createBlogs = createBlogs
module.exports.getBlog = getBlog