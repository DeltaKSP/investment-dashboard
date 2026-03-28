/**
 * COMPONENTE RAIZ - APP.TSX
 * 
 * RESPONSABILIDADES:
 * - Fornece contexto global (Provider)
 * - Define roteamento (em produção com react-router)
 * - Configura temas/estilos globais
 * - Layout principal da aplicação
 */

import { useState } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { DashboardPage } from './pages';
import { PositionsPage } from './pages';
import './App.css';

type AppPage = 'dashboard' | 'positions';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gray-50">
        {/* NAVEGAÇÃO */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">
              💰 Investment Dashboard
            </h1>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setCurrentPage('positions')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'positions'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Posições
              </button>
            </div>
          </div>
        </nav>

        {/* CONTEÚDO PRINCIPAL */}
        <main>
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'positions' && <PositionsPage />}
        </main>
      </div>
    </DashboardProvider>
  );
}

export default App;
