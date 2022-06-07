const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paginateDocuments = require("../../utilities/paginateDocuments");
const { Service,validateService} = require("../../models/service");

router.post("/",async(req,res)=>{
    const {error}= validateService(req.body);
    if(error){
        return res.status(400).send({message: error.details[0].message})
    }

    const service = new Service(req.body);

    await service.save();

    return res.send({message:"Service is successfully saved"})
})

router.put("/:serviceId",async(req,res)=>{
    const {serviceId} = req.params;

    if(!mongoose.isValidObjectId(serviceId)){
        return res.status(400).send({message:"Invalid service"})
    }

    const {error} = validateService(req.body)
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    let service = await Service.findByIdAndUpdate(serviceId,req.body,{new:true});

    if(!service){
        return res.status(404).send({message:"Service has not been found"})
    }

    return res.send({message:"Service has been successfully updated"})
})

router.get("/",async(req,res)=>{
    const serviceQuery = Service.find({})

    const serviceCount = await Service.countDocuments();

    const url = `${req.protocol}://${req.get('host')}/api/services`

    const services = await paginateDocuments(req.query,serviceQuery,serviceCount,url);

    return res.send(services)
})

router.get("/:serviceId",async(req,res)=>{
    const {serviceId}= req.params;

    if(!mongoose.isValidObjectId(serviceId)){
        return res.status(400).send({message:"Invalid service"})
    }

    const service = await Service.findOne({_id:serviceId});

    if(!service){
        return res.status(404).send({message:"Service has not been found"})
    }

    return res.send(service)
})

router.delete("/:serviceId",async(req,res)=>{
    const {serviceId} = req.params;

    if(!mongoose.isValidObjectId(serviceId)){
        return res.status(404).send({message:"Invalid service"});
    }

    const service = await Service.findByIdAndDelete(serviceId);

    if(!service){
        return res.status(404).send({message:"Service has not been found"})
    }

    return res.send({message:"Service has been succcessfully deleted"})
})


module.exports = router;