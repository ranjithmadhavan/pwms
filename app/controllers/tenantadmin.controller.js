var TenantQuestion = mongoose.model("TenantQuestion"),
	TenantSetting = mongoose.model("TenantSetting"),
	errorHandler = reqlib('/app/controllers/errors.server.controller');
/**
 * Get settings of the logged in tenant.
 */
exports.setttingsList = function(req, res, next) {
	TenantSetting.findOne({createdBy:req.loggedInUser}, function(err, tenantSettings){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if (!tenantSettings) {
				tenantSettings = new TenantSetting({

				});
			}
			res.json(tenantSettings);
		}
	});
}

/**
 * Create Settings for a tenant
 */

exports.createSettings = function(req, res) {
	var tenantSettings = new TenantSetting(req.body);
	tenantSettings.createdBy(req.loggedInUser);
	tenantSettings.save(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tenantSettings);
		}
	});
}

/**
 * Settings middleware
 */
exports.populateSettingsInRequest = function(req, res, next, id) {
	TenantSetting.findById(id).populate('createdBy').exec(function(err, tenantSetting) {
		if (err) return next(err);
		if (!tenantSetting) return next(new Error('Failed to load tenantSetting ' + id));
		req.tenantSetting = tenantSetting;
		next();
	});
};

exports.getTenantSettingById = function(req, res) {
	return res.json(req.tenantSetting);
}


/**
 * Update a article
 */
exports.updateTenantSetting = function(req, res) {
	var tenantSetting = req.tenantSetting;

	tenantSetting = _.extend(tenantSetting, req.body);

	tenantSetting.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tenantSetting);
		}
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorizationToEditSettings = function(req, res, next) {
	if (req.settings.createdBy._id !== req.loggedInUser._id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

exports.getQuestions = function(req,res,next) {	
	TenantQuestion.find({createdBy:req.loggedInUser._id}, function(err, questions){
		if (err) {			
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(questions);	
		}
	});
}

exports.addQuestion = function(req,res,next) {
	var questionToAdd = req.body.question;
	var tenantId = req.loggedInUser._id;
	var tenantQuestion = new TenantQuestion({
		question : questionToAdd,
		createdBy : tenantId,
		updatedBy : tenantId
	});
	tenantQuestion.save(function(err){
		if (err) {
			// res.status(400).json(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			TenantQuestion.find({createdBy:req.loggedInUser._id}, function(err, questions){
				if (err) {
					next(err, req, res);
				} else {
					res.json(questions);	
				}
			});			
		}
	});
}

exports.modifyQuestion = function(req,res,next) {
	var tenantId = req.loggedInUser._id;
	var questionFromDb = TenantQuestion.findById(req.body._id, function(err, question){		
		question.question = req.body.question;
		question.save(function(err){
			if (err) {				
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {	
				TenantQuestion.find({createdBy:req.loggedInUser._id}, function(err, questions){
					if (err) {
						res.status(400).json(err);
					} else {
						res.json(questions);	
					}
				});				
			}
		});	
	});
}


exports.deleteQuestion = function(req,res,next) {
	TenantQuestion.remove({_id:req.body._id},function(err){
		if (!err) {	
			TenantQuestion.find({createdBy:req.loggedInUser._id}, function(err, questions){
				if (err) {					
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json(questions);	
				}
			});
		} else {			
			res.status(400).json(err);
		}
	})
} 
