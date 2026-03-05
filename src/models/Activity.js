import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  type: {
    type: String,
    enum: [
      "watch_progress",
      "review",
      "follow",
      "club_join"
    ]
  },

  targetId: mongoose.Schema.Types.ObjectId,

  metadata: Object

},
{ timestamps: true });

export default mongoose.models.User || mongoose.model("User", ActivitySchema);