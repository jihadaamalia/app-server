'use strict';

module.exports = function(app) {
    var chat = require('../controllers/chatController');
    var location = require('../controllers/locationController');
    var vaccine = require('../controllers/vaccineController');
    var match = require('../controllers/matchController');
    var register = require('../controllers/registerController');
    var setting = require('../controllers/settingController');
    var profile = require('../controllers/profileController');
    var pet = require('../controllers/petController');
    var liked = require('../controllers/likedController');
    var history = require('../controllers/historyController');

    app.get('/', function(req,res){
        res.json({"Message" : "Hello World!"});
        res.end();
    });

    app.post('/verify', function(req,res){
        res.json({
            "Message" : "is Aunthenticate",
            "Results" : res.locals
        });
        res.end();
    });

    //register
    app.post('/register/user-profile', register.createUserProf );
    app.post('/register/pet', register.createPet );
    app.post('/register/vaccine', register.createVaccine);

    //get vaccine
    app.get('/breeds/:variant', pet.breeds);

    //get vaccine
    app.get('/vaccines/:variant', vaccine.vaccines);

    //get location
    app.get('/provinces', location.provinces); //get province
    app.get('/provinces/:prov_id', location.cities); //get city by province

    //matched pet timeline
    app.get('/matched/pet', match.matchedPet);
    app.post('/matched/liked', liked.insertLiked);

    //get liked pet data
    app.get('/matched/liked', liked.getLikedPet);

    //my profile
    app.get('/profile/user-profile', profile.getUserProf);
    app.get('/profile/pet', profile.getPet); //pet general info + vaccines

    //setting
    app.post('/setting/user-profile', setting.updateUserProf );
    app.post('/setting/pet', setting.updatePet );
    app.post('/setting/vaccine', setting.updateVaccine);

    //setting account
    app.post('/setting/user', setting.updateUser);
    app.post('/setting/change-password', setting.changePass);

    //chat
    app.post('/chat/start', chat.createRoom);
    app.get('/chat/room', chat.roomList);
    app.get('/chat/room/:room_id', chat.chatRoom);
    app.post('/chat/messages', chat.sendChat);

    //history
    app.post('/matched/history', history.insertHistory);
    app.get('/matched/history/:pet_id', history.getHistory);
    app.get('/matched/history', history.getSelfHistory);


    /*
    //unused preference API
    app.post('/register/preference', register.matchPreference);
    app.get('/profile/preference', profile.getPetPreference);
    app.post('/setting/preference', setting.updatePreference);
    */
};
  