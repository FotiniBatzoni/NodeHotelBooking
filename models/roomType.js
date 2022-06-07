const Joi = require("joi");
const mongoose = require("mongoose");

const roomCategorySchema = new mongoose.Schema({
    Name:{
        type:String
    },
    totalRooms:{
        type:Number
    },
    availableRooms:{
        type:Number
    },
    lowSeasonPrice:{
        type:Number
    },
    midSeasonPrice:{
        type:Number
    },
    highSeasonPrice:{
        type:Number
    },
    discountForAgents:{
        type:Number
    },
    discountForIndividual:{
        type:Number
    },
    specialOffer:{
        type:Number
    },
    gallery:[{
        type:String
    }],
    description:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Description'
    }]

})