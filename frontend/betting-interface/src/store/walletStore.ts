import { create } from 'zustand';

interface WalletState {
  isConnected: boolean;
  account: string | null;
  connect: () => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  account: null,
  connect: () => set({ isConnected: true, account: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' }),
  disconnect: () => set({ isConnected: false, account: null }),
}));
