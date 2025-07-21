import { useEffect, useState } from "react";
import { getQuestions } from "../services/questions";

export function useQuestions() {
    const [questions, setQuestions] = useState<EGELQuestion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // En un futuro aquí podrías hacer fetch a Supabase/API
        const fetchQuestions = async () => {
            try {
                const data = getQuestions();
                setQuestions(data);
            } catch (error) {
                console.error("Error al obtener preguntas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    return {
        questions,
        loading,
    };
}
