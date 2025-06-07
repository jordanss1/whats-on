import { Express, Request } from 'express';

declare global {
  export namespace Express {
    export interface Request {
      category?: string;
      search?: string;
      hospitality?: string;
      month?: string;
      panthers?: string;
    }
  }
}
