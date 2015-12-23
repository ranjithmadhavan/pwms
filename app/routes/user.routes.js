var auth = reqlib("/app/controllers/authentication.controller.js"),
	userController = reqlib("/app/controllers/user.controller")

module.exports = function(app) {
	console.log(chalk.blue("User Route Initialized"));
	app.route("/selfPasswordReset")
		.post(auth.isAuthenticated, userController.selfPasswordReset);		
		
}