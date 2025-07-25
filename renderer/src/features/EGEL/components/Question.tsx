import ReactMarkdown from 'react-markdown'

type Props = {
    question: EGELQuestion
    selectedAnswer?: number
    onSelect: (index: number) => void
    showFeedback: boolean
    mode: "simulacro" | "practica"
}

export const Question: React.FC<Props> = ({
    question,
    selectedAnswer,
    onSelect,
    showFeedback,
    mode,
}) => {
    const isCorrect = selectedAnswer === question.correctAnswerIndex

    return (
        <div className="mb-6 bg-white border rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold leading-relaxed"><ReactMarkdown >{question.question}</ReactMarkdown></h2>
            </div>
            <div className="p-4 space-y-3">
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrectAnswer = index === question.correctAnswerIndex
                    const feedbackClass =
                        showFeedback && mode === "practica"
                            ? isCorrectAnswer
                                ? "bg-green-50 border-green-200"
                                : isSelected && !isCorrect
                                    ? "bg-red-50 border-red-200"
                                    : "bg-gray-50"
                            : isSelected
                                ? "bg-blue-50 border-blue-200"
                                : "hover:bg-gray-50"

                    return (
                        <div
                            key={index}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${feedbackClass}`}
                            onClick={() => onSelect(index)}
                        >
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                                {isSelected && <div className="w-2 h-2 bg-gray-800 rounded-full" />}
                            </div>
                            <label className="flex-1 cursor-pointer select-none flex gap-2">
                                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                                <ReactMarkdown>{option}</ReactMarkdown>
                            </label>
                            {showFeedback && mode === "practica" && (
                                <>
                                    {isCorrectAnswer && <span className="text-green-600 font-bold text-sm">✔</span>}
                                    {isSelected && !isCorrect && (
                                        <span className="text-red-600 font-bold text-sm">✖</span>
                                    )}
                                </>
                            )}
                        </div>
                    )
                })}

                {showFeedback && mode === "practica" && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                        <strong>Respuesta correcta:</strong>{" "}
                        <label className="flex-1 cursor-pointer select-none flex gap-2">
                            <span className="font-medium mr-2">{String.fromCharCode(65 + question.correctAnswerIndex)}.</span>
                            <ReactMarkdown>{question.options[question.correctAnswerIndex]}</ReactMarkdown>
                        </label>
                    </div>
                )}
            </div>
        </div>
    )
}
