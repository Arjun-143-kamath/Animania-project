const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const authMiddleware = require('../middleware/auth');

// All library routes require authentication
router.use(authMiddleware);

router.get('/', libraryController.getLibrary);
router.post('/add', libraryController.addAnime);
router.put('/update', libraryController.updateProgress);
router.put('/move', libraryController.moveCategory);
router.delete('/remove/:mal_id', libraryController.removeAnime);

module.exports = router;
