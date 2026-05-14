import React from 'react';

const SPORTS = ['all', 'football', 'basketball', 'tennis', 'esports'];

interface Props { selectedSport: string; onSportChange: (sport: string) => void; }

export const SportsFilter: React.FC<Props> = ({ selectedSport, onSportChange }) => (
  <div className="flex gap-2">
    {SPORTS.map((s) => (
      <button
        key={s}
        onClick={() => onSportChange(s)}
        className={`px-3 py-1 rounded text-sm capitalize ${selectedSport === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
      >
        {s}
      </button>
    ))}
  </div>
);
