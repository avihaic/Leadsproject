const validator = require('validator')
const mongoose = require('mongoose')
const Campaigncannels = require('../models/campaignscannel')

const campaignInputsSchema = new mongoose.Schema({
    name:{
        type:String,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error('שדה שם יכול להכיל רק תווים');
            }
        }
    },
    lastname:{
        type:String,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error('שדה שם משפחה יכול להכיל רק תווים');
            }
        }
    },
    address:{
        type:String,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error('שדה כתובת יכול להכיל רק תווים');
            }
        }
    },
    phone:{
        type:String,
        validate(value){
            if(!validator.isMobilePhone(value)){
                throw new Error('שדה טלפון לא תקין נסה שנית');
            }
        }
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('כתובת מייל לא תקינה נסה שנית');
            }
        }
    },
    note:{
        type:String
    },
    page:{
        type:String
    },
    owner:{
        type:String
    },
    cannel_owner:{
        type:String
    },
    camp_owner:{
        type:String
    },
    uuidkey:{
        type:String
    }
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

campaignInputsSchema.pre('save', async function(next){
const inputs = this
    const val = await CampaignInputs.findOne( {cannel_owner: inputs.cannel_owner })
    if(val){
        throw new Error(console.error('there is inputs for this cannel all ready'))
    } 
    next() 
})

const CampaignInputs = mongoose.model('CampaignInputs',campaignInputsSchema)
module.exports = CampaignInputs
