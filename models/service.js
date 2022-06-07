const Joi = require("joi");
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name:{
        type:String
    }
})

const Service = mongoose.model("Service",serviceSchema);

function validateService(service){
    const schema = Joi.object({
        name: Joi.string().required().empty().messages({
            "any.required": `Name is a required field`,
            "string.empty":`Name should not be empty`,
            "string.base":`Invalid Name`
        })
    })

    return schema.validate(service)
}

module.exports={
    Service,
    validateService
}