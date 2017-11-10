var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    Widget = require('widget');

var dashboard = new Schema({
  title:    { type: String },
  position: { type: Number },
  type: { type: String },
  userId: {type: String},
  period: {type: String},
  widgets: [Widget]
});

module.exports = mongoose.model('dashboard', dashboard);