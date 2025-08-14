export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-xl mb-4">Página no encontrada</h2>
        <p className="mb-8">La página que buscas no existe.</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="border px-4 py-2 hover:bg-gray-100"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
