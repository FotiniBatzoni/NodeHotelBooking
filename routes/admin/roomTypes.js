const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paginateDocuments = require("../../utilities/paginateDocuments")
const { RoomType,validatePrice,validateRoomType} = require("../../models/roomType");
const { Description } = require("../../models/description");
const { Service } = require("../../models/service");
const { View } = require("../../models/view");
const { Guest } = require("../../models/guest")


router.post("/",async(req,res)=>{
    const {error}= validateRoomType(req.body)
    if(error){
        return res.status(400).send({message:`${error.details[0].error} `})
    }

    //validate price
    for(let [i,price] of req.body.prices.entries()){
        const {error}= validatePrice(price)
        if(error){
            return res.status(400).send({message:`${error.details[0].message} for price ${i+1}`})
        }
    }

    //validate description
    for(let [i,descr] of req.body.description.entries()){
        const description = await Description.findOne({_id:descr})
        if(!description){
            return res.status(404).send({message:`${i+1} description has not been found`})
        }
    }

    //validate services
    for(let [i,s] of req.body.services.entries()){

        const service = await Service.findOne({_id:s})
        if(!service){
            return res.status(404).send({message:`${i+1} service has not been found`})
        }
    }

    //validate view
    if(!mongoose.isValidObjectId(req.body.view)){
        return res.status(404).send({message:`View is invalid`})
    }

    const view = await View.findOne({_id:req.body.view})
    if(!view){
        return res.status(404).send({message:`View has not been found`})
    }

    //validate guests
    for(let [i,g] of req.body.guests.entries()){

        const guest = await Guest.findOne({_id:g})
        if(!guest){
            return res.status(404).send({message:`${i+1} guest type has not been found`})
        }
    }

    const roomType = new RoomType(req.body);

    await roomType.save();

    return res.send({message:"Room Type is successfully saved"})
})

router.put("/:roomTypeId",async(req,res)=>{
    const {roomTypeId} = req.params;

    if(!mongoose.isValidObjectId(roomTypeId)){
        return res.status(404).send({message:"Invalid Room Type"})
    }

    const {error}= validateRoomType(req.body)
    if(error){
        return res.status(400).send({message:`${error.details[0].message} `})
    }

    //validate price
    for(let [i,price] of req.body.prices.entries()){
        const {error}= validatePrice(price)
        if(error){
            return res.status(400).send({message:`${error.details[0].message} for price ${i+1}`})
        }
    }

    //validate description
    for(let [i,descr] of req.body.description.entries()){
        const description = await Description.findOne({_id:descr})
        if(!description){
            return res.status(404).send({message:`${i+1} description has not been found`})
        }
    }

    //validate services
    for(let [i,s] of req.body.services.entries()){
        const service = await Service.findOne({_id:s})
        if(!service){
            return res.status(404).send({message:`${i+1} service has not been found`})
        }
    }

    //validate view
    if(!mongoose.isValidObjectId(req.body.view)){
        return res.status(404).send({message:`View is invalid`})
    }

    const view = await View.findOne({_id:req.body.view})
    if(!view){
        return res.status(404).send({message:`View has not been found`})
    }

    //validate guests
    for(let [i,g] of req.body.guests.entries()){
        const guest = await Guest.findOne({_id:g})
        if(!guest){
            return res.status(404).send({message:`${i+1} guest type has not been found`})
        }
    }

    const roomType = await RoomType.findByIdAndUpdate(roomTypeId,req.body,{new:true})

    if(!roomType){
        return res.status(404).send({message:"Room Type has not been found"})
    }

    return res.send({message:"Room Type is successfully updated"})
})

router.get("/",async(req,res)=>{
    const roomTypeQuery = RoomType.find({})
      .populate({ path :'rooms', select:'roomNumber floor isAvailable isOutOfOrder'})
      .populate({ path:'description', select:'name thumbnail'})
      .populate({ path:'services', select:'name'})
      .populate({ path:'view', select:'name'})
      .populate({ path:'guests', select:'name  guests thumbnail'})

      const roomTypeCount = await RoomType.countDocuments({})

      const url = `${req.protocol}://${req.get('host')}/api/roomtypes`

      const roomTypes = await paginateDocuments(req.query,roomTypeQuery,roomTypeCount,url);

      return res.send(roomTypes)
})

router.get("/:roomTypeId",async(req,res)=>{
    const {roomTypeId}=req.params;

    if(!mongoose.isValidObjectId(roomTypeId)){
        return res.status(404).send({message:"Invalid Room Type"})
    }

    const roomType = await RoomType.findOne({_id:roomTypeId})
        .populate({ path :'rooms', select:'roomNumber floor isAvailable isOutOfOrder'})
        .populate({ path:'description', select:'name thumbnail'})
        .populate({ path:'services', select:'name'})
        .populate({ path:'view', select:'name'})
        .populate({ path:'guests', select:'name  guests thumbnail'})
        
    if(!roomType){
        return res.status(404).send({message:"Room Type has not been found"})
    }

    return res.send(roomType)

})

router.delete("/:roomTypeId",async(req,res)=>{
    const {roomTypeId}= req.params;

    if(!mongoose.isValidObjectId(roomTypeId)){
        return res.status(404).send({message:"Invalid Room Type"})
    }

    const roomType = await RoomType.findByIdAndDelete(roomTypeId);

    if(!roomType){
        return res.status(404).send({message:"Room Type has not been found"})
    }

    return res.send({message:"Room Type has been successfully deleted"})
})


module.exports=router;