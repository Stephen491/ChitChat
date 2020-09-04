var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
require('dotenv').config()


module.exports = {
verify_token: function(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader!== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      if(bearerToken == null) {
          return res.sendStatus(401);
      }

      jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, 
        (err, user) => 
      {
        if(err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();



      });
      
    }
    
  
  }

};