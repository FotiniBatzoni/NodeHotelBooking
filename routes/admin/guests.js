const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paginateDocuments = require("../../utilities/paginateDocuments")
const { Guest,validateGuest} = require("../../models/guest");

router.post("/",async(req,res)=>{
    const {error} = validateGuest(req.body);
    if(error){
        return res.send({message:error.details[0].message})
    }

    const guest = new Guest(req.body);

    await guest.save();

    return res.send({message:"Guest is successfully saved"})
})

router.put("/:guestId",async(req,res)=>{
    const {guestId} = req.params;

    if(!mongoose.isValidObjectId(guestId)){
        return res.status(404).send({message:"Invalid guest"});
    }

    const {error}=validateGuest(req.body)
    if(error){
        return res.send({message:error.details[0].message});
    }

    const guest = await Guest.findByIdAndUpdate(guestId,req.body,{new:true});

    if(!guest){
        return res.status(404).send({message:"Guest has not been found"})
    }

    return res.send({message:"Guest has been successfully updated"})
})

router.get("/",async(req,res)=>{
    const guestQuery = Guest.find({});

    const guestCount = await Guest.countDocuments();

    const url = `${req.protocol}://${req.get('host')}/api/guests`;

    const guests = await paginateDocuments(req.query,guestQuery,guestCount,url);

    return res.send(guests)
})

router.get("/:guestId",async(req,res)=>{
    const {guestId} = req.params;

    
    if(!mongoose.isValidObjectId(guestId)){
        return res.status(404).send({message:"Invalid guest"});
    }

    const guest = await Guest.findOne({_id:guestId});

    if(!guest){
        return res.status(404).send({message:"Guest has not been found"})
    }

    return res.send(guest)
})

router.delete("/:guestId",async(req,res)=>{
    const {guestId}= req.params;

    if(!mongoose.isValidObjectId(guestId)){
        return res.status(404).send({message:"Invalid guest"});
    }

    const guest = await Guest.findByIdAndDelete(guestId);

    if(!guest){
        return res.status(404).send({message:"Guest has not been found"})
    }

    return res.send({message:"Guest has been successfully deleted"})
})

module.exports = router;