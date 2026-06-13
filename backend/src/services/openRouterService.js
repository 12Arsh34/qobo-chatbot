/**
 * openRouterService.js
 *
 * Production-ready AI integration using OpenRouter API and Axios.
 * Implements robust error handling, retry logic, timeout, and fallback models.
 */

import axios from 'axios';
import knowledgeBase from './knowledgeBase.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY_MODEL  = 'google/gemini-2.5-flash';
const FALLBACK_MODEL = 'openai/gpt-4o-mini';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const AXIOS_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 1;

// ─── Lazy-loaded initialization ───────────────────────────────────────────────

let isInitialized = false;
let openRouterApiKey = null;

/**
 * Validates the OpenRouter API key lazily.
 * Defers the API key check from module-load time to call time.
 *
 * @throws {Error} if OPENROUTER_API_KEY is not set.
 */
const initOpenRouter = () => {
  if (isInitialized) return;

  openRouterApiKey = process.env.OPENROUTER_API_KEY;

  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  isInitialized = true;
};

// ─── Knowledge base retrieval ─────────────────────────────────────────────────

/**
 * Analyzes the question and returns the most relevant knowledge sections.
 * 1. Always include company context.
 * 2. Add matching categories based on keywords.
 * 3. If no extra category matches, include ALL remaining categories.
 *
 * @param {string} question
 * @returns {string} Targeted context string
 */
const getRelevantContext = (question) => {
  const q = question.toLowerCase();

  // 1. Always include company context
  let contextParts = [`[Company Overview]:\n${knowledgeBase.company.trim()}`];
  let matchedCategories = 0;

  // 2. Check for matches
  const matchesWebsite = q.includes('website') || q.includes('site') || q.includes('web') || q.includes('landing');
  const matchesAgents = q.includes('agent') || q.includes('ai') || q.includes('bot') || q.includes('support') || q.includes('chat');
  const matchesAutomation = q.includes('automat') || q.includes('workflow') || q.includes('repetitive') || q.includes('trigger');
  const matchesMobile = q.includes('app') || q.includes('mobile') || q.includes('ios') || q.includes('android') || q.includes('phone');

  if (matchesWebsite) {
    contextParts.push(`[Website Builder]:\n${knowledgeBase.websiteBuilder.trim()}`);
    matchedCategories++;
  }
  if (matchesAgents) {
    contextParts.push(`[AI Agents]:\n${knowledgeBase.aiAgents.trim()}`);
    matchedCategories++;
  }
  if (matchesAutomation) {
    contextParts.push(`[Business Automation]:\n${knowledgeBase.automation.trim()}`);
    matchedCategories++;
  }
  if (matchesMobile) {
    contextParts.push(`[Mobile Apps]:\n${knowledgeBase.mobileApps.trim()}`);
    matchedCategories++;
  }

  // 3. If no specific category matched, include ALL remaining categories
  if (matchedCategories === 0) {
    contextParts.push(`[Website Builder]:\n${knowledgeBase.websiteBuilder.trim()}`);
    contextParts.push(`[AI Agents]:\n${knowledgeBase.aiAgents.trim()}`);
    contextParts.push(`[Business Automation]:\n${knowledgeBase.automation.trim()}`);
    contextParts.push(`[Mobile Apps]:\n${knowledgeBase.mobileApps.trim()}`);
  }

  return contextParts.join('\n\n') + '\n\n';
};

// ─── Core API Request Logic ───────────────────────────────────────────────────

/**
 * Executes a single request to OpenRouter API.
 * Handles timeouts and response extraction securely.
 *
 * @param {string} modelName
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
const executeRequest = async (modelName, systemPrompt, userMessage) => {
  const startTime = Date.now();
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      },
      {
        timeout: AXIOS_TIMEOUT,
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || "http://localhost:3000",
          'X-Title': "Qobo Knowledge Assistant"
        }
      }
    );

    const duration = Date.now() - startTime;
    console.log(`[OpenRouter] Success | Model: ${modelName} | Duration: ${duration}ms`);

    // Safe extraction using optional chaining
    const content = response?.data?.choices?.[0]?.message?.content;
    
    if (!content || content.trim() === '') {
      throw new Error("No content returned from AI provider");
    }

    return content;

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[OpenRouter] Failure | Model: ${modelName} | Duration: ${duration}ms`);

    // Detailed Error Handling and Categorization
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new Error(`Authentication error (Status: ${status})`);
      } else if (status === 429) {
        throw new Error(`Rate limit error (Status: 429)`);
      } else {
        throw new Error(`Invalid response error (Status: ${status})`);
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error(`Timeout error`);
    } else if (error.request) {
      throw new Error(`Network error`);
    } else {
      throw new Error(`Invalid response error: ${error.message}`);
    }
  }
};

/**
 * Wrapper for executeRequest that implements retry logic.
 * Retries exactly once on Network, Timeout, or Rate Limit errors.
 *
 * @param {string} modelName
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
const callWithRetry = async (modelName, systemPrompt, userMessage) => {
  let attempts = 0;
  
  while (attempts <= MAX_RETRIES) {
    try {
      return await executeRequest(modelName, systemPrompt, userMessage);
    } catch (error) {
      attempts++;
      const msg = error.message.toLowerCase();
      
      const isRetryable = msg.includes('network error') || 
                          msg.includes('timeout error') || 
                          msg.includes('rate limit');
                          
      if (isRetryable && attempts <= MAX_RETRIES) {
        console.log(`[OpenRouter] Retrying model ${modelName} (Attempt ${attempts} of ${MAX_RETRIES}) after error: ${error.message}`);
        continue;
      }
      
      throw error;
    }
  }
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generates an answer to the user's question.
 * Uses primary model, automatically falling back if it fails.
 *
 * @param {string} question - The user's question
 * @returns {Promise<string>} - The generated answer
 */
export const generateAnswer = async (question) => {
  initOpenRouter();

  const relevantContext = getRelevantContext(question);

  const systemPrompt = `You are Qobo Assistant.

You are a product expert for Qobo.

Answer ONLY using the provided context.

Never hallucinate.

Never invent:
* pricing
* integrations
* partnerships
* features not in context

If information is unavailable respond exactly:
"I couldn't find that information in Qobo's knowledge base."

Response style:
* concise
* professional
* business-friendly
* easy to understand

--- QOBO KNOWLEDGE BASE ---
${relevantContext}
--- END CONTEXT ---`;

  try {
    return await callWithRetry(PRIMARY_MODEL, systemPrompt, question);
  } catch (primaryError) {
    console.warn(`[OpenRouter] Primary model (${PRIMARY_MODEL}) failed completely: ${primaryError.message}. Initiating fallback.`);
    
    try {
      return await callWithRetry(FALLBACK_MODEL, systemPrompt, question);
    } catch (fallbackError) {
      throw new Error(`Both AI models failed.\nPrimary: ${primaryError.message}\nFallback: ${fallbackError.message}`);
    }
  }
};
