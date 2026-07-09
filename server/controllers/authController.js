const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Not all fields have been entered' });
    }

    if (password.length < 5) {
      return res.status(400).json({ message: 'The password needs to be at least 5 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();

      res.status(201).json({
        token: generateToken(savedUser._id),
        user: {
          id: savedUser._id,
          email: savedUser.email,
          username: savedUser.username,
          avatar: savedUser.avatar,
          titleLanguage: savedUser.titleLanguage,
          defaultLibraryView: savedUser.defaultLibraryView,
        },
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Not all fields have been entered' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account with this email has been registered' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        titleLanguage: user.titleLanguage,
        defaultLibraryView: user.defaultLibraryView,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.oauthCallback = (req, res) => {
  // Successful authentication, issue JWT
  const token = generateToken(req.user._id);
  const user = {
    id: req.user._id,
    email: req.user.email,
    username: req.user.username,
    avatar: req.user.avatar,
    titleLanguage: req.user.titleLanguage,
    defaultLibraryView: req.user.defaultLibraryView,
  };
  
  // URL encode the user object to pass safely in query string
  const userParam = encodeURIComponent(JSON.stringify(user));
  
  // Redirect to frontend auth callback route
  res.redirect(`http://localhost:3000/auth/callback?token=${token}&user=${userParam}`);
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, titleLanguage, defaultLibraryView } = req.body;
    const updateData = {};

    if (username !== undefined) updateData.username = username;
    if (titleLanguage) updateData.titleLanguage = titleLanguage;
    if (defaultLibraryView) updateData.defaultLibraryView = defaultLibraryView;

    // Handle avatar upload via multer
    if (req.file) {
      updateData.avatar = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    if (newPassword.length < 5) {
      return res.status(400).json({ message: 'The new password needs to be at least 5 characters long' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'You signed up with an external provider and do not have a password set.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
