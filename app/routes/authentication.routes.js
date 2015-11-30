var appRoot = require('app-root-path');
var auth = require(appRoot+"/app/controllers/authentication.controller.js");
var adminRouter = require('express').Router();

module.exports = function(app) {
	console.log(chalk.blue("Authentication Route Initialized"));
	app.route("/authenticate")
		.post(auth.authenticate);

	app.route("/login")
		.post(auth.login);		

	app.route("/testauth")
		.get(auth.isAuthenticated, function(req,res){
			res.send("Test Auth Success");
		});
		
}