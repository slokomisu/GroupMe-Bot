const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  created_at: {type: Date, default: Date.now}
  group_id: String,
  name: String,
  sender_id: String,
  text: String,

})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
