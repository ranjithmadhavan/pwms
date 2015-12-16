/**
 * Module dependencies.
 */
var restful = require('node-restful'),
	mongoose = restful.mongoose;

var TodoSchema = mongoose.Schema({
  name: String,
  completed: Boolean,
  note: String,
  updated_at: { type: Date, default: Date.now },
});


restful.model('Todo', TodoSchema)
  .methods(['get', 'post', 'put', 'delete']);

