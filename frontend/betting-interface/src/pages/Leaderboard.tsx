import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Droplets } from 'lucide-react';
import axios from 'axios';

type LeaderboardType = 'profit' | 'winrate' | 'liquidity';
type LeaderboardPeriod = '24h' | '7d' | '30d' | 'all';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  value: number;
  totalBets?: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const TYPE_LABELS: Record<LeaderboardType, { label: string; icon: React.ReactNode; unit: string }> = {
  profit: { label: 'Top Profit', icon: <TrendingUp className="w-4 h-4" />, unit: 'XLM' },
  winrate: { label: 'Win Rate', icon: <Trophy className="w-4 h-4" />, unit: '%' },
  liquidity: { label: 'Liquidity', icon: <Droplets className="w-4 h-4" />, unit: 'XLM' },
};

const PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  '24h': '24h',
  '7d': '7 Days',
  '30d': '30 Days',
  all: 'All Time',
};

async function fetchLeaderboard(type: LeaderboardType, period: LeaderboardPeriod) {
  const { data } = await axios.get<{ data: LeaderboardEntry[] }>(
    `${API_BASE}/api/v1/leaderboard?type=${type}&period=${period}`
  );
  return data.data;
}

export const Leaderboard: React.FC = () => {
  const [type, setType] = useState<LeaderboardType>('profit');
  const [period, setPeriod] = useState<LeaderboardPeriod>('7d');

  const { data, isLoading, isError } = useQuery(
    ['leaderboard', type, period],
    () => fetchLeaderboard(type, period),
    { staleTime: 5 * 60 * 1000 }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Leaderboard
      </h1>

      {/* Type tabs */}
      <div className="flex gap-2 mb-4">
        {(Object.keys(TYPE_LABELS) as LeaderboardType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === t
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {TYPE_LABELS[t].icon}
            {TYPE_LABELS[t].label}
          </button>
        ))}
      </div>

      {/* Period tabs */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(PERIOD_LABELS) as LeaderboardPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              period === p
                ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {isLoading && (
          <div className="p-8 text-center text-gray-500">Loading leaderboard…</div>
        )}
        {isError && (
          <div className="p-8 text-center text-red-500">Failed to load leaderboard.</div>
        )}
        {data && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-right">{TYPE_LABELS[type].label}</th>
                <th className="px-4 py-3 text-right">Bets</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr
                  key={entry.userId}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <td className="px-4 py-3 font-bold text-lg">
                    {MEDAL[entry.rank] ?? `#${entry.rank}`}
                  </td>
                  <td className="px-4 py-3 font-medium">{entry.username}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {entry.value.toLocaleString()} {TYPE_LABELS[type].unit}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{entry.totalBets ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};
