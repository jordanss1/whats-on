import { AllowedParamKey } from '../middleware/sanitizeQuery';
import { FormattedEventType, RawEventType } from '../types';

function formatEvents(
  events: RawEventType[],
  eventFilter: AllowedParamKey | null = null
): (FormattedEventType & { dates: Date[] })[] {
  const imgUrl = 'https://d2gloyfobyb8yo.cloudfront.net/dbimages/';

  const returnedEvents = events.map(({ id, fields }) => {
    const date = new Date(fields.date);

    const monthAndYear = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });

    const offsale = new Date(fields.offsale_date);
    const onsale = new Date(fields.onsale_date);
    const now = new Date();

    const canEventBeSold = now < offsale && now > onsale;

    return {
      id,
      hospitalityPackage: fields.when.toLowerCase().includes('hospitality'),
      contentIds: fields.content_ids,
      contentId: fields.content_id,
      categoryIds: fields.category_ids,
      canEventBeSold,
      date: fields.date,
      showId: fields.show_id,
      monthAndYear,
      description: fields.description ?? '',
      featureImage: imgUrl + fields.feature_image,
      genre: fields.genre,
      isRetired: Boolean(+fields.is_retired),
      isSoldOut: Boolean(+fields.is_sold_out),
      keywords: fields.keywords,
      offsaleDate: fields.offsale_date,
      onsaleDate: fields.onsale_date,
      purchase: `https://tickets.motorpointarenanottingham.com/shows/Show.aspx?sh=${fields.content_id}`,
      thumbnail: imgUrl + fields.thumbnail,
      title: fields.title ?? '',
      when: fields.when,
    };
  });

  return groupEventsById(returnedEvents, eventFilter);
}

export function groupEventsById(
  events: FormattedEventType[],
  eventFilter: AllowedParamKey | null
): (FormattedEventType & { dates: Date[] })[] {
  const TWO_DAY_MS = 48 * 60 * 60 * 1000;

  let returnedEvents = events.reduce((acc, event) => {
    const ids = event.contentIds ?? [event.contentId];
    const eventDate = new Date(event.date);
    const eventTime = eventDate.getTime();

    let existingKey: null | undefined | string = ids.find((id) => {
      const bucket = acc[id];
      if (!bucket) return false;

      return bucket.dates.some(
        (d) => Math.abs(d.getTime() - eventTime) <= TWO_DAY_MS
      );
    });

    // if no bucket found by ID, try matching on keywords
    if (!existingKey) {
      existingKey =
        Object.keys(acc).find((key) => {
          const bucket = acc[key];

          // must share keywords
          if (bucket?.keywords !== event.keywords) return false;

          // and have at least one existing date within 2 days
          return bucket.dates.some(
            (d) => Math.abs(d.getTime() - eventTime) <= TWO_DAY_MS
          );
        }) ?? null;
    }

    // if still none, create a new bucket in the acc with the first id of this event/time in ms
    if (!existingKey) {
      const dayBucket = Math.floor(eventTime / TWO_DAY_MS);

      existingKey = `${ids[0]}_${dayBucket}`;

      acc[existingKey] = { ...event, dates: [] };
    }

    //  merge into that bucket
    const bucket = acc[existingKey]!;

    // if same date doesn't exist in dates array, push it
    const newDate = new Date(event.date);
    const isDuplicate = bucket.dates.some(
      (d) =>
        d.getFullYear() === newDate.getFullYear() &&
        d.getMonth() === newDate.getMonth() &&
        d.getDate() === newDate.getDate()
    );

    if (event.hospitalityPackage) {
      bucket.hospitalityPackage = true;
    }

    if (!isDuplicate) {
      bucket.dates.push(newDate);
    }

    // map through every ID of this event and point it back to the same bucket object
    ids.forEach((id) => (acc[id] = bucket));

    return acc;
  }, {} as Record<string, FormattedEventType & { dates: Date[] }>);

  // now that we have many contentIds very likely pointing to same events - dedupe by pushing only unique values
  const allValues = Object.values(returnedEvents);
  const uniqueBuckets: (FormattedEventType & { dates: Date[] })[] = [];

  allValues.forEach((event) => {
    if (!uniqueBuckets.includes(event)) {
      uniqueBuckets.push(event);
    }
  });

  uniqueBuckets
    .sort((e1, e2) => e1.dates[0]!.getTime() - e2.dates[0]!.getTime())
    .map((event) => {
      event.dates.sort((a, b) => a.getTime() - b.getTime());

      if (event.dates.length === 1) {
        const date = event.dates[0]!;
        const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'long' });
        const year = date.getFullYear();

        const dateStr = `${weekday} ${day} ${month} ${year}`;
        if (eventFilter === 'panthers') {
          const timeStr = date
            .toLocaleTimeString('en-GB', {
              hour: 'numeric',
              hour12: true,
            })
            .toLowerCase();
          event.date = `${timeStr} – ${dateStr}`;
        } else {
          event.date = dateStr;
        }
      } else {
        // otherwise, format each date as "Wed 25"
        const dayParts = event.dates.map((d) =>
          d.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
          })
        );

        // join each one like "Wed 25, Thu 26 & Fri 27" except for the last one which we '&d'
        const daysString =
          dayParts.length === 2
            ? dayParts.join(' & ')
            : `${dayParts.slice(0, -1).join(', ')} & ${dayParts.slice(-1)}`;

        const monthYear = event.dates![0]!.toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric',
        });

        event.date = `${daysString} ${monthYear}`;
      }

      return event;
    });

  uniqueBuckets.forEach(({ hospitalityPackage }) =>
    console.log({ hospitalityPackage })
  );

  return uniqueBuckets;
}

export default formatEvents;
