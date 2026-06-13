import React, { useContext } from 'react';
import {
  Bot,
  CalendarClock,
  Globe2,
  LogOut,
  MessageSquare,
  Plus,
  Rocket,
  Smartphone,
  Sparkles,
  User as UserIcon,
  X,
  Zap
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const quickQuestions = [
  { label: 'What is Qobo?', prompt: 'What is Qobo?', icon: Rocket },
  { label: 'Website Builder', prompt: 'Tell me about the Qobo Website Builder.', icon: Globe2 },
  { label: 'AI Agents', prompt: 'How can Qobo AI Agents help my business?', icon: Bot },
  { label: 'Automation', prompt: 'What business workflows can Qobo automate?', icon: Zap },
  { label: 'Mobile Apps', prompt: 'How does Qobo build mobile apps?', icon: Smartphone }
];

const isSameDay = (date, compareDate) =>
  date.getFullYear() === compareDate.getFullYear() &&
  date.getMonth() === compareDate.getMonth() &&
  date.getDate() === compareDate.getDate();

const groupHistory = (history) => {
  const groups = {
    Today: [],
    Yesterday: [],
    Older: []
  };

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  [...history]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .forEach((chat) => {
      const chatDate = new Date(chat.updatedAt || chat.createdAt);
      if (isSameDay(chatDate, today)) groups.Today.push(chat);
      else if (isSameDay(chatDate, yesterday)) groups.Yesterday.push(chat);
      else groups.Older.push(chat);
    });

  return groups;
};

const QoboLogo = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-qobo ring-1 ring-gray-100">
    <span className="font-logo text-[22px] font-extrabold tracking-normal">
      <span className="text-primary">qo</span>
      <span className="text-secondary">bo</span>
    </span>
  </div>
);

const Sidebar = ({ history, onSelectChat, onNewChat, onQuickQuestion, isOpen, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const historyGroups = groupHistory(history);

  return (
    <aside className={`scrollbar-qobo fixed inset-y-0 left-0 z-50 flex w-[19rem] transform flex-col overflow-y-auto border-r border-gray-100 bg-white/95 shadow-float backdrop-blur-xl transition-transform duration-300 ease-out md:relative md:translate-x-0 md:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-5">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <QoboLogo />
            <div>
              <p className="text-lg font-extrabold leading-tight text-dark">Qobo AI</p>
              <p className="text-sm font-semibold text-gray-500">Assistant</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-dark md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-orange transition-colors hover:bg-primary-hover"
        >
          <Plus className="h-5 w-5" />
          New Chat
        </motion.button>
      </div>

      <div className="border-y border-gray-100 px-4 py-5">
        <p className="mb-3 px-2 text-xs font-extrabold uppercase tracking-[0.18em] text-gray-400">Quick Questions</p>
        <div className="space-y-1.5">
          {quickQuestions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => onQuickQuestion(item.prompt)}
                className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-gray-700 transition-all hover:bg-primary-light hover:text-primary"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-light text-primary transition-colors group-hover:bg-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="scrollbar-qobo min-h-[9rem] flex-1 overflow-y-auto px-4 py-5">
        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gray-400">Recent Chats</p>
          <CalendarClock className="h-4 w-4 text-gray-300" />
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-light p-4 text-sm font-medium text-gray-500">
            Your Qobo conversations will appear here.
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(historyGroups).map(([group, chats]) =>
              chats.length > 0 ? (
                <div key={group}>
                  <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-300">{group}</p>
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <button
                        key={chat._id || chat.id || chat.createdAt}
                        onClick={() => {
                          onSelectChat(chat);
                          if (window.innerWidth < 768) toggleSidebar();
                        }}
                        className="group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left text-sm font-semibold text-gray-700 transition-all hover:border-gray-100 hover:bg-white hover:shadow-soft"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                          <MessageSquare className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{chat.question}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="rounded-3xl bg-white p-3 shadow-qobo ring-1 ring-gray-100">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-qobo-gradient text-sm font-extrabold text-white shadow-soft">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-dark">{user?.name || 'Qobo User'}</p>
              <p className="truncate text-xs font-medium text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-light px-3 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
