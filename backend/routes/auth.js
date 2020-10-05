var express = require('express');
const jwt = require('jsonwebtoken');
var cassandra = require('cassandra-driver');
const argon2 = require('argon2');
var router = express.Router();
require('dotenv').config()


var connection = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_DB_HOST],
  localDataCenter: process.env.CASSANDRA_DB_DATACENTER,
  keyspace: process.env.CASSANDRA_DB_KEYSPACE
});


const verify_access_token = (req, res, next) => {
  console.log("From authserver token is...");
      
        var user;
        var accessToken = req.headers.authorization.split(' ')[1]

        console.log("!".concat(accessToken,"!"))
        if(accessToken==='null') {
          req.noAccessToken = true;
          next();
        }
        else {
          
          jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if(err instanceof jwt.TokenExpiredError) {
            //TO DO: Attempt to renew access token using refresh token, if successful, grant access. Else, reject request
            
              req.expiredAccessToken = true;
            

              console.log("Expired access token");
              next();


            }
            else if(err){
              
              console.log("Internal server error");
              next();
            }
            else {
              user = {
                email: decoded.user.email,
                userid: decoded.user.userid,
                username: decoded.user.username
              }
              req.user = user;
              console.log("Access Token Authorized");
              next();
            }
          
        });
      }

}


router.get('/', function(req, res, next) {
    res.send('Auth is working properly');
});



router.post('/login', async function(req, res, next) { 
  let emailAddress = req.body.email;
  let password = req.body.password; 
  let requestGranted = false;
  let notFound = false;
  let wrongPassword = false;
  let response;
  let user;

  console.log("Login attempt received");

  let query = "SELECT id, passwordhash, username FROM user_accounts_login_credentials WHERE email = ?"; 
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
                 jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' }, (err, token) => {
                        
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



router.post('/authenticatetoken', verify_access_token, (req, res, next) =>
    {
      if(req.user){
        console.log(req.user.username);
        res.sendStatus(200);

      }
      else if(req.expiredAccessToken||req.noAccessToken){
        res.sendStatus(401);
      }
      else{
        res.sendStatus(500);
      }
       
    }//end function



);//end post


router.post('/accesstokenrenewal', async (req, res, next) => 
    {
      //TO DO: Generate a new access token for the user if current one has expired
      console.log("From authserver refresh token is...")
      const refreshToken = req.cookies.refresh_token; 


      if(refreshToken===undefined) {
        //User has no refresh token
        res.sendStatus(401);
      }
   
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async function(err, decoded) {
        if(err instanceof jwt.TokenExpiredError) {
          //User's refresh token is expired
          res.sendStatus(401);
        }

        else if(err){
          res.sendStatus(500);
        }
        else {
          refreshTokenIsVoid(decoded.user.userid, refreshToken).then((voidRefreshToken)=>{
            console.log(voidRefreshToken)
            if(voidRefreshToken) {
              res.sendStatus(401);
            }
            
            else{
              user = {
                email: decoded.user.email,
                userid: decoded.user.userid,
                username: decoded.user.username
              }
              jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'}, (err, token) => {
                res.json({err: false, notFound: false, wrongPassword: false, accessToken: token});
              });
            }
          })
          
        }
    });



      console.log(req.cookies);
      
    }//end function


);//end post


router.post('/voidrefreshtoken', verify_access_token, (req, res, next) => {
  
  if(req.cookies.refresh_token === undefined) {
    res.sendStatus(200)
    console.log("cookie is undefined")
  }
  else if(req.user) {
    let userid = req.user.userid;
    let refreshToken = req.cookies.refresh_token;
    let voidRefreshTokenQuery = "INSERT INTO void_refresh_tokens_by_id(id, refresh_token) VALUES (?, ?)";
    let params = [userid, refreshToken];

    connection.execute(voidRefreshTokenQuery, params, {prepare: true}).then(
      (result) => {
        res.sendStatus(200);
      }
    ).catch((err)=> {
      console.log(err)
      res.sendStatus(500)})

  }

  else {
    res.sendStatus(401)
  }

})



async function refreshTokenIsVoid(userid, cookie) {
  console.log("checking if refresh token is void...")
  let query = "SELECT refresh_token FROM void_refresh_tokens_by_id WHERE id = ?";
  let params = [userid];
  let voidRefreshToken = false;
  await connection.execute(query, params, {prepare:true}).then( function (result) {
    let rows = result.rows;
    rows.forEach((row) => {
      let token = row.refresh_token
      console.log(token)
      if(token===cookie) {
        console.log("Token is voided")
        voidRefreshToken = true;
      }
      })
    
    })
  return voidRefreshToken
   

}




module.exports = router;