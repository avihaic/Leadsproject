const express = require('express')
const router = new express.Router()
const auth = require('../middelware/auth')
const CampaignInputs = require('../models/campaignsInputs')
const Campaigncannels = require('../models/campaignscannel')
const uuidAPIKey = require('uuid-apikey');
require('mongoose')

//Create fileds
router.post('/Formfileds', auth, async (req, res) =>{

    const keys = uuidAPIKey.create()
    const query = await Campaigncannels.find( {owner: req.user._id })
   
    const Fileds = new CampaignInputs({
      ...req.body,
      owner: req.user._id,
      cannel_owner: req.query.id,
      camp_owner: query[0].camp_owner,
      uuidkey: keys.uuid
    }) 

    try {
        await Fileds.save()
 
        res.status(200).send(await CampaignInputs.createurl(Fileds,keys.apiKey))
    } catch (e) {
        res.status(400).send(e)
    } 
})

router.patch('/updates/:id', auth ,async (req,res) =>{

    const updates = Object.keys(req.body)
    const alloption = ["name","lastname","address","phone","email","note","page"]
    const isupdates =  updates.every((update) => alloption.includes(update))
    
    if(!isupdates){
            res.status(400).send({error:' Error in updates'})
        }
    
        try {
            const inputs = await CampaignInputs.findOne({ _id: req.params.id})
            if(!inputs){
              return res.status(404).send('no inputs with this id')
            }
    
             updates.forEach((update) => inputs[update] = req.body[update])
             await inputs.save()
             res.send(inputs)
    
        } catch (e) {
            res.status(500).send('error to update')
        }
    })








module.exports = router

