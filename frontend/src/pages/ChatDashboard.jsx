import React, { useEffect, useRef } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import Spinner from '../components/common/Spinner';
import { Sparkles } from 'lucide-react';

const ChatDashboard = () => {
  const {
    chats,
    sendQuestion,
    sendingMessage,
    loadingChats
  } = useChat();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, sendingMessage]);

  const handleSendMessage = (content) => {
    sendQuestion(content);
  };

  const suggestions = [
    { text: 'Write a JavaScript function to debounce search entries', label: 'Algorithms' },
    { text: 'What are the main security benefits of HttpOnly Cookies?', label: 'Security' },
    { text: 'Draft a professional apology note to clients for unexpected maintenance', label: 'Support' },
    { text: 'Suggest three innovative ideas for improving chatbot engagement', label: 'Brainstorm' }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-dark-950 overflow-hidden relative">
        {loadingChats ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-dark-950">
            <Spinner size="md" />
            <span className="text-xs text-slate-500 font-semibold tracking-wider">Loading chat history...</span>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

            {/* Scrollable Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

              {chats.length === 0 && !sendingMessage ? (
                /* Welcome Splash */
                <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full py-8">
                  <div className="h-16 w-16 rounded-3xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-6 shadow-xl shadow-brand-500/5 animate-bounce">
                    <Sparkles size={28} />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-sans">
                    Meet Qobo
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
                    Your highly articulate full-stack knowledge assistant. Ask questions, explore code bases, or request draft suggestions.
                  </p>

                  {/* Quick Suggestions Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                    {suggestions.map((sug, i) => (
                      <div
                        key={i}
                        onClick={() => handleSendMessage(sug.text)}
                        className="glass-panel text-left p-4 rounded-2xl cursor-pointer hover:bg-slate-800/40 border border-slate-800/40 hover:border-brand-500/30 transition-all hover:scale-[1.01]"
                      >
                        <span className="inline-block text-[9px] font-bold tracking-wider uppercase text-brand-400 mb-2 bg-brand-500/10 px-2.5 py-0.5 rounded-lg border border-brand-500/10">
                          {sug.label}
                        </span>
                        <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-relaxed">
                          {sug.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Render Q&A pairs */
                chats.map((chat) => (
                  <div key={chat._id}>
                    {/* User Question */}
                    <ChatBubble message={{ role: 'user', content: chat.question, timestamp: chat.createdAt }} />

                    {/* Gemini Answer */}
                    {chat.answer ? (
                      <ChatBubble message={{ role: 'model', content: chat.answer, timestamp: chat.createdAt }} />
                    ) : (
                      /* Loading indicator while waiting for answer */
                      <div className="flex w-full justify-start mb-4">
                        <div className="flex items-start max-w-[85%] space-x-3.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-400">
                            <div className="animate-spin h-4 w-4 border-2 border-slate-700 border-t-brand-400 rounded-full" />
                          </div>
                          <div className="px-4 py-3 rounded-2xl glass-panel shadow-lg flex items-center space-x-2.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qobo is thinking</span>
                            <span className="flex space-x-1">
                              <span className="h-1.5 w-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }} />
                              <span className="h-1.5 w-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.8s' }} />
                              <span className="h-1.5 w-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.8s' }} />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer Panel */}
            <div className="p-4 border-t border-slate-800/40 bg-dark-950/60 backdrop-blur-md">
              <div className="max-w-3xl mx-auto w-full">
                <ChatInput onSend={handleSendMessage} disabled={sendingMessage} />
                <p className="text-[10px] text-center text-slate-500 mt-2.5 font-medium leading-normal">
                  Powered by Google Gemini-1.5-Flash. Please cross-reference critical info.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ChatDashboard;
