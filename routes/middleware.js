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
    var token = req.body.token;
    var currentTime = Math.floor(Date.now() / 1000);
    jwt.verify(token, secret, { algorithms: 'HS256', audience: 'TEST' }, function(err, decoded) {
        if (err) {
            res.json({
                "status": false,
                "msg" : err.message
            });
        } else if (!err) {
            res.locals = JSON.parse(decoded.data);
            var getId = "SELECT id from `user_profile` WHERE `username` = '" + res.locals.username + "'";
            db.query(getId, function(err, results) {
                if (err || results.length < 1) {
                    res.json({
                        "err": err,
                        "results": results
                    });
                    res.end();
                } else {
                    res.locals.id = results[0].id;
                    return next();
                }
            });
        }
    });
};
