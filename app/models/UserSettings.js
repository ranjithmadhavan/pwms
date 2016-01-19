/**
 * Module dependencies.
 */
var restful = require('node-restful'),
	mongoose = restful.mongoose,
	Schema = mongoose.Schema;

var UserSettingsSchema = mongoose.Schema({  
	created: {
		type: Date,
		default: Date.now
	},
	updated : {
		type: Date,
		default:Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required : 'User needs to be associated and cannot be empty'
	},
	alternateEmail: {
		type:String,
		validate: {
			validator : function(v) {
				return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
			},
			message : '{VALUE} is not a valid email address'
		}
	},
	emailValiationToken: {
		type : String
	},
	emailValidated : {
		type:Boolean,
		default:false
	},
	previousPasswords : {
		type : [{
			type : String
		}]
	}
});


restful.model('UserSettings', UserSettingsSchema)
  .methods(['get', 'post', 'put', 'delete']);

