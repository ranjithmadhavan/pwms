var TenantQuestion = mongoose.model("TenantQuestion"),
	errorHandler = reqlib('/app/controllers/errors.server.controller')

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
