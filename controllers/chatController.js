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

module.exports.chatRoom = function (req, res) {
    var chatRoomSql = "SELECT message_with.image, message_with.text, message_with.from, message_with.added_at, user_profile.name, user_profile.photo FROM message_with JOIN pet ON message_with.from = pet.id JOIN user_profile ON pet.user_id = user_profile.id WHERE message_with.room_id = '"+req.params.roomid+"'";
    db.query(chatRoomSql, function(err, result){
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