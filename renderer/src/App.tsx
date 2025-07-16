function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">¡Tailwind está listo!</h1>
        <p className="text-gray-700 mb-6">
          Este es un template mínimo para que confirmes que TailwindCSS está funcionando.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Haz clic aquí
        </button>
      </div>
    </div>
  );
}

export default App;
