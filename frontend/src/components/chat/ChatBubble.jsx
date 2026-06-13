import React, { useState } from 'react';
import { Copy, Check, User } from 'lucide-react';
import { motion } from 'framer-motion';

const QAvatar = () => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-qobo ring-1 ring-gray-100">
    <span className="font-logo text-lg font-extrabold">
      <span className="text-primary">q</span>
      <span className="text-secondary">o</span>
    </span>
  </div>
);

const ChatBubble = ({ message }) => {
  const isModel = message.role === 'model';
  const [copied, setCopied] = useState(false);

  // Basic markdown parser for bold, line breaks, and simple lists
  const renderContent = (text) => {
    if (!text) return '';

    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      let trimmed = line.trim();

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2);
        return (
          <li key={lIdx} className="ml-4 list-disc text-[15px] text-gray-700 my-1 leading-relaxed">
            {parseInlineMarkdown(content)}
          </li>
        );
      }

      if (line === '') {
        return <div key={lIdx} className="h-2" />;
      }

      return (
        <p key={lIdx} className="text-[15px] text-gray-800 leading-7 my-1.5">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text) => {
    const boldRegex = /\*\*([\s\S]*?)\*\*/g;
    const parts = text.split(boldRegex);

    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-dark">{part}</strong>;
      }
      return part;
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'} mb-6 group`}
    >
      <div className={`flex max-w-[90%] items-start gap-3 sm:max-w-[76%] ${!isModel ? 'flex-row-reverse' : ''}`}>
        {isModel ? (
          <QAvatar />
        ) : (
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-dark text-white shadow-soft">
            <User size={17} />
          </div>
        )}

        <div className={`relative rounded-[1.4rem] px-5 py-4 ${
          isModel
            ? 'rounded-tl-md border border-gray-100 bg-white shadow-qobo'
            : 'rounded-tr-md bg-primary-light text-dark shadow-orange-soft ring-1 ring-primary/10'
        }`}>
          {isModel ? (
            <div className="max-w-none pr-6">
              {renderContent(message.content)}
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-[15px] font-medium leading-7">{message.content}</p>
          )}

          <div className={`flex items-center justify-between mt-3 ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className={`text-[11px] font-bold ${isModel ? 'text-gray-400' : 'text-primary'}`}>
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>

            {isModel && (
              <button
                onClick={handleCopy}
                className="rounded-full p-1 text-gray-400 opacity-0 transition-all duration-200 hover:bg-primary-light hover:text-primary focus:outline-none group-hover:opacity-100"
                title="Copy response"
              >
                {copied ? <Check size={14} className="text-secondary" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
