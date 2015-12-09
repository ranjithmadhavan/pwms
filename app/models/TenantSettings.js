'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var TenantSettingSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated : {
		type: Date
	},
	createdBy: {
		type: Schema.ObjectId,
		ref: 'Tenant'
	},
	updatedBy: {
		type: Schema.ObjectId,
		ref: 'Tenant'
	},
	idpAdminUserName: {
		type: String,
		default: '',
		trim: true,
		required: 'IDP Admin Name Cannot be blank'
	},
	idpAdminPassword: {
		type: String,
		default: '',
		trim: true,
		required: 'IDP Admin Password Cannot be blank'
	}
});

// Sets the updated time
TenantSettingSchema.pre('update', function() {
	this.update({},{ $set: { updated: new Date() } });
});


mongoose.model('TenantSetting', TenantSettingSchema);