module.exports.vaccines = function(req, res){
    var getVaccines = "SELECT id, name FROM `vaccines` WHERE `variant` ='"+req.params.variant+"'";
    var query = db.query(getVaccines, function(err, result){
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
        else if(result){
            res.json({
                status: 200,
                error: false,
                error_msg: {
                    title: '',
                    detail: ''
                },
                response: {
                    vaccines: result
                }
            });
            res.end();
        }
    });
};
