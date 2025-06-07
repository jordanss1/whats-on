import redisClient from '../services/redis';

async function getOrSetCache<ResponseType>(
  key: string,
  cb: () => Promise<ResponseType>
): Promise<ResponseType> | never {
  try {
    const data = await redisClient.get(key);

    if (data !== null) return JSON.parse(data);

    const freshData = await cb();

    await redisClient.set(key, JSON.stringify(freshData));

    return freshData;
  } catch (err) {
    throw err;
  }
}

export default getOrSetCache;
