import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useConfig } from "../context/ConfigContext.tsx"; // config context import

const SetupPage = () => {
    const navigate = useNavigate();
    const { setConfig } = useConfig(); // se usa contexto para guardar la configuración
    const [selectedArea, setSelectedArea] = useState("ambas");
    const [timerEnabled, setTimerEnabled] = useState(true);
    const [practiceMode, setPracticeMode] = useState(false);

    const handleClick = (path: string) => {
        const body = document.body;
        body.classList.add("click-anim");

        setTimeout(() => {
            body.classList.remove("click-anim");

            const config = {
                area: selectedArea,
                cronometro: timerEnabled,
                tiempo: 40000, //
                modoPractica: practiceMode,
            };

            console.log("Configuración enviada:", config);
            setConfig(config); // Guardar en contexto
            navigate(path); // Ir a /simulacion
        }, 300);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-lime-50 to-white flex items-center justify-center p-6 font-serif">
            <div className="bg-white rounded-3xl shadow-lg border border-lime-50 p-12 w-full max-w-3xl text-black z-10 flex flex-col space-y-6 relative">
                <button onClick={() => navigate(-1)} className="flex items-center text-sm text-black hover:text-green-700">
                    <ArrowLeft className="h-5 w-5 mr-1" /> Volver
                </button>

                <h2 className="text-3xl font-bold text-center text-black">Configuración del Simulacro</h2>

                <div className="flex justify-center mt-6">
                    <div className="grid grid-cols-2 gap-16">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Área de estudio</h3>
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
                                            {value === "ambas" ? "Ambas áreas" : value.charAt(0).toUpperCase() + value.slice(1)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

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

                <button
                    onClick={() => handleClick("/simulacion")}
                    className="mt-10 cursor-pointer w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-3 bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700"
                >
                    <Play className="h-5 w-5" />
                    <span>Iniciar Simulacro</span>
                </button>
            </div>
        </div>
    );
};

export default SetupPage;
