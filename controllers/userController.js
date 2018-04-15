/**
 * Module dependencies.
 */
require('dotenv').config();

module.exports.createUserProf = function (req, res) { //step 1 of user registration data
    var userData = req.body;
    var checkDataSql = "SELECT id FROM `user_profile` WHERE `username`= '" + res.locals.username + "'";
    db.query(checkDataSql, function(err, result){
        if(err) {
            res.json({
                status: 200,
                error: true,
                error_msg: 'MySQL failed',
                response: err
            });
            res.end();
        } else if (result[0]) { //if data has created
            //TODO: USE IF EXIST INSTEAD OF 3 DIFF QUERY
            var updateUserProfile = "UPDATE `user_profile` SET `name` = '" + userData.name + "', `user_dob` = '" + userData.user_dob + "', `sex` = '" + userData.sex + "', `photo` = '" + userData.photo + "', `city` = '" + userData.city + "', updated_at = CURRENT_TIMESTAMP() WHERE `username` = '" + res.locals.username + "'";
            db.query(updateUserProfile, function(err, result){
                if(err) {
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
                        response: 'User profile updated!'
                    });
                    res.end();
                }
            });
        } else { //create new data
            var createUserProfile = "INSERT INTO `user_profile` (`name`, `user_dob`, `sex`, `username`, `photo`, `city`, `added_at`)  VALUES ('" + userData.name + "', '" + userData.user_dob + "', '" + userData.sex + "', '" + res.locals.username + "', '" + userData.photo + "', '" + userData.city + "', CURRENT_TIMESTAMP())";
            db.query(createUserProfile, function(err, result){
                if(err) {
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
                        response: 'User profile created!'
                    });
                    res.end();
                }
            });
        }
    });

};