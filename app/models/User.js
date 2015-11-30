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
mongoose.model('User', UserSchema);