'use strict';

module.exports = function(app) {
    var isAuthenticate = require('./middleware');
    var location = require('../controllers/locationController');
    var vaccine = require('../controllers/vaccineController');
    var match = require('../controllers/matchController');
    var register = require('../controllers/registerController');
    var setting = require('../controllers/settingController');
    var profile = require('../controllers/profileController');

    app.get('/', function(req,res){
        res.json({"Message" : "Hello World!"});
        res.end();
    });

    app.post('/verify', isAuthenticate.verify, function(req,res){
        res.json({
            "Message" : "is Aunthenticate",
            "Results" : res.locals
        });
        res.end();
    });

    //register
    app.post('/register/user-profile', isAuthenticate.verify, register.createUserProf );
    app.post('/register/pet', isAuthenticate.verify, register.createPet );
    app.post('/register/vaccine', isAuthenticate.verify, register.createVaccine);
    app.post('/register/preference', isAuthenticate.verify, register.matchPreference);

    //get vaccine
    app.get('/vaccines/:variant', isAuthenticate.verify, vaccine.vaccines);

    //get location
    app.get('/provinces', isAuthenticate.verify, location.provinces); //get province
    app.get('/provinces/:prov_id', isAuthenticate.verify, location.cities); //get city by province

    //matched pet timeline
    app.get('/matched/pet', isAuthenticate.verify, match.matchedPet);
    app.post('/matched/liked', isAuthenticate.verify, match.insertLiked);

    //get liked pet data
    app.get('/matched/liked', isAuthenticate.verify, match.getLikedPet);

    //my profile
    app.get('/profile/user-profile', isAuthenticate.verify, profile.getUserProf);
    app.get('/profile/pet', isAuthenticate.verify, profile.getPet); //pet general info + vaccines

    //setting
    app.post('/setting/user_profile', isAuthenticate.verify, setting.updateUserProf );
    app.post('/setting/pet', isAuthenticate.verify, setting.updatePet );
    app.post('/setting/preference', isAuthenticate.verify, setting.updatePreference);
    app.post('/setting/vaccine', isAuthenticate.verify, setting.updateVaccine);

    //setting account
    app.post('/setting/user', isAuthenticate.verify, setting.updateUser);
    app.post('/setting/change_password', isAuthenticate.verify, setting.changePass);

};
  