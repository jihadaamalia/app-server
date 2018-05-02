module.exports.matchedPet = function(req, res){
    var self = this
    self.paginate = req.query;

    var petOption  = "SELECT pet.id, pet.pet_name, pet.pet_dob, pet.pet_sex, pet.furcolor, pet.weight, pet.breed, breeds.name AS breed_name, breeds.size, variants.name AS variant, pet.pet_photo, pet.breed_cert, pet.pet_desc, pet.user_id, user_profile.name, user_profile.username, user_profile.user_dob, user_profile.photo, user_profile.sex, regencies.name AS city, provinces.name AS provinces FROM `pet` JOIN `user_profile`ON pet.user_id = user_profile.id JOIN breeds ON breeds.id = pet.breed JOIN regencies ON regencies.id = user_profile.city JOIN provinces ON regencies.province_id = provinces.id JOIN variants ON variants.id = breeds.variant LEFT JOIN (SELECT liked.to FROM liked WHERE liked.from = '"+res.locals.pet_id+"') liked ON pet.id = liked.to WHERE pet.id <> '"+res.locals.pet_id+"' AND liked.to IS NULL";

    var query = db.query(petOption, function(err, results){
        if(err){
            res.json({
                status: 200,
                error: false,
                error_msg: 'Failed fetching data',
                response: err
            });
            res.end();
        }
        else if(results){
            self.sortMatched (results)
        }
    });

    self.sortMatched = function (results) {
        self.matchedSorted = [];
        for (var i in results) {
            self.matchedSorted[i] = {
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
                    score: ''
                }
            }
        };

        // slice(begin, end) note: end not included
        self.paginate.end = self.paginate.start + self.paginate.size;

        self.matchedResult = self.matchedSorted.slice(self.paginate.start, self.paginate.end)

        res.json({
            status: 200,
            error: false,
            error_msg: '',
            response: {
                matchedPet : self.matchedResult
            }
        });
        res.end();
    }
};