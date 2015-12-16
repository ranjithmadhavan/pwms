var restful = require('node-restful'), 
	Todo = restful.model("Todo");

module.exports = function(app) {
	console.log(chalk.blue("Todo  Route Initialized"));

	
	Todo.register(app, "/todo");
	

}