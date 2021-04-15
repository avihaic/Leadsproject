const express = require('express')
const router = new express.Router()
const authapi = require('../middelware/authapi')
const auth = require('../middelware/auth')
const Leads = require('../models/Leads')
require('mongoose')

//Create fileds
router.post('/leads' ,auth ,authapi, async (req, res) =>{
   console.log(req.query)
    const info = new Leads({
        ...req.query,
    })
    try {
        await info.save()
       console.log(info)
        res.status(200).send(info)
    } catch (e) {
        res.status(400).send(e)
    }
})

//show all leads by camping id
router.get('/showleads/:id',auth, async (req,res) => {
    try
    {
        console.log(req.params.id)
        const leads = await Leads.find({camp_owner:req.params.id})
        console.log(leads)
        if(leads1.length === 0){
            console.log('in if')
            return res.status(400).send('אין לך לידים עבור הקמפיין הזה')
        }
        res.status(200).send(leads)
    } catch (e) {
        res.status(400).send('אין לך לידים עבור הקמפיין הזה')
    }
})








module.exports = router

