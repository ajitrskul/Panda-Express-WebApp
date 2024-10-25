import axios from 'axios';

// our base URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export default api;
