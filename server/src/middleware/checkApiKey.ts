import { NextFunction, Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import db from '../services/mysql';

const checkApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    res
      .status(403)
      .json({ error: 'You must provide an api key in X-API-Key header' });
    return;
  }

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT api_key FROM api_keys WHERE api_key=?`,
    [apiKey]
  );

  if (!rows?.length) {
    res.status(403).json({ error: 'Invalid API key' });
    return;
  }

  next();
};

export default checkApiKey;
