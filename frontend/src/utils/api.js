import axios from 'axios';
const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const api = axios.create({ baseURL: `${BASE}/api` });

// Her istekte token ekle
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('shopai_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;
export { BASE };
