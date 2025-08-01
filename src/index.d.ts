import { Request } from 'express';

declare global {
  interface RequestWithUser extends Request {
    user: { id: string };
  }
}
