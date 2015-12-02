var tenantAdminController = reqlib("/app/controllers/tenantadmin.controller");
var auth = reqlib("/app/controllers/authentication.controller");

module.exports = function(app) {
	console.log(chalk.blue("Tenant Admin Route Initialized"));

	app.route("/getQuestions")
		.get(auth.isAuthenticated, tenantAdminController.getQuestions);		
		
}