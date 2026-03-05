import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({

  name: String,

  description: String,

  avatar: String,

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

},
{ timestamps: true });

export default mongoose.models.Clubs || mongoose.model("clubs", ClubSchema);