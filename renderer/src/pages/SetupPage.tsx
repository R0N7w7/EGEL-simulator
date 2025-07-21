import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSetupStore } from "../features/auth/hooks/useSetupStore";

const SetupPage = () => {
    const navigate = useNavigate();

    // obtenemos la función para guardar configuración en zustand
    const setConfig = useSetupStore((state) => state.setConfig);

    // estados locales para la configuración
    const [selectedArea, setSelectedArea] = useState("ambas");
    const [timerEnabled, setTimerEnabled] = useState(true);
    const [practiceMode, setPracticeMode] = useState(false);

    // cuando el usuario hace clic en "iniciar simulacro"
    const handleClick = () => {
        const simulationSettings = {
            area: selectedArea,
            timerEnabled: timerEnabled,
            duration: 40000,
            practiceMode: practiceMode,
        };

        console.log("configuration sent to console:", simulationSettings);
        setConfig(simulationSettings);
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-lime-50 to-white flex items-center justify-center p-6 font-serif">
            <div className="bg-white rounded-3xl shadow-lg border border-lime-50 p-12 w-full max-w-3xl text-black z-10 flex flex-col space-y-6 relative">

                {/* botón para volver atrás */}
                <button onClick={() => navigate(-1)} className="flex items-center text-sm text-black hover:text-green-700">
                    <ArrowLeft className="h-5 w-5 mr-1" /> Volver
                </button>

                {/* título */}
                <h2 className="text-3xl font-bold text-center text-black">Configuración del simulacro</h2>

                {/* selección de área y modalidad */}
                <div className="flex justify-center mt-6">
                    <div className="grid grid-cols-2 gap-16">

                        {/* radios para seleccionar área */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Àrea de estudio</h3>
                            <div className="space-y-4">
                                {["disciplinar", "transversal", "ambas"].map((value) => (
                                    <label key={value} className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="area"
                                            value={value}
                                            checked={selectedArea === value}
                                            onChange={() => setSelectedArea(value)}
                                            className="w-5 h-5 accent-green-600"
                                        />
                                        <span className="text-base capitalize">
                                            {value === "ambas" ? "ambas áreas" : value.charAt(0).toUpperCase() + value.slice(1)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* opción para habilitar modo práctica */}
                        <div className="flex flex-col justify-start items-start">
                            <h3 className="text-lg font-semibold mb-3">Modalidad de examen</h3>
                            <label className="flex items-center space-x-2 mb-1">
                                <input
                                    id="practice-mode"
                                    type="checkbox"
                                    checked={practiceMode}
                                    onChange={() => setPracticeMode(!practiceMode)}
                                    className="form-checkbox w-5 h-5 text-green-600 border-gray-300 rounded accent-green-600"
                                />
                                <span className="text-base text-gray-700">Modo práctica</span>
                            </label>
                            <p className="text-xs text-gray-500 max-w-[200px] pl-7">
                                Recibirás retroalimentación inmediata después de cada respuesta.
                            </p>
                        </div>
                    </div>
                </div>

                {/* checkbox para activar/desactivar el temporizador */}
                <div className="absolute bottom-28 right-16">
                    <label className="flex items-center space-x-2">
                        <input
                            id="enable-timer"
                            type="checkbox"
                            checked={timerEnabled}
                            onChange={() => setTimerEnabled(!timerEnabled)}
                            className="form-checkbox w-4 h-4 text-green-600 border-gray-300 rounded accent-green-600"
                        />
                        <span className="text-sm text-gray-700">Activar temporizador</span>
                    </label>
                </div>

                {/* botón para iniciar el simulacro */}
                <button
                    onClick={handleClick}
                    className="mt-10 cursor-pointer w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-3 bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700"
                >
                    <Play className="h-5 w-5" />
                    <span>Iniciar simulacro</span>
                </button>
            </div>
        </div>
    );
};

export default SetupPage;
