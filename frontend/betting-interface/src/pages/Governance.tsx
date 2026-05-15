import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  endTime: string;
}

type VoteChoice = 'For' | 'Against' | 'Abstain';

function VoteBar({ label, votes, total, color }: { label: string; votes: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
  return (
    <div className="mb-1">
      <div className="flex justify-between text-xs mb-0.5">
        <span>{label}</span><span>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded">
        <div className={`h-2 rounded ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ProposalCard({ proposal, onVote }: { proposal: Proposal; onVote: (id: string, choice: VoteChoice) => void }) {
  const [voted, setVoted] = useState(false);
  const total = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const timeLeft = Math.max(0, Math.floor((new Date(proposal.endTime).getTime() - Date.now()) / 86400000));

  const handleVote = (choice: VoteChoice) => {
    if (voted) return;
    onVote(proposal.id, choice);
    setVoted(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">{proposal.title}</h3>
        <span className="text-xs text-gray-500">{timeLeft}d left</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{proposal.description}</p>
      <VoteBar label="For" votes={proposal.votesFor} total={total} color="bg-green-500" />
      <VoteBar label="Against" votes={proposal.votesAgainst} total={total} color="bg-red-500" />
      <VoteBar label="Abstain" votes={proposal.votesAbstain} total={total} color="bg-gray-400" />
      {!voted && (
        <div className="flex gap-2 mt-4">
          {(['For', 'Against', 'Abstain'] as VoteChoice[]).map((c) => (
            <button
              key={c}
              onClick={() => handleVote(c)}
              className="flex-1 py-1.5 text-sm rounded border hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {c}
            </button>
          ))}
        </div>
      )}
      {voted && <p className="mt-3 text-sm text-green-600 font-medium">✓ Vote submitted</p>}
    </div>
  );
}

export const Governance: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading, refetch } = useQuery('proposals', async () => {
    const { data } = await axios.get<{ data: Proposal[] }>(`${API_BASE}/api/v1/governance/proposals`);
    return data.data;
  });

  const voteMutation = useMutation(({ proposalId, choice }: { proposalId: string; choice: VoteChoice }) =>
    axios.post(`${API_BASE}/api/v1/governance/vote`, { proposalId, choice })
  );

  const createMutation = useMutation(
    () => axios.post(`${API_BASE}/api/v1/governance/proposals`, { title, description }),
    { onSuccess: () => { setShowCreate(false); setTitle(''); setDescription(''); refetch(); } }
  );

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Governance</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
          + New Proposal
        </button>
      </div>

      {showCreate && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 mb-6">
          <h2 className="font-semibold mb-3">Create Proposal</h2>
          <input
            className="w-full border rounded px-3 py-2 mb-3 text-sm dark:bg-gray-700 dark:border-gray-600"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border rounded px-3 py-2 mb-3 text-sm dark:bg-gray-700 dark:border-gray-600"
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={() => createMutation.mutate()}
            disabled={!title || !description}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      )}

      {isLoading && <p className="text-gray-500">Loading proposals…</p>}
      {data?.map((p) => (
        <ProposalCard key={p.id} proposal={p} onVote={(id, choice) => voteMutation.mutate({ proposalId: id, choice })} />
      ))}
    </motion.div>
  );
};
