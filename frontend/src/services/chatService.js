import api from './api';

export const askQuestion = async (message) => {
  const response = await api.post('/chat/ask', { message });
  return response.data;
};

export const getChatHistory = async () => {
  const response = await api.get('/chat/history');
  return response.data;
};

export const deleteChat = async (id) => {
  const response = await api.delete(`/chat/${id}`);
  return response.data;
};
