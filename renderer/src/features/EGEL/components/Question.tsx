import ReactMarkdown from 'react-markdown'

type Props = {
    question: EGELQuestion
    selectedAnswer?: number
    onSelect: (index: number) => void
    showFeedback: boolean
    mode: "simulacro" | "practica"
    allowMultipleSelection?: boolean
}

export const Question: React.FC<Props> = ({
    question,
    selectedAnswer,
    onSelect,
    showFeedback,
    mode,
    allowMultipleSelection,
}) => {

    

    return (
        <div className="w-full max-w-2xl mx-auto bg-white px-4 py-5 rounded-2xl shadow-md border border-gray-200 transition-all flex flex-col justify-between h-full">
            <div>
                <h2 className="text-lg md:text-xl font-serif font-semibold text-gray-800 text-justify mb-4 leading-snug">
                    <ReactMarkdown>{question.question}</ReactMarkdown>
                </h2>

                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;

                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    if (!allowMultipleSelection && selectedAnswer !== undefined) return;
                                    onSelect(index);
                                }}

                                className={`flex items-start px-5 py-3 rounded-xl border transition-all duration-200 cursor-pointer group
                                    ${isSelected
                                        ? "bg-emerald-100 border-emerald-300"
                                        : "bg-white border-gray-300 hover:bg-emerald-50 hover:border-emerald-300"
                                    }`}
                            >
                                <div className="font-semibold text-gray-700 mr-3 pt-1">
                                    {String.fromCharCode(65 + index)}.
                                </div>
                                <div className="text-gray-800 font-sans text-sm leading-relaxed">
                                    <ReactMarkdown>{option}</ReactMarkdown>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showFeedback && mode === "practica" && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
                        <strong>Respuesta correcta:</strong>{" "}
                        <span className="font-medium">
                            {String.fromCharCode(65 + question.correctAnswerIndex)}. {question.options[question.correctAnswerIndex]}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
