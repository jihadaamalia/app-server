exports.provinces=function(req, res){
    var provinces_sql = "SELECT * FROM `provinces`";
    var query = db.query(provinces_sql, function(err, result){
        if (err) {
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
        else {
            res.json({
                status: 200,
                error: false,
                error_msg: {
                    title: '',
                    detail: ''
                },
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
        else if(result){
            res.json({
                status: 200,
                error: false,
                error_msg: {
                    title: '',
                    detail: ''
                },
                response: {
                    cities: result
                }
            });
            res.end();
        }
    });
};
