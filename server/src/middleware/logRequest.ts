import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const logPath = path.join(__dirname, '../../audit.log');

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const time = new Date().toISOString();
  const line = `${time} | ${req.ip} |  ${req.originalUrl}\n`;

  fs.appendFileSync(logPath, line);

  next();
};

export default logRequest;
