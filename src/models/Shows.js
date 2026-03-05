import mongoose from "mongoose";

const ShowSchema = new mongoose.Schema({

  title: String,

  type: {
    type: String,
    enum: ["anime","tv","movie"]
  },

  poster: String,

  description: String,

  totalEpisodes: Number,

  genres: [String],

  releaseYear: Number,

  rating: Number
});

export default mongoose.models.Shows || mongoose.model("shows", ShowSchema);