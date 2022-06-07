const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paginateDocuments = require("../../utilities/paginateDocuments");
const { View, validateView} = require("../../models/view");

router.post("/",async(req,res)=>{
    const {error}= validateView(req.body);
    if(error){
        return res.status(400).send({message: error.details[0].message})
    }

    const view = new View(req.body);

    await view.save();

    return res.send({message:"View is successfully saved"})
})

router.put("/:viewId",async(req,res)=>{
    const {viewId} = req.params;

    if(!mongoose.isValidObjectId(viewId)){
        return res.status(400).send({message:"Invalid view"})
    }

    const {error} = validateView(req.body)
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    let view = await View.findByIdAndUpdate(viewId,req.body,{new:true});

    if(!view){
        return res.status(404).send({message:"View has not been found"})
    }

    return res.send({message:"View has been successfully updated"})
})

router.get("/",async(req,res)=>{
    const viewQuery = View.find({})

    const viewCount = await View.countDocuments();

    const url = `${req.protocol}://${req.get('host')}/api/view`

    const views = await paginateDocuments(req.query,viewQuery,viewCount,url);

    return res.send(views)
})

router.get("/:viewId",async(req,res)=>{
    const {viewId}= req.params;

    if(!mongoose.isValidObjectId(viewId)){
        return res.status(400).send({message:"Invalid view"})
    }

    const view = await View.findOne({_id:viewId});

    if(!view){
        return res.status(404).send({message:"View has not been found"})
    }

    return res.send(view)
})

router.delete("/:viewId",async(req,res)=>{
    const {viewId} = req.params;

    if(!mongoose.isValidObjectId(viewId)){
        return res.status(404).send({message:"Invalid view"});
    }

    const view = await View.findByIdAndDelete(viewId);

    if(!view){
        return res.status(404).send({message:"View has not been found"})
    }

    return res.send({message:"View has been succcessfully deleted"})
})


module.exports = router;