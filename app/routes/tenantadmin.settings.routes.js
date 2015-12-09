var tenantAdminController = reqlib("/app/controllers/tenantadmin.controller");
var auth = reqlib("/app/controllers/authentication.controller");

module.exports = function(app) {
	console.log(chalk.blue("Tenant Admin Settings Route Initialized"));

	app.route("/settings")
		.get(auth.isAuthenticated, tenantAdminController.setttingsList)
		.post(auth.isAuthenticated, tenantAdminController.createSettings);

	app.route('/settings/:settingsId')
		.get(tenantAdminController.getTenantSettingById)
		.put(auth.isAuthenticated, tenantAdminController.hasAuthorizationToEditSettings, tenantAdminController.updateTenantSetting);

	// Finish by binding the settings middleware
	app.param('settingsId', tenantAdminController.populateSettingsInRequest);
		
}