import axios from 'axios';

export const optimizeCode = async (code: string, language: string) => {
  // localhost ki jagah seedha 127.0.0.1 use kar rahe hain taake network issue na aaye
  const response = await axios.post('http://127.0.0.1:8000/api/optimize', {
    code,
    language,
  });
  return response.data;
};