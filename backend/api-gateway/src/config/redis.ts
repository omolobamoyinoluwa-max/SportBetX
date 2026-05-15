import { createClient } from 'redis';
import { logger } from '../utils/logger';

export type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient | null = null;

export async function connectRedis(): Promise<void> {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  client = createClient({ url });

  client.on('error', (err) => logger.error('Redis error', { err }));
  client.on('reconnecting', () => logger.warn('Redis reconnecting'));

  try {
    await client.connect();
    logger.info('Redis connected');
  } catch (err) {
    logger.warn('Redis unavailable, caching disabled', { err });
    client = null;
  }
}

export function getRedisClient(): RedisClient | null {
  return client;
}

export async function disconnectRedis(): Promise<void> {
  if (client) {
    await client.quit();
    client = null;
  }
}

/**
 * Cache-aside helper. Fetches from cache; on miss calls fn(), stores result.
 * Degrades gracefully if Redis is unavailable.
 */
export async function getOrSet<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  if (client) {
    try {
      const cached = await client.get(key);
      if (cached !== null) return JSON.parse(cached) as T;
    } catch (err) {
      logger.warn('Redis get failed, falling through to source', { key, err });
    }
  }

  const value = await fn();

  if (client) {
    try {
      await client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
      logger.warn('Redis set failed', { key, err });
    }
  }

  return value;
}

export async function invalidateKey(key: string): Promise<void> {
  if (client) {
    try {
      await client.del(key);
    } catch (err) {
      logger.warn('Redis del failed', { key, err });
    }
  }
}

export function isRedisConnected(): boolean {
  return client !== null && client.isReady;
}
