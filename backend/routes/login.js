var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config()

var connection = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_DB_HOST],
    localDataCenter: process.env.CASSANDRA_DB_DATACENTER,
    keyspace: process.env.CASSANDRA_DB_KEYSPACE
  });


router.get('/', function(req, res, next) {
    res.send('API is working properly');
});

router.post('/', async function(req, res, next) { 
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
                console.log(result.rows[0]);
               let dbPasswordHash = result.rows[0].passwordhash; 
               if(await argon2.verify(dbPasswordHash, password)) {
                   //correct password 
                   console.log("correct password");
                    user = {
                       userid: result.rows[0].id,
                       username: result.rows[0].username,
                       email: emailAddress,
                   }
                   res.cookie("jid", jwt.sign({user: user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }), {httpOnly: true});
                   jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }, (err, token) => {
                          res.json({err: false, notFound: false, wrongPassword: false, accessToken: token});
                    });


                }//end if correct password
                else{
                     //incorrect password
                    wrongPassword = true;
                    console.log("incorrect password");
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

module.exports = router;