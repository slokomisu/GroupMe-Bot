const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDate: Date,
})

module.exports = mongoose.model('Event', eventSchema);