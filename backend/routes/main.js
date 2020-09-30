var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
var auth = require('./auth.js');




require('dotenv').config()


router.use('/', (req, res, next) => {auth.verify_access_token(req, res, next)});


router.get('/', (req, res, next) => {

     console.log(req.user);
} )

module.exports = router;