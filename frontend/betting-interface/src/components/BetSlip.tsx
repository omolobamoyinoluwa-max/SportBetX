import React from 'react';
import { BetSlipItem } from '../types/sports';

interface Props {
  betSlip: BetSlipItem[];
  onPlaceBet: () => void;
  onRemoveBet: (index: number) => void;
  formatOdds: (odds: number) => string;
}

export const BetSlip: React.FC<Props> = ({ betSlip, onPlaceBet, onRemoveBet, formatOdds }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
    <h2 className="font-semibold mb-3">Bet Slip ({betSlip.length})</h2>
    {betSlip.length === 0 ? (
      <p className="text-sm text-gray-500">No selections yet.</p>
    ) : (
      <>
        {betSlip.map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
            <div className="text-sm">
              <div className="font-medium">{item.event.title}</div>
              <div className="text-gray-500">{item.selection} @ {formatOdds(item.odds)}</div>
            </div>
            <button onClick={() => onRemoveBet(i)} className="text-red-500 text-xs">✕</button>
          </div>
        ))}
        <button onClick={onPlaceBet} className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          Place Bet
        </button>
      </>
    )}
  </div>
);
