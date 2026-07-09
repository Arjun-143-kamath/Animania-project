const AnimeProgress = require('../models/AnimeProgress');

// Get all library entries for the user
exports.getLibrary = async (req, res) => {
  try {
    const library = await AnimeProgress.find({ userId: req.user.id });
    res.status(200).json(library);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add an anime to the library
exports.addAnime = async (req, res) => {
  try {
    const { mal_id, category, title, image_url, totalEpisodes } = req.body;

    // Check if it already exists
    const existing = await AnimeProgress.findOne({ userId: req.user.id, mal_id });
    if (existing) {
      return res.status(400).json({ message: 'Anime already in library' });
    }

    const newAnime = new AnimeProgress({
      userId: req.user.id,
      mal_id,
      category,
      title,
      image_url,
      totalEpisodes,
      watchedEpisodes: category === 'COMPLETED' ? (totalEpisodes || 0) : 0
    });

    const saved = await newAnime.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update episode/season progress
exports.updateProgress = async (req, res) => {
  try {
    const { mal_id, watchedEpisodes, currentSeason } = req.body;

    const anime = await AnimeProgress.findOne({ userId: req.user.id, mal_id });
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found in library' });
    }

    if (watchedEpisodes !== undefined) anime.watchedEpisodes = watchedEpisodes;
    if (currentSeason !== undefined) anime.currentSeason = currentSeason;

    // Auto-complete if watched all episodes
    if (anime.totalEpisodes && anime.watchedEpisodes >= anime.totalEpisodes) {
       anime.category = 'COMPLETED';
       anime.watchedEpisodes = anime.totalEpisodes;
    }

    const updated = await anime.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change category
exports.moveCategory = async (req, res) => {
  try {
    const { mal_id, category } = req.body;

    const anime = await AnimeProgress.findOne({ userId: req.user.id, mal_id });
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found in library' });
    }

    anime.category = category;
    
    // Auto-update episodes if moved to completed
    if (category === 'COMPLETED' && anime.totalEpisodes) {
      anime.watchedEpisodes = anime.totalEpisodes;
    }

    const updated = await anime.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove from library
exports.removeAnime = async (req, res) => {
  try {
    const { mal_id } = req.params;

    const deleted = await AnimeProgress.findOneAndDelete({ userId: req.user.id, mal_id });
    if (!deleted) {
      return res.status(404).json({ message: 'Anime not found in library' });
    }

    res.status(200).json({ message: 'Anime removed from library' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
