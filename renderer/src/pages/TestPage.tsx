import React, { useEffect, useState } from "react"
import { useSetupStore } from "../features/EGEL/hooks/useSetupStore"
import { useQuestions } from "../features/EGEL/hooks/useQuestions"
import { Question } from "../features/EGEL/components/Question"
import { useHistoryStore } from "../features/EGEL/hooks/useHistoryStore";
import { useNavigate } from "react-router-dom"
import { ClockIcon } from "lucide-react"

export const TestPage: React.FC = () => {
    const config = useSetupStore((state) => state.config)
    const { questions: examQuestions, loading } = useQuestions();

    const navigate = useNavigate()

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
    const [showFeedback, setShowFeedback] = useState(false)
    const [timeLeft, setTimeLeft] = useState(config?.duration ?? 0)
    const addHistoryEntry = useHistoryStore((state) => state.addEntry);


    // Redirección si no hay configuración cargada
    useEffect(() => {
        if (!config) {
            navigate("/setup");
        }
    }, [config, navigate])

    // Temporizador
    useEffect(() => {
        if (!config?.timerEnabled) return
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) clearInterval(interval)
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [config])

    const selectAnswer = (id: string, index: number) => {
        if (selectedAnswers[id] === undefined) {
            setSelectedAnswers((prev) => ({ ...prev, [id]: index }))
            setShowFeedback(true)
        }
    }

    const nextQuestion = () => {
        setShowFeedback(false);
        const isLast = currentQuestionIndex === examQuestions.length - 1

        if (isLast) {
            const total = examQuestions.length

            // Simulación básica de aciertos (ejemplo: 70% aciertos aleatorios si no tienes correctAnswer)
            const correct = Math.floor(total * 0.7) // puedes adaptar esto para el real (esto es solo para el examen de prueba)
            const score = Math.round((correct / total) * 100)
            const now = new Date();
            const date = now.toLocaleDateString()
            const time = now.toLocaleTimeString()

            addHistoryEntry({
                date,
                time,
                score,
                correct,
                total,
                type: config!.area,
                timerEnabled: config!.timerEnabled,
                practiceMode: config!.practiceMode,
            });

            navigate("/history");
        } else {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    }


    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
        const sec = seconds % 60
        return `${min}:${sec.toString().padStart(2, "0")}`
    }

    if (!config || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Cargando preguntas...
            </div>
        )
    }

    const currentQuestion = examQuestions[currentQuestionIndex]
    const selectedAnswer = selectedAnswers[currentQuestion.id]
    const isAnswered = selectedAnswer !== undefined

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-lime-50 to-white p-6 text-gray-800 font-serif">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold shadow-inner">
                                {config.practiceMode ? "Modo Práctica" : "Simulacro"}
                            </span>
                            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-medium capitalize">
                                {currentQuestion.block}
                            </span>
                        </div>

                        {config.timerEnabled && (
                            <div className="flex items-center gap-2 text-lg font-mono text-gray-700 animate-fade-in">
                                <ClockIcon className="w-5 h-5 text-blue-500" />
                                <span className={timeLeft < 300 ? "text-red-600 font-semibold animate-pulse" : ""}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 rounded-full"
                            style={{
                                width: `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%`,
                            }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        Pregunta {currentQuestionIndex + 1} de {examQuestions.length}
                    </p>
                </div>

                {/* Pregunta estilizada */}
                <Question
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelect={(index) => selectAnswer(currentQuestion.id, index)}
                    showFeedback={showFeedback}
                    mode={config.practiceMode ? "practica" : "simulacro"}
                    allowMultipleSelection={!config.practiceMode}
                />

                {/* Navegación */}
                <div className="flex justify-between pt-4">
                    <button
                        onClick={() => navigate("/home")}
                        className="px-5 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition shadow text-sm"
                    >
                        ← Salir
                    </button>
                    <button
                        onClick={nextQuestion}
                        disabled={!isAnswered}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${isAnswered
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {currentQuestionIndex === examQuestions.length - 1 ? "Finalizar" : "Siguiente"} →
                    </button>


                </div>
            </div>
        </div>
    );

}
