const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('mongoose')

const authrole = (rolesArray) => (req,res,next) => {
    if(!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Session expired',
          code: 'SESSION_EXPIRED'
        });
      }
      let authorized = false;
    //if user has a role that is required to access any API
        for( let i=0 ; i<=rolesArray.length;i++)
       {
          console.log(req.user.userType,rolesArray[i])
          authorized = req.user.userType === rolesArray[i];
          console.log(authorized)
          if(authorized){
              return next();
          }
       }
       if(!authorized)
       return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
}

module.exports = authrole

