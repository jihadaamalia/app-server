module.exports.createRoom = function (req, res) {
    var self = this;

    var checkExisting = "SELECT room_id, member_id, user_profile.name FROM chat_member JOIN pet ON pet.id = chat_member.member_id JOIN user_profile ON user_profile.id = pet.user_id WHERE room_id IN (SELECT room_id FROM chat_member WHERE member_id = "+res.locals.pet_id+") AND member_id = "+req.body.other_member+"";

    db.query(checkExisting, function(err, result){
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
        } else if (result[0]) {
            res.json({
                status: 200,
                error: false,
                error_msg: {
                    title: '',
                    detail: ''
                },
                response: {
                    room_id: result[0].room_id,
                    other_member_id: result[0].member_id,
                    other_member_name : result[0].name
                }
            });
            res.end();
        } else {
            self.createNew ();
        }
    });

    self.createNew = function () {
        var createRoomSql = "INSERT INTO chat_room VALUES (NULL, CURRENT_TIMESTAMP)";

        db.query(createRoomSql, function(err, result){
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
            } else if (result.affectedRows > 0) {
                self.roomId = result.insertId;
                self.createMember ();
            }
        });
    };

    self.createMember = function () {
        var memberSql = "INSERT INTO `chat_member` VALUES (" + req.body.other_member + ", " + self.roomId + ", CURRENT_TIMESTAMP), (" + res.locals.pet_id + ", " + self.roomId + ", CURRENT_TIMESTAMP)";

        db.query(memberSql, function (err, result) {
            if (err) {
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
            } else if (result.affectedRows > 0) {
                self.getDataMember ();
            }
        });
    };

    self.getDataMember = function () {
        var dataMember = "SELECT user_profile.name, member_id, room_id FROM chat_member JOIN pet ON pet.id = chat_member.member_id JOIN user_profile ON user_profile.id = pet.user_id WHERE member_id = "+ req.body.other_member +" AND room_id = "+ self.roomId +"";

        db.query(dataMember, function (err, result) {
            if (err) {
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
                    response: {
                        room_id: result[0].room_id,
                        other_member_id: result[0].member_id,
                        other_member_name : result[0].name
                    }
                });
                res.end();
            }
        });

    };
};

module.exports.roomList = function (req, res) {
    var self = this;

    var roomListSql = "SELECT chat_member.member_id, chat_member.room_id, user_profile.name, user_profile.photo FROM chat_member JOIN pet ON chat_member.member_id = pet.id JOIN user_profile ON user_profile.id = pet.user_id WHERE chat_member.room_id IN (SELECT room_id FROM chat_member WHERE member_id = '"+res.locals.pet_id+"') AND chat_member.member_id <> '"+res.locals.pet_id+"'";
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
            self.roomList = result;
            self.getLastMsg ();
        }
    });

    self.getLastMsg = function () {
        var lastMsgSql = "SELECT chat_msg.from, chat_msg.image, chat_msg.text, DATE_FORMAT(chat_msg.added_at,'%Y-%m-%d %H:%i') AS added_at, chat_msg.room_id FROM chat_msg WHERE chat_msg.room_id IN (SELECT chat_room.id FROM chat_room JOIN chat_member ON chat_room.id = chat_member.room_id WHERE chat_member.member_id = '"+res.locals.pet_id+"')"

        db.query(lastMsgSql, function(err, result){
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
                for (var i in self.roomList) {
                    self.roomList[i].last_msg = {
                        from: '',
                        image: '',
                        text: '',
                        timestamp: ''
                    };

                    for (var j in result) {
                        if (result[j].room_id == self.roomList[i].room_id) {
                            if (result[j].added_at > self.roomList[i].last_msg.timestamp) { //get last msg
                                self.roomList[i].last_msg.from = result[j].from;
                                self.roomList[i].last_msg.image = result[j].image;
                                self.roomList[i].last_msg.text = result[j].text;
                                self.roomList[i].last_msg.timestamp = result[j].added_at; //TODO: CONVERT TO bangkok timezone
                            }
                        }
                    }
                }

                res.json({
                    status: 200,
                    error: false,
                    error_msg: {
                        title: '',
                        detail: ''
                    },
                    response: {
                        rooms: self.roomList
                    }
                });
                res.end();
            }
        });
    }
};

module.exports.chatRoom = function (req, res) {
    var chatRoomSql = "SELECT chat_msg.from, user_profile.name, user_profile.photo, chat_msg.image, chat_msg.text, DATE_FORMAT(chat_msg.added_at,'%Y-%m-%d %H:%i') AS added_at FROM chat_msg JOIN pet ON chat_msg.from = pet.id JOIN user_profile ON pet.user_id = user_profile.id WHERE chat_msg.room_id = "+req.params.room_id+" ORDER BY chat_msg.added_at ASC";
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
                response: {
                    chat_msg: result
                }
            });
            res.end();
        }
    });
};

module.exports.sendChat = function (req, res) {
    var chatRoomSql = "INSERT INTO `chat_msg` VALUES ('"+res.locals.pet_id+"', '"+req.body.image+"', '"+req.body.text+"', '"+req.body.room+"', CURRENT_TIMESTAMP)";
    db.query(chatRoomSql, function(err, result){
        if(err) {
            res.json({
                status: 500,
                error: true,
                error_msg: {
                    title: 'Failed to send data',
                    detail: err
                },
                response: ''
            });
            res.end();
        } else if (result.affectedRows > 0) {
            var reqRoom = {
                params: {
                    room_id:req.body.room
                }
            };
            module.exports.chatRoom(reqRoom,res);
        }
    });
};