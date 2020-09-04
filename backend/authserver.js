var express = require('express');
const auth = express();
const jwt = require('jsonwebtoken');
require('dotenv').config()
var cors = require("cors");

auth.use(express.json());
auth.use(cors());




auth.get('/', function(req, res, next) {
    res.send('Auth is working properly');
});


auth.post('/authenticatetoken', (req, res, next) =>
    {
        console.log("From authserver token is...");
        console.log(req.body);
        res.sendStatus(200);

        

    }//end function



);//end post


auth.post('/accesstokenrenewal', (req, res, next) => 
    {
      //client requests for new access token if previous is expisted


    }//end function


);//end post


function verify_renew_token(renewToken) {
  //check the client's renew token to see if it's expired or forbidden




  
}//end verify_renew_token function


function verify_access_token(req, res, next) {
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

module.exports = auth;
  
