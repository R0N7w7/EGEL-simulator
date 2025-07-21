import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// tipo que define la estructura de la configuración del simulacro
type Config = {
    area: string;
    cronometro: boolean;
    tiempo: number;
    modoPractica: boolean;
};

// tipo que representa el valor que tendrá el contexto
type ConfigContextType = {
    config: Config | null;
    setConfig: (config: Config) => void;
};

// se crea el contexto de configuración
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// hook personalizado para acceder al contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig debe usarse dentro de un <ConfigProvider>");
    }
    return context;
};

// componente proveedor del contexto que envuelve la app
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    // estado que almacena la configuración actual
    const [config, setConfig] = useState<Config | null>(null);

    // se pasa el estado y su setter al proveedor
    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};
