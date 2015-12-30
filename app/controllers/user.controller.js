var errorHandler = reqlib('/app/controllers/errors.server.controller'),
	wsClient = reqlib("/modules/ws/wsClient"),	
    cheerio = require('cheerio')

/**
 * Makes the webservice call to get the user profile response
 * 
 * @param  {[type]}   req      [description]
 * @param  {[type]}   res      [description]
 * @param  {[type]}   user     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.selfPasswordReset = function (req, res, next) {
	var passwordSelfResetUrl = envProps.wso2.webservices.user.passwordSelfResetUrl;
	var userName = req.loggedInUser.userId;
	var params = {}
	params.oldPassword = req.body.oldPassword;
	params.newPassword = req.body.newPassword;
	var siteId = req.loggedInUser.tenantMapping;
	if (!userName || !siteId) {
		res.json({errorMsg: "Could not get userid of the user from database"});
	} 
	passwordSelfResetUrl = passwordSelfResetUrl.replaceAll("##USERNAME##",userName+"@"+siteId).replaceAll("##PASSWORD##",params.oldPassword);	
	wsClient.makeSoapCall(passwordSelfResetUrl, "selfPasswordReset.xml", params)
      .then(function(wsResponse){  	
      	var $ = cheerio.load(wsResponse);
      	var errorMessage = $("soapEnv\\:Fault").find("soapEnv\\:Reason").find("soapEnv\\:Text").text();
      	if (errorMessage && errorMessage.length > 0) {
      		return res.status(400).send({message:errorMessage});
      	} else {
      		res.json({message:"Password Changed Successfully"});
      	}
      })
      .catch(function(error){        
      		res.status(500).send(error)
      });
}



