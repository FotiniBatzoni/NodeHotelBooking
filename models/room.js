const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const roomSchema = new mongoose.Schema({
    roomType:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'RoomType'
    },
    roomNumber:{
        type:String
    },
    floor:{
        type:String
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
        ref:'Service' 
    }]
})

const Room = mongoose.model('Room',roomSchema);

function validateRoom(room){
    const schema= Joi.object({
        roomType:Joi.objectId().required().messages({
            "any.reqired":`Room Type is a required field`,
            "string.pattern.name":`Invalid Room Type`
        }),
        roomNumber:Joi.string().trim().required().messages({
            "any.reqired":`Room Number is a required field`,
            "string.empty":`Room Number should not be empty`,
            "string.base":`Invalid Room Number`
        }),
        floor: Joi.string().trim().required().empty().messages({
            "any.required": `Floor is a required field`,
            "string.empty":`Floor should not be empty`,
            "string.base":`Invalid Floor`
        }),
        isAvailable:Joi.boolean().required().messages({
            "any.required":`Is Room Available is a required field`,
            "boolean.base":`Is Room Available should be a boolean`
        }),
        isOutOfOrder:Joi.boolean().messages({
            "boolean.base":`Is Room Out Of Order should be a boolean`
        }),
        damages:Joi.array().items(Joi.objectId()).unique().messages({
            "array.unique":`Damages contain duplicated value`,
            "string.empty":`Damage should not be empty`
        })
    })

    return schema.validate(room)
}

module.exports={
    Room,
    validateRoom
}