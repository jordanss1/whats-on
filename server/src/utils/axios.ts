import axios from 'axios';
import keys from '../config/keys';

export const eventsApi = axios.create({
  baseURL: 'https://whatson.motorpointarenanottingham.com/api/challenge',
  headers: {
    'X-API-Key': keys.apiKey,
  },
});
