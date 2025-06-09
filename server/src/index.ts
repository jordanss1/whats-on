import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import keys from './config/keys';
import categoriesRouter from './routes/categories';
import eventRouter from './routes/events';
import monthsRouter from './routes/months';
import types from './types/express';

const app: Express = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: keys.clientUrl,
    allowedHeaders: ['Content-Type', 'X-API-Key'],
  })
);

app.use('/api/events', eventRouter);

//retrieve categories for select dropdown

app.use('/api/events/categories', categoriesRouter);

//retrieve months for select dropdown

app.use('/api/events/months', monthsRouter);

const PORT = process.env.PORT || 3000;

process.env.NODE_ENV = 'production';

app.listen(PORT);
