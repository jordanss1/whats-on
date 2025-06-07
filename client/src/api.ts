import axios from 'axios';
import { EventType } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'X-API-Key': import.meta.env.VITE_CACHE_API_KEY,
  },
});

const allowedParamKeys = [
  'category',
  'search',
  'hospitality',
  'month',
  'panthers',
];

export const axiosGetCache = async (
  filter: Record<string, string> | null
): Promise<EventType[]> => {
  let query = '';

  if (filter) {
    const keys = Object.keys(filter);

    let key = keys[0];

    query = allowedParamKeys.includes(key) ? `?${key}=${filter[key]}` : '';
  }

  const { data } = await api.get(`/events${query}`);

  return data;
};

export const axiosGetCategories = async (): Promise<string[]> => {
  const { data } = await api.get(`/events/categories`);

  return data;
};

export const axiosGetMonths = async (): Promise<string[]> => {
  const { data } = await api.get(`/events/months`);

  return data;
};
