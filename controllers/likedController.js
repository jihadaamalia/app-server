var wsm = require('./wsmController');

module.exports.insertLiked = function(req, res){
    var self = this;

    var insertLiked = "INSERT INTO `liked`(`from`, `to`, `like_stat`, `added_at`) VALUES ('"+res.locals.pet_id+"', '"+req.body.liked_pet+"', '"+req.body.liked_status+"', CURRENT_TIMESTAMP())";
    var query = db.query(insertLiked, function(err, results){
        if(err){
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed inserting data',
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
                response: 'like status added'
            });
            res.end();
        }
    });
};

module.exports.getLikedPet = function(req, res){
    var self = this;

    self.alternatives = function () {
        var getLiked = "SELECT pet.id, pet.pet_name, DATE_FORMAT(pet.pet_dob, '%Y-%m-%d') AS pet_dob, pet.pet_sex, pet.furcolor, pet.weight, pet.breed, breeds.name AS breed_name, breeds.size, variants.name AS variant, pet.pet_photo, pet.breed_cert, pet.pet_desc, pet.user_id, user_profile.name, user.username,  DATE_FORMAT(user_profile.user_dob, '%Y-%m-%d') AS user_dob, user_profile.photo, user_profile.sex, regencies.name AS city, provinces.name AS provinces, have_vaccines.id_vaccine, vaccines.name AS name_vaccine FROM `pet` JOIN `user_profile`ON pet.user_id = user_profile.id JOIN user ON user.id = user_profile.username_id JOIN breeds ON breeds.id = pet.breed JOIN regencies ON regencies.id = user_profile.city JOIN provinces ON regencies.province_id = provinces.id JOIN variants ON variants.id = breeds.variant JOIN liked ON pet.id = liked.to LEFT JOIN have_vaccines ON have_vaccines.id_pet = pet.id LEFT JOIN vaccines ON vaccines.id = have_vaccines.id_vaccine LEFT JOIN (SELECT history_with.pet_to FROM history_with WHERE history_with.pet_from = "+res.locals.pet_id+") history ON pet.id = history.pet_to WHERE liked.from = "+res.locals.pet_id+" AND liked.like_stat = 1 AND history.pet_to IS NULL";

        var query = db.query(getLiked, function(err, results){
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
                self.likedPet = [];
                self.dump = [];

                for (var i in results) {
                    if (!self.dump.includes(results[i].id)) {
                        self.dump.push(results[i].id);
                        results[i].vaccines = [];
                        self.likedPet.push(results[i]);
                    }

                    for (var j in self.likedPet) {
                        if (self.likedPet[j].id == results[i].id) {
                            if (results[i].id_vaccine) {
                                var vaccData = {
                                    id: results[i].id_vaccine,
                                    name: results[i].name_vaccine
                                };
                                self.likedPet[j].vaccines.push(vaccData);
                            }
                        }

                        if (self.likedPet[j].id_vaccine) {
                            delete self.likedPet[j].id_vaccine;
                            delete self.likedPet[j].name_vaccine;
                        }
                    }
                }
                self.srcPet ();
            }
        });
    };

    self.srcPet = function (results) {
        var srcSql = "SELECT pet.id, pet.pet_name, DATE_FORMAT(pet.pet_dob, '%Y-%m-%d') AS pet_dob, pet.pet_sex, pet.furcolor, pet.weight, pet.breed, breeds.name AS breed_name, breeds.size, variants.name AS variant, pet.pet_photo, pet.breed_cert, pet.pet_desc, pet.user_id, user_profile.name, user.username, DATE_FORMAT(user_profile.user_dob, '%Y-%m-%d') AS user_dob, user_profile.photo, user_profile.sex, regencies.name AS city, provinces.name AS provinces, have_vaccines.id_vaccine, vaccines.name AS name_vaccine FROM `pet` JOIN `user_profile`ON pet.user_id = user_profile.id JOIN user ON user.id = user_profile.username_id JOIN breeds ON breeds.id = pet.breed JOIN regencies ON regencies.id = user_profile.city JOIN provinces ON regencies.province_id = provinces.id JOIN variants ON variants.id = breeds.variant LEFT JOIN have_vaccines ON have_vaccines.id_pet = pet.id LEFT JOIN vaccines ON vaccines.id = have_vaccines.id_vaccine WHERE pet.id = "+res.locals.pet_id+"";

        var query = db.query(srcSql, function(err, results){
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
                    if (!self.src) {
                        self.src = results[i];
                        self.src.vaccines = [];
                    }

                    if (results[i].id_vaccine) {
                        var vaccData = {
                            id: results[i].id_vaccine,
                            name: results[i].name_vaccine
                        };
                        self.src.vaccines.push(vaccData);
                    }

                    if (self.src.id_vaccine){
                        delete self.src.id_vaccine;
                        delete self.src.name_vaccine;
                    }
                }

                self.wsmCalc ();
            }
        });
    };

    self.wsmCalc = function () {
        var results = wsm.calculate(self.likedPet,self.src);

        self.likePetList = [];
        for (var i in results) {
            self.likePetList[i] = {
                id : results[i].id,
                pet_name : results[i].pet_name,
                pet_dob : results[i].pet_dob,
                pet_sex : results[i].pet_sex,
                furcolor : results[i].furcolor,
                weight : results[i].weight,
                breed_name : results[i].breed_name,
                size : results[i].size,
                variant : results[i].variant,
                pet_photo : results[i].pet_photo,
                breed_cert : results[i].breed_cert,
                pet_desc : results[i].pet_desc,
                vaccines : results[i].vaccines,
                user_data : {
                    user_id : results[i].user_id,
                    name : results[i].name,
                    username : results[i].username,
                    user_dob : results[i].user_dob,
                    photo : results[i].photo,
                    sex : results[i].sex,
                    city : results[i].city,
                    provinces : results[i].provinces
                },
                matched_status : {
                    score: results[i].matched_status.score
                }
            }
        };

        res.json({
            status: 200,
            error: false,
            error_msg: {
                title: '',
                detail: ''
            },
            response: {
                likedPet : self.likePetList
            }
        });
        res.end();
    };

    self.alternatives();
};

module.exports.deleteLiked = function(req, res){
    var dislike = "DELETE FROM `liked` WHERE `from` = "+res.locals.pet_id+" AND `to` = "+req.body.pet_id+"";
    var query = db.query(dislike, function(err, results){
        if(err){
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed delete data',
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
                response: 'Disliked success!'
            });
            res.end();
        }
    });
};