import axios from 'axios';

// our base URL
const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:5001/api/'
    : 'https://project-3-01-beastmode-1fed971de919.herokuapp.com/api/',
});

export default api;
