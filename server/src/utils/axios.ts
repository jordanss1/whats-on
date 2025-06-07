import axios from 'axios';
import keys from '../config/dev';

export const eventsApi = axios.create({
  baseURL: 'https://whatson.motorpointarenanottingham.com/api/challenge',
  headers: {
    'X-API-Key': keys.apiKey,
  },
});
