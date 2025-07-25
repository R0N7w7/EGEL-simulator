import { ClipboardList, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHistoryStore } from "../features/EGEL/hooks/useHistoryStore.ts";

const HistoryPage = () => {
    const navigate = useNavigate();
    const history = useHistoryStore((state) => state.history);

    const totals = history.reduce(
        (acc, cur) => {
            if (cur.type in acc) {
                acc[cur.type as "disciplinar" | "transversal" | "ambas"]++;
            }
            acc.total++;
            return acc;
        },
        {
            disciplinar: 0,
            transversal: 0,
            ambas: 0,
            total: 0,
        } as Record<"disciplinar" | "transversal" | "ambas" | "total", number>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-lime-50 to-white flex items-center justify-center p-6 font-serif">
            <div className="bg-white rounded-3xl shadow-lg border border-lime-50 p-8 w-full max-w-4xl text-black flex flex-col space-y-6 relative">
                <button onClick={() => navigate('/home')} className="cursor-pointer flex items-center text-sm text-black hover:text-green-700">
                    <ArrowLeft className="h-5 w-5 mr-1" /> Volver
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full p-4 shadow-inner">
                        <ClipboardList className="h-10 w-10 text-green-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-700">Historial de Simulacros</h2>
                    <p className="text-gray-600 text-sm">Consulta tu desempeño en intentos anteriores.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-4">
                    <div className="bg-emerald-50 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-green-700">{totals.total}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Disciplinar</p>
                        <p className="text-lg font-bold text-green-700">{totals.disciplinar}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Transversal</p>
                        <p className="text-lg font-bold text-green-700">{totals.transversal}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Ambas áreas</p>
                        <p className="text-lg font-bold text-green-700">{totals.ambas}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    {history.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row justify-between p-4 bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                                <CheckCircle className="text-green-600 w-6 h-6" />
                                <div>
                                    <p className="font-semibold text-base">{item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {item.date} a las {item.time}</p>
                                    <p className="text-sm text-gray-500">{item.correct} aciertos de {item.total}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-green-700">{item.score}%</p>
                                <p className="text-xs text-gray-400">calificación</p>
                            </div>
                        </div>
                    ))}

                    {history.length === 0 && (
                        <p className="text-center text-gray-400 mt-6">Aún no has realizado simulacros.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
