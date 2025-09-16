import Redis from 'ioredis';
import { REDIS_URL } from '../../config';

export const redis = new Redis(REDIS_URL);

export async function setSession(token: string, userId: string, ttl = 3600) {
  await redis.set(`sess:${token}`, userId, 'EX', ttl);
}

export async function getSession(token: string) {
  return redis.get(`sess:${token}`);
}

export async function deleteSession(token: string) {
  await redis.del(`sess:${token}`);
}
