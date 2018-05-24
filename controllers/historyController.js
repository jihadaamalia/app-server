var wsm = require('./wsmController');

module.exports.insertHistory = function(req, res){
    var self = this;
    var petDetail = "SELECT pet.id, pet.pet_name, DATE_FORMAT(pet.pet_dob, '%Y-%m-%d') AS pet_dob, pet.pet_sex, pet.furcolor, pet.weight, pet.breed, breeds.name AS breed_name, breeds.size, breeds.mixed, breeds.cross_possibility, variants.id AS variant_id, variants.name AS variant, pet.pet_photo, pet.breed_cert, pet.pet_desc, pet.user_id, user_profile.name, user.username, DATE_FORMAT(user_profile.user_dob, '%Y-%m-%d') AS user_dob, user_profile.photo, user_profile.sex, regencies.id AS city_id, regencies.name AS city, provinces.id AS province_id, provinces.name AS provinces, pet.breed_pref, pet.age_min, pet.age_max, pet.city_pref, have_vaccines.id_vaccine FROM `pet` JOIN `user_profile`ON pet.user_id = user_profile.id JOIN user ON user.id = user_profile.username_id JOIN breeds ON breeds.id = pet.breed JOIN regencies ON regencies.id = user_profile.city JOIN provinces ON regencies.province_id = provinces.id JOIN variants ON variants.id = breeds.variant LEFT JOIN have_vaccines ON have_vaccines.id_pet = pet.id WHERE pet.id IN ('"+res.locals.pet_id+"','"+req.body.pet_id+"')"; //check pet sex

    var query = db.query(petDetail, function(err, results){
        if(err){
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed fetching data',
                    detail: err
                },
                response: ''
            });
            res.end();
        }
        else if(results){
            for (var i in results) {
                if(results[i].id == res.locals.pet_id) {
                    if (!self.from) {
                        self.from = results[i]
                        self.from.vaccines = [];
                    }
                    if (results[i].id_vaccine) {
                        var vaccData = {
                            id: results[i].id_vaccine
                        };
                        self.from.vaccines.push(vaccData);
                    }
                }
                else if (results[i].id == req.body.pet_id) {
                    if (!self.to) {
                        self.to = []
                        self.to.push(results[i])
                        self.to[0].vaccines = [];
                    }
                    if (results[i].id_vaccine) {
                        var vaccData = {
                            id: results[i].id_vaccine
                        };
                        self.to[0].vaccines.push(vaccData);
                    }
                }
            }
            self.createHistory();
        }
    });

    self.createHistory = function () {
        self.to = wsm.calculate(self.to,self.from)[0];

        var historySql = "INSERT INTO `history_with`(`pet_from`, `pet_to`, `match_stat`, `match_date`, `score`, `added_at`) VALUES ('"+self.from.id+"', '"+self.to.id+"', '"+req.body.status+"', CURRENT_TIMESTAMP(),'"+self.to.matched_status.score+"', CURRENT_TIMESTAMP())";

        var query = db.query(historySql, function(err, results){
            if(err){
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
            }
            else if(results){
                res.json({
                    status: 200,
                    error: false,
                    error_msg: {
                        title: '',
                        detail: ''
                    },
                    response: 'Added to history!'
                });
                res.end();
            }
        });
    }

};

module.exports.getHistory = function(req, res){
    var self = this;
    var ownPet = "SELECT history_with.pet_from, pet_f.pet_name AS from_name, pet_f.pet_photo AS from_photo, breeds_f.name AS from_breed, history_with.pet_to, pet_t.pet_name AS to_name, pet_t.pet_photo AS to_photo, breeds_t.name AS to_breed, history_with.match_stat, DATE_FORMAT(history_with.match_date, '%Y-%m-%d') AS match_date, history_with.score FROM history_with JOIN pet pet_f ON history_with.pet_from = pet_f.id JOIN pet pet_t ON history_with.pet_to = pet_t.id JOIN breeds breeds_f ON breeds_f.id = pet_f.breed JOIN breeds breeds_t ON breeds_t.id = pet_t.breed WHERE history_with.pet_from = '"+req.params.pet_id+"'"

    var query = db.query(ownPet, function(err, results){
        if(err){
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed fetching data',
                    detail: err
                },
                response: ''
            });
            res.end();
        }
        else if(results){
            res.json({
                status: 200,
                error: false,
                error_msg: {
                    title: '',
                    detail: ''
                },
                response: results
            });
        }
    });
};

module.exports.getSelfHistory = function (req,res) {
    var self = this;
    var ownPet = "SELECT history_with.pet_from, pet_f.pet_name AS from_name, pet_f.pet_photo AS from_photo, breeds_f.name AS from_breed, history_with.pet_to, pet_t.pet_name AS to_name, pet_t.pet_photo AS to_photo, breeds_t.name AS to_breed, history_with.match_stat, DATE_FORMAT(history_with.match_date, '%Y-%m-%d') AS match_date, history_with.score FROM history_with JOIN pet pet_f ON history_with.pet_from = pet_f.id JOIN pet pet_t ON history_with.pet_to = pet_t.id JOIN breeds breeds_f ON breeds_f.id = pet_f.breed JOIN breeds breeds_t ON breeds_t.id = pet_t.breed WHERE history_with.pet_from = '"+res.locals.pet_id+"'"

    var query = db.query(ownPet, function(err, results){
        if(err){
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed fetching data',
                    detail: err
                },
                response: ''
            });
            res.end();
        }
        else if(results){
            res.json({
                status: 200,
                error: false,
                error_msg: {
                    title: '',
                    detail: ''
                },
                response: results
            });
        }
    });
}