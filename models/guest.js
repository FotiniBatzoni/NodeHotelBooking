const mongoose = require("mongoose");
const Joi = require("joi");

const guestSchema = new mongoose.Schema({
    name:{
        type: String
    },
    guests:{
        numberOfAdults:{
            type:Number
        },
        numberOfChilden0to2:{
            type:Number
        },
        numberOfChilden3to6:{
            type:Number
        },
        numberOfChilden7to12:{
            type:Number
        },
    },
    thumbnail:{
        type:String
    }
})

const Guest = mongoose.model("Guest",guestSchema);

function validateGuest(guest){
    const schema = Joi.object({
        name: Joi.string().required().empty().messages({
            "any.required": `Name is a required field`,
            "string.empty":`Name should not be empty`,
            "string.base":`Invalid Name`
        }),
        guests:Joi.object({
            numberOfAdults:Joi.number().required().integer().min(0).messages({
                "any.reqired":`Number Of Adults is a required field`,
                "number.base":`Number Of Adults shoulb an integer number`,
                "number.min":`Number Of Adults should be positive`
            }),
            numberOfChilden0to2:Joi.number().required().integer().min(0).messages({
                "any.reqired":`Number Of Childern from 0 to 2 y.o is a required field`,
                "number.base":`Number Of Childern from 0 to 2 y.o shoulb an integer number`,
                "number.min":`Number Of Childern from 0 to 2 y.o should be positive`  
            }),
            numberOfChilden3to6:Joi.number().required().integer().min(0).messages({
                "any.reqired":`Number Of Childern from 3 to 6 y.o  is a required field`,
                "number.base":`Number Of Childern from 3 to 6 y.o  shoulb an integer number`,
                "number.min":`Number Of Childern from 3 to 6 y.o  should be positive`  
            }),
            numberOfChilden7to12:Joi.number().required().integer().min(0).messages({
                "any.reqired":`Number Of Childern from 7 to 12 y.o  is a required field`,
                "number.base":`Number Of Childern from 7 to 12 y.o  shoulb an integer number`,
                "number.min":`Number Of Childern from 7 to 12 y.o  should be positive`  
            }),
        }).required().messages({
            "any.required":`Guests are required`
        }),
        thumbnail:Joi.string().required().empty().messages({
            "any.required": `Thumbnail is a required field`,
            "string.empty":`Thumbnail should not be empty`,
            "string.base":`Invalid Thumbnail`
        }),
    })

    return schema.validate(guest)
}


module.exports={
    Guest,
    validateGuest
}
