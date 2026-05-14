import { Router, Request, Response } from 'express';
import { createClient } from 'redis';
import { logger } from '../utils/logger';

export const leaderboardRouter = Router();

const CACHE_TTL = 300; // 5 minutes

// Lazy Redis client reference (injected via module-level setter)
let redisClient: ReturnType<typeof createClient> | null = null;

export function setLeaderboardRedisClient(client: ReturnType<typeof createClient>) {
  redisClient = client;
}

type LeaderboardType = 'profit' | 'winrate' | 'liquidity';
type LeaderboardPeriod = '24h' | '7d' | '30d' | 'all';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  value: number;
  totalBets?: number;
}

/**
 * Build a mock leaderboard. In production this would query the DB.
 * Kept minimal — replace with real DB queries when tables exist.
 */
function buildMockLeaderboard(type: LeaderboardType, period: LeaderboardPeriod): LeaderboardEntry[] {
  const seed = `${type}-${period}`;
  return Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    userId: `user-${seed}-${i + 1}`,
    username: `Player${i + 1}`,
    value: Math.round((1000 - i * 80) * (type === 'winrate' ? 0.01 : 1)),
    totalBets: 50 - i * 4,
  }));
}

/**
 * GET /api/v1/leaderboard
 * Query params:
 *   type   = profit | winrate | liquidity  (default: profit)
 *   period = 24h | 7d | 30d | all          (default: 7d)
 */
leaderboardRouter.get('/', async (req: Request, res: Response) => {
  const type = (req.query.type as LeaderboardType) || 'profit';
  const period = (req.query.period as LeaderboardPeriod) || '7d';

  const validTypes: LeaderboardType[] = ['profit', 'winrate', 'liquidity'];
  const validPeriods: LeaderboardPeriod[] = ['24h', '7d', '30d', 'all'];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
  }
  if (!validPeriods.includes(period)) {
    return res.status(400).json({ error: `Invalid period. Must be one of: ${validPeriods.join(', ')}` });
  }

  const cacheKey = `leaderboard:${type}:${period}`;

  try {
    // Try cache first
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json({ data: JSON.parse(cached), cached: true });
      }
    }

    const data = buildMockLeaderboard(type, period);

    // Store in cache
    if (redisClient) {
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));
    }

    return res.json({ data, cached: false });
  } catch (err) {
    logger.error('Leaderboard error', { err });
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});
