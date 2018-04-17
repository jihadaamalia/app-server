module.exports.insertLiked = function(req, res){
    var self = this;
    console.log(req.body)

    var insertLiked = "INSERT INTO `liked`(`pet_m`, `pet_f`, `like_stat`, `added_at`) VALUES ('"+res.locals.pet_id+"', '"+req.body.liked_pet+"', '"+req.body.liked_status+"', CURRENT_TIMESTAMP())";
    var query = db.query(insertLiked, function(err, results){
        if(err){
            res.json({
                status: 200,
                error: true,
                error_msg: 'Failed fetching data',
                response: err
            });
            res.end();
        }
        else if(results){
            res.json({
                status: 200,
                error: false,
                error_msg: '',
                response: 'like status added'
            });
            res.end();
        }
    });
};