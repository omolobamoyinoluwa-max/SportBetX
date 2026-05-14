import React from 'react';
import { SportsEvent, BetSelection } from '../types/sports';

interface Props {
  event: SportsEvent;
  onSelect: (event: SportsEvent, selection: string, odds: number) => void;
  selectedEvents: BetSelection[];
  formatOdds: (odds: number) => string;
}

export const EventCard: React.FC<Props> = ({ event, onSelect, selectedEvents, formatOdds }) => {
  const isSelected = (sel: string) => selectedEvents.some((s) => s.event.id === event.id && s.selection === sel);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
        {event.status === 'live' && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">LIVE</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(['home', 'draw', 'away'] as const).map((sel) => (
          <button
            key={sel}
            onClick={() => onSelect(event, sel, event.odds[sel])}
            className={`py-2 rounded text-sm font-medium transition-colors ${
              isSelected(sel) ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-100'
            }`}
          >
            {sel.toUpperCase()} {formatOdds(event.odds[sel])}
          </button>
        ))}
      </div>
    </div>
  );
};
