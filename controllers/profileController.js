module.exports.getUserProf = function (req, res) {
    var getUserProfile = "SELECT user_profile.name, user.username, user.email, DATE_FORMAT(user_profile.user_dob, '%Y-%m-%d') AS user_dob, user_profile.photo, user_profile.sex, regencies.name AS city, provinces.name AS provinces FROM `user_profile` JOIN user ON user.id = user_profile.username_id  JOIN regencies ON regencies.id = user_profile.city JOIN provinces ON regencies.province_id = provinces.id WHERE user_profile.id = '"+res.locals.user_id+"'";
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
                response: result[0]
            });
            res.end();
        }
    });
};

module.exports.getPet = function(req, res){
    self = this;
    var petInfo  = "SELECT pet.id, pet.pet_name, DATE_FORMAT(pet.pet_dob, '%Y-%m-%d') AS pet_dob, pet.pet_sex, pet.furcolor, pet.weight, pet.breed, breeds.name AS breed_name, breeds.size, variants.name AS variant, pet.pet_photo, pet.breed_cert, pet.pet_desc FROM `pet` JOIN breeds ON breeds.id = pet.breed JOIN variants ON variants.id = breeds.variant WHERE pet.user_id = '"+res.locals.user_id+"'";

    var query = db.query(petInfo, function(err, results){
        if(err){
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
        }
        else if(results[0]){
            self.resData = results[0];
            self.getVaccines();
        }
    });

    self.getVaccines = function () {
        var getVaccines = "SELECT vaccines.id, vaccines.name FROM have_vaccines JOIN vaccines ON have_vaccines.id_vaccine = vaccines.id WHERE id_pet ='"+res.locals.pet_id+"'";
        var query = db.query(getVaccines, function(err, result){
            if(result){
                self.resData.vaccines = result
            }

            res.json({
                status: 200,
                error: false,
                error_msg: {
                    title: '',
                    detail: ''
                },
                response: self.resData
            });
            res.end();
        });
    }
};

module.exports.getPetPreference = function(req, res){
    self = this;
    var petPref  = "SELECT breeds.name AS breeds, pet.age_min, pet.age_max, regencies.name AS city FROM `pet` JOIN breeds ON breeds.id = pet.breed_pref JOIN regencies ON regencies.id = pet.city_pref WHERE pet.user_id = '"+res.locals.user_id+"'";

    var query = db.query(petPref, function(err, results){
        if(err){
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
        }
        else if(results[0]){
            res.json({
                status: 200,
                error: false,
                error_msg: {
                    title: '',
                    detail: ''
                },
                response: results[0]
            });
            res.end();
        }
    });
};