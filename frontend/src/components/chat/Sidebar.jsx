import React from 'react';
import { Trash2, MessageSquare, History } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import Button from '../common/Button';

const Sidebar = ({ onClose }) => {
  const {
    chats,
    deleteChatItem,
    clearAllHistory,
    loadingChats
  } = useChat();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteChatItem(id);
  };

  return (
    <div className="flex flex-col h-full w-full bg-dark-900 border-r border-slate-800/50 p-4">
      {/* Label for History segment */}
      <div className="flex items-center space-x-2 px-2 py-2 mb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
        <History size={12} />
        <span>Chat History</span>
      </div>

      {/* History scroll list panel */}
      <div className="flex-1 overflow-y-auto space-y-1.5 py-2 pr-0.5">
        {loadingChats ? (
          <div className="flex flex-col items-center justify-center h-24 space-y-2">
            <div className="animate-spin h-5 w-5 border-2 border-slate-700 border-t-brand-500 rounded-full" />
            <span className="text-xs text-slate-500 font-medium">Loading history...</span>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-10 px-4 font-medium leading-relaxed">
            No chat history yet.<br/>Ask Qobo a question to get started.
          </div>
        ) : (
          chats.map(chat => (
            <div
              key={chat._id}
              className="group flex items-center justify-between px-3 py-3 rounded-xl border border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition-all"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <MessageSquare size={16} className="text-slate-500 shrink-0" />
                <p className="text-xs font-semibold truncate leading-tight">
                  {chat.question.substring(0, 50)}{chat.question.length > 50 ? '...' : ''}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, chat._id)}
                className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ml-1.5 shrink-0"
                aria-label="Delete chat"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Delete actions footer panel */}
      {chats.length > 0 && (
        <div className="pt-4 border-t border-slate-800/50">
          <Button
            variant="danger"
            onClick={clearAllHistory}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-xs"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
