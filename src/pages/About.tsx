export const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">O aplikacji</h1>
        <p className="text-gray-700 mb-4">
          Aplikacja do obliczeń elektrycznych stworzona z wykorzystaniem React + Vite + TailwindCSS.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Technologie:</h2>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>React 19 + TypeScript</li>
            <li>Vite (szybkie budowanie)</li>
            <li>TailwindCSS (stylowanie)</li>
            <li>React Router (routing)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

