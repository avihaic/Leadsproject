const uuidAPIKey = require('uuid-apikey');
const campaignsInputs = require('../models/campaignsInputs')
require('mongoose')

const authapi = async (req,res,next) => {

const apikey = req.query.api_key
const key = await campaignsInputs.find({}).select('uuidkey').where('cannel_owner', req.query.cannel_owner)

console.log(key[0].uuidkey)
if(!uuidAPIKey.check(apikey,key[0].uuidkey)){
    return res.status(404).send('Api key wrong')
    }
    next()
} 

module.exports = authapi
