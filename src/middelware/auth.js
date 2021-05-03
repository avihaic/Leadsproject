const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('mongoose')
const auth = async (req,res,next) =>  {
    try {

            const token = req.header('Authorization').replace('Bearer ', '')
         //   console.log(token)
            const decoded = jwt.verify(token, 'blabal')
           // console.log(decoded)
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

            if(!user){
                return res.status(404).send('no user')
            }


            req.token = token
            req.user = user
            next()
        } catch (e) {
            res.status(401).send('please Authenticate')
        }

}


module.exports = auth

