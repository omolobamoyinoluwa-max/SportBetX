import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const oracleRoutes = Router();

oracleRoutes.get('/status', (_req: Request, res: Response) => {
  res.json({
    data: {
      status: 'running',
      lastPoll: new Date().toISOString(),
      pendingSubmissions: 0,
    },
  });
});

oracleRoutes.get('/events/finished', (_req: Request, res: Response) => {
  try {
    // TODO: query oracle service for finished events
    res.json({ data: [] });
  } catch (err) {
    logger.error('Failed to fetch finished events', { err });
    res.status(500).json({ error: 'Failed to fetch finished events' });
  }
});
