import { Request, Response, Router } from 'express';
import checkApiKey from '../middleware/checkApiKey';
import logRequest from '../middleware/logRequest';
import sanitizeQuery, {
  AllowedParamKey,
  allowedParamKeys,
} from '../middleware/sanitizeQuery';
import { FormattedEventType, RawEventType } from '../types';
import { eventsApi } from '../utils/axios';
import getOrSetCache from '../utils/cache';
import handleError from '../utils/error';
import formatEvents from '../utils/events';

const eventRouter = Router();

eventRouter.get('/', checkApiKey, sanitizeQuery, logRequest, getEvents);

async function getEvents(req: Request, res: Response) {
  let cacheName = 'events';
  let key: AllowedParamKey | null = null;
  let value: string | null = null;

  allowedParamKeys.forEach((allowedKey) => {
    if (req[allowedKey]) {
      key = allowedKey;
      value = req[allowedKey];

      cacheName += `?${allowedKey}=${encodeURIComponent(req[allowedKey])}`;
    }
  });

  //this func pulls events from API if the event key isn't already cached in redis

  try {
    const events = await getOrSetCache<FormattedEventType[]>(
      cacheName,

      // this function runs if events arent cached, pulls events and formats them
      async () => {
        const { data } = await eventsApi.get<RawEventType[]>('');

        const formattedEvents = formatEvents(data, key);

        // this key and value pulled from the query params determine how the events are filtered for cache and then sent to frontend

        if (key && value) {
          switch (key) {
            case 'category':
              return formattedEvents.filter((e) =>
                e.genre.some((g) => g.toLowerCase().includes(value!))
              );
            case 'search':
              return formattedEvents.filter(
                (e) =>
                  e.title.toLowerCase().includes(value!) ||
                  e.description.toLowerCase().includes(value!)
              );
            case 'month':
              return formattedEvents.filter(
                (e) => e.monthAndYear.toLowerCase() === value!
              );
            case 'hospitality':
              return formattedEvents.filter((e) => e.hospitalityPackage);
            case 'panthers':
              return formattedEvents.filter((e) =>
                e.genre.some((g) => g.toLowerCase().includes('panthers'))
              );
            default:
              return formattedEvents;
          }
        }

        return formattedEvents;
      }
    );

    res.status(200).json(events);
  } catch (err) {
    handleError(err, res);
  }
}

export default eventRouter;
