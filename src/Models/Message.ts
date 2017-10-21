import * as mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  created_at: {type: Date, default: Date.now},
  group_id: String,
  id: {
    required: true,
    type: String,
    unique: true,
  },
  name: String,
  sender_id: String,
  text: String,

});

const Message = mongoose.model("Message", messageSchema);
export default Message;
