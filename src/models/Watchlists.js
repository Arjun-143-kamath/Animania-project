import mongoose from "mongoose"

const WatchlistSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show"
  },

  status: {
    type: String,
    enum: ["watching","completed","planned","dropped"]
  },

  progress: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    min: 1,
    max: 10
  }

},
{ timestamps: true });

export default mongoose.models.Watchlists || mongoose.model("watchlists", WatchlistsSchema);