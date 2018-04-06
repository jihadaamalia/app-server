/**
 * Module dependencies.
 */
require('dotenv').config();

exports.createPet = function (req, res) {
    var petData = req.body;
    var userData = res.locals;
    var newPet = "INSERT INTO `pet`(`pet_name`,`pet_dob`,`pet_sex`, `furcolor`, `weight`, `breed`, `pet_photo`, `pet_desc`, `user_id`, `breed_pref`, `age_min`, `age_max`, `city_pref`, `added_at`) VALUES ('" + petData.name + "', '" + petData.pet_dob + "', '" + petData.pet_sex + "', '" + petData.furcolor + "', '" + petData.weight + "', '" + petData.breed + "', '" + petData.pet_photo + "', '" + petData.pet_desc + "', '" + userData.id + "', '" + petData.breed_pref + "',  '" + petData.age_min + "', '" + petData.age_max + "', '" + petData.city + "', CURRENT_TIMESTAMP())";

    db.query(newPet, function(err, results) {
        if (err || results.length < 1) {
            res.json({
                "err": err,
                "results": results
            });
            res.end();
        } else {
            res.json({
                "results": "Added"
            });
            res.end();
        }
    });
};

exports.updatePet = function (req, res) {
    var petData = req.body;
    var userData = res.locals;
    var updatePet = "UPDATE `pet` SET `pet_name` = '" + petData.name + "', `pet_dob` = '" + petData.pet_dob + "', `pet_sex` = '" + petData.pet_sex + "', `furcolor` = '" + petData.furcolor + "', `weight` = '" + petData.weight + "', `breed` = '" + petData.breed + "', `pet_photo` = '" + petData.pet_photo + "', `pet_desc` = '" + petData.pet_desc + "' WHERE `user_id` =  '" + userData.id + "'";

    db.query(updatePet, function(err, results) {
        if (err || results.length < 1) {
            res.json({
                "err": err,
                "results": results
            });
            res.end();
        } else {
            res.json({
                "results": "Updated"
            });
            res.end();
        }
    });
};
