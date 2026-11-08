import axios from 'axios';

export const optimizeCode = async (code: string, language: string) => {
  // process.env.NEXT_PUBLIC_API_URL vercel se live link uthayega
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  
  const response = await axios.post(`${API_URL}/api/optimize`, {
    code,
    language,
  });
  return response.data;
};