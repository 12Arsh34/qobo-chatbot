import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not defined in the environment. Chatbot integrations will fail until configured.');
}

export { genAI };
