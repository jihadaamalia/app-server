/**
 * Module dependencies.
 */
require('dotenv').config();



module.exports.getUserProf = function (req, res) { //step 1 of user registration data
    var getUserProfile = "SELECT user_profile.name, user_profile.username, user_profile.user_dob, user_profile.photo, user_profile.sex, regencies.name AS city, provinces.name AS provinces FROM `user_profile` JOIN regencies ON regencies.id = user_profile.city JOIN provinces ON regencies.province_id = provinces.id WHERE user_profile.id = '"+res.locals.user_id+"'";
    db.query(getUserProfile, function(err, result){
        if(err) {
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed to fetch data',
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
                response: result
            });
            res.end();
        }
    });
};



