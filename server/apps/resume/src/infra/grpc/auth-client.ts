import { credentials, ServiceError, status } from '@grpc/grpc-js';
import { SessionServiceClient, ValidateResponse } from '@pkg/grpc/auth/v1/session';
import { AUTH_GRPC_URL } from '../../config';

const client = new SessionServiceClient(AUTH_GRPC_URL, credentials.createInsecure());

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export async function validateSessionToken(token: string): Promise<ValidateResponse> {
  return new Promise((resolve, reject) => {
    client.validate({ token }, (err, response) => {
      if (err) {
        if ((err as ServiceError).code === status.UNAUTHENTICATED) {
          return reject(new AuthenticationError(err.message));
        }
        return reject(err);
      }
      if (!response) {
        return reject(new Error('Empty response from Auth service'));
      }
      resolve(response);
    });
  });
}
