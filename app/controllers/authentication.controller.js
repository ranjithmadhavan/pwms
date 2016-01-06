var request = require('request'),
	reqopts = {
	    url : envProps.quicklaunch.restapi.authurl,
	    method:'POST',
	    rejectUnauthorized: false, 
	    headers :{
	         "Content-Type " : "application/x-www-form-urlencoded"
	    },
	    formData: {email:'quicklaunchadmin@quicklaunchsso.com',password : 'quicklaunchadmin'}
	},
	jwt = require('jsonwebtoken'),
	Tenant = mongoose.model("Tenant"),
	User = mongoose.model("User"),
	async = require('async'),
	wsClient = reqlib("/modules/ws/wsClient")


/**
 * Function to authenticate the tenant against the qlsso middleware server using the 
 * email and password registered.
 * 
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
var authenticateAgainstQuickLaunch = function(email, password) {	
	return new Promise(function(resolve, reject){
		if (envProps.environment === 'development') {
			var testDataPath =  require('app-root-path').resolve('config/testData/tenant.json');			
			var user = require('fs').readFileSync(testDataPath);
			resolve(JSON.parse(user).tenant);
		} else {
			reqopts.formData.email = email;
			reqopts.formData.password = password;
			request(reqopts, function(error, response, body){
				if(error) {
		        	console.log("Error is "+error);
		            reject(error);
		        } else {
		            if (body && JSON.parse(body)) {	            	
		            	if (JSON.parse(body).authenticated) {
		            		resolve(JSON.parse(body).tenant)
		            	} else {
		            		reject(JSON.parse(body).errorMsg);
		            	}
		            } else {
		            	reject("Authentication failed due to unknown reason");
		            }
		        }
		    }); 
		}
	});	 
}

exports.authenticate = function(req, res) {
	authenticateAgainstQuickLaunch(req.body.userName,req.body.password)
		.then(function(tenant){			
			addUserToDatabase(tenant)
			.then(function(){
				tenant.icon = "";
				jwt.sign({userId:tenant.email, tenantMapping:null, role:"ROLE_ADMIN"}, envProps.jwt.secret, { expiresIn: envProps.jwt.expiresIn }, function(token) {			  
					return res.json({id: tenant.userName, user : {id:tenant.userName, role: "ROLE_ADMIN"}, token:token });	
				});
			});
		})
		.catch(function(error){
			console.log("Authentication failed due to "+error);
			return res.status(403).json({errorMsg: error});
		})
}

exports.profile = function(req, res) {
	// Get the user's password
	// Get the users profile using webservice call
	// send the response
	async.waterfall([
			function(callback){
				callback(null, req, res);
			},
			fetchUserFromDb,
			fetchUserAttributes,
			formatResult
		],
		function(err){
		      if (err) {
		        console.log("Error is "+err);
		        return res.status(500).json({errorMsg: "Unknown error "+err});
		      } else {
		        console.log("No Error");
		      }
		}
		);
}

/**
 * Gets the user from the database based on userid and tenant mapping
 * 
 * @param  {[type]}   req      [description]
 * @param  {[type]}   res      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function fetchUserFromDb (req, res, callback) {
	if (req.loggedInUser.tenantMapping && req.loggedInUser.tenantMapping.trim() !== "") {
		User.findOne({"userId": req.loggedInUser.userId, "tenantMapping":req.loggedInUser.tenantMapping}, function(err, user){
			if (err) {
				callback(err);
			} else {			
				callback(null, req, res, user);
			}
		});
	} else {
		return res.status(403).json({errorMsg: "Cannot get profile for admin user"});
	}
}

/**
 * Makes the webservice call to get the user profile response
 * 
 * @param  {[type]}   req      [description]
 * @param  {[type]}   res      [description]
 * @param  {[type]}   user     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function fetchUserAttributes(req, res, user, callback) {
	var userProfileUrl = envProps.wso2.webservices.user.login.url;
	var userName = user.userId;
	var password = user.password;
	var siteId = user.tenantMapping;
	if (!userName || !password || !siteId) {
		return res.json({errorMsg: "Could not get userid of the user from database"});
	} 
	userProfileUrl = userProfileUrl.replaceAll("##USERNAME##",userName+"@"+siteId).replaceAll("##PASSWORD##",password);
	wsClient.makeSoapCall(userProfileUrl, "userLogin.xml", null)
      .then(function(wsResponse){
      		// Get Attribute Keys
      		var keys = new Promise(function(resolve, reject){      			
	      		wsClient.parseResponse(wsResponse, '{"ax2307" : "http://dto.mgt.identity.carbon.wso2.org/xsd"}',"//ax2307:claimUri/text()")
	      			.then(function(parsedResponse){
	      				resolve(parsedResponse);
	      			}); 
      		});
      		// Get Attribute Values
      		var values = new Promise(function(resolve, reject){      			
	      		wsClient.parseResponse(wsResponse, '{"ax2307" : "http://dto.mgt.identity.carbon.wso2.org/xsd"}',"//ax2307:claimValue/text()")
	      			.then(function(parsedResponse){
	      				resolve(parsedResponse);
	      			});
      		}); 
      		// Once we get both keys and values return the result
      		Promise.all([keys, values])
      			.then(function(result){
        			callback(null, req, res, result);
      			});
      })
      .catch(function(error){
        callback(error);
      });
}

function formatResult(req, res, result, callback) {
	var keys = result[0];
	var values = result[1];
	var valueToReturn = {};
	keys.forEach(function(element, index, array){
		var lastIndexOfSlash = element.data.lastIndexOf("/")+1;		
		valueToReturn[element.data.substring(lastIndexOfSlash).capitalize()] = values[index].data;
	});
	res.json({userAttributes:valueToReturn});
}


/**
 * Middleware function to validate JWT
 *  
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.isAuthenticated = function(req,res,next) {
  	// check header or url parameters or post parameters for token
  	var token = req.body.token || req.query.token || req.headers['x-access-token'];
  	if (token) {
  		// verifies secret and checks exp
	    jwt.verify(token, envProps.jwt.secret, function(err, decoded) {      
	      if (err) {
	        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	        // if everything is good, save to request for use in other routes
	        if (decoded.tenantMapping && decoded.tenantMapping !== null && decoded.tenantMapping.trim() !== "") {
	        	User.findByUserIdAndTenantMapping(decoded.userId, decoded.tenantMapping, function(user){
			        req.loggedInUser = user;    
			        next();	
	        	});
	        } else {
	        	Tenant.findByEmail(decoded.userId, function(user){ 
	        		req.loggedInUser = user;    
			        next();	
	        	});
	        }
	      }
	    });
		
  	} else {
  		// if there is no token
	    // return an error
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });
  	}

}

var addUserToDatabase = function(userFromQuickLaunch) {
	return new Promise(function(resolve, reject){		
		if (userFromQuickLaunch) {
			// Check whether the user exists in our system.
			Tenant.findOne({email:userFromQuickLaunch.email}, function(err, user){
				if (err) {
					// Just log the error.
					console.log(chalk.red("Error occured while searching for during the post authentication process")); 
					resolve();
				} else {
					if (!user) {
						var newUser = new Tenant({
							userName:userFromQuickLaunch.userName,
							icon:"",
							email:userFromQuickLaunch.email,
							tenantMapping:userFromQuickLaunch.tenantMapping,
							roles:['ROLE_ADMIN']
						});
						newUser.save(function(err,user){
							if (err) {
								console.log(chalk.red("could not save user into the user db due to "+err));
								resolve();
							} else {
								if (user) {
									console.log("New User added to the Database");
									resolve();
								}
							}
						})
					} else {
						console.log("User "+userFromQuickLaunch.email+" already exists in our system. No need to add.")
						resolve();
					}
				}
			});		
		} else {
			resolve();
		}
	});
}

/**
 * While loggin in a user these are the steps that we perform
 * 1) Check whether there is a registered siteid
 * 2) Yes Try and authenticate the user against wso2
 * 3) If the login is successful create the user in our local database.
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.login = function(req, res, next) {	
	var loginUrl = envProps.wso2.webservices.user.login.url;
	var userName = req.body.userName;
	var siteId = req.body.siteId;
	var password = req.body.password;
	if (!userName || !password || !siteId) {
		return res.status(403).json({errorMsg: "Provide UserName, Password & SiteId"});
	} 
	loginUrl = loginUrl.replaceAll("##USERNAME##",userName+"@"+siteId).replaceAll("##PASSWORD##",password);
	// If there is a registred tenant then try and authenticate the user
	async.waterfall([
	    // First Check whether the site id is registered.
	    function(callback) {      
	      Tenant.count({"tenantMapping":siteId}, function(err, count){
	        callback(err,count);
	      })
	    },
	    // Invoke the login service. Rather the get claims rule.    
	    function(count,callback) {
	      if (count > 0) {
	        wsClient.makeSoapCall(loginUrl, "userLogin.xml", null)
	          .then(function(response){
	            callback(null, response);
	          })
	          .catch(function(error){
	            callback(error);
	          });
	      } else {
	      	return res.status(403).json({errorMsg:"Site id not registered"});
	      }
	    },
	    // Parse the response and see whether there are any errors.
	    function(loginResult, callback) {
	      wsClient.parseResponse(loginResult, '{"soapenv":"http://www.w3.org/2003/05/soap-envelope"}', "//soapenv:Fault//soapenv:Text/text()")
	        .then(function(result){	        	
	          callback(null, result)
	        })
	        .catch(function(err){
	          callback(err);
	        });
	    },
	    // If no errors add the user to the user db.
	    function(faultResponse, callback) {
	      if (faultResponse && faultResponse.length > 0) {
	        return res.status(403).json({errorMsg: "Invalid UserId and/or Password"});
	      } else {
	        User.findOne({"tenantMapping":siteId, userId: userName}, function(err, user){	        	
	        	if (user) {
	        		console.log("user already exists. Update password");
	        		user.password = password;
	        		user.save();
	        		jwt.sign({userId:user.userId, tenantMapping:siteId, role:"ROLE_USER"}, envProps.jwt.secret, { expiresIn: envProps.jwt.expiresIn }, function(token) {			  
	        			return res.json({id: userName, user : {id:userName, role: "ROLE_USER"} , token:token });		        			
					});	
	        	} else {
	        		console.log("Fresh sign in. Adding user "+userName)
	        		var newUser = new User({
	        			userId : userName,
	        			password : password,
	        			tenantMapping: siteId
	        		});
	        		newUser.save(function(err, user) {
	        			if (!err) {
			        		jwt.sign({userId:user.userId, tenantMapping:siteId, role:"ROLE_USER"}, envProps.jwt.secret, { expiresIn: envProps.jwt.expiresIn }, function(token) {			  
			        			return res.json({id: userName, user : {id:userName, role: "ROLE_USER"}, token:token });	
							});	        				
	        			} else {
	        				console.log("Error while adding new user "+userName+" due to "+err);
	        				return res.status(403).json({errorMsg:"Cannot Sign in due to "+err});
	        			}		
	        		});
	        	}
	        });
	      }
	    }
	    //
	  ], function(err){
	      if (err) {
	        console.log("Error is "+err);
	        return res.status(500).json({errorMsg: "Unknown error "+err});
	      } else {
	        console.log("No Error");
	      }
	});
	
}
