import dotenv from 'dotenv';
import cron from 'node-cron';
import express from 'express';
import { logger } from './logger';
import { pollAndSubmit } from './oracle';

dotenv.config();

const app = express();
const PORT = process.env.ORACLE_PORT || 3050;

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'oracle-service', timestamp: new Date().toISOString() });
});

// Poll every 60 seconds (issue #16)
cron.schedule('*/60 * * * * *', async () => {
  logger.info('Oracle poll triggered');
  await pollAndSubmit();
});

app.listen(PORT, () => {
  logger.info(`Oracle service running on port ${PORT}`);
  // Run once on startup
  pollAndSubmit().catch((err) => logger.error('Initial poll failed', { err }));
});
