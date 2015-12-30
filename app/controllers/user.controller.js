var errorHandler = reqlib('/app/controllers/errors.server.controller'),
	wsClient = reqlib("/modules/ws/wsClient")

/**
 * Makes the webservice call to get the user profile response
 * 
 * @param  {[type]}   req      [description]
 * @param  {[type]}   res      [description]
 * @param  {[type]}   user     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.selfPasswordReset = function (req, res) {
	console.log("Self password reset called.");
	var passwordSelfResetUrl = envProps.wso2.webservices.user.passwordSelfResetUrl;
	var userName = req.loggedInUser.userId;
	var params = {}
	params.oldPassword = req.body.oldPassword;
	params.newPassword = req.body.newPassword;
	var siteId = req.loggedInUser.tenantMapping;
	if (!userName || !siteId) {
		res.json({errorMsg: "Could not get userid of the user from database"});
	} 
	passwordSelfResetUrl = passwordSelfResetUrl.replaceAll("##USERNAME##",userName+"@"+siteId).replaceAll("##PASSWORD##",oldPassword);	
	wsClient.makeSoapCall(passwordSelfResetUrl, "selfPasswordReset.xml", params)
      .then(function(wsResponse){
      		wsClient.parseResponse(wsResponse,'{"soapenv":"http://www.w3.org/2003/05/soap-envelope"}',"//soapenv:Fault//soapenv:Text/text()").
      			then(function(response){
      				console.log("Response is "+response);
      			});
      		res.send(wsResponse)
      })
      .catch(function(error){        
      		res.status(500).send(error)
      });
}