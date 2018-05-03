/**
 * Module dependencies.
 */
var atob = require('atob');
var Cryptr = require('cryptr');
cryptr = new Cryptr(process.env.CRYPTER_KEY);

/**
 * SIGNUP SERVICES
 */
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