var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config()

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  })

  connection.connect(function (err) {
    if (err) {
        console.log('ERROR:', err.code);
        
    } else {
        console.log('Connected to DB')
    }
});



router.get('/', function(req, res, next) {
    res.send('API is working properly');
});

router.post('/', function(req, res, next) { 
    let emailAddress = req.body.email;
    let password = req.body.password; 
    let requestGranted = false;
    let notFound = false;
    let wrongPassword = false;
    let response;
    let user;

    console.log("Login attempt received");
    seekAccount();
    
    function seekAccount() {

        let queryCommand = "";
        queryCommand = queryCommand.concat("SELECT userid, username, passwordhash FROM useraccounts WHERE email = \'", emailAddress, "\';"); 
        connection.query(queryCommand, async function(err, rows, field) {
            if(rows.length==0){
                //if user for given email doesn't exist
                notFound = true;
                response = {err: true, notFound: true, wrongPassword: wrongPassword, token: null};
                res.json(response); 
            }
            else {
                //if user for given email exists
                dbPasswordHash = rows[0].passwordhash;
                try {
                   if(await argon2.verify(dbPasswordHash, password)) {
                       //correct password
                       console.log("correct password");
                       user = {
                           userid: rows[0].userid,
                           username: rows[0].username,
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

        })//end query command

    }//end seekAccount

    response = {
        userid: '',
        username: '',
        accessGranted: requestGranted,
    }
});

module.exports = router;