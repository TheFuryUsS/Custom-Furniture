// Arxiu per cridar l'api i tenir-ho unificat

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.Authorization = token;
}

export default api;