import React from 'react';
import { SportsEvent } from '../types/sports';

export const LiveScore: React.FC<{ event: SportsEvent }> = ({ event }) => (
  <div className="flex justify-between text-sm py-1">
    <span className="text-gray-700 dark:text-gray-300">{event.title}</span>
    <span className="text-red-500 font-medium">LIVE</span>
  </div>
);
