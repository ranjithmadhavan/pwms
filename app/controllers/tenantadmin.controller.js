exports.getQuestions = function(req,res,next) {
	var questions = [
			{
				question: "First Car ?"	
			},
			{
				question: "First Bike ?"	
			},
			{
				question: "Mothers Maiden Name ?"	
			}
	];
	res.json(questions);
}