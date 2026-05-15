export type BetType = 'moneyline' | 'spread' | 'total' | 'parlay';
export type OddsFormat = 'decimal' | 'american' | 'fractional';

export interface SportsEvent {
  id: string;
  title: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  startTime: number;
  endTime: number;
  status: 'upcoming' | 'live' | 'finished';
  outcome: 'pending' | 'home' | 'away' | 'draw';
  odds: { home: number; away: number; draw: number };
  volume: number;
}

export interface BetSelection {
  event: SportsEvent;
  selection: string;
  odds: number;
  type: BetType;
}

export interface BetSlipItem extends BetSelection {
  stake?: number;
}
