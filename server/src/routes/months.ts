import { Request, Response, Router } from 'express';
import checkApiKey from '../middleware/checkApiKey';
import redisClient from '../services/redis';
import { FormattedEventType, RawEventType } from '../types';
import { eventsApi } from '../utils/axios';
import getOrSetCache from '../utils/cache';
import formatEvents from '../utils/events';

const monthsRouter = Router();

monthsRouter.get('/', checkApiKey, getMonths);

async function getMonths(req: Request, res: Response) {
  const months = await getOrSetCache<string[]>('events/months', async () => {
    let events = await redisClient.get('events');
    let formattedEvents;

    if (events !== null) {
      formattedEvents = JSON.parse(events) as FormattedEventType[];
    } else {
      const { data } = await eventsApi.get<RawEventType[]>('');

      formattedEvents = formatEvents(data);
    }

    const months = formattedEvents.flatMap((event) => event.monthAndYear);

    const uniqueMonths = [...new Set(months)];

    await redisClient.set('events/months', JSON.stringify(uniqueMonths));

    return uniqueMonths;
  });

  res.json(months);
}

export default monthsRouter;
