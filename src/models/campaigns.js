const validator = require('validator')
const mongoose = require('mongoose')
const generateUniqueId = require('generate-unique-id');


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
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }
}
      ,{
        timestamps:true
})

//delete leads and inputs and cannels when campings is removed
campaignSchema.pre('remove', async function(next){
    const user = this
    await CampaignInputs.deleteMany({camp_owner: Campaigns._id})
    await Campaigncannels.deleteMany({camp_owner: Campaigns._id})
    await Leads.deleteMany({camp_owner: Campaigns._id})
})

const Campaigns = mongoose.model('Campaigns',campaignSchema)
module.exports = Campaigns
