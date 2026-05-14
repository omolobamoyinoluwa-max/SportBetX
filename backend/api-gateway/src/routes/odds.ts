import { Router, Request, Response } from 'express';
import { getOrSet } from '../config/redis';
import { logger } from '../utils/logger';

export const oddsRoutes = Router();

const ODDS_TTL = 5; // seconds (issue #15)

oddsRoutes.get('/:eventId', async (req: Request, res: Response) => {
  const { eventId } = req.params;
  try {
    const odds = await getOrSet(`odds:${eventId}`, ODDS_TTL, async () => ({
      eventId,
      home: 180,
      away: 200,
      draw: 350,
      updatedAt: new Date().toISOString(),
    }));
    res.json({ data: odds });
  } catch (err) {
    logger.error('Failed to fetch odds', { err, eventId });
    res.status(500).json({ error: 'Failed to fetch odds' });
  }
});
