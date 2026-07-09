const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    // Password is not required if the user signed up via OAuth
    required: false,
  },
  googleId: {
    type: String,
    default: null,
  },
  githubId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    trim: true,
    default: null,
  },
  titleLanguage: {
    type: String,
    enum: ['english', 'romaji'],
    default: 'english',
  },
  defaultLibraryView: {
    type: String,
    enum: ['WATCHLIST', 'WATCHING', 'COMPLETED'],
    default: 'WATCHING',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
