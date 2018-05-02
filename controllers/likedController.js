module.exports.insertLiked = function(req, res){
    var self = this;

    var insertLiked = "INSERT INTO `liked`(`from`, `to`, `like_stat`, `added_at`) VALUES ('"+res.locals.pet_id+"', '"+req.body.liked_pet+"', '"+req.body.liked_status+"', CURRENT_TIMESTAMP())";
    var query = db.query(insertLiked, function(err, results){
        if(err){
            res.json({
                status: 200,
                error: true,
                error_msg: 'Failed fetching data',
                response: err
            });
            res.end();
        }
        else if(results){
            res.json({
                status: 200,
                error: false,
                error_msg: '',
                response: 'like status added'
            });
            res.end();
        }
    });
};

module.exports.getLikedPet = function(req, res){
    var self = this;

    var getLiked = "SELECT pet.id, pet.pet_name, pet.pet_dob, pet.pet_sex, pet.furcolor, pet.weight, pet.breed, breeds.name AS breed_name, breeds.size, variants.name AS variant, pet.pet_photo, pet.breed_cert, pet.pet_desc, pet.user_id, user_profile.name, user_profile.username, user_profile.user_dob, user_profile.photo, user_profile.sex, regencies.name AS city, provinces.name AS provinces FROM `pet` JOIN `user_profile`ON pet.user_id = user_profile.id JOIN breeds ON breeds.id = pet.breed JOIN regencies ON regencies.id = user_profile.city JOIN provinces ON regencies.province_id = provinces.id JOIN variants ON variants.id = breeds.variant JOIN liked ON pet.id = liked.to WHERE liked.from = '"+res.locals.pet_id+"' AND liked.like_stat = 1";

    var query = db.query(getLiked, function(err, results){
        if(err){
            res.json({
                status: 200,
                error: true,
                error_msg: 'Failed fetching data',
                response: err
            });
            res.end();
        }
        else if(results){
            self.likePet (results)
        }
    });

    self.likePet = function (results) {
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
                    score: '' //TODO: check whether there will be a score on the like page
                }
            }
        };

        res.json({
            status: 200,
            error: false,
            error_msg: '',
            response: {
                matchedPet : self.likePetList
            }
        });
        res.end();
    }
};