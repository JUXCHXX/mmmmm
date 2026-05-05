import { create } from 'zustand';

export interface GlobalBrandImageStore {
  brandImage: string | null;
  enabled: boolean;
  setBrandImage: (url: string | null) => void;
  setEnabled: (enabled: boolean) => void;
  clearBrandImage: () => void;
}

export const useBrandStore = create<GlobalBrandImageStore>((set) => ({
  brandImage: null,
  enabled: true,

  setBrandImage: (url: string | null) => set({ brandImage: url }),

  setEnabled: (enabled: boolean) => set({ enabled }),

  clearBrandImage: () => set({ brandImage: null, enabled: false }),
}));
