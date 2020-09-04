var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
var auth = require('./auth.js');




require('dotenv').config()

router.get('/', auth.verify_token,(req, res) => {

    console.log(req.user);
    res.send(req.user.user);
} )

module.exports = router;