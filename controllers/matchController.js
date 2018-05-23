var tools = require('../libs/tools');

module.exports.matchedPet = function(req, res){
    var self = this;
    //sort
    (function(){
        // This code is copyright 2012 by Gavin Kistner, !@phrogz.net
        // License: http://phrogz.net/JS/_ReuseLicense.txt
        if (typeof Object.defineProperty === 'function'){
            try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
        }
        if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

        function sb(f){
            for (var i=this.length;i;){
                var o = this[--i];
                this[i] = [].concat(f.call(o,o,i),o);
            }
            this.sort(function(a,b){
                for (var i=0,len=a.length;i<len;++i){
                    if (a[i]!=b[i]) return a[i]<b[i]?-1:1;
                }
                return 0;
            });
            for (var i=this.length;i;){
                this[--i]=this[i][this[i].length-1];
            }
            return this;
        }
    })();

    self.paginate = req.query;
    var petOption = "SELECT pet.id, pet.pet_name, DATE_FORMAT(pet.pet_dob, '%Y-%m-%d') AS pet_dob, pet.pet_sex, pet.furcolor, pet.weight, pet.breed, breeds.name AS breed_name, breeds.size, breeds.mixed, breeds.cross_possibility, variants.id AS variant_id, variants.name AS variant, pet.pet_photo, pet.breed_cert, pet.pet_desc, pet.user_id, user_profile.name, user.username, DATE_FORMAT(user_profile.user_dob, '%Y-%m-%d') AS user_dob, user_profile.photo, user_profile.sex, regencies.id AS city_id, regencies.name AS city, provinces.id AS province_id, provinces.name AS provinces, pet.breed_pref, pet.age_min, pet.age_max, pet.city_pref, pet.updated_at FROM `pet` JOIN `user_profile`ON pet.user_id = user_profile.id JOIN user ON user.id = user_profile.username_id JOIN breeds ON breeds.id = pet.breed JOIN regencies ON regencies.id = user_profile.city JOIN provinces ON regencies.province_id = provinces.id JOIN variants ON variants.id = breeds.variant LEFT JOIN (SELECT liked.to FROM liked WHERE liked.from = '"+res.locals.pet_id+"') liked ON pet.id = liked.to WHERE liked.to IS NULL";

    var query = db.query(petOption, function(err, results){
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
            self.sortMatched (results)
        }
    });

    self.sortMatched = function (results) {
        self.sliced = [];

        for (var i in results) { //get resource pet
            if (results[i].id == res.locals.pet_id ) {
                self.resPet = results[i];
            }
        };

        for (var i in results) { //delete unused pet (same gender, diff variants)
            if (results[i].id != res.locals.pet_id &&
                results[i].variant_id == self.resPet.variant_id &&
                results[i].pet_sex != self.resPet.pet_sex) {
                self.sliced.push(results[i])
            }
        };

        self.sliced = self.sliced.sortBy( function(){ return -this.updated_at } );
        self.vaccinesData();
    };

    self.vaccinesData = function () {
        var getVaccines = "SELECT have_vaccines.id_pet, vaccines.id, vaccines.name FROM have_vaccines JOIN vaccines ON have_vaccines.id_vaccine = vaccines.id";

        var query = db.query(getVaccines, function(err, results){
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
                for (var i in self.sliced) {
                    self.sliced[i].vaccines = [];
                    for (var j in results) {
                        if (results[j].id_pet == self.sliced[i].id) {
                            var vaccine = {
                                id : results[j].id,
                                name : results[j].name
                            };
                            self.sliced[i].vaccines.push(vaccine);
                        }
                    }
                }

                self.generateRes();
            }
        });
    };

    self.generateRes = function () {
        // slice(begin, end) note: end not included
        self.paginate.end = self.paginate.start + self.paginate.size;
        self.paginated = self.sliced.slice(self.paginate.start, self.paginate.end);

        //rearrange format
        self.matchedResult = [];
        for (var i in self.paginated) {
            self.matchedResult[i] = {
                id : self.paginated[i].id,
                pet_name : self.paginated[i].pet_name,
                pet_dob : self.paginated[i].pet_dob,
                pet_sex : self.paginated[i].pet_sex,
                furcolor : self.paginated[i].furcolor,
                weight : self.paginated[i].weight,
                breed_name : self.paginated[i].breed_name,
                size : self.paginated[i].size,
                variant : self.paginated[i].variant,
                pet_photo : self.paginated[i].pet_photo,
                breed_cert : self.paginated[i].breed_cert,
                pet_desc : self.paginated[i].pet_desc,
                vaccines : self.paginated[i].vaccines,
                user_data : {
                    user_id : self.paginated[i].user_id,
                    name : self.paginated[i].name,
                    username : self.paginated[i].username,
                    user_dob : self.paginated[i].user_dob,
                    photo : self.paginated[i].photo,
                    sex : self.paginated[i].sex,
                    city : self.paginated[i].city,
                    provinces : self.paginated[i].provinces
                },
                matched_status : {
                    score: 0
                }
            };
        }

        res.json({
            status: 200,
            error: false,
            error_msg: {
                title: '',
                detail: ''
            },
            response: {
                matchedPet: self.matchedResult
            }
        });
        res.end();
    }
};

