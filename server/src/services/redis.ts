import { createClient } from 'redis';
import keys from '../config/keys';

const redisHost = keys.redisHost;
const redisPort = +keys.redisPort;

const client = createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function startRedis() {
  await client.connect();
}

startRedis();

export default client;
