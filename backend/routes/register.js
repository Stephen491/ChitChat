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
    let response; 

    let findUsernameCommand = 'SELECT * FROM user_accounts_username WHERE username = ?';


    let findEmailCommand = 'SELECT * FROM user_accounts_email WHERE email = ?';
    
    let insertCommand; 
    
    await connection.execute(findUsernameCommand, [req.body.username]).then(function(result) {
            if(result.rows[0]) {
                usernameTaken = true;
                hasError = true;
            }
        }).catch(function(err) {
            hasError = true;
            console.log(err);
        });

    await connection.execute(findEmailCommand, [req.body.email]).then(function(result) {
            if(result.rows[0]) {
                emailTaken = true;
                hasError = true;
            }
        }
        ).catch(function(err){
            hasError = true;
            console.log(err);

        });

    if(!emailTaken&&!usernameTaken&&!hasError) {
        console.log("credentials are OK");
        const passwordHash = await argon2.hash(password);
        let formattedDOB = req.body.dob.split('T')[0]
        let insertIntoCredentialsByID = 'INSERT INTO user_accounts_credentials(id, email, passwordhash) VALUES (now(), ?, ?)'
        let insertIntoCredentialsByEmail = 'INSERT INTO user_accounts_login_credentials(email, passwordhash, id, username) VALUES (?,?, now(), ?)'
        let insertIntoIdByEmail = 'INSERT INTO user_accounts_email(email, id) VALUES (?, now())'
        let insertIntoIdByUsername = 'INSERT INTO user_accounts_username(username, id) VALUES (?, now())'
        let insertIntoUseraccountsInfoById = 'INSERT INTO user_accounts_info(id, email, username, dob) VALUES (now(), ?, ?, ?)'
        let queries = [
            {query: insertIntoCredentialsByID, params: [req.body.email, passwordHash]},
            {query: insertIntoCredentialsByEmail, params: [req.body.email, passwordHash, req.body.username]},
            {query: insertIntoIdByEmail, params: [req.body.email]},
            {query: insertIntoIdByUsername, params: [req.body.username]},
            {query: insertIntoUseraccountsInfoById, params: [req.body.email, req.body.username, formattedDOB]}
        ]


        connection.batch(queries, {prepare: true}).then(function() {
            response = {
                hasError: hasError,
                emailTaken: emailTaken,
                usernameTaken: usernameTaken
            }


            console.log("inserted");
            res.type('json');
            res.send(response);

        }).catch(function(err) {
            console.log(err);
            hasError = true;
        });

    }
    else {
        console.log("Duplicate email/username")
        response = {
            hasError: hasError,
            emailTaken: emailTaken,
            usernameTaken: usernameTaken
        }
        res.type('json');
        res.send(response);



    }

});//end post

module.exports = router;