var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var widget = new Schema({
  position: {type: Number},
  type: {type: String},
  query: {type: String}
});

module.exports = mongoose.model('widget', widget);