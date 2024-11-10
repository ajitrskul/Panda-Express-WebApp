import axios from 'axios';
import Constants from 'expo-constants';

// Safely access expoConfig for detecting local development
const isLocalhost =
  Constants.expoConfig &&
  (Constants.expoConfig?.debuggerHost?.split(':').shift() === 'localhost' ||
   Constants.expoConfig?.debuggerHost?.includes('127.0.0.1'));

// Create an axios instance with a dynamic baseURL
const api = axios.create({
  baseURL: isLocalhost
    ? 'http://127.0.0.1:5001/api/' // Local development URL for your Flask API
    : 'https://project-3-01-beastmode-1fed971de919.herokuapp.com/api/', // Production URL
});

export default api;
