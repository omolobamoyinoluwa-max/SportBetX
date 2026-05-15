import React from 'react';
import { motion } from 'framer-motion';

export const LiveBetting: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
    <h1 className="text-2xl font-bold mb-4">Live Betting</h1>
    <p className="text-gray-500">Live betting markets coming soon.</p>
  </motion.div>
);
