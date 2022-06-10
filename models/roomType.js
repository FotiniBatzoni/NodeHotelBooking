const Joi = require("joi");
const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
    name:{
        type:String
    },
    value:{
        type:Number
    },
    date:{
        from:{
            type:Date
        },
        to:{
            type:Date
        }
    }
})

const roomTypeSchema = new mongoose.Schema({
    name:{
        type:String
    },
    rooms:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    availableRooms:{
        type:Number
    },
    prices:[priceSchema],
    gallery:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery'
    }],
    description:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Description'
    }],
    services:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Services'
    }],
    view:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'View'
    },
    guests:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Guest'
    }]
})

const RoomType = mongoose.model('RoomType',roomTypeSchema);

function validatePrice(price){
    const schema = Joi.object({
        name: Joi.string().trim().required().empty().messages({
            "any.required": `Name is a required field`,
            "string.empty":`Name should not be empty`,
            "string.base":`Invalid Name`
        }),
        value:Joi.number().required().min(0).messages({
            "any.reqired":`Value  is a required field`,
            "number.base":`Value  should an integer number`,
            "number.min":`Value  should be positive`  
        }),
        date:Joi.object({
            from: Joi.date().required().messages({
                "any.required":`From is required`,
                "date.base":`From should be date`
            }),
            to: Joi.date().greater(Joi.ref('from')).required().messages({
                "any.required":`To is required`,
                "date.base":`To should be date`,
                "date.greater":`To should be grater than From`,
               "date.ref":`From should be date` 
            })
        }).required().messages({
            "any.required":`Date is required`,
            "object.base":`Date should be an Object`
        })
    })
    return schema.validate(price)
}

function validateRoomType(roomType){
    const schema = Joi.object({
        name: Joi.string().trim().required().empty().messages({
            "any.required": `Name is a required field`,
            "string.empty":`Name should not be empty`,
            "string.base":`Invalid Name`
        }),
        description:Joi.array().items(Joi.objectId()).unique().messages({
            "array.unique":`Description contain duplicated value`,
            "string.empty":`Description should not be empty`,
            "string.pattern.name":`Invalid one of description`
        }),
        services:Joi.array().items(Joi.objectId()).unique().messages({
            "array.unique":`Services contain duplicated value`,
            "string.empty":`Services should not be empty`,
            "string.pattern.name":`Invalid one of services`
        }),
        guests:Joi.array().items(Joi.objectId()).unique().messages({
            "array.unique":`Guests contain duplicated value`,
            "string.empty":`Guests should not be empty`,
            "string.pattern.name":`Invalid one of guests`
        })
    }).unknown(true)
    return schema.validate(roomType)
}

module.exports ={
    RoomType,
    validatePrice,
    validateRoomType
}