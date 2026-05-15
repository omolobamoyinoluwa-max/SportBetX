import axios from 'axios';
import { logger } from './logger';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

interface FinishedEvent {
  id: string;
  homeScore: number;
  awayScore: number;
  winner: 'home' | 'away' | 'draw';
}

// Dead-letter queue for failed submissions
const deadLetterQueue: Array<{ event: FinishedEvent; attempts: number }> = [];

async function fetchFinishedEvents(): Promise<FinishedEvent[]> {
  const apiKey = process.env.SPORTS_API_KEY;
  const apiUrl = process.env.SPORTS_API_URL || 'https://api-sports.io/fixtures';

  if (!apiKey) {
    logger.warn('SPORTS_API_KEY not set, using mock data');
    return [];
  }

  const { data } = await axios.get<{ response: FinishedEvent[] }>(apiUrl, {
    headers: { 'x-apisports-key': apiKey },
    params: { status: 'FT', date: new Date().toISOString().split('T')[0] },
    timeout: 10000,
  });
  return data.response || [];
}

async function submitToOracle(event: FinishedEvent, attempt = 1): Promise<void> {
  try {
    // TODO: replace with real Stellar SDK contract invocation
    // const server = new StellarSdk.Server(process.env.STELLAR_HORIZON_URL);
    // await server.submitTransaction(buildOracleTx(event));
    logger.info('Oracle submission (stub)', { eventId: event.id, winner: event.winner, attempt });
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      logger.warn(`Oracle submission failed, retrying (${attempt}/${MAX_RETRIES})`, { eventId: event.id, err });
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
      return submitToOracle(event, attempt + 1);
    }
    logger.error('Oracle submission failed after max retries, adding to DLQ', { eventId: event.id, err });
    deadLetterQueue.push({ event, attempts: attempt });
  }
}

export async function pollAndSubmit(): Promise<void> {
  try {
    const events = await fetchFinishedEvents();
    logger.info(`Fetched ${events.length} finished events`);

    await Promise.allSettled(events.map((e) => submitToOracle(e)));

    // Retry DLQ items
    const dlqItems = deadLetterQueue.splice(0);
    for (const item of dlqItems) {
      await submitToOracle(item.event, item.attempts);
    }
  } catch (err) {
    logger.error('Poll cycle failed', { err });
  }
}

export { deadLetterQueue };
