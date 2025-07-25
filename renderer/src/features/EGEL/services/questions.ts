const questions: EGELQuestion[] = [
    {
        id: "q1",
        question: "¿Cuál de las siguientes opciones **describe correctamente** el uso del operador lógico `&&` en JavaScript?",
        options: [
            "`&&` evalúa ambas expresiones y retorna `true` si al menos una es verdadera.",
            "`&&` detiene la evaluación si la primera expresión es verdadera.",
            "`&&` evalúa de izquierda a derecha y retorna el **primer valor falso** o el último valor si todos son verdaderos.",
            "`&&` siempre retorna un valor booleano.",
        ],
        correctAnswerIndex: 2,
        block: "disciplinary",
        subtopic: "operadores lógicos",
    },
    {
        id: "q2",
        question: "Dado el siguiente fragmento de código en Python, ¿cuál es el valor de `resultado`?\n\n```python\nx = [1, 2, 3]\ny = x\nx.append(4)\nresultado = y\n```",
        options: [
            "`[1, 2, 3]`",
            "`[1, 2, 3, 4]`",
            "`[4]`",
            "Error de asignación por referencia",
        ],
        correctAnswerIndex: 1,
        block: "disciplinary",
        subtopic: "estructuras de datos",
    },
    {
        id: "q3",
        question: "¿Cuál es la diferencia entre `==` y `===` en JavaScript?",
        options: [
            "`==` compara por referencia, `===` compara por valor.",
            "`==` permite coerción de tipos, `===` compara tipos y valores estrictamente.",
            "`==` es una versión más segura de `===`.",
            "`===` convierte ambos operandos a `Number` antes de comparar.",
        ],
        correctAnswerIndex: 1,
        block: "transversal",
    },
    {
        id: "q4",
        question: "En Markdown, ¿cómo representas un bloque de código con sintaxis específica?\n\nSelecciona la opción correcta:",
        options: [
            "`<code lang=\"js\">...<\\/code>`",
            "Encerrando el código entre tres tildes: `~~~codigo~~~`",
            "Usando tres backticks y el nombre del lenguaje: \n\n```\njs\nconsole.log('Hola');\n```",
            "Solo usando una tabulación al inicio de cada línea",
        ],
        correctAnswerIndex: 2,
        block: "transversal",
    },
];
const typeMap = {
    disciplinar: "disciplinary",
    transversal: "transversal",
    ambas: "ambas",
} as const;

type QuestionType = keyof typeof typeMap;

export function getQuestions(type: QuestionType = "ambas"): EGELQuestion[] {
    if (type === "ambas") return questions;

    const mappedType = typeMap[type];
    return questions.filter(q => q.block === mappedType);
}
