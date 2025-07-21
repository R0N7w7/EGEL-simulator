import { useConfig } from "../context/ConfigContext.tsx";
import { useNavigate } from "react-router-dom";

const SimulacionPage = () => {
    const navigate = useNavigate();
    const { config } = useConfig();

    if (!config) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">No hay configuración cargada.</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                >
                    Volver a configurar
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-8 font-serif">
            <h1 className="text-3xl font-bold mb-6">Simulación de Examen</h1>
            <div className="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-lg w-full border border-gray-200">
                <p><strong>Área:</strong> {config.area}</p>
                <p><strong>Cronómetro:</strong> {config.cronometro ? "Sí" : "No"}</p>
                <p><strong>Tiempo:</strong> {config.tiempo} segundos</p>
                <p><strong>Modo práctica:</strong> {config.modoPractica ? "Sí" : "No"}</p>
            </div>
        </div>
    );
};

export default SimulacionPage;
