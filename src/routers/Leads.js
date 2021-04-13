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









module.exports = router

