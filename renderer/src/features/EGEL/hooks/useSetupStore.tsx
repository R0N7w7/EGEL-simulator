import { create } from "zustand";

type SimulationSettings = {
  area: SimulationType;
  timerEnabled: boolean;
  duration: number;
  practiceMode: boolean;
};

type SetupStore = {
  config: SimulationSettings | null;
  setConfig: (config: SimulationSettings) => void;
  resetConfig: () => void;
};

export const useSetupStore = create<SetupStore>((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
  resetConfig: () => set({ config: null }),
}));
