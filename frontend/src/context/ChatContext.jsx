import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setChats([]);
    }
  }, [user]);

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const response = await api.get('/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error.message);
    } finally {
      setLoadingChats(false);
    }
  };

  const sendQuestion = async (question) => {
    setSendingMessage(true);

    // Optimistically show the user question while waiting
    const tempChat = {
      _id: 'temp-' + Date.now(),
      question,
      answer: null,
      createdAt: new Date().toISOString()
    };
    setChats(prev => [...prev, tempChat]);

    try {
      const response = await api.post('/chats', { question });
      // Replace temp entry with real data
      setChats(prev =>
        prev.map(c => c._id === tempChat._id ? response.data : c)
      );
    } catch (error) {
      console.error('Failed to send question:', error.message);
      // Replace temp with error state
      setChats(prev =>
        prev.map(c =>
          c._id === tempChat._id
            ? { ...c, answer: `Error: ${error.response?.data?.message || 'Connection lost. Please try again.'}` }
            : c
        )
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const deleteChatItem = async (id) => {
    try {
      await api.delete(`/chats/${id}`);
      setChats(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      console.error('Failed to delete chat:', error.message);
    }
  };

  const clearAllHistory = async () => {
    try {
      await api.delete('/chats');
      setChats([]);
    } catch (error) {
      console.error('Failed to clear history:', error.message);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        loadingChats,
        sendingMessage,
        fetchChats,
        sendQuestion,
        deleteChatItem,
        clearAllHistory
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
