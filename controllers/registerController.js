/**
 * Module dependencies.
 */
require('dotenv').config();

module.exports.createUserProf = function (req, res) { //step 1 of user registration data
    var userData = req.body;
    var updateUserProfile = "UPDATE `user_profile` SET `name` = '" + userData.name + "', `user_dob` = '" + userData.user_dob + "', `sex` = '" + userData.sex + "', `photo` = '" + userData.photo + "', `city` = '" + userData.city + "', updated_at = CURRENT_TIMESTAMP() WHERE `id` = '" + res.locals.user_id + "'";
    db.query(updateUserProfile, function(err, result){
        if(err) {
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

module.exports.createPet = function (req, res) {
    self = this;
    var petData = req.body;
    var userData = res.locals;

    var updatePet = "UPDATE `pet` SET `pet_name` = '" + petData.name + "',`pet_dob` = '" + petData.pet_dob + "',`pet_sex` = '" + petData.pet_sex + "', `furcolor` = '" + petData.furcolor + "', `weight` = '" + petData.weight + "', `breed` = '" + petData.breed + "', `pet_photo` = '" + petData.pet_photo + "', `pet_desc` = '" + petData.pet_desc + "', `breed_cert` = '" + petData.breed_cert + "', `updated_at` = CURRENT_TIMESTAMP() WHERE `id` = '" + userData.pet_id + "'";

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
                error_msg: '',
                response: 'Pet updated!'
            });
            res.end();
        }
    });
};

module.exports.createVaccine = function (req, res) {
    var self = this;
    var userData = res.locals;

    self.deleteVaccines = function () {
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
    };

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

    self.deleteVaccines();
};

module.exports.matchPreference = function (req, res) {
    var self = this;
    var userData = res.locals;
    var petData = req.body;

    self.insertPreference = function () {
        var insertPref = "UPDATE `pet` SET `breed_pref` = '" + petData.breed_pref + "', `age_min` = '" + petData.age_min + "', `age_max` = '" + petData.age_max + "', `city_pref` = '" + petData.city_pref + "', updated_at = CURRENT_TIMESTAMP() WHERE `id` = '" + userData.pet_id + "'";

        db.query(insertPref, function(err, results) {
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
                self.updateFirstLogin ();
            }
        });
    };

    self.updateFirstLogin = function () {
        var firstLogin = "UPDATE `user` SET `first_login` = 0 WHERE `id` = '" + userData.username_id + "'";

        db.query(firstLogin, function(err, results) {
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
                    response: 'Preference created!'
                });
                res.end();
            }
        });
    };

    self.insertPreference();

};