import dotenv from 'dotenv';
dotenv.config();

const keys = {
  dbPass: process.env.DB_PASS,
  dbUser: process.env.DB_USER,
  dbName: process.env.DB_NAME,
  clientUrl: process.env.CLIENT_URL,
  host: process.env.HOST,
  apiKey: process.env.API_KEY,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
};

export default keys;
