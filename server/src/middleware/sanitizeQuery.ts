import { NextFunction, Request, Response } from 'express';

export const allowedParamKeys = [
  'category',
  'search',
  'hospitality',
  'month',
  'panthers',
] as const;

export type AllowedParamKey = (typeof allowedParamKeys)[number];

const sanitizeQuery = (req: Request, res: Response, next: NextFunction) => {
  for (const [key, value] of Object.entries(req.query)) {
    if (allowedParamKeys.includes(key as AllowedParamKey)) {
      if (typeof value === 'string') {
        req[key as AllowedParamKey] = value;
      }
    }
  }

  next();
};

export default sanitizeQuery;
