import { create } from "zustand";

// tipo de configuracion del simulacro
type SimulationSettings = {
  area: string;              // area de estudio: "disciplinar", "transversal" o "ambas"
  timerEnabled: boolean;     // temporizador activado/desactivado
  duration: number;          // duracion del simulacro en minutos
  practiceMode: boolean;     // modo de practica activado/desactivado
};

// zustand store para manejar la configuracion del simulacro
type SetupStore = {
  config: SimulationSettings | null;
  setConfig: (config: SimulationSettings) => void;
  resetConfig: () => void;
};

// zustand store implementacion
export const useSetupStore = create<SetupStore>((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
  resetConfig: () => set({ config: null }),
}));
