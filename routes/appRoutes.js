'use strict';

module.exports = function(app) {
    var isAuthenticate = require('./middleware');
    var pet = require('../controllers/petController');

    app.get('/', function(req,res){
        res.json({"Message" : "Hello World!"});
    });

    app.post('/verify', isAuthenticate.verify, function(req,res){
        res.json({"Message" : "is Aunthenticate"});
    });

    app.post('/create_pet', isAuthenticate.verify, pet.createPet );

    app.post('/update_pet', isAuthenticate.verify, pet.updatePet );
};
  