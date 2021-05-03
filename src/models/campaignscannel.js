const mongoose = require('mongoose')
const generateUniqueId = require('generate-unique-id');


const campaigncannelSchema = new mongoose.Schema({
    cannelid:{
        type:String,
        default:generateUniqueId({length:6})
    },
    name:{
        type: String,
        require:true
    },
    owner:{
        type:String,
        required:true,
    },
    camp_owner:{
        type:String,
        required:true,
    }
})


const Campaigncannels = mongoose.model('Campaigncannels',campaigncannelSchema)
module.exports = Campaigncannels
