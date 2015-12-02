'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema Schema
 */
var UserSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},	
	updated: {
		type: Date
	},
	userId : {
		type :String
	},
	password : {
		type : String
	},
	tenantMapping : { 
		type:String
	},
	roles: {
		type: [{
			type: String,
			enum: ['ROLE_SUPER', 'ROLE_EDITOR','ROLE_ADMIN','ROLE_USER']
		}],
		default: ['ROLE_USER']
	},
});

UserSchema.statics.findByUserIdAndTenantMapping = function(userId, tenantMapping, callback) {
	var _this = this;
	_this.findOne({userId:userId, tenantMapping:tenantMapping}, function(err,user){
		if (!err) {
			callback(user);
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);