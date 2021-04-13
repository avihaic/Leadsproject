const validator = require('validator')
const mongoose = require('mongoose')

const campaignInputsSchema = new mongoose.Schema({
    name:{type:String},
    lastname:{type:String},
    address:{type:String},
    phone:{type:String},
    email:{type:String},
    note:{type:String},
    page:{type:String},
    owner:{type:String},
    cannel_owner:{type:String},
    camp_owner:{type:String},
    uuidkey:{type:String}
})

campaignInputsSchema.statics.createurl = async function (info,api) { 
    const obj = info.toObject()
    delete obj['_id'];
    delete obj['__v'];

    const keys = Object.keys(obj)
    const vals = Object.values(obj)
    let url = `http://localhost:3000/leads?api_key=${api}`

   for(i=0;i<keys.length;i++){
       let a = keys[i].toString()
       let b = vals[i].toString()
       url += '&'
       url += a
       url += '='
       url += b  
    }
    console.log(url)
return url
}



const CampaignInputs = mongoose.model('CampaignInputs',campaignInputsSchema)
module.exports = CampaignInputs
