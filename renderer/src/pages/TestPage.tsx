import React, { useEffect, useState } from "react"
import { useSetupStore } from "../features/EGEL/hooks/useSetupStore"
import { useQuestions } from "../features/EGEL/hooks/useQuestions"
import { Question } from "../features/EGEL/components/Question"
import { useNavigate } from "react-router-dom"
import { ClockIcon } from "lucide-react"

export const TestPage: React.FC = () => {
    const config = useSetupStore((state) => state.config)
    const { questions: examQuestions, loading } = useQuestions()
    const navigate = useNavigate()

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
    const [showFeedback, setShowFeedback] = useState(false)
    const [timeLeft, setTimeLeft] = useState(config?.duration ?? 0)

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
        setShowFeedback(false)
        if (currentQuestionIndex < examQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1)
        } else {
            navigate("/home")
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
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 border rounded">
                                {config.practiceMode ? "Práctica" : "Simulacro"}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded capitalize">
                                {currentQuestion.block}
                            </span>
                        </div>

                        {config.timerEnabled && (
                            <div className="flex items-center space-x-2 text-lg font-mono">
                                <span><ClockIcon /></span>
                                <span className={timeLeft < 300 ? "text-red-600" : "text-gray-700"}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded">
                        <div
                            className="h-full bg-blue-500 rounded"
                            style={{
                                width: `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%`,
                            }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                        Pregunta {currentQuestionIndex + 1} de {examQuestions.length}
                    </p>
                </div>

                {/* Pregunta */}
                <Question
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelect={(index) => selectAnswer(currentQuestion.id, index)}
                    showFeedback={showFeedback}
                    mode={config.practiceMode ? "practica" : "simulacro"}
                />

                {/* Navegación */}
                <div className="flex justify-between">
                    <button
                        onClick={() => window.confirm("¿Seguro que quieres salir?") && window.location.reload()}
                        className="px-4 py-2 border rounded hover:bg-gray-100 text-sm flex items-center"
                    >
                        ← Salir
                    </button>
                    <button
                        onClick={nextQuestion}
                        disabled={!isAnswered}
                        className={`px-4 py-2 rounded text-sm flex items-center justify-center gap-2 ${isAnswered
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            } min-w-[120px]`}
                    >
                        {currentQuestionIndex === examQuestions.length - 1 ? "Finalizar" : "Siguiente"} →
                    </button>
                </div>
            </div>
        </div>
    )
}
