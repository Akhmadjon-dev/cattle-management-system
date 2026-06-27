import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700">
              🐄 Cattle Manager
            </Link>

            <div className="flex items-center gap-4">
              {/* Navigation */}
              <nav className="hidden sm:flex gap-6">
              <Link
                to="/"
                className={`font-medium transition-colors ${
                  isActive('/')
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cattle
              </Link>
              <Link
                to="/dashboard"
                className={`font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics
              </Link>
            </nav>

              {/* Mobile nav (simplified) */}
              <nav className="sm:hidden flex gap-4">
                <Link to="/" className={`text-sm font-medium ${isActive('/') ? 'text-emerald-600' : 'text-gray-600'}`}>
                  Cattle
                </Link>
                <Link to="/dashboard" className={`text-sm font-medium ${isActive('/dashboard') ? 'text-emerald-600' : 'text-gray-600'}`}>
                  Analytics
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-600 text-center">
            Cattle Management System © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
