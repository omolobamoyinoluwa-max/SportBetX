import React from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../store/walletStore';

export const Profile: React.FC = () => {
  const { account, isConnected } = useWalletStore();
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {isConnected ? (
        <p className="text-gray-700 dark:text-gray-300">Address: {account}</p>
      ) : (
        <p className="text-gray-500">Connect your wallet to view your profile.</p>
      )}
    </motion.div>
  );
};
