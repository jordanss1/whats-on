import { Request, Response, Router } from 'express';
import checkApiKey from '../middleware/checkApiKey';
import redisClient from '../services/redis';
import { FormattedEventType, RawEventType } from '../types';
import { eventsApi } from '../utils/axios';
import getOrSetCache from '../utils/cache';
import formatEvents from '../utils/events';

const categoriesRouter = Router();

categoriesRouter.get('/', checkApiKey, getCategories);

async function getCategories(req: Request, res: Response) {
  const categories = await getOrSetCache<string[]>(
    'events/categories',
    async () => {
      let events = await redisClient.get('events');
      let formattedEvents;

      if (events !== null) {
        formattedEvents = JSON.parse(events) as FormattedEventType[];
      } else {
        const { data } = await eventsApi.get<RawEventType[]>('');

        formattedEvents = formatEvents(data);
      }

      const filteredGenres = formattedEvents.flatMap((event) =>
        event.genre
          .map((g) => g.trim().toLowerCase())
          .filter((g) => g !== 'user preferences')
          .map((g) => g.charAt(0).toUpperCase() + g.slice(1))
      );

      const uniqueCategories = [...new Set(filteredGenres)];

      await redisClient.set(
        'events/categories',
        JSON.stringify(uniqueCategories)
      );

      return uniqueCategories;
    }
  );

  res.json(categories);
}

export default categoriesRouter;
