import * as grpc from '@grpc/grpc-js';
import {
  SessionServiceService,
  ValidateRequest,
  ValidateResponse,
} from '@pkg/grpc/auth/v1/session';
import { validateSession } from '../../service/auth';
import { GRPC_PORT } from '../../config';

export function startGrpcServer() {
  const server = new grpc.Server();

  server.addService(SessionServiceService, {
    validate: async (
      call: grpc.ServerUnaryCall<ValidateRequest, ValidateResponse>,
      callback: grpc.sendUnaryData<ValidateResponse>,
    ) => {
      const token = call.request.token;
      if (!token) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Token is required',
        });
      }

      const user = await validateSession(token);

      if (!user) {
        return callback({
          code: grpc.status.UNAUTHENTICATED,
          message: 'Invalid session',
        });
      }

      callback(null, {
        id: user.id,
        username: user.username,
        email: user.email || '',
        fullName: user.full_name || '',
        phone: user.phone || '',
        address: user.address || '',
        profilePicture: user.profile_picture || '',
        createdAt: user.created_at ? new Date(user.created_at) : undefined,
        updatedAt: user.updated_at ? new Date(user.updated_at) : undefined,
        role: user.role,
      });
    },
  });

  server.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) throw err;
    console.log(`gRPC server running on port ${port}`);
  });
}
