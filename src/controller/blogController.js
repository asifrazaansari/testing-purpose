const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')

const createBlogs = async function (req, res) {
    try {
        let bodyData = req.body
        if (!bodyData.authorId) {
            res.status(400).send({ status: false, data: "Please Enter Author Id" })
        }
        else {
            let authorId = await authorModel.find({ _id: bodyData.authorId })
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
        let getData = await blogModel.find({ isDeleted: false, isPublished: true })          //.populate("authorId")
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

const updateBlogs = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let Title = req.body.title
        let Body = req.body.body
        let Tags = req.body.tags
        let Subcategory = req.body.subcategory
        let validBlogId = await blogModel.findById(blogId)
        if (validBlogId === null) {
            return res.status(404).send({ status: false, msg: "Invalid Id, Id not found " })
        }else if(validBlogId.isDeleted === true){
            return res.status(400).send({status: false, msg: "Id is already deleted"})
        }else if(!(Tags && Subcategory)){
            return res.status(400).send({status: false, msg: "Tags and Subcategory is mandatory"})
        }else {
            let updateUser = await blogModel.findOneAndUpdate(
                { "_id": blogId },
                { "$set": { "title": Title, "body": Body }, "$push": { "tags": Tags, "subcategory": Subcategory }, isPublished: true, publishedAt: new Date() },
                { new: true }
            )
            res.status(200).send({ status: true, data: updateUser })
        }

    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


module.exports.createBlogs = createBlogs
module.exports.getBlog = getBlog
module.exports.updateBlogs = updateBlogs