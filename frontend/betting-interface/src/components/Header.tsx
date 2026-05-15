import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useWalletStore } from '../store/walletStore';

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { isConnected, account, connect, disconnect } = useWalletStore();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm px-6 py-4 flex items-center justify-between">
      <nav className="flex gap-4 text-sm font-medium">
        <Link to="/" className="hover:text-blue-600">Betting</Link>
        <Link to="/live" className="hover:text-blue-600">Live</Link>
        <Link to="/history" className="hover:text-blue-600">History</Link>
        <Link to="/governance" className="hover:text-blue-600">Governance</Link>
        <Link to="/leaderboard" className="hover:text-blue-600">Leaderboard</Link>
      </nav>
      <div className="flex items-center gap-3">
        <button onClick={toggleDarkMode} aria-label="Toggle dark mode" className="px-3 py-1 rounded border text-sm">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button
          onClick={isConnected ? disconnect : connect}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          {isConnected ? `${account?.slice(0, 6)}…` : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
};
