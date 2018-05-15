module.exports.calculate = function (alternative, resource) {

    var self = this;

    self.weight = [
        {
            title : 'size',
            weight : 0.33,
            score : [0,1]
        },
        {
            title : 'health',
            weight : 0.27,
            score : [0,1]
        },
        {
            title : 'breed',
            weight : 0.2,
            score : [0,1]
        },
        {
            title : 'age',
            weight : 0.13,
            score : [0,1]
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

    for (var i in alternative) {
        alternative[i].matched_status = {
            score : 0
        };

        if (resource.size == alternative[i].size) {
            alternative[i].matched_status.score = alternative[i].matched_status.score + (self.weight[0].weight * self.weight[0].score[1]);
        }

        if (alternative[i].vaccines.length > 0) {
            alternative[i].matched_status.score = alternative[i].matched_status.score + (self.weight[1].weight * self.weight[1].score[1]);
        }

        if (resource.breed_pref == alternative[i].breed) {
            alternative[i].matched_status.score = alternative[i].matched_status.score + (self.weight[2].weight * self.weight[2].score[1]);
        }

        alternative[i].age = getAge(alternative[i].pet_dob)

        if (resource.age_min <= alternative[i].age && resource.age_max <= alternative[i].age) {
            alternative[i].matched_status.score = alternative[i].matched_status.score + (self.weight[3].weight * self.weight[3].score[1]);
        }

        if (resource.city_pref == alternative[i].city_id) {
            alternative[i].matched_status.score = alternative[i].matched_status.score + (self.weight[4].weight * self.weight[4].score[1]);
        }
    }

    //sort by score
    var wsmRes = alternative.sortBy( function(){ return -this.matched_status.score } );

    return wsmRes;
};
