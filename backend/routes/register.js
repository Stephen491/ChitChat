var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
const argon2 = require('argon2');
require('dotenv').config()


var connection = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_DB_HOST],
    localDataCenter: process.env.CASSANDRA_DB_DATACENTER,
    keyspace: process.env.CASSANDRA_DB_KEYSPACE
  });


router.get('/', function(req, res, next) {
    res.send('API is working properly');
});//end get

router.post('/', async function(req, res, next) {

    let usernameOrEmailTaken = false;
    let password = req.body.password;
    let hasError = false;
    let emailTaken = false;
    let usernameTaken = false;
    let email = req.body.email;
   

    let findUsernameCommand = 'SELECT * FROM user_accounts_username WHERE username = ?';


    let findEmailCommand = 'SELECT * FROM user_accounts_email WHERE email = ?';
    
    let insertCommand; 
    
    await connection.execute(findUsernameCommand, [req.body.username]).then(result => 
        usernameTaken = result.rows[0]
        );

    await connection.execute(findEmailCommand, [req.body.email]).then(result => 
         emailTaken = result.rows[0]
        );




    if(!emailTaken&&!usernameTaken) {
        console.log("credentials are OK");

        //TODO: Insert data and response to client





    }

        /** 
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
    */
});//end post

module.exports = router;