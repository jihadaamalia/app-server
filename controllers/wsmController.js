module.exports.calculate = function (alternative, resource) {

    var self = this;
    self.optimalAge = 1;
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
            title : 'health',
            weight : 0.2,
            score : [0.25,0.5,1]
        },
        {
            title : 'breed',
            weight : 0.13,
            score : [0.25,0.5,0.75,1]
        },
        {
            title : 'city',
            weight : 0.07,
            score : [0,1]
        }
    ];

    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);

        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    (function(){
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

    //define pet sex
    if (resource.pet_sex == 'f') {
        //console.log(alternative[0])
        self.pet_f = resource;
        self.pet_m = alternative;
        console.log(alternative.length)

        for (var i in self.pet_m) {
            alternative[i].scores = {
                age: 0,
                size: 0,
                health: 0,
                breed: 0,
                city: 0
            };

            self.pet_m[i].age = getAge(self.pet_m[i].pet_dob);
            self.pet_f.age = getAge(self.pet_f.pet_dob)

            if (self.pet_f.age >= self.optimalAge && self.pet_m[i].age >= self.optimalAge) {
                alternative[i].scores.age = self.criteria[0].score[3];
            } else if (self.pet_f.age >= self.optimalAge && self.pet_m[i].age < self.optimalAge) {
                alternative[i].scores.age = self.criteria[0].score[2];
            } else if (self.pet_f.age < self.optimalAge && self.pet_m[i].age >= self.optimalAge) {
                alternative[i].scores.age = self.criteria[0].score[1];
            } else if(self.pet_f.age < self.optimalAge && self.pet_m[i].age >= self.optimalAge) {
                alternative[i].scores.age = self.criteria[0].score[0];
            }

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

            //console.log(alternative[i].scores.size, ' ',alternative[i].scores.age,' ', i)
        }
    } else {
        self.pet_m = resource;
        self.pet_f = alternative;

        for (var i in self.pet_m) {
            alternative[i].scores = {
                age: 0,
                size: 0,
                health: 0,
                breed: 0,
                city: 0
            };

            self.pet_m.age = getAge(self.pet_m.pet_dob);
            self.pet_f[i].age = getAge(self.pet_f[i].pet_dob)

            if (self.pet_f[i].age >= self.optimalAge && self.pet_m.age >= self.optimalAge) {
                alternative[i].scores.age = self.criteria[0].score[3];
            } else if (self.pet_f[i].age >= self.optimalAge && self.pet_m.age < self.optimalAge) {
                alternative[i].scores.age = self.criteria[0].score[2];
            } else if (self.pet_f[i].age < self.optimalAge && self.pet_m.age >= self.optimalAge) {
                alternative[i].scores.age = self.criteria[0].score[1];
            } else if(self.pet_f[i].age < self.optimalAge && self.pet_m.age >= self.optimalAge) {
                alternative[i].scores.age = self.criteria[0].score[0];
            }

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

    for (var i in alternative) {
        alternative[i].matched_status = {
            score : 0
        }

        alternative[i].matched_status.score = (self.criteria[0].weight * alternative[i].scores.age) + (self.criteria[1].weight * alternative[i].scores.size) + (self.criteria[2].weight * alternative[i].scores.health) + (self.criteria[3].weight * alternative[i].scores.breed) + (self.criteria[4].weight * alternative[i].scores.city);
    }

    //sort by score
    var wsmRes = alternative.sortBy( function(){ return -this.matched_status.score } );

    return wsmRes;
};
