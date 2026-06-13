import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  Globe2,
  Menu,
  RefreshCw,
  Rocket,
  Smartphone,
  Sparkles,
  Trash2,
  Zap
} from 'lucide-react';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import Sidebar from '../components/layout/Sidebar';
import { askQuestion, getChatHistory } from '../services/chatService';

const FeatureCards = ({ onSelect }) => {
  const features = [
    {
      id: 1,
      title: 'Website Builder',
      prompt: 'How can Qobo help me generate websites through simple conversations?',
      icon: Globe2,
      desc: 'Generate websites through simple conversations.',
      accent: 'bg-primary-light text-primary'
    },
    {
      id: 2,
      title: 'AI Agents',
      prompt: 'How can Qobo AI Agents support customers and generate leads?',
      icon: Bot,
      desc: 'Customer support and lead generation.',
      accent: 'bg-secondary-light text-secondary'
    },
    {
      id: 3,
      title: 'Automation',
      prompt: 'How can Qobo automate repetitive workflows for my business?',
      icon: Zap,
      desc: 'Automate repetitive workflows.',
      accent: 'bg-primary-light text-primary'
    },
    {
      id: 4,
      title: 'Mobile Apps',
      prompt: 'How can Qobo help me build Android and iOS applications?',
      icon: Smartphone,
      desc: 'Build Android and iOS applications.',
      accent: 'bg-secondary-light text-secondary'
    }
  ];

  return (
    <motion.div
      className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {features.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 + index * 0.06 }}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(item.prompt)}
            className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 text-left shadow-qobo transition-shadow duration-300 hover:shadow-float"
          >
            <span className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-secondary/15 transition-transform duration-300 group-hover:scale-125" />
            <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${item.accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mb-2 text-base font-extrabold text-dark transition-colors group-hover:text-primary">
              {item.title}
            </h3>
            <p className="text-sm font-medium leading-6 text-gray-500">{item.desc}</p>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

const HeroEmptyState = ({ onSelect }) => (
  <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-4 py-12">
    <motion.span
      className="absolute left-[8%] top-[14%] h-20 w-20 rounded-full bg-primary/15 blur-sm"
      animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.span
      className="absolute right-[10%] top-[20%] h-16 w-16 rounded-[1.6rem] bg-secondary/20"
      animate={{ y: [0, 14, 0], rotate: [8, -8, 8] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.span
      className="absolute bottom-[18%] left-[18%] h-10 w-10 rounded-full border-8 border-secondary/20"
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative z-10 flex flex-col items-center text-center"
    >
      <div className="mb-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-gray-600 shadow-qobo ring-1 ring-gray-100">
        <Sparkles className="h-4 w-4 text-primary" />
        Qobo AI Knowledge Assistant
      </div>
      <h1 className="max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] text-dark sm:text-6xl lg:text-7xl">
        Build Your Business with <span className="text-gradient">AI</span>
      </h1>
      <p className="mt-6 max-w-2xl text-balance text-lg font-medium leading-8 text-gray-500">
        Ask Qobo about websites, mobile apps, AI agents and business automation.
      </p>
    </motion.div>

    <FeatureCards onSelect={onSelect} />
  </div>
);

const Chat = () => {
  const [history, setHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getChatHistory();
      setHistory(data.chats || []);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat, isLoading]);

  const handleSendMessage = async (text) => {
    if (!text?.trim() || isLoading) return;

    const question = text.trim();
    const userMessage = {
      role: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };

    setCurrentChat((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await askQuestion(question);
      const aiMessage = {
        role: 'model',
        content: data.answer,
        timestamp: new Date().toISOString()
      };
      setCurrentChat((prev) => [...prev, aiMessage]);
      fetchHistory();
    } catch (error) {
      setCurrentChat((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChat = (chat) => {
    setCurrentChat([
      { role: 'user', content: chat.question, timestamp: chat.createdAt },
      { role: 'model', content: chat.answer, timestamp: chat.updatedAt }
    ]);
  };

  const handleNewChat = () => {
    setCurrentChat([]);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleQuickQuestion = (prompt) => {
    handleSendMessage(prompt);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-dark">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar
        history={history}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onQuickQuestion={handleQuickQuestion}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(false)}
      />

      <main className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_left,rgba(242,138,67,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(118,209,196,0.16),transparent_32%),#FFFFFF]">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-dark md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-dark sm:text-lg">Qobo Knowledge Assistant</h2>
                <span className="hidden items-center gap-1.5 rounded-full bg-secondary-light px-2.5 py-1 text-xs font-extrabold text-secondary sm:flex">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-secondary-light px-2.5 py-1 text-xs font-extrabold text-secondary sm:hidden">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Online
            </span>
            {currentChat.length > 0 && (
              <button
                onClick={handleNewChat}
                className="hidden items-center gap-2 rounded-full bg-light px-3 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-primary-light hover:text-primary sm:flex"
              >
                <RefreshCw className="h-4 w-4" />
                New
              </button>
            )}
            {currentChat.length > 0 && (
              <button
                onClick={() => setCurrentChat([])}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
          </div>
        </header>

        <section className="scrollbar-qobo relative min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto flex h-full max-w-5xl flex-col">
            {currentChat.length === 0 ? (
              <HeroEmptyState onSelect={handleSendMessage} />
            ) : (
              <div className="pb-8 pt-4">
                <div className="mb-6 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-gray-500 shadow-soft ring-1 ring-gray-100">
                  <Rocket className="h-4 w-4 text-primary" />
                  Qobo AI Knowledge Assistant
                </div>
                {currentChat.map((msg, index) => (
                  <ChatBubble key={index} message={msg} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </section>

        <div className="bg-gradient-to-t from-white via-white to-transparent pt-5">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Chat;
