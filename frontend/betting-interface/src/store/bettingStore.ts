import { create } from 'zustand';
import { SportsEvent, BetSelection, BetSlipItem, OddsFormat } from '../types/sports';

interface BettingState {
  events: SportsEvent[];
  selectedEvents: BetSelection[];
  betSlip: BetSlipItem[];
  oddsFormat: OddsFormat;
  setEvents: (events: SportsEvent[]) => void;
  setSelectedEvents: (events: BetSelection[]) => void;
  setBetSlip: (slip: BetSlipItem[]) => void;
  setOddsFormat: (format: OddsFormat) => void;
  placeBet: () => Promise<void>;
}

export const useBettingStore = create<BettingState>((set) => ({
  events: [],
  selectedEvents: [],
  betSlip: [],
  oddsFormat: 'decimal',
  setEvents: (events) => set({ events }),
  setSelectedEvents: (selectedEvents) => set({ selectedEvents }),
  setBetSlip: (betSlip) => set({ betSlip }),
  setOddsFormat: (oddsFormat) => set({ oddsFormat }),
  placeBet: async () => {
    // TODO: submit to API
    set({ betSlip: [], selectedEvents: [] });
  },
}));
