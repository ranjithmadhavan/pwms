module.exports = function() {
	// Create a super user for the system if super user does not exist	
	var	Tenant = mongoose.model('Tenant');

	/*User.findOne({email:"ranjith.madhavan@gmail.com"}, function(error, user){
		if (error) {
			console.log("Error occured while searching for super user"+error);
		} else {
			if (!user)
				createSuperUser();
			else 
				console.log(chalk.green("Super User already existing in system. Do nothing."));
		}
	});*/

	/**
	 * Creates a super user.
	 * @return {[type]} [description]
	 */
	function createSuperUser() {
		console.log("No User Create Super user ");
	}
}

