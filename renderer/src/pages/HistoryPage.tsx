import { ClipboardList, ArrowLeft, CheckCircle, Timer, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHistoryStore } from "../features/EGEL/hooks/useHistoryStore.tsx";

const HistoryPage = () => {
    const navigate = useNavigate();
    const history = useHistoryStore((state) => state.history);

    const totals = history.reduce(
        (acc, cur) => {
            if (cur.type in acc) {
                acc[cur.type as SimulationType]++;
            }
            acc.total++;
            return acc;
        },
        {
            disciplinar: 0,
            transversal: 0,
            ambas: 0,
            total: 0,
        } as Record<SimulationType | "total", number>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-lime-50 to-white flex items-center justify-center p-6 font-serif">
            <div className=" font-serif bg-white rounded-3xl shadow-lg border border-gray-200 p-8 w-full max-w-5xl text-black flex flex-col space-y-6 relative">
                <button onClick={() => navigate('/home')} className="cursor-pointer flex items-center text-smlg text-gray-600 hover:text-green-600">
                    <ArrowLeft className="h-5 w-5 mr-1" /> Volver
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-200 rounded-full p-4 shadow-inner">
                        <ClipboardList className="h-10 w-10 text-green-700" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-wide">Historial de Simulacros</h2>
                    <p className="text-gray-500 text-sm">Consulta tu desempeño en intentos anteriores.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-4">
                    <div className="bg-blue-50 rounded-xl p-5 shadow">
                        <p className="font-bold text-gray-500">Total</p>
                        <p className="text-lg font-bold text-blue-700">{totals.total}</p>
                    </div>
                    <div className="bg-pink-50 rounded-xl p-5 shadow">
                        <p className="font-bold text-gray-500">Disciplinar</p>
                        <p className="text-lg font-bold text-pink-700">{totals.disciplinar}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-5 shadow">
                        <p className="font-bold text-gray-500">Transversal</p>
                        <p className="text-lg font-bold text-yellow-600">{totals.transversal}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-5 shadow">
                        <p className="font-bold text-gray-500">Ambas Areas</p>
                        <p className="text-lg font-bold text-purple-700">{totals.ambas}</p>
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    {history.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white border border-green-100 rounded-xl shadow hover:shadow-md transition">
                            <div className="flex items-center space-x-4 text-left w-full sm:w-auto ">
                                <CheckCircle className="text-green-600 w-6 h-6" />
                                <div>
                                    <p className="text-base font-medium text-gray-800 tracking-wide mb-1">
                                        <span className="font-bold italic">
                                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                        </span>
                                        &nbsp;&nbsp;~&nbsp;&nbsp; {item.date} &nbsp;&nbsp;&nbsp;&nbsp; {item.time}
                                    </p>



                                    <div className=" flex flex-wrap text-sm text-gray-600 gap-2">
                                        <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                            <PlayCircle className="w-4 h-4" />
                                            {item.practiceMode ? "Práctica" : "Simulacro"}
                                        </span>
                                        <span className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                                            <Timer className="w-4 h-4" />
                                            {item.timerEnabled ? "Cronometrado" : "Sin cronómetro"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-700 mt-1">{item.correct} aciertos de {item.total}</p>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 text-right">
                                <p className="text-xl font-bold text-blue-800">{item.score}%</p>
                                <p className="text-xs text-gray-400">Calificación</p>
                            </div>
                        </div>
                    ))}

                    {history.length === 0 && (
                        <p className="text-center text-gray-400 mt-6 italic">Aún no has realizado simulacros.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
