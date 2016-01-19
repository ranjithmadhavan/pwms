var auth = reqlib("/app/controllers/authentication.controller.js"),
	userController = reqlib("/app/controllers/user.controller"),
	restful = require('node-restful'), 
	UserSettings = restful.model("UserSettings");

module.exports = function(app) {
	console.log(chalk.blue("User Route Initialized"));
	app.route("/selfPasswordReset")
		.post(auth.isAuthenticated, userController.selfPasswordReset);		

	// Register the User settings RESTful routes
	UserSettings.register(app, "/usersettings");		
		
}