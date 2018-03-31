'use strict';

module.exports = function(app) {
 	var user = require('../controllers/userController'); //to get something outside the caller file folder

  	app.get("/",function(req,res){
	        res.json({"Message" : "Hello World !"});
	});

    //check access
    app.post('/verify_access', user.verify);

};
  