'use strict';

module.exports = function(app) {
    var isAuthenticate = require('./middleware');
    var user = require('../controllers/userController');
    var pet = require('../controllers/petController');
    var location = require('../controllers/locationController');
    var vaccine = require('../controllers/vaccineController');
    var match = require('../controllers/matchController');
    var liked = require('../controllers/likedController');

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
    app.post('/create_profile', isAuthenticate.verify, user.createUserProf );
    app.post('/create_pet', isAuthenticate.verify, pet.createPet );
    app.post('/create_vaccine', isAuthenticate.verify, pet.createVaccine);
    app.post('/create_preference', isAuthenticate.verify, pet.matchPreference);

    //get vaccine
    app.get('/vaccines/:variant', isAuthenticate.verify, vaccine.vaccines);

    //get location
    app.get('/provinces', isAuthenticate.verify, location.provinces); //get province
    app.get('/provinces/:prov_id', isAuthenticate.verify, location.cities); //get city by province

    //matched pet timeline
    app.get('/matched_pet', isAuthenticate.verify, match.matchedPet);
    app.post('/create_liked', isAuthenticate.verify, liked.insertLiked);

    //get liked pet data
    app.get('/get_liked', isAuthenticate.verify, liked.getLikedPet);

    //my profile
    app.get('/user_profile', isAuthenticate.verify, user.getUserProf);
    app.get('/pet', isAuthenticate.verify, pet.getPet); //pet general info + vaccines

    //setting
    app.post('/setting/user_profile', isAuthenticate.verify, user.updateUserProf );
    app.post('/setting/pet', isAuthenticate.verify, pet.updatePet );
    app.post('/setting/preference', isAuthenticate.verify, pet.updatePreference);
    // app.post('/setting/vaccine', isAuthenticate.verify, pet.createVaccine);

};
  