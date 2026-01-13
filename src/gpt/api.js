import { axios, HEADERS_OPEN_AI } from "../baseImport.js";
import https from "https";

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
});

async function withRetry(fn, maxRetries = 5) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const code = error?.code;
      const status = error?.response?.status;
      
      const isRetryable = 
        code === "ECONNRESET" ||
        code === "ETIMEDOUT" ||
        code === "ECONNREFUSED" ||
        status === 429 ||
        (status >= 500 && status < 600);

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = Math.min(10000, 500 * Math.pow(2, attempt)) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export const gptApi = async (system_prompt, user_data) => {
  const payload = {
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system_prompt },
      { role: 'user', content: JSON.stringify(user_data) }
    ],
  };

  const response = await withRetry(async () => {
    return await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      {
        ...HEADERS_OPEN_AI,
        timeout: 120000,
        httpsAgent,
      }
    );
  });

  return response.data;
}