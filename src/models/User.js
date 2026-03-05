import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
  name: String,

  username: {
    type: String,
    unique: true
  },

  email: {
    type: String,
    unique: true
  },

  password: String,

  avatar: String,

  bio: String,

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  joinedClubs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club"
    }
  ]
},
{ timestamps: true }
);

export default mongoose.models.User || mongoose.model("users", UserSchema);