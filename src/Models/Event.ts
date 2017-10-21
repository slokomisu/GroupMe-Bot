import * as mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventDate: Date,
  eventName: String,
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
