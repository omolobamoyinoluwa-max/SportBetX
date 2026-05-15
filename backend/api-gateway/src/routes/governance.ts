import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { logger } from '../utils/logger';

export const governanceRoutes = Router();

// Mock proposals
const mockProposals = [
  {
    id: 'prop-1',
    title: 'Reduce platform fee from 2% to 1.5%',
    description: 'Proposal to reduce the platform fee to attract more users.',
    status: 'active',
    votesFor: 1500,
    votesAgainst: 300,
    votesAbstain: 100,
    endTime: new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'prop-2',
    title: 'Add esports betting markets',
    description: 'Expand platform to include esports events.',
    status: 'active',
    votesFor: 2000,
    votesAgainst: 500,
    votesAbstain: 200,
    endTime: new Date(Date.now() + 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

governanceRoutes.get('/proposals', (_req: Request, res: Response) => {
  res.json({ data: mockProposals });
});

governanceRoutes.get('/proposals/:id', (req: Request, res: Response) => {
  const proposal = mockProposals.find((p) => p.id === req.params.id);
  if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
  return res.json({ data: proposal });
});

// POST /api/v1/governance/vote - with validation (issue #18)
governanceRoutes.post(
  '/vote',
  [
    body('proposalId').isString().notEmpty().withMessage('proposalId is required'),
    body('choice').isIn(['For', 'Against', 'Abstain']).withMessage('choice must be For, Against, or Abstain'),
  ],
  validate,
  async (req: Request, res: Response) => {
    const { proposalId, choice } = req.body as { proposalId: string; choice: string };
    try {
      // TODO: submit vote to Stellar smart contract
      logger.info('Vote cast', { proposalId, choice });
      res.status(201).json({
        data: { proposalId, choice, status: 'submitted', createdAt: new Date().toISOString() },
      });
    } catch (err) {
      logger.error('Failed to cast vote', { err });
      res.status(500).json({ error: 'Failed to cast vote' });
    }
  }
);

// POST /api/v1/governance/proposals - create proposal
governanceRoutes.post(
  '/proposals',
  [
    body('title').isString().notEmpty().isLength({ max: 200 }).withMessage('title is required (max 200 chars)'),
    body('description').isString().notEmpty().withMessage('description is required'),
  ],
  validate,
  async (req: Request, res: Response) => {
    const { title, description } = req.body as { title: string; description: string };
    try {
      const proposal = {
        id: `prop-${Date.now()}`,
        title,
        description,
        status: 'pending',
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        endTime: new Date(Date.now() + 7 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      logger.info('Proposal created', { proposal });
      res.status(201).json({ data: proposal });
    } catch (err) {
      logger.error('Failed to create proposal', { err });
      res.status(500).json({ error: 'Failed to create proposal' });
    }
  }
);
