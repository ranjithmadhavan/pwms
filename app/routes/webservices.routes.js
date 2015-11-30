var appRoot = require('app-root-path');
var wsController = require(appRoot+"/app/controllers/webservices.controller.js");

module.exports = function(app) {
	console.log(chalk.blue("WebService Route Initialized"));
	app.route("/ws")
		.get(wsController.makeSoapCall); 
}
