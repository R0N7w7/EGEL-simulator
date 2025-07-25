import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SimulationType = "disciplinar" | "transversal" | "ambas";

export interface HistoryItem {
    id: string;
    date: string;
    time: string;
    score: number;
    correct: number;
    total: number;
    type: SimulationType;
}

interface HistoryState {
    history: HistoryItem[];
    addEntry: (entry: Omit<HistoryItem, 'id'>) => void;
    clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set, get) => ({
            history: [],
            addEntry: (entry) => {
                const newEntry: HistoryItem = {
                    id: crypto.randomUUID(),
                    ...entry,
                };
                set({ history: [newEntry, ...get().history] });
            },
            clearHistory: () => set({ history: [] }),
        }),
        {
            name: 'sim-history-store',
        }
    )
);
