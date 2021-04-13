const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = require('../middelware/auth')
const authrole = require('../middelware/authrole')
require('mongoose')

/*Create User */
router.post('/users', async (req, res) =>{
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateauthtoken()
        res.status(200).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//login user
router.post('/users/login', async (req,res) => {
try {
  //  console.log(req.body.email,req.body.password)
    const user = await User.findbycredentials(req.body.email,req.body.password)
    const token = await user.generateauthtoken()
    res.send({user,token})
    } catch (e) {
        res.status(400).send({error:'לא ניתן להתחבר'})
    }
})

//user logout
router.post('/users/logout', auth , async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
           return token.token !== req.token
        })     
       await req.user.save()
       res.send('התנתקת מהמערכת')

    } catch (e) {
        res.status(500).send(e)
    }
})

//logoutall
router.post('/users/logoutall', auth ,async (req,res) =>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("התנתקת מכל המכשירים")

    } catch (e) {
        res.send('ישנה בעיה בהתנתקות')
    }
})

//show all profiles
router.get('/users/', auth, authrole(['admin']) ,async (req,res) => {
    const users =  await User.find()
    try {
        if(users)
        res.status(200).send(users)
    } catch (e) {
        res.status(401).send(e)
    }
})

//show my profile
router.get('/users/me', auth ,async (req,res) => {
res.send(req.user)
})

//update user
router.patch('/users/me', auth , async (req,res) =>{

    const updates = Object.keys(req.body)
    const allowedupdates = ['name','email','password','age']
    const isvalidoperation = updates.every((update) => allowedupdates.includes(update))
    
    if(!isvalidoperation){
        return res.status(400).send({error: 'invaild updates!!!'})
    }

    try {        
        updates.forEach((update) =>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//delete user
router.delete('/users/me', auth , async (req,res) =>{
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router