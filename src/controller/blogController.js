const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')
const { default: mongoose } = require('mongoose')
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
const stringChecking = function (data) {
    if (typeof data !== 'string') {
      return false;
    } else if (typeof data === 'string' && data.trim().length == 0) {
      return false;
    } else {
      return true;
    }
  }

  const arrayOfStringChecking = function (data) { for(let i=0;i<data.length;i++){
    if (typeof data[i] !== 'string') {
      return false;
    } else if (typeof data[i] === 'string' && data[i].trim().length == 0) {
      return false;
    } else {
      return true;
    }
  }
}



const createBlogs = async function (req, res) {
    try {
        let bodyData = req.body
        if(Object.keys(bodyData).length===0){
            return res.status(400).send({status:false,msg:"Please enter details for creation of blog"})
        }     
        else {
            const {title,authorId,body,subcategory,category,tags}=bodyData

            if (!isValidObjectId(authorId)) {
                return res.status(400).send({ msg: "please enter valid authorId" })
            }
            if(!stringChecking(title) || !stringChecking(body)) return res.status(400).send({ status: false, msg: "title and body must be present and have Non empty string " }) 

                    
            if(!arrayOfStringChecking(category) ) return res.status(400).send({ status: false, msg: "category must be present and have Non empty string " }) 

            if(subcategory){
                if(!arrayOfStringChecking(subcategory) ) return res.status(400).send({ status: false, msg: "subcategory must be present and have Non empty string " }) 
            }
            if( tags){
                if( !arrayOfStringChecking(tags) ) return res.status(400).send({ status: false, msg: "tags must be present and have Non empty string " }) 
            }

            let checkauthorId = await authorModel.findById(authorId )
            if (checkauthorId.length === null) {
                res.status(404).send({ status: false, data: "Author ID not Found.....please Enter valid Author ID" })
            }
            else {
                 let userLoggedIn=(req.decodedToken.authorId).toString()
                 if(bodyData.authorId===userLoggedIn){
                    let createData = await blogModel.create(bodyData)
                    res.status(201).send({ status: true, data: createData })
                   }
                   else{
                    return res.status(400).send({status:false,msg:"Cannot create blog as user not authorised please enter valid authorId"})
                   }
                }
            }
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

const getBlog = async function (req, res) {
    try {
        let bodyData = req.query
        
        if (Object.keys(bodyData).length==0){
            let getData = await blogModel.find({ isDeleted: false, isPublished: true })
            if (getData.length <= 0) {
                 res.status(404).send({ status: false, msg: "Data Not Found" })
                }
               res.status(200).send({ status: true,count:getData.length, data: getData })
        }            
        else{    
            let {subcategory,category,tags,authorId}=bodyData
            let filter={}
            if(subcategory){
                if(!arrayOfStringChecking(subcategory) ) return res.status(400).send({ status: false, msg: "subcategory must be present and have Non empty string " })
                filter.subcategory= subcategory
            }
            if( tags){
                if( !arrayOfStringChecking(tags) ) return res.status(400).send({ status: false, msg: "tags must be present and have Non empty string " }) 
                filter.tags=tags
            }
            if( category){
                if( !arrayOfStringChecking(tags) ) return res.status(400).send({ status: false, msg: "tags must be present and have Non empty string " }) 
                filter.category=category
            }
            if(authorId){
            if (!isValidObjectId(authorId))  return res.status(400).send({ status: false,msg: "please enter valid authorId" })
                filter.authorId=authorId
            }
            filter.isDeleted=false
            filter.isPublished=true
           if(subcategory || category || tags || authorId){
            let getDataByFilter = await blogModel.find(filter)
            return res.status(200).send({ status: true, count:getDataByFilter.length,data: getDataByFilter} ) 
           } 
           else{
            return res.status(400).send({status: false, msg: "Filters can be subcategory,category,tags,authorId only " })
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
        let data = req.body
        let {subcategory,tags,body,title}=data
        if(Object.keys(data).length===0){
            return res.status(400).send({status:false,msg:"Please enter required details in request body"})
        }
        if(subcategory){
            if(!arrayOfStringChecking(subcategory) ) return res.status(400).send({ status: false, msg: "subcategory must  have Non empty string " }) 
        }
        if( tags){
            if( !arrayOfStringChecking(tags) ) return res.status(400).send({ status: false, msg: "tags must have Non empty string " }) 
        }

        if(title){
              if(!stringChecking(title)) return res.status(400).send({ status: false, msg: "title must be Non empty string " })
        } 

        if(body){
              if(!stringChecking(body)) return res.status(400).send({ status: false, msg: "body must have Non empty string " }) 
        }

        let validBlogId = await blogModel.findById(blogId)
        if (validBlogId === null) {
            return res.status(404).send({ status: false, msg: "Invalid blogId, Id not found " })
        } else if (validBlogId.isDeleted === true) {
            return res.status(400).send({ status: false, msg: " Blog is already deleted" })
        } else {
            let updateUser = await blogModel.findOneAndUpdate(
                { "_id": blogId },
                { "$set": { "title": title, "body": body }, "$addToSet": { "tags": tags, "subcategory": subcategory }, isPublished: true, publishedAt: new Date() },
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
        
        const checkblog = await blogModel.findById(blogId);
        if (checkblog === null || checkblog.isDeleted == true) {
            return res.status(400).send({ msg: "Blog already deleted" });
        } else {
            await blogModel.findByIdAndUpdate(blogId, {
                $set: { isDeleted: true, deletedAt: new Date() },
            });
            return res.status(200).send({ msg: "Deleted" });
        }
    }
    catch (err) {
        return res.status(500).send({ error: err.message });
    }
};


const deleteByQuery = async function (req, res) {

    try {
        let data = req.query
        const tokenAuthorId=(req.decodedToken.authorId).toString()
        if (Object.keys(data).length === 0) {
            return res.status(404).send({ status: false, msg: "Please enter a filter to delete" })
        }
        const {category,subcategory,tags,authorId}=data
        const filter={}
        if(subcategory){
            if(!arrayOfStringChecking(subcategory) ) return res.status(400).send({ status: false, msg: "subcategory must be present and have Non empty string " })
            filter.subcategory= subcategory
        }
        if( tags){
            if( !arrayOfStringChecking(tags) ) return res.status(400).send({ status: false, msg: "tags must be present and have Non empty string " }) 
            filter.tags=tags
        }
        if( category){
            if( !arrayOfStringChecking(tags) ) return res.status(400).send({ status: false, msg: "tags must be present and have Non empty string " }) 
            filter.category=category
        }
        if(authorId){
            if (!isValidObjectId(authorId))  return res.status(400).send({ status: false,msg: "please enter valid authorId" })
            if(authorId!==tokenAuthorId){
                return res.status(403).send({status:false,msg:"Person is not authorised"})
            }
        }
        filter.isDeleted=false
        filter.isPublished=false
        const blog = await blogModel.find(filter)
        for(let i=0;i<blog.length;i++){
        if(((blog[i].authorId.toString()))!==tokenAuthorId){
            return res.status(403).send({status:false ,msg:"The blogs with this filters are forbidden for this logged in user"})  
        }
        }
            const deleteByQuery = await blogModel.updateMany(
                filter,
                { $set: { isDeleted: true, deletedAt: new Date() } }
            )
            if (deleteByQuery.modifiedCount === 0) {
                return res.status(404).send({ status: false, msg: "No data found" })
            }
          return  res.status(200).send({ status: true, msg: "deleted" })
        
    
  } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}


module.exports.createBlogs = createBlogs
module.exports.getBlog = getBlog
module.exports.updateBlogs = updateBlogs
module.exports.deleteByQuery = deleteByQuery
module.exports.deleteBlog = deleteBlog