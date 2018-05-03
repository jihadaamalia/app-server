/**
 * Module dependencies.
 */
var jwt = require('jsonwebtoken');
var atob = require('atob');
var Cryptr = require('cryptr');
cryptr = new Cryptr(process.env.CRYPTER_KEY);

module.exports.updateUser = function(req , res){
    self = this;
    var userData = req.body;
    var checkEmail = "SELECT * FROM `user` WHERE `email`= '"+userData.email+"' AND `username` <> '"+res.locals.username+"'";
    db.query(checkEmail, function(err, result){
        if(err) {
            res.json({
                status: 400,
                error: true,
                error_msg: {
                    title: 'Failed to check email',
                    detail: err
                },
                response: ''
            });
            res.end();
        } else if (result[0]){
            res.json({
                status: 400,
                error: true,
                error_msg: {
                    title: 'Email already used by other account!',
                    detail: ''
                },
                response: ''
            });
            res.end();
        } else {
            var userSql = "UPDATE `user` SET `username` = '" + userData.username + "', `email` = '" + userData.email + "', `updated_at` = CURRENT_TIMESTAMP()  WHERE username = '"+res.locals.username+"'";

            db.query(userSql, function(err, result){
                if(err || result.affectedRows === 0) {
                    res.json({
                        status: 400,
                        error: true,
                        error_msg: {
                            title: 'Failed to update data',
                            detail: err
                        },
                        response: ''
                    });
                    res.end();
                } else {
                    self.token_data = {
                        username : userData.username,
                        user_id: res.locals.user_id ,
                        pet_id: res.locals.pet_id,
                    }
                    self.createToken();
                };
            });
        }
    });

    self.createToken = function (){
        var data = JSON.stringify(self.token_data);
        var secret = process.env.JWT_SECRET_KEY;
        // var now = Math.floor(Date.now() / 1000), //for creating an expire tim
        //     expiresIn = 3600, //1 hour
        //     expBefore = (now + expiresIn)
        var jwtId = Math.random().toString(36).substring(7);

        var payload = {
            jwtid : jwtId,
            data: data
        };

        var header = {
            algorithm: 'HS256',
            audience : 'TEST'
        };

        jwt.sign(payload, secret, header, function(err, token) {
            if(token){
                res.json({
                    status: 200,
                    error: false,
                    error_msg: {
                        title: '',
                        detail: ''
                    },
                    response: {
                        message: 'Username updated!',
                        token: token
                    }
                });
                res.end();
            } else {
                res.header();
                res.json({
                    status: 500,
                    error: true,
                    error_msg: {
                        title: 'Username updated, please signin to activate',
                        detail: ''
                    },
                    response: ''
                });
                res.end();
            }
        });
    };
};

module.exports.changePass = function(req , res){
    self = this;
    var userData = req.body;
    var pass = userData.password;
    var bin_pass = atob(pass);
    var encrypted_pass = cryptr.encrypt(bin_pass);
    var sql="SELECT * FROM `user` WHERE `username`='"+res.locals.username+"' AND password = '"+encrypted_pass+"'";

    db.query(sql, function(err, results) {
        if (err || results.length < 1) {
            res.json({
                status: 404,
                error: true,
                error_msg: {
                    title: 'Your old password are incorrect, please try again',
                    detail: err
                },
                response: ''
            });
            res.end();
        }
        else if (results.length > 0) {
            self.updatePass();
        }
    });

    self.updatePass = function () {
        var bin_new_pass = atob(userData.newPassword);
        var encrypted_new_pass = cryptr.encrypt(bin_new_pass);

        var updatePass = "UPDATE `user` SET `password` = '" + encrypted_new_pass + "', `updated_at` = CURRENT_TIMESTAMP() WHERE `username` = '"+res.locals.username+"'";

        db.query(updatePass, function(err, result){
            if(err || result.affectedRows === 0) {
                res.json({
                    status: 400,
                    error: true,
                    error_msg: {
                        title: 'Failed to change password',
                        detail: err
                    },
                    response: ''
                });
                res.end();
            } else {
                res.json({
                    status: 200,
                    error: false,
                    error_msg: {
                        title: '',
                        detail: ''
                    },
                    response: 'Password changed'
                });
                res.end();
            }
        });
    }
};
