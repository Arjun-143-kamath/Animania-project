const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');

// Get comments for an anime
router.get('/:mal_id', async (req, res) => {
  try {
    const { mal_id } = req.params;
    const comments = await Comment.find({ mal_id })
      .populate('user', 'username email avatar')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// Add a comment
router.post('/:mal_id', authMiddleware, async (req, res) => {
  try {
    const { mal_id } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    if (text.length > 500) {
      return res.status(400).json({ message: 'Comment exceeds 500 characters' });
    }

    const comment = new Comment({
      mal_id,
      user: req.user.id,
      text: text.trim(),
    });

    await comment.save();
    
    // Populate user info before returning
    await comment.populate('user', 'username email avatar');
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Edit a comment
router.put('/:comment_id', authMiddleware, async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    if (text.length > 500) {
      return res.status(400).json({ message: 'Comment exceeds 500 characters' });
    }

    const comment = await Comment.findById(comment_id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Ensure the user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = text.trim();
    await comment.save();
    
    await comment.populate('user', 'username email avatar');
    
    res.json(comment);
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ message: 'Failed to edit comment' });
  }
});

// Delete a comment
router.delete('/:comment_id', authMiddleware, async (req, res) => {
  try {
    const { comment_id } = req.params;
    
    const comment = await Comment.findById(comment_id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Ensure the user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(comment_id);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

module.exports = router;
