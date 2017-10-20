import * as mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDate: Date,
})

const Event = mongoose.model('Event', eventSchema)
export default Event