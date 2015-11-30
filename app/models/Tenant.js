'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema Schema
 */
var TenantSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},	
	updated: {
		type: Date
	},
	userName: {
		type: String,
		trim: true
	},
	icon : {
		type:String
	},
	email: {
		type: String,
		default: '',
		trim: true,
		unique:true
	},
	tenantMapping : { 
		type:String,
		unique:true
	},
	roles: {
		type: [{
			type: String,
			enum: ['ROLE_SUPER', 'ROLE_EDITOR','ROLE_ADMIN','ROLE_USER']
		}],
		default: ['ROLE_ADMIN']
	},
});

/**
 * Find possible not used username
 */
TenantSchema.statics.findByEmail = function(email, callback) {
	var _this = this;

	_this.findOne({
		email: email
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(null);
			} else {
				callback(user);
			}
		} else {
			callback(err);
		}
	});
};

mongoose.model('Tenant', TenantSchema);