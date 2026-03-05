import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show"
  },

  rating: Number,

  reviewText: String

},
{ timestamps: true });

export default mongoose.models.Reviews || mongoose.model("reviews", ReviewSchema);