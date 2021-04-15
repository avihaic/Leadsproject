const express = require('express')
const router = new express.Router()
const auth = require('../middelware/auth')
const authrole = require('../middelware/authrole')
const Campaigns = require('../models/campaigns')
const User = require('../models/user')
require('mongoose')
//Create Camping
router.post('/campaign', auth, async (req, res) =>{
    const campaign = new Campaigns({
      ...req.body,
      owner: req.user.userid
    })

    try {
        await campaign.save()
        res.status(200).send(campaign)
    } catch (e) {
        res.status(400).send(e)
    }
})

//update campaign by id
router.patch('/campaign/:id', auth ,async (req,res) =>{

    const updates = Object.keys(req.body)
    const alloption = ["name","kind"]
    const isupdates =  updates.every((update) => alloption.includes(update))

    if(!isupdates){
            res.status(400).send({error:' Error in updates'})
        }
    
        try {
            const campaign = await Campaigns.findOne({campingid: req.params.id,owner: req.user.userid})
            if(!campaign){
              return res.status(404).send('no campaign with this id')
            }
    
             updates.forEach((update) => campaign[update] = req.body[update])
             await campaign.save()
             res.send(campaign)
    
        } catch (e) {
            res.status(500).send('error to update')
        }
    })
    
    //delete campaign by id
    router.delete('/campaign/:id', auth ,async (req,res) => {
        try {
            const campaign = await Campaigns.findOne({ campingid: req.params.id, owner: req.user.userid })
            console.log(campaign)
            if(!campaign){
                return res.status(404).send('campaign dont found')
            }
            await campaign.remove()
            res.status(200).send(campaign)
        } catch (e) {
            res.status(500).send(e)
        }
})
//Find all campings
//GET /campaign?kind=seo
//GET /campaign?limit=10&skip=20
//GET /campaign?sortBy=createdAt:desc
//GET /campaign?page
// For page 1, the skip is: (1 - 1) * 2 => 0 * 2 = 0
// For page 2, the skip is: (2 - 1) * 2 => 1 * 2 = 2
router.get('/campaign', auth, authrole(['admin','user']),async (req,res) => {
    console.log(req.user.userType)
   // const query = await Campaigns.find({owner:req.user.userid})
    console.log(req.user.userid)

    try{ 
      const query = await Campaigns.find({owner:req.user.userid})
      res.status(200).send(query)
    } catch (e) {
      res.status(400).send(e) 
    }

})

//find camping by id
router.get('/campaign/:id', auth , async (req,res) => {
    try {
        const campaign = await Campaigns.findOne({campingid:req.params.id})
        if(!campaign){
            return res.status(400).send('אין לך קמפיין עם מזהה כזה')
        }
        res.status(200).send(campaign)
    } catch (e) {
        res.status(400).send('אין לך קמפיין עם מזהה כזה')
    }
})








module.exports = router

