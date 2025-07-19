import { BookOpen, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyKey } from "../features/auth/services/verifyKey";

const AuthPage = () => {
    const navigate = useNavigate();

    // You may need to define these states and handlers if not already present
    const [productKey, setProductKey] = useState("");
    const [isKeyValid, setIsKeyValid] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [keyError, setKeyError] = useState("");

    const formatProductKey = (value: string) => {
        // Remover caracteres no válidos y convertir a minúsculas
        const cleaned = value.replace(/[^0-9a-f-]/gi, "").toLowerCase()

        // Formatear como UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        let formatted = cleaned.replace(/-/g, "")
        if (formatted.length > 32) formatted = formatted.slice(0, 32)

        const parts = []
        if (formatted.length > 0) parts.push(formatted.slice(0, 8))
        if (formatted.length > 8) parts.push(formatted.slice(8, 12))
        if (formatted.length > 12) parts.push(formatted.slice(12, 16))
        if (formatted.length > 16) parts.push(formatted.slice(16, 20))
        if (formatted.length > 20) parts.push(formatted.slice(20, 32))

        return parts.join("-")
    }

    const handleKeyInput = (value: string) => {
        const formatted = formatProductKey(value)
        setProductKey(formatted)
        setKeyError("")
    }

    const validateProductKey = async (key: string) => {
        setIsValidating(true)
        setKeyError("")

        // Validar formato UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(key)) {
            setKeyError("Formato de clave inválido. Debe ser un UUID válido.")
            setIsValidating(false)
            return
        }

        const result = await verifyKey(key);
        if (result.success) {
            setIsKeyValid(true);
            navigate("/main");
        } else {
            setKeyError(
                "error" in result && result.error.message
                    ? result.error.message
                    : "Error al validar la clave de producto."
            );
        }

        setIsValidating(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="text-center px-8 pt-8 pb-4">
                    <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full w-fit">
                        <BookOpen className="h-10 w-10 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold ">
                        Simulador de Examen
                    </h1>
                    <p className="text-lg mt-2 text-gray-600">Ingrese su clave de producto para continuar</p>
                </div>
                <div className="px-8 pb-8 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="product-key" className="text-base font-medium block mb-1">
                            Clave de Producto (UUID)
                        </label>
                        <div className="relative">
                            <input
                                id="product-key"
                                type="text"
                                value={productKey}
                                onChange={(e) => handleKeyInput(e.target.value)}
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                className={`w-full px-4 py-4 text-xl font-mono tracking-wider text-center border-2 rounded-lg transition-all duration-200 ${keyError
                                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                                    : isKeyValid
                                        ? "border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200"
                                        : "border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-200"
                                    } focus:outline-none focus:ring-4`}
                                disabled={isValidating || isKeyValid}
                                maxLength={36}
                            />
                            {isKeyValid && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                </div>
                            )}
                        </div>
                        {keyError && (
                            <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                                <XCircle className="h-4 w-4" />
                                <span>{keyError}</span>
                            </div>
                        )}
                    </div>

                    <button
                        className="w-full h-14 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                        onClick={() => validateProductKey(productKey)}
                        disabled={!productKey || isValidating || isKeyValid}
                    >
                        {isValidating ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Validando clave...</span>
                            </div>
                        ) : isKeyValid ? (
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5" />
                                <span>¡Clave válida! Redirigiendo...</span>
                            </div>
                        ) : (
                            "Validar Clave"
                        )}
                    </button>

                    {isKeyValid && (
                        <div className="text-center">
                            <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                                <div className="animate-pulse h-2 w-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium">Acceso autorizado</span>
                            </div>
                        </div>
                    )}

                    <div className="text-center text-sm text-gray-500">
                        <p>¿No tienes una clave de producto?</p>
                        <button
                            type="button"
                            className="text-blue-600 underline p-0 h-auto bg-transparent hover:text-blue-800"
                        >
                            Contactar soporte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage;