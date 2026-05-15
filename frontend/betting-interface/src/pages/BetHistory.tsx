import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useWalletStore } from '../store/walletStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Bet {
  id: string;
  eventTitle: string;
  sport: string;
  selection: string;
  amount: number;
  odds: number;
  status: 'pending' | 'won' | 'lost';
  payout: number;
  createdAt: string;
}

interface HistoryResponse {
  data: Bet[];
  pagination: { page: number; pageSize: number; total: number };
  summary: { totalStaked: number; totalWon: number; roi: number };
}

function exportCSV(bets: Bet[]) {
  const header = 'ID,Event,Sport,Selection,Amount,Odds,Status,Payout,Date';
  const rows = bets.map((b) =>
    [b.id, b.eventTitle, b.sport, b.selection, b.amount, b.odds, b.status, b.payout, b.createdAt].join(',')
  );
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'bet-history.csv'; a.click();
  URL.revokeObjectURL(url);
}

export const BetHistory: React.FC = () => {
  const { account } = useWalletStore();
  const [status, setStatus] = useState('');
  const [sport, setSport] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<HistoryResponse>(
    ['bet-history', account, status, sport, page],
    async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (status) params.set('status', status);
      if (sport) params.set('sport', sport);
      const addr = account || 'demo';
      const { data } = await axios.get<HistoryResponse>(`${API_BASE}/api/v1/betting/${addr}/history?${params}`);
      return data;
    },
    { keepPreviousData: true }
  );

  const summary = data?.summary;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bet History</h1>

      {/* P&L Summary */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Staked', value: `${summary.totalStaked} XLM` },
            { label: 'Total Won', value: `${summary.totalWon} XLM` },
            { label: 'ROI', value: `${summary.roi.toFixed(1)}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center">
              <div className="text-sm text-gray-500">{label}</div>
              <div className="text-xl font-bold mt-1">{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
        <input value={sport} onChange={(e) => { setSport(e.target.value); setPage(1); }}
          placeholder="Sport filter…"
          className="border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600" />
        {data && (
          <button onClick={() => exportCSV(data.data)}
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
            Export CSV
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500">
              <tr>
                {['Event', 'Sport', 'Selection', 'Amount', 'Odds', 'Status', 'Payout', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.data.map((bet) => (
                <tr key={bet.id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="px-4 py-3">{bet.eventTitle}</td>
                  <td className="px-4 py-3 capitalize">{bet.sport}</td>
                  <td className="px-4 py-3 capitalize">{bet.selection}</td>
                  <td className="px-4 py-3">{bet.amount} XLM</td>
                  <td className="px-4 py-3">{(bet.odds / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      bet.status === 'won' ? 'bg-green-100 text-green-700' :
                      bet.status === 'lost' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{bet.status}</span>
                  </td>
                  <td className="px-4 py-3">{bet.payout > 0 ? `${bet.payout} XLM` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(bet.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-500">{data.pagination.total} bets</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded border disabled:opacity-40">← Prev</button>
            <span className="px-3 py-1">Page {page}</span>
            <button disabled={data.data.length < 20} onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded border disabled:opacity-40">Next →</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
