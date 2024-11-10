import axios from 'axios';

// our base URL
const isLocal = window.location.hostname === 'localhost';
const api = axios.create({
  baseURL: isLocal
    ? 'http://127.0.0.1:5001/api/'
    : 'https://project-3-01-beastmode-1fed971de919.herokuapp.com/api/',
  timeout: isLocal ? 2000 : 10000, 
});

if (isLocal) {
  api.interceptors.response.use(
    response => response, 
    async error => {
      // If request fails due to timeout or no response, fall back to remote
      if (error.config && (error.code === 'ECONNABORTED' || error.response === undefined)) {
        console.warn('Local API request failed or timed out. Falling back to remote API...');
        error.config.baseURL = 'https://project-3-01-beastmode-1fed971de919.herokuapp.com/api/';
        try {
          return await axios.request(error.config);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
