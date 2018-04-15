module.exports.vaccines = function(req, res){
    var getVaccines = "SELECT id, name FROM `vaccines` WHERE `variant` ='"+req.params.variant+"'";
    var query = db.query(getVaccines, function(err, result){
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
                    vaccines: result
                }
            });
            res.end();
        }
    });
};
