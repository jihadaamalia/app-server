var tools = require('../libs/tools');

module.exports.calculate = function (alternative, resource) {
    var self = this;
    self.criteria = [
        {
            title : 'age',
            weight : 0.33,
            score : [0.25,0.5,0.75,1]
        },
        {
            title : 'size',
            weight : 0.27,
            score : [0.25,0.5,0.75,1]
        },
        {
            title : 'breed',
            weight : 0.2,
            score : [0.25,0.5,0.75,1]
        },
        {
            title : 'health',
            weight : 0.13,
            score : [0.3,0.7,1]
        },
        {
            title : 'city',
            weight : 0.07,
            score : [0.5,1]
        }
    ];

    //supporting data
    self.optAgeF = 1;
    self.optAgeM = 1;

    if (resource.cross_possibility) {
        var res = resource.cross_possibility;
        self.possibleBreed = res.split(";");
    }

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

    self.generalCalc = function (alternative, resource) {
        //sex related criteria
        if (resource.pet_sex == 'f') {
            self.pet_f = resource;
            self.pet_m = alternative;

            for (var i in self.pet_m) {
                alternative[i].scores = {
                    age: 0,
                    size: 0,
                    health: 0,
                    breed: 0,
                    city: 0
                };

                self.pet_m[i].age = tools.getAge(self.pet_m[i].pet_dob);
                self.pet_f.age = tools.getAge(self.pet_f.pet_dob)

                //age

                if (self.pet_f.age >= self.optAgeF && self.pet_m[i].age >= self.optAgeM) {
                    alternative[i].scores.age = self.criteria[0].score[3];
                } else if (self.pet_f.age >= self.optAgeF && self.pet_m[i].age < self.optAgeM) {
                    alternative[i].scores.age = self.criteria[0].score[2];
                } else if (self.pet_f.age < self.optAgeF && self.pet_m[i].age >= self.optAgeM) {
                    alternative[i].scores.age = self.criteria[0].score[1];
                } else if(self.pet_f.age < self.optAgeF && self.pet_m[i].age < self.optAgeM) {
                    alternative[i].scores.age = self.criteria[0].score[0];
                }

                //size
                if (self.pet_f.size == self.pet_m[i].size) {
                    alternative[i].scores.size = self.criteria[1].score[3];
                } else if (self.pet_f.size == 'large' && self.pet_m[i].size == 'medium' ||
                    self.pet_f.size == 'medium' && self.pet_m[i].size == 'small') {
                    alternative[i].scores.size = self.criteria[1].score[2];
                } else if (self.pet_f.size == 'medium' && self.pet_m[i].size == 'large' ||
                    self.pet_f.size == 'small' && self.pet_m[i].size == 'medium') {
                    alternative[i].scores.size = self.criteria[1].score[1];
                } else {
                    alternative[i].scores.size = self.criteria[1].score[0];
                }
            }
        }
        else {
            self.pet_m = resource;
            self.pet_f = alternative;

            for (var i in self.pet_f) {
                alternative[i].scores = {
                    age: 0,
                    size: 0,
                    health: 0,
                    breed: 0,
                    city: 0
                };

                self.pet_m.age = tools.getAge(self.pet_m.pet_dob);
                self.pet_f[i].age = tools.getAge(self.pet_f[i].pet_dob)

                //age
                if (self.pet_f[i].age >= self.optAgeF && self.pet_m.age >= self.optAgeM) {
                    alternative[i].scores.age = self.criteria[0].score[3];
                } else if (self.pet_f[i].age >= self.optAgeF && self.pet_m.age < self.optAgeM) {
                    alternative[i].scores.age = self.criteria[0].score[2];
                } else if (self.pet_f[i].age < self.optAgeF && self.pet_m.age >= self.optAgeM) {
                    alternative[i].scores.age = self.criteria[0].score[1];
                } else if (self.pet_f[i].age < self.optAgeF && self.pet_m.age < self.optAgeM) {
                    alternative[i].scores.age = self.criteria[0].score[0];
                }

                //size
                if (self.pet_f[i].size == self.pet_m.size) {
                    alternative[i].scores.size = self.criteria[1].score[3];
                } else if (self.pet_f[i].size == 'large' && self.pet_m.size == 'medium' ||
                    self.pet_f[i].size == 'medium' && self.pet_m.size == 'small') {
                    alternative[i].scores.size = self.criteria[1].score[2];
                } else if (self.pet_f[i].size == 'medium' && self.pet_m.size == 'large' ||
                    self.pet_f[i].size == 'small' && self.pet_m.size == 'medium') {
                    alternative[i].scores.size = self.criteria[1].score[1];
                } else {
                    alternative[i].scores.size = self.criteria[1].score[0];
                }
            }
        }

        //general criteria
        for (var i in alternative) {
            //breeds
            if (alternative[i].breed == resource.breed) {
                alternative[i].scores.breed = self.criteria[2].score[3];
            } else if (!resource.mixed && !alternative[i].mixed) { //both pure but diff breed
                if (self.possibleBreed) { //have recognized crossbreed
                    for (var j in self.possibleBreed) {
                        if (self.possibleBreed[j] == alternative[i].breed_name) { //both pure and new breed is common
                            alternative[i].scores.breed = self.criteria[2].score[2];
                            break;
                        } else { //both pure but new breed have not recognized
                            alternative[i].scores.breed = self.criteria[2].score[1];
                        }
                    }
                } else { //both pure but new breed have not recognized
                    alternative[i].scores.breed = self.criteria[2].score[1];
                }
            } else if (resource.mixed || alternative[i].mixed) { //cross x pure or cross x cross
                alternative[i].scores.breed = self.criteria[2].score[0];
            }

            //health
            if (alternative[i].vaccines.length > 0) {
                if (alternative[i].variant_id == 1) {
                    if (alternative[i].vaccines.length == 7) {
                        alternative[i].scores.health = self.criteria[3].score[2];
                    } else {
                        alternative[i].scores.health = self.criteria[3].score[1];
                    }
                } else {
                    if (alternative[i].vaccines.length == 5){
                        alternative[i].scores.health = self.criteria[3].score[2];
                    } else {
                        alternative[i].scores.health = self.criteria[3].score[1];
                    }
                }
            } else if (alternative[i].vaccines.length == 0) {
                alternative[i].scores.health = self.criteria[3].score[0];
            }

            //city
            if (alternative[i].city == resource.city) { //same city
                alternative[i].scores.city = self.criteria[4].score[1];
            } else { //cross x pure or cross x cross
                alternative[i].scores.city = self.criteria[4].score[0];
            }

            alternative[i].matched_status = {
                score: 0
            };

            alternative[i].matched_status.score = (self.criteria[0].weight * alternative[i].scores.age) + (self.criteria[1].weight * alternative[i].scores.size) + (self.criteria[2].weight * alternative[i].scores.breed) + (self.criteria[3].weight * alternative[i].scores.health) + (self.criteria[4].weight * alternative[i].scores.city);
        }

        //sort by score
        var wsmRes = alternative.sortBy( function(){ return -this.matched_status.score } );

        return wsmRes;
    };

    return self.generalCalc (alternative, resource);
};
