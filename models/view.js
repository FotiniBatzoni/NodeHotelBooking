const mongoose = require("mongoose");
const Joi = require("joi");

const viewSchema = new mongoose.Schema({
    name:{
        type: String
    }
})

const View = mongoose.model("View",viewSchema);

function validateView(view){
    const schema = Joi.object({
        name:Joi.string().trim().required().empty().messages({
            "string.base":`View name should be a string`,
            "any.required":`View name is a required field`,
            "string.empty":`View name should not be empty`
        })
    })

    return schema.validate(view)
} 

module.exports={
    View,
    validateView
}