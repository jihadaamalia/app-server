'use strict';

module.exports = function(app) {
    var isAuthenticate = require('./middleware');
    var pet = require('../controllers/petController');
    var location = require('../controllers/locationController');

    app.get('/', function(req,res){
        res.json({"Message" : "Hello World!",});
        res.end();
    });

    app.post('/verify', isAuthenticate.verify, function(req,res){
        res.json({
            "Message" : "is Aunthenticate",
            "Results" : res.locals
        });
        res.end();
    });

    app.post('/create_user', isAuthenticate.verify, user.createPet );

    app.post('/create_pet', isAuthenticate.verify, pet.createPet );

    app.post('/update_pet', isAuthenticate.verify, pet.updatePet );

    //get location
    app.get('/provinces', isAuthenticate.verify, location.provinces); //get province
    app.get('/provinces/:prov_id', location.cities); //get city by province
};
  