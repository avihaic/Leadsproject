const validator = require('validator')
const mongoose = require('mongoose')
const generateUniqueId = require('generate-unique-id');
const CampaignInputs = require('../models/campaignsInputs')
const Campaigncannels = require('../models/campaignscannel')
const Leads = require('../models/Leads')

const campaignSchema = new mongoose.Schema({
    campingid:{
        type:String,
        default:generateUniqueId({length:6})
    },
    name:{
        type: String,
        require:true
    },
    kind:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error('no numbers allowed');
            }
        }
    },
    owner:{
        type:String,
        required:true,
        ref: 'User'
    }
}
      ,{
        timestamps:true
})

//delete leads and inputs and cannels when campings is removed
campaignSchema.pre('remove', async function(next){
    const camping = this
    console.log(camping.campingid)
    await CampaignInputs.deleteMany({camp_owner: camping.campingid})
    await Campaigncannels.deleteMany({camp_owner: camping.campingid})
    await Leads.deleteMany({camp_owner: camping.campingid})
    next()
})

const Campaigns = mongoose.model('Campaigns',campaignSchema)
module.exports = Campaigns
