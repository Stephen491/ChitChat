var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const argon2 = require('argon2');
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
});//end connection.connect

router.get('/', function(req, res, next) {
    res.send('API is working properly');
});//end get

router.post('/', function(req, res, next) {

    let usernameOrEmailTaken = false;
    let password = req.body.password;
    let hasError1 = false;
    let emailTaken1 = false;
    let usernameTaken1 = false;
   
    let command = 'SELECT';
    command = command.concat(' * FROM useraccounts WHERE username = \'',req.body.username, '\' OR email = \'', req.body.email,'\' ;');
    console.log(command);

    if(!usernameOrEmailTaken) {
        console.log("ranconditional");
        insertData();
    }

    async function insertData() {
        try {
            const passwordHash = await argon2.hash(password);
            let insertCommand = 'INSERT';
          
            insertCommand = insertCommand.concat(' INTO useraccounts (email, username, passwordhash, dob) VALUES (\'',req.body.email,'\', \'',req.body.username,'\', \'',passwordHash, '\', STR_TO_DATE(DATE_FORMAT(\'',req.body.dob.split('T')[0],'\', \'%Y %M %D\'),\'%Y %M %D\'))');

            connection.query(insertCommand, function(err, rows, field){
                if(err){
                 if(err.errno==1062) {
                    let errorMessage = err.sqlMessage.split(' ');
                    if(errorMessage[errorMessage.length-1]==="'useraccounts.email'") {                  
                            hasError1 = true;
                            emailTaken1 = true; 
                    }
                    else if(errorMessage[errorMessage.length-1]==="'useraccounts.username'") { 
                            hasError1 = true;
                            usernameTaken1 = true;
                    }
                }
                 else {
                    throw error;
                    }
                }
                console.log(emailTaken1);   
                let response = {
                    hasError: hasError1,
                    emailTaken: emailTaken1,
                    usernameTaken: usernameTaken1,
        
                };
                res.type('json');
                res.send(response);

            }//end query callback
            );//end query

            connection.release();
        }//end try
        catch(err){
            hasError = true;
            errorType = "Password hashing Error";
        
        }//end catch
    }//insert data function
});//end post

module.exports = router;