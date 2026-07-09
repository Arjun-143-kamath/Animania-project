const mongoose = require('mongoose');

const AnimeProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mal_id: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['WATCHLIST', 'WATCHING', 'COMPLETED'],
    required: true,
  },
  watchedEpisodes: {
    type: Number,
    default: 0,
  },
  currentSeason: {
    type: Number,
    default: 1,
  },
  // Snapshot data to reduce Jikan API calls
  title: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  totalEpisodes: {
    type: Number,
    default: null, // null if unknown
  }
}, {
  timestamps: true
});

// A user should only have one entry per anime
AnimeProgressSchema.index({ userId: 1, mal_id: 1 }, { unique: true });

module.exports = mongoose.model('AnimeProgress', AnimeProgressSchema);
