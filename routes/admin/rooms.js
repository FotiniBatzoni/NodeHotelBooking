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

router.put("/:roomId",async(req,res)=>{
    const {roomId}= req.params;

    if(!mongoose.isValidObjectId(roomId)){
        return res.status(404).send({message:"Invalid Room"})
    }

    const {error} =validateRoom(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    const roomBeforeUpdate = await Room.findOne({_id:roomId});

    if(!roomBeforeUpdate){
        return res.status(404).send({message:"Room has not been found"})
    }

    const roomTypeBeforeUpdate = roomBeforeUpdate.roomType;
    
   
    const room = await Room.findByIdAndUpdate(roomId,req.body,{new:true});

    if(roomTypeBeforeUpdate!==req.body.roomType){
        await RoomType.findByIdAndUpdate(roomTypeBeforeUpdate._id, {$pull: {rooms:roomBeforeUpdate._id}})
        await RoomType.findByIdAndUpdate(room.roomType, {$push: {rooms:room._id}})
    }

    return res.send({message:"Room has been successfully updated"})
})

router.get("/",async(req,res)=>{
    const roomQuery = Room.find({})
        .populate({ path:'roomType', select:'name'})
        .populate({ path:'damages',select:'name'})

    const roomCount = await Room.countDocuments()

    const url = `${req.protocol}://${req.get('host')}/api/rooms`;

    const rooms = await paginateDocuments(req.query,roomQuery,roomCount,url);

    return res.send(rooms)

})

router.get("/:roomId",async(req,res)=>{
    const {roomId}= req.params;

    if(!mongoose.isValidObjectId(roomId)){
        return res.status(404).send({message:"Invalid Room"})
    }

    const room =await  Room.findOne({_id:roomId})
    .populate({ path:'roomType', select:'name'})
    .populate({ path:'damages',select:'name'})

    if(!room){
        return res.status(404).send({message:"Room has not been found"})
    }

    return res.send(room)
})


router.delete("/:roomId",async(req,res)=>{
    const {roomId}= req.params;

    if(!mongoose.isValidObjectId(roomId)){
        return res.status(404).send({message:"Invalid Room"})
    }

    const room = await Room.findByIdAndDelete(roomId);

    if(!room){
        return res.status(404).send({message:"Room has not been found"})
    }

    //find roomtype and delete room
    await RoomType.findOneAndUpdate(
        {_id:room.roomType},
        { $pull:{rooms:roomId}},
        {new:true}
     )

    return res.send({message:"Room has been successfully deleted"})
})

module.exports = router