import { ValidateResponse } from '@pkg/grpc/auth/v1/session';

declare global {
  namespace Express {
    interface Request {
      user?: ValidateResponse & { token?: string };
    }
  }
}

export {};
