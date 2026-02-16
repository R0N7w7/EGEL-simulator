import { useEffect, useState } from "react";
import { getQuestions } from "../services/questions";

export function useQuestions(type: SimulationType = "ambas") {
    const [questions, setQuestions] = useState<EGELQuestion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = getQuestions(type);
                setQuestions(data);
            } catch (error) {
                console.error("Error al obtener preguntas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [type]);

    return {
        questions,
        loading,
    };
}
