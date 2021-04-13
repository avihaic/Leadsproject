const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Campaigns = require('../models/campaigns')
const CampaignInputs = require('../models/campaignsInputs')
const Campaigncannels = require('../models/campaignscannel')
const Leads = require('../models/Leads')
const generateUniqueId = require('generate-unique-id');

const userSchema = new mongoose.Schema({
    userid:{
        type:String,
        default:generateUniqueId({length:6})
    },
    userType:{
        type:String,
        usertype:['admin','user'],
        default:'user'
    },
    name: {
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('כתובת מייל לא תקינה נסה שנית');
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            //.lowercase()
            if(value.toLowerCase().includes('password')){
                throw new Error('password cant contain the string password')
            }            
        },

    },
    tokens:[{
       token:{
          type:String,
          required:true
       } 
    }],
},{
        timestamps:true
})

userSchema.virtual('campaigns', {
    ref: 'Campaigns',
    localField: '_id',
    foreignField: 'owner',
})

userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password

    return userObject
}

userSchema.methods.generateauthtoken = async function () {

    const user = this
    const token = jwt.sign({ _id: user._id.toString() },'blabal')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//check user login
userSchema.statics.findbycredentials = async (email,password) => {
   //console.log(email,password)
    const user = await User.findOne({email})
  
    if(!user){
        throw new Error('לא ניתו להתחבר בדוק את השדות')
    }

    const ismatch = await bcrypt.compare(password,user.password)
    if(!ismatch){
        throw new Error('לא ניתו להתחבר בדוק את השדות')
    }
    return user
}

//hash the plain text password before sending
userSchema.pre('save', async function(next){
    const user = this

   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password,8)
   }

    next()
})

//delete user campings when user is removed
userSchema.pre('remove', async function(next){
    const user = this
    await Campaigns.deleteMany({owner: user._id})
    await CampaignInputs.deleteMany({owner: user._id})
    await Campaigncannels.deleteMany({owner: user._id})
    await Leads.deleteMany({owner: user._id})
})

const User = mongoose.model('User',userSchema)

module.exports = User