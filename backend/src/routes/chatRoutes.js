import express from 'express';
import {
  askQuestion,
  getChatHistory,
  deleteChat
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All chat routes are protected
router.use(protect);

// @route   POST /api/chat/ask
router.post('/ask', askQuestion);

// @route   GET /api/chat/history
router.get('/history', getChatHistory);

// @route   DELETE /api/chat/:id
router.delete('/:id', deleteChat);

export default router;
