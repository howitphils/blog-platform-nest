import { Request } from 'express';

declare global {
  interface RequestWithUser extends Request {
    user: { id: string };
  }
}

declare global {
  interface RequestWithOptionalUser extends Request {
    user: { id: string } | null;
  }
}
