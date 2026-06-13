import Chat from '../models/Chat.js';
import { generateAnswer } from '../services/openRouterService.js';

/**
 * @desc    Ask a question to the Qobo Knowledge Assistant
 * @route   POST /api/chat/ask
 * @access  Private
 */
export const askQuestion = async (req, res, next) => {
  try {
    // 1. Verify authenticated user exists (req.user is attached by protect middleware)
    if (!req.user || !req.user._id) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
    }

    // 2. Read message from request body
    const { message } = req.body;

    // 3. Validate message
    if (!message || message.trim() === '') {
      const error = new Error('Message is required');
      error.statusCode = 400;
      throw error;
    }

    // 4. Call generateAnswer(message) from geminiService.js
    const answer = await generateAnswer(message);

    // 5. Save chat to MongoDB
    const chat = await Chat.create({
      userId: req.user._id,
      question: message,
      answer: answer
    });

    // 6. Return response
    res.status(201).json({
      success: true,
      answer: chat.answer,
      chatId: chat._id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chat history for logged in user
 * @route   GET /api/chat/history
 * @access  Private
 */
export const getChatHistory = async (req, res, next) => {
  try {
    // Only return user's chats, sort newest first
    const chats = await Chat.find({ userId: req.user._id })
      .select('question answer createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      chats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a specific chat
 * @route   DELETE /api/chat/:id
 * @access  Private
 */
export const deleteChat = async (req, res, next) => {
  try {
    // Find the chat first to check ownership
    const chat = await Chat.findById(req.params.id);

    // Return 404 if chat not found
    if (!chat) {
      const error = new Error('Chat not found');
      error.statusCode = 404;
      throw error;
    }

    // User can delete only their own chat - Return 403 if belongs to another user
    if (chat.userId.toString() !== req.user._id.toString()) {
      const error = new Error('Forbidden: You can only delete your own chats');
      error.statusCode = 403;
      throw error;
    }

    await Chat.deleteOne({ _id: chat._id });

    res.json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
