module.exports.roomList = function (req, res) {
    var roomListSql = "SELECT member_chat.room_id, user_profile.name, user_profile.photo FROM `room_chat` JOIN member_chat ON room_chat.id = member_chat.room_id JOIN pet ON pet.id = member_chat.member_id JOIN user_profile ON pet.user_id = user_profile.id WHERE member_chat.member_id = '"+res.locals.pet_id+"'";
    db.query(roomListSql, function(err, result){
        if(err) {
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
        } else {
            res.json({
                status: 200,
                error: false,
                error_msg: {
                    title: '',
                    detail: ''
                },
                response: result
            });
            res.end();
        }
    });
};