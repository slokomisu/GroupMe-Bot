const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  created_at: Date,
  group_id: String,
  name: String,
  sender_id: String,
  text: String,

}, {_id: false})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;