'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var TenantQuestionSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated : {
		type: Date
	},
	question: {
		type: String,
		default: '',
		trim: true,
		required: 'Question cannot be blank'
	},
	createdBy: {
		type: Schema.ObjectId,
		ref: 'Tenant'
	},
	updatedBy: {
		type: Schema.ObjectId,
		ref: 'Tenant'
	}
});

// Sets the updated time
TenantQuestionSchema.pre('update', function() {
  this.updated = Date.now;
});


mongoose.model('TenantQuestion', TenantQuestionSchema);