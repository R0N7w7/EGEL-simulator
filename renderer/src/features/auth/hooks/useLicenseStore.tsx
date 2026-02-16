import { create } from 'zustand';
import { verifyLocalKey } from '../services/verifyLocalKey';

interface LicenseState {
    isValid: boolean | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

export const useLicenseStore = create<LicenseState>((set) => ({
    isValid: null,
    loading: true,
    refresh: async () => {
        set({ loading: true });
        const valid = await verifyLocalKey();
        set({ isValid: valid, loading: false });
    },
}));
