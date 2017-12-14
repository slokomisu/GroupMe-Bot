import * as mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  rouletteStreak: Number,
  rouletteResults: [
    {
      attemptTime: Date,
      attemptResults: {
        type: String,
        enum: ['BANG', 'CLICK']
      }
    }
  ],
  groupmeUserId: Number
});

const Member = mongoose.model("Member", memberSchema);
export default Member;
