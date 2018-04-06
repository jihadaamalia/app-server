exports.provinces=function(req, res){
    var provinces_sql = "SELECT * FROM `provinces`";
    var query = db.query(provinces_sql, function(err, result){
        if (err) {
            res.json({
                status: 200,
                error: true,
                error_msg: 'Failed fetching data',
                response: err
            });
            res.end();
        }
        else {
            res.json({
                status: 200,
                error: false,
                error_msg: '',
                response: {
                    provinces: result
                }
            });
            res.end();
        }
    });
};

exports.cities=function(req, res){
    var cities_sql = "SELECT id, name FROM `regencies` WHERE `province_id` ='"+req.params.prov_id+"'";
    var query = db.query(cities_sql, function(err, result){
        if(err){
            res.json({
                status: 200,
                error: false,
                error_msg: 'Failed fetching data',
                response: err
            });
            res.end();
        }
        else if(result){
            res.json({
                status: 200,
                error: false,
                error_msg: '',
                response: {
                    cities: result
                }
            });
            res.end();
        }
    });
};
