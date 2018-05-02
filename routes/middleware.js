/**
 * Module dependencies.
 */
require('dotenv').config();
var jwt = require('jsonwebtoken');
var atob = require('atob');
var Cryptr = require('cryptr'),
    path = require('path');
cryptr = new Cryptr(process.env.CRYPTER_KEY);

//-------------------------------------------check login status ----------------------------------
exports.verify = function(req , res, next){
    var secret = process.env.JWT_SECRET_KEY;
    var token = req.headers.token;
    jwt.verify(token, secret, { algorithms: 'HS256', audience: 'TEST' }, function(err, decoded) {
        if (err) {
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed decode JWT',
                    detail: err
                },
                response: ''
            });
            res.end();
        } else if (!err) {
            res.locals = JSON.parse(decoded.data);
            return next();
        }
    });
};
