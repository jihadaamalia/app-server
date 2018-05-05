module.exports.breeds = function(req, res){
    var getBreeds = "SELECT id, name FROM `breeds` where variant ='"+req.params.variant+"'";
    var query = db.query(getBreeds, function(err, result){
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
                    breeds: result
                }
            });
            res.end();
        }
    });
};
