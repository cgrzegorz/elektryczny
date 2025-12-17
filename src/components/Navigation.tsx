import { Link } from 'react-router-dom'

export const Navigation = () => {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white text-xl font-bold hover:text-gray-300 transition">
            ⚡ Elektryczny
          </Link>
          <div className="flex gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/data"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Dane Techniczne
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              O aplikacji
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}



