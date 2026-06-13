import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    question: {
      type: String,
      required: [true, 'Question is required']
    },
    answer: {
      type: String,
      required: [true, 'Answer is required']
    }
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
