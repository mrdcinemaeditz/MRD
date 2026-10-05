import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mrd_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Attach session token for anonymous view tracking
  let sessionToken = localStorage.getItem('mrd_session_token');
  if (!sessionToken) {
    sessionToken = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('mrd_session_token', sessionToken);
  }
  config.headers['X-Session-Token'] = sessionToken;

  return config;
});

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on expired or invalid session
      if (localStorage.getItem('mrd_token')) {
        localStorage.removeItem('mrd_token');
        localStorage.removeItem('mrd_user');
        window.dispatchEvent(new Event('mrd-auth-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
