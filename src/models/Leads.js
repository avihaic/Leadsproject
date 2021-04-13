const validator = require('validator')
const mongoose = require('mongoose')
const User = require('../models/user')
const generateUniqueId = require('generate-unique-id');

const LeadsSchema = new mongoose.Schema({
    leadid:{
        type:String,
        default:generateUniqueId({length:6})
    },   
    name:{
        type: String,
    },
    lastname:{
        type: String,
    },
    address:{
        type: String,
    },
    phone:{
        type: String,
    },
    email:{
        type: String,
    },
    note:{
        type: String,
    },
    page:{
        type: String,
    },
    owner:{
        type:String,    
    },
    cannel_owner:{
        type:String,
    },
})


const Leads = mongoose.model('Leads',LeadsSchema)
module.exports = Leads
