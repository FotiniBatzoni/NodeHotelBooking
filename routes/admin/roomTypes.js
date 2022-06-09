const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paginateDocuments = require("../../utilities/paginateDocuments")
const { RoomType,validatePrice,validateRoomType} = require("../../models/roomType");


module.exports=router;