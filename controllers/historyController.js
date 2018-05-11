module.exports.insertHistory = function(req, res){
    var self = this;
    var checkPetSex = "SELECT `pet_sex` FROM `pet` WHERE `id` = '"+res.locals.pet_id+"'"; //check pet sex

    var query = db.query(checkPetSex, function(err, results){
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
            if (results[0].pet_sex == 'm') {
                self.pet_m = res.locals.pet_id;
                self.pet_f = req.body.pet_id;
            } else if (results[0].pet_sex == 'f'){
                self.pet_f = res.locals.pet_id;
                self.pet_m = req.body.pet_id;
            }

            self.createHistory();
        }
    });

    self.createHistory = function () {
        var historySql = "INSERT INTO `history_with`(`pet_m`, `pet_f`, `match_stat`, `match_date`, `added_at`) VALUES ('"+self.pet_m+"', '"+self.pet_f+"', '"+req.body.status+"', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())";

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
    var ownPet = "select pet.id, pet.pet_name, pet.pet_dob, pet.pet_photo, pet.pet_sex, breeds.name AS breed from pet JOIN breeds ON pet.breed = breeds.id where pet.id = '"+res.locals.pet_id+"'"

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
            self.getPartner (results[0]);
        }
    });

    self.getPartner = function (ownPet) {
        self.ownPet = {
            id: ownPet.id,
            name: ownPet.pet_name,
            dob: ownPet.pet_dob,
            photo: ownPet.pet_photo,
            breed: ownPet.breed
        };

        if (ownPet.pet_sex == 'f') {
            self.subqueryHistory = "(SELECT pet_m FROM history_with WHERE pet_f = '"+res.locals.pet_id+"')";
            self.onClause = "pet_m";
            self.pet_f = ownPet;
        } else if (ownPet.pet_sex == 'm') {
            self.subqueryHistory = "(SELECT pet_f FROM history_with WHERE pet_m = '"+res.locals.pet_id+"')"
            self.onClause = "pet_f";
        }

        var queryHistory = "SELECT pet.id, pet.pet_name, pet.pet_dob, pet.pet_photo, breeds.name AS breed, history_with.match_stat, history_with.match_date FROM pet JOIN breeds ON pet.breed = breeds.id JOIN history_with ON history_with."+self.onClause+" = pet.id WHERE pet.id in "+self.subqueryHistory+""
        var query = db.query(queryHistory, function(err, results){
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
            else if(results){

                self.historyList = [];
                for (var i in results) {
                    var otherPet = {
                        id: results[i].id,
                        name: results[i].pet_name,
                        dob: results[i].pet_dob,
                        photo: results[i].pet_photo,
                        breed: results[i].breed
                    };

                    if (ownPet.pet_sex == 'f') {
                        self.history = {
                            pet_m: otherPet,
                            pet_f: self.ownPet
                        }
                    } else if (ownPet.pet_sex == 'm') {
                        self.history = {
                            pet_m: self.ownPet,
                            pet_f: otherPet
                        }
                    }

                    self.historyList.push(self.history)
                }

                res.json({
                    status: 200,
                    error: false,
                    error_msg: {
                        title: '',
                        detail: ''
                    },
                    response: self.historyList
                });
            }
        });

     }
};