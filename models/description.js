const Joi = require("joi");
const mongoose = require("mongoose");

const roomDescriptionSchema = new mongoose.Schema({
    name:{
        type:String
    },
    thumbnail:{
        type:String
    }
})

const Description = mongoose.model("Description",roomDescriptionSchema);

function validateDescription(description){
    const schema = Joi.object({
        name: Joi.string().trim().required().empty().messages({
            "any.required": `Name is a required field`,
            "string.empty":`Name should not be empty`,
            "string.base":`Invalid Name`
        }),
        thumbnail:Joi.string().required().empty().messages({
            "any.required": `Thumbnail is a required field`,
            "string.empty":`Thumbnail should not be empty`,
            "string.base":`Invalid Thumbnail`
        }),
    })

    return schema.validate(description)
}

module.exports={
    Description,
    validateDescription
}