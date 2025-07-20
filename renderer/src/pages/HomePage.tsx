import { Orbit, Sparkles, LineChart, Clock } from "lucide-react"; // Íconos principales
import { useNavigate } from "react-router-dom"; // Navegación entre rutas

const HomePage = () => {
    const navigate = useNavigate();

    // Agrega una animación visual rápida al hacer clic en un botón
    const handleClick = (path: string) => {
        const body = document.body;
        body.classList.add("click-anim");
        setTimeout(() => {
            body.classList.remove("click-anim");
            navigate(path);
        }, 300);
    };

    return (
        // Fondo suave con degradado blanco-lima-blanco  blanconomegustapuesyax
        <div className="min-h-screen bg-gradient-to-b from-white via-lime-50 to-white flex items-center justify-center p-6 font-serif relative">

            
            {/* Contenedor del contenido principal */ /* si no jala la sombra fuerzaloooo */} 
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-lime-50 p-12 w-full max-w-3xl min-h-[500px] text-black z-10 flex flex-col justify-center">

                {/* Sección superior: ícono título descripción */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full p-5 shadow-inner">
                        <Orbit className="h-12 w-12 text-green-700" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-green-700">Simulador de Examen</h1>

                    <p className="text-gray-600 font-normal text-base font-serif leading-relaxed max-w-sm">
                        Aprende, practica y mejora a tu ritmo con herramientas diseñadas para tu éxito.
                    </p>
                </div>

                {/* Botones de navegación */}
                <div className="space-y-5 mt-12">

                    {/* Botón Empezar Simulacro con icono de Sparkles */}
                    <button
                        onClick={() => handleClick("/simulacion")}
                        className="cursor-pointer w-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-3 bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-green-700"
                    >
                        <Sparkles className="h-6 w-6" />
                        <span>Empezar Simulacro</span>
                    </button>

                    {/* Botón Ver Historial */}
                    <button
                        onClick={() => handleClick("/historial")}
                        className="cursor-pointer w-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-3 bg-white text-black py-4 rounded-2xl text-lg font-medium hover:bg-emerald-100"
                    >
                        <Clock className="h-6 w-6 text-green-500" />
                        <span>Ver Historial</span>
                    </button>

                    {/* Botón Estadísticas */}
                    <button
                        onClick={() => handleClick("/estadisticas")}
                        className="cursor-pointer w-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-3 bg-white text-black py-4 rounded-2xl text-lg font-medium hover:bg-emerald-100"
                    >
                        <LineChart className="h-6 w-6 text-green-500" />
                        <span>Estadísticas</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
