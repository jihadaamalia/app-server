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
    var checkEmail = "SELECT * FROM `user` WHERE `email`= '"+userData.email+"' AND `id` <> '"+res.locals.username_id+"'";
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
            var userSql = "UPDATE `user` SET `username` = '" + userData.username + "', `email` = '" + userData.email + "', `updated_at` = CURRENT_TIMESTAMP()  WHERE id = '"+res.locals.username_id+"'";

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
                    res.header();
                    res.json({
                        status: 200,
                        error: false,
                        error_msg: {
                            title: '',
                            detail: ''
                        },
                        response: 'User data updated!'
                    });
                    res.end();
                };
            });
        }
    });
};

module.exports.changePass = function(req , res){
    self = this;
    var userData = req.body;
    var pass = userData.password;
    var bin_pass = atob(pass);
    var encrypted_pass = cryptr.encrypt(bin_pass);
    var sql="SELECT * FROM `user` WHERE `id`='"+res.locals.username_id+"' AND password = '"+encrypted_pass+"'";

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

        var updatePass = "UPDATE `user` SET `password` = '" + encrypted_new_pass + "', `updated_at` = CURRENT_TIMESTAMP() WHERE `id` = '"+res.locals.username_id+"'";

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

module.exports.updateUserProf = function (req, res) {
    var userData = req.body;
    var updateUserProfile = "UPDATE `user_profile` SET `name` = '" + userData.name + "', `user_dob` = '" + userData.user_dob + "', `sex` = '" + userData.sex + "', `photo` = '" + userData.photo + "', `city` = '" + userData.city + "', updated_at = CURRENT_TIMESTAMP() WHERE `id` = '" + res.locals.user_id + "'";
    db.query(updateUserProfile, function(err, result){
        if(err || result.affectedRows === 0) {
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed to update data',
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
                response: 'User profile updated!'
            });
            res.end();
        }
    });
};

module.exports.updatePet = function(req,res) {
    var self = this;
    var petData = req.body;
    var updatePet = "UPDATE `pet` SET `pet_name` = '" + petData.name + "',`pet_dob` = '" + petData.pet_dob + "',`pet_sex` = '" + petData.pet_sex + "', `furcolor` = '" + petData.furcolor + "', `weight` = '" + petData.weight + "', `breed` = '" + petData.breed + "', `pet_photo` = '" + petData.pet_photo + "', `pet_desc` = '" + petData.pet_desc + "', `breed_cert` = '" + petData.breed_cert + "', `updated_at` = CURRENT_TIMESTAMP() WHERE `user_id` = '" + res.locals.user_id + "'";

    db.query(updatePet, function(err, results) {
        if (err || results.affectedRows === 0) {
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed to update data',
                    detail: err
                },
                response: ''
            });
            res.end();
        } else {
            self.clearDislike();
        }
    });

    self. clearDislike = function () {
        var updatePet = "DELETE FROM `liked` WHERE `to`= '" + res.locals.user_id + "' AND `like_stat` = 2";

        db.query(updatePet, function(err, results) {
            if (err) {
                res.json({
                    status: 500,
                    error: true,
                    error_msg: {
                        title: 'Failed to update data',
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
                    response: 'Pet updated!'
                });
                res.end();
            }
        });
    };

};

module.exports.updateVaccine = function (req, res) {
    var self = this;
    var userData = res.locals;

    var deleteExisting = "DELETE FROM `have_vaccines` WHERE `id_pet` = '" + userData.pet_id + "'";
    db.query(deleteExisting, function(err, results) {
        if (err) {
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed to update data',
                    detail: err
                },
                response: ''
            });
            res.end();
        } else {
            self.insertVaccines();
        }
    });


    self.insertVaccines = function () {
        var userData = res.locals;
        var vaccineId = JSON.parse(req.body.vaccines);
        self.vaccinesData = "";
        for (var i in vaccineId) {
            var query = "(" + userData.pet_id + ", " + vaccineId[i] + ", CURRENT_TIMESTAMP())";
            if (vaccineId.length - 1 != i) {
                self.vaccinesData = self.vaccinesData + query + ", ";
            } else {
                self.vaccinesData = self.vaccinesData + query;
            }

        }
        var insertVaccines = "INSERT INTO `have_vaccines`(`id_pet`, `id_vaccine`, `added_at`) VALUES " + self.vaccinesData;

        db.query(insertVaccines, function(err, results) {
            if (err) {
                res.json({
                    status: 500,
                    error: true,
                    error_msg: {
                        title: 'Failed to insert data',
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
                    response: 'Vaccine inserted'
                });
                res.end();
            }
        });
    };
};

/*
* module.exports.updatePreference = function(req, res) {
    var petData = req.body;
    var insertPref = "UPDATE `pet` SET `breed_pref` = '" + petData.breed_pref + "', `age_min` = '" + petData.age_min + "', `age_max` = '" + petData.age_max + "', `city_pref` = '" + petData.city_pref + "', updated_at = CURRENT_TIMESTAMP() WHERE `id` = '" + res.locals.pet_id + "'";

    db.query(insertPref, function(err, results) {
        if (err || results.affectedRows === 0) {
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed to update data',
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
                response: 'Match preference updated!'
            });
        }
    });

};
* */