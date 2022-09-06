const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')
const { default: mongoose } = require('mongoose')
require('mongoose')
const isValidObjecctId=(ObjectId)=>{
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


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
                let getDataByFilter = await blogModel.find({isDeleted: false, isPublished: true, $or: [{ authorId: AuthorId }, { tags: Tags }, { category: Category }, { subcategory: Subcategory }] })
                res.status(200).send({ status: true, data: getDataByFilter })
            }
            else {
                res.status(200).send({ status: true, data: getData })
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


const deleteBlog = async function (req, res) {
    try {
      const blogId = req.params.blogId;
       if(!isValidObjecctId){
        return res.status(400).send({msg:"please enter valid blogId"})
       }
        const checkblog = await blogModel.findById(blogId);
        console.log(checkblog);
        if (checkblog === null || checkblog.isDeleted == true) {
          return res.status(400).send({ msg: "Blog already deleted" });
        }
        const deletedData = await blogModel.findByIdAndUpdate(blogId, {
          $set: { isDeleted: true, deletedAt: new Date() },
        });
        return res.status(200).send({ msg: "Deleted 11" });
     
    } 
    catch (err) {
      return res.status(500).send({ error: err.message });
    }
  };
  
  const deleteByQuery=async function(req,res){
      try{
          const data1 = req.query;
      data1.isDeleted = false;
      data1.isPublished = true;
      console.log(data1);
      const deletebyquery = await blogModel.updateMany(data1, {
        $set: { isDeleted:false, deletedAt: new Date() },
         new: true
      });
      console.log(deletebyquery);
      if (deletebyquery.modifiedCount> 0) {
        return res.status(200).send({ msg: "Deleted" });
      }
      return res.status(400).send({ msg: "No match found" });
      }
      catch (err) {
          return res.status(500).send({ error: err.message });
        }
  }

module.exports.createBlogs = createBlogs
module.exports.getBlog = getBlog
module.exports.updateBlogs = updateBlogs
module.exports.deleteByQuery=deleteByQuery
module.exports.deleteBlog=deleteBlog