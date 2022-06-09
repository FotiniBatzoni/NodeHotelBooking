const mongoose = require("mongoose");
const Joi = require("joi");

const roomSchema = new mongoose.Schema({
    roomType:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'RoomType'
    },
    isAvailable:{
        type:Boolean
    },
    isOutOfOrder:{
        type:Boolean,
        default:false
    },
    damages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Services' 
    }]
})

const Room = mongoose.model('Room',roomSchema);

function validateRoom(room){
    const schema= Joi.object({
        isAvailable:Joi.boolean().required().messages({
            "any.required":`Is Room Available is a required field`,
            "boolean.base":`Is Room Available should be a boolean`
        }),
        isOutOfOrder:Joi.boolean().required().messages({
            "any.required":`Is Room Out Of Order is a required field`,
            "boolean.base":`Is Room Out Of Order should be a boolean`
        })
    })

    return schema.validate(room)
}

module.exports={
    Room,
    validateRoom
}