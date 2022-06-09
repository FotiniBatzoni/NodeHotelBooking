const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paginateDocuments = require("../../utilities/paginateDocuments")
const { RoomType} = require("../../models/roomType");
const { Room,validateRoom} = require("../../models/room");


router.post("/",async(req,res)=>{
    const {error} = validateRoom(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    //validate roomType
    if(!mongoose.isValidObjectId(req.body.roomType)){
        return res.status(404).send({message:`Room Type is invalid`})
    }

    const roomType = await RoomType.findOne({_id:req.body.roomType})
    if(!roomType){
        return res.status(404).send({message:`Room Type has not been found`})
    }

    //validate damages
    for(let [i,s] of req.body.damages.entries()){
        if(!mongoose.isValidObjectId(s)){
            return res.status(404).send({message:`${i+1} damage is invalid`})
        }

        const damage = await RoomType.findOne({services:{$in:s}})
        if(!damage){
            return res.status(404).send({message:`${i+1} damage has not been found`})
        }
    }

    const room = new Room(req.body);

    await room.save();

    await RoomType.findByIdAndUpdate(req.body.roomType, {$push: {rooms:room._id}})

    return res.send({message:"Room is successfully saved"})
})

module.exports = router