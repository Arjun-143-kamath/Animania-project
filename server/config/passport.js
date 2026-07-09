const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const handleOAuthLogin = async (providerIdField, profile, done) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    let user = await User.findOne({ [providerIdField]: profile.id });

    if (user) {
      return done(null, user);
    }

    if (email) {
      user = await User.findOne({ email });
      if (user) {
        // Link to existing account
        user[providerIdField] = profile.id;
        if (!user.avatar && profile.photos && profile.photos.length > 0) {
          user.avatar = profile.photos[0].value;
        }
        await user.save();
        return done(null, user);
      }
    }

    // Create new user
    user = new User({
      email: email || `${profile.id}@${providerIdField}.local`, // fallback if no email
      [providerIdField]: profile.id,
      avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
    });
    
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        handleOAuthLogin('googleId', profile, done);
      }
    )
  );
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback',
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        handleOAuthLogin('githubId', profile, done);
      }
    )
  );
}

module.exports = passport;
