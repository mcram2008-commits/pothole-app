// API Configuration for deployment
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getImageUrl = (imagePath) => {
  const baseUrl = API_URL.replace('/api', '');
  return `${baseUrl}${imagePath}`;
};
