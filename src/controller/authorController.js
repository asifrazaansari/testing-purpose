const mongoose=require('mongoose')
const authorModel=require("../models/authorModel")
const isvalidEmail=new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)
    

const createAuther=async function(req,res){
try{
    let data=req.body
let email=req.body.email
if(!isvalidEmail.test(email)){
    return res.status(400).send({msg:"please enter valid email",status:false})
}

const createdata=await authorModel.create(data)
return res.status(201).send({msg:"Auther Created",status:true,data:createdata})
}
catch(err){
    return res.status(500).send({error:err.message,status:false})
}
}
module.exports.createAuther=createAuther