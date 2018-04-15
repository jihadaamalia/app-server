/**
 * Module dependencies.
 */
require('dotenv').config();

exports.createPet = function (req, res) {
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
        var createPet = "INSERT INTO `pet`(`pet_name`,`pet_dob`,`pet_sex`, `furcolor`, `weight`, `breed`, `pet_photo`, `pet_desc`, `user_id`, `added_at`) VALUES ('" + petData.name + "', '" + petData.pet_dob + "', '" + petData.pet_sex + "', '" + petData.furcolor + "', '" + petData.weight + "', '" + petData.breed + "', '" + petData.pet_photo + "', '" + petData.pet_desc + "', '" + idUser + "', CURRENT_TIMESTAMP())";
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
