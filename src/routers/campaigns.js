const express = require('express')
const router = new express.Router()
const auth = require('../middelware/auth')
const Campaigns = require('../models/campaigns')
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
            const campaign = await Campaigns.findOneAndDelete({ campingid: req.params.id, owner: req.user.userid })
            
            if(!campaign){
                return res.status(404).send('campaign dont found')
            }
            await req.campaign.remove()
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
router.get('/campaign', auth ,async (req,res) => {
    const match = {}
    const sort ={}

    if(req.query.kind){
        match.kind = req.query.kind
        console.log(match.kind)
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
       
        const page = parseInt(req.query.page)  //convert tp number frpm string
        const page_size = 2 // Similar to 'limit'
        const skip = (page - 1) 
        await req.user.populate({
             path:'campaigns',
             match,
             options:{
                 limit: (page_size),
                 skip:(skip),
                 sort
             }
         }).execPopulate()
        res.status(200).send(req.user.campaigns)
    } catch (e) {
       res.status(400).send(e) 
    }

})

//find camping by id
router.get('/campaign/:id', auth , async (req,res) => {
    const _id = req.params.id
    try {
        const campaign = await Campaigns.findOne( { _id, owner: req.user._id })
        if(!campaign){
            return res.status(400).send('אין לך קמפיין עם מזהה כזה')
        }
        res.status(200).send(campaign)
    } catch (e) {
        res.status(400).send('אין לך קמפיין עם מזהה כזה')
    }
})








module.exports = router

