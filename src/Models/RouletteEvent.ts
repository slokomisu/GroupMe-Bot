import * as mongoose from 'mongoose';

const rouletteEventSchema = new mongoose.Schema({
    userId: Number,
    attemptTime: {
        type: Date,
        default: Date.now
    },
    result: {
        type: String,
        enum: ['BOOM', 'CLICK']
    },
});

const RouletteEvent = mongoose.Model('RouletteEvent', rouletteEventSchema);
export default RouletteEvent;