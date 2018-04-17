/**
 * Module dependencies.
 */
require('dotenv').config();

module.exports.createPet = function (req, res) {
    self = this;
    var petData = req.body;
    var userData = res.locals;

    var getUserId = "SELECT id FROM `user_profile` WHERE `username`= '" + userData.username + "'";
    db.query(getUserId, function(err, results) {
        if (err || results.length < 1) {
            res.json({
                status: 200,
                error: true,
                error_msg: 'Error retrieving data',
                response: err
            });
            res.end();
        } else {
            self.createPetFunc(results[0].id);
        }
    });

    self.createPetFunc = function (idUser) {
        var checkPet = "SELECT `id` FROM `pet` WHERE `user_id` = '" + idUser + "'";
        var createPet = "INSERT INTO `pet`(`pet_name`,`pet_dob`,`pet_sex`, `furcolor`, `weight`, `breed`, `pet_photo`, `breed_cert`, `pet_desc`, `user_id`, `added_at`) VALUES ('" + petData.name + "', '" + petData.pet_dob + "', '" + petData.pet_sex + "', '" + petData.furcolor + "', '" + petData.weight + "', '" + petData.breed + "', '" + petData.pet_photo + "', '" + petData.breed_cert + "', '" + petData.pet_desc + "', '" + idUser + "', CURRENT_TIMESTAMP())";
        var updatePet = "UPDATE `pet` SET `pet_name` = '" + petData.name + "',`pet_dob` = '" + petData.pet_dob + "',`pet_sex` = '" + petData.pet_sex + "', `furcolor` = '" + petData.furcolor + "', `weight` = '" + petData.weight + "', `breed` = '" + petData.breed + "', `pet_photo` = '" + petData.pet_photo + "', `pet_desc` = '" + petData.pet_desc + "', `updated_at` = CURRENT_TIMESTAMP() WHERE `user_id` = '" + idUser + "'";

        db.query(checkPet, function(err, result) {
            if (err) {
                res.json({
                    status: 200,
                    error: true,
                    error_msg: 'MySQL failed',
                    response: err
                });
                res.end();
            } else if (result[0]){
                db.query(updatePet, function(err, results) {
                    if (err) {
                        res.json({
                            status: 200,
                            error: true,
                            error_msg: 'MySQL failed',
                            response: err
                        });
                        res.end();
                    } else {
                        res.json({
                            status: 200,
                            error: false,
                            error_msg: '',
                            response: 'Pet updated'
                        });
                        res.end();
                    }
                });
            } else {
                db.query(createPet, function(err, results) {
                    if (err) {
                        res.json({
                            status: 200,
                            error: true,
                            error_msg: 'MySQL failed',
                            response: err
                        });
                        res.end();
                    } else {
                        res.json({
                            status: 200,
                            error: false,
                            error_msg: '',
                            response: 'Pet created'
                        });
                        res.end();
                    }
                });
            }
        });
    };
};

module.exports.createVaccine = function (req, res) {
    var self = this;
    var userData = res.locals;
    var getId = "SELECT pet.user_id, pet.id FROM `pet` INNER JOIN `user_profile` ON pet.user_id = user_profile.id WHERE user_profile.username = '" + userData.username + "'";

    db.query(getId, function(err, results) {
        if (err) {
            res.json({
                status: 200,
                error: true,
                error_msg: 'MySQL failed',
                response: err
            });
            res.end();
        } else {
            userData.user_id = results[0].user_id;
            userData.pet_id = results[0].id;

            self.deleteVaccines ();
        }
    });

    self.deleteVaccines = function () {
        var deleteExisting = "DELETE FROM `have_vaccines` WHERE `id_pet` = '" + userData.pet_id + "'";
        db.query(deleteExisting, function(err, results) {
            if (err) {
                res.json({
                    status: 200,
                    error: true,
                    error_msg: 'MySQL failed',
                    response: err
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
                    status: 200,
                    error: true,
                    error_msg: 'MySQL failed',
                    response: err
                });
                res.end();
            } else {
                res.json({
                    status: 200,
                    error: false,
                    error_msg: '',
                    response: 'Vaccine inserted'
                });
                res.end();
            }
        });
    };
};

module.exports.matchPreference = function (req, res) {
    var self = this;
    var userData = res.locals;
    var petData = req.body;
    var getId = "SELECT pet.user_id, pet.id FROM `pet` INNER JOIN `user_profile` ON pet.user_id = user_profile.id WHERE user_profile.username = '" + userData.username + "'";

    db.query(getId, function(err, results) {
        if (err) {
            res.json({
                status: 200,
                error: true,
                error_msg: 'MySQL failed',
                response: err
            });
            res.end();
        } else {
            userData.user_id = results[0].user_id;
            userData.pet_id = results[0].id;

            self.insertPreference ();
        }
    });

    self.insertPreference = function () {
        var insertPref = "UPDATE `pet` SET `breed_pref` = '" + petData.breed_pref + "', `age_min` = '" + petData.age_min + "', `age_max` = '" + petData.age_max + "', `city_pref` = '" + petData.city_pref + "', updated_at = CURRENT_TIMESTAMP() WHERE `id` = '" + userData.pet_id + "'";

        db.query(insertPref, function(err, results) {
            if (err) {
                res.json({
                    status: 200,
                    error: true,
                    error_msg: 'MySQL failed',
                    response: err
                });
                res.end();
            } else {
                self.updateFirstLogin ();
            }
        });
    };

    self.updateFirstLogin = function () {
        var firstLogin = "UPDATE `user` SET `first_login` = 0 WHERE `username` = '" + userData.username + "'";

        db.query(firstLogin, function(err, results) {
            if (err) {
                res.json({
                    status: 200,
                    error: true,
                    error_msg: 'MySQL failed',
                    response: err
                });
                res.end();
            } else {
                res.json({
                    status: 200,
                    error: true,
                    error_msg: '',
                    response: 'Pet created!'
                });
                res.end();
            }
        });
    };

};

