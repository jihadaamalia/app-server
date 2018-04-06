/**
 * Module dependencies.
 */
require('dotenv').config();

module.exports.createUserProf = function (req, res) {
    var userData = req.body;
    var checkDataSql = "SELECT id FROM `user_profile` WHERE `username`= '" + res.locals.username + "'";
    var userProfileSql = "INSERT INTO `user_profile` (`name`, `user_dob`, `sex`, `username`, `photo`, `city`, `added_at`)  VALUES ('" + userData.name + "', '" + userData.user_dob + "', '" + userData.sex + "', '" + res.locals.username + "', '" + userData.photo + "', '" + userData.city + "', CURRENT_TIMESTAMP())";
    db.query(checkDataSql, function(err, result){
        if(err) {
            res.json({
                status: 200,
                error: true,
                error_msg: 'MySQL failed',
                response: err
            });
            res.end();
        } else if (result[0]) {
            //TODO: or just directly updated?
            res.json({
                status: 200,
                error: true,
                error_msg: 'User profile for '+ res.locals.username +' is already created',
                response: ''
            });
            res.end();
        } else {
            db.query(userProfileSql, function(err, result){
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
