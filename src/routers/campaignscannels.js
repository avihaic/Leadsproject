const express = require('express')
const router = new express.Router()
const auth = require('../middelware/auth')
const Campaigncannels = require('../models/campaignscannel')
require('mongoose')

//Create cannel
router.post('/cannel', auth, async (req, res) =>{
 //   console.log(req.body)
    const cannel = new Campaigncannels({
      ...req.body,
      owner: req.user.userid,
      camp_owner: req.query.id
    })

    try {
        await cannel.save()
        res.status(200).send(cannel)
    } catch (e) {
        res.status(400).send(e)
    }
})

//show all camping cannel by id
router.get('/cannels/:id',auth, async (req,res) =>{
 
    try {
        const cannels = await Campaigncannels.find( {owner: req.params.id })
        if(!cannels){
            return res.status(400).send(e)
        }
        res.status(200).send(cannels)
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router

