import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full border-t border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-xl">
      <div className="relative mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="relative flex items-center rounded-[1.75rem] bg-white shadow-qobo ring-1 ring-gray-100 transition-all focus-within:ring-primary/40">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled}
            placeholder="Ask Qobo anything..."
            className="h-16 w-full rounded-[1.75rem] bg-transparent pl-6 pr-16 text-[15px] font-medium text-dark outline-none placeholder:text-gray-400 disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: message.trim() && !disabled ? 1.04 : 1 }}
            whileTap={{ scale: message.trim() && !disabled ? 0.96 : 1 }}
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-orange transition-colors hover:bg-primary-hover disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
            aria-label="Send message"
          >
            <Send size={18} />
          </motion.button>
        </form>
        <p className="mt-2 text-center text-[11px] font-medium text-gray-400">
          Powered by Qobo AI. Verify important business details before acting.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
