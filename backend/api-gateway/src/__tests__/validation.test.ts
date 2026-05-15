import express from 'express';
import request from 'supertest';
import { bettingRoutes } from '../routes/betting';
import { liquidityRoutes } from '../routes/liquidity';
import { governanceRoutes } from '../routes/governance';

// Mock redis to avoid real connection
jest.mock('../config/redis', () => ({
  getOrSet: async (_key: string, _ttl: number, fn: () => Promise<unknown>) => fn(),
  invalidateKey: async () => undefined,
  isRedisConnected: () => false,
}));

const app = express();
app.use(express.json());
app.use('/api/v1/betting', bettingRoutes);
app.use('/api/v1/liquidity', liquidityRoutes);
app.use('/api/v1/governance', governanceRoutes);

describe('POST /api/v1/betting/place validation', () => {
  it('returns 400 when eventId is not a UUID', async () => {
    const res = await request(app)
      .post('/api/v1/betting/place')
      .send({ eventId: 'not-a-uuid', amount: 10, selection: 'home' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when amount is negative', async () => {
    const res = await request(app)
      .post('/api/v1/betting/place')
      .send({ eventId: '550e8400-e29b-41d4-a716-446655440000', amount: -5, selection: 'home' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when selection is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/betting/place')
      .send({ eventId: '550e8400-e29b-41d4-a716-446655440000', amount: 10, selection: 'invalid' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 201 for valid bet', async () => {
    const res = await request(app)
      .post('/api/v1/betting/place')
      .send({ eventId: '550e8400-e29b-41d4-a716-446655440000', amount: 10, selection: 'home' });
    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
  });
});

describe('POST /api/v1/liquidity/deposit validation', () => {
  it('returns 400 when poolId is missing', async () => {
    const res = await request(app)
      .post('/api/v1/liquidity/deposit')
      .send({ amount: 100 });
    expect(res.status).toBe(400);
  });

  it('returns 400 when amount is zero', async () => {
    const res = await request(app)
      .post('/api/v1/liquidity/deposit')
      .send({ poolId: 'pool-1', amount: 0 });
    expect(res.status).toBe(400);
  });

  it('returns 201 for valid deposit', async () => {
    const res = await request(app)
      .post('/api/v1/liquidity/deposit')
      .send({ poolId: 'pool-1', amount: 100 });
    expect(res.status).toBe(201);
  });
});

describe('POST /api/v1/governance/vote validation', () => {
  it('returns 400 when choice is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/governance/vote')
      .send({ proposalId: 'prop-1', choice: 'Yes' });
    expect(res.status).toBe(400);
  });

  it('returns 201 for valid vote', async () => {
    const res = await request(app)
      .post('/api/v1/governance/vote')
      .send({ proposalId: 'prop-1', choice: 'For' });
    expect(res.status).toBe(201);
  });
});
