import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useWalletStore } from '../store/walletStore';

const navItems = [
  { path: '/', label: 'Betting' },
  { path: '/live', label: 'Live' },
  { path: '/history', label: 'History' },
  { path: '/profile', label: 'Profile' },
  { path: '/governance', label: 'Governance' },
  { path: '/leaderboard', label: 'Leaderboard' },
];

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { isConnected, account, connect, disconnect } = useWalletStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm px-4 sm:px-6 py-4 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {drawerOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link to="/" className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
            🏈 SportBetX
          </Link>
        </div>

        <nav className="hidden lg:flex gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hover:text-blue-600 transition-colors ${
                location.pathname === item.path
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="px-3 py-1 rounded border text-sm border-gray-300 dark:border-gray-600"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={isConnected ? disconnect : connect}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 whitespace-nowrap"
          >
            {isConnected ? `${account?.slice(0, 6)}…` : 'Connect Wallet'}
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold text-gray-900 dark:text-white">Menu</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {isConnected && account && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Connected as {account}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
