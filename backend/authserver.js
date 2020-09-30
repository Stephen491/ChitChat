var express = require('express');
const auth = express();
const jwt = require('jsonwebtoken');
var cassandra = require('cassandra-driver');
const argon2 = require('argon2');
const cookieParser = require('cookie-parser');
require('dotenv').config()
var cors = require("cors");

auth.use(express.json());
//auth.use(cors());
auth.use(cors({credentials: true, origin: 'http://localhost:3000'}));
auth.use(cookieParser());



var connection = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_DB_HOST],
  localDataCenter: process.env.CASSANDRA_DB_DATACENTER,
  keyspace: process.env.CASSANDRA_DB_KEYSPACE
});



auth.get('/', function(req, res, next) {
    res.send('Auth is working properly');
});



auth.post('/login', async function(req, res, next) { 
  let emailAddress = req.body.email;
  let password = req.body.password; 
  let requestGranted = false;
  let notFound = false;
  let wrongPassword = false;
  let response;
  let user;

  console.log("Login attempt received");

  let query = "SELECT id, passwordhash FROM user_accounts_login_credentials WHERE email = ?"; 
  connection.execute(query, [req.body.email]).then(async function(result) {
      if(!result.rows[0]){
          notFound = true;
          response = {err: true, notFound: true, wrongPassword: wrongPassword, token: null};                
          res.json(response); 
      }
      else {
          
          try {
             let dbPasswordHash = result.rows[0].passwordhash; 
             if(await argon2.verify(dbPasswordHash, password)) {

                 //correct password 
                  user = {
                     userid: result.rows[0].id,
                     username: result.rows[0].username,
                     email: emailAddress,
                 }
                 res.cookie("refresh_token", jwt.sign({user: user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }), {httpOnly: true});
                 jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }, (err, token) => {
                        
                        res.json({err: false, notFound: false, wrongPassword: false, accessToken: token});
                  });


              }//end if correct password
              else{
                   //incorrect password
                  wrongPassword = true;
                  response = {err: true, notFound: false, wrongPassword: wrongPassword, token: null};
                  res.json(response);
              }// end else incorrect password

          }
          catch(err){
              //hashing error
              throw err;
          }


      }

  });//end query command

  
});



auth.post('/authenticatetoken', (req, res, next) =>
    {
        //TO DO: Verify user's access token
        verify_access_token(req,res,next);
        

    }//end function



);//end post


auth.post('/accesstokenrenewal', (req, res, next) => 
    {
      //TO DO: Generate a new access token for the user if current one has expired
      console.log("From authserver refresh token is...")
      const refreshToken = req.cookie; 
      console.log(req.cookies);
      res.sendStatus(200);
    }//end function


);//end post

const verify_access_token = (req, res, next) => {
  console.log("From authserver token is...");
        console.log(req.body);

        jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
          if(err instanceof jwt.TokenExpiredError) {
           //TO DO: Attempt to renew access token using refresh token, if successful, grant access. Else, reject request
            
            res.sendStatus(401);
            



          }
          else if(err){
            res.sendStatus(401).send("Internal Server Error");
          }
          else {
            req.email = decoded.email;
            req.userid = decoded.userid;
            req.username = decoded.username;
            console.log("Access Token Authorized");
            //next(); 
          }
        });

}

function verify_renew_token(renewToken) {
  //TO DO: check the client's renew token to see if it's expired or forbidden




  
}//end verify_renew_token function

/** 
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
  */

module.exports = auth;
  
