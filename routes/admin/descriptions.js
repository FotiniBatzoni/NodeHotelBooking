const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paginateDocuments = require("../../utilities/paginateDocuments")
const { Description,validateDescription} = require("../../models/description");


router.post("/",async(req,res)=>{
    const {error}= validateDescription(req.body);
    if(error){
        return res.status(400).send({message: error.details[0].message})
    }

    const input = {
        name:req.body.name,
        thumbnail:req.body.thumbnail
    }
    const description = new Description(input);

    await description.save();

    return res.send({message:"Description is successfully saved"})
})

router.put("/:descriptionId",async(req,res)=>{
    const{descriptionId}=req.params;

    if(!mongoose.isValidObjectId(descriptionId)){
        return res.status(404).send({message:"Invalid description"})
    }

    const {error} = validateDescription(req.body)
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    let description = await Description.findByIdAndUpdate(
        descriptionId,req.body,{new:true}
    )
    if(!description){
        return res.status(404).send({message:"Description has not been found"});
    }

    return res.send({message:"Description has been successfully updated"})
})

router.get("/",async(req,res)=>{
    const descriptionQuery = Description.find({});

    const descriptionCount = await Description.countDocuments({});

    const url = `${req.protocol}://${req.get('host')}/api/description`;

    const description = await paginateDocuments(req.query,descriptionQuery,descriptionCount,url);

    return res.send(description)
})

router.get("/:descriptionId",async(req,res)=>{
    const {descriptionId} = req.params;

    if(!mongoose.isValidObjectId(descriptionId)){
        return res.status(400).send({message:"Invalid Description"})
    }

    const description = await Description.findOne({_id:descriptionId});

    if(!description){
        return res.status(404).send({message:"Description has not been found"});
    }

    return res.send(description)
})

router.delete("/:descriptionId",async(req,res)=>{
    const {descriptionId} = req.params;

    if(!mongoose.isValidObjectId(descriptionId)){
        return res.status(404).send({message:"Invalid Description"});
    }

    const description = await Description.findByIdAndDelete(descriptionId);

    if(!description){
        return res.status(404).send({message:"Description has not been found"})
    }

    return res.send({message:"Description has been successfully deleted"})
})



module.exports = router;