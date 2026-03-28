/**
 * PÁGINA: DETALHES DE POSIÇÕES
 * 
 * RESPONSABILIDADES:
 * - Lista todas as posições com mais detalhes
 * - Permite filtrar posições
 * - Mostra histórico e métricas detalhadas
 */

import { useState } from 'react';
import { useDashboardState } from '../context/DashboardContext';
import { useFilterPositions } from '../hooks';
import { Card, PositionItem, Loading } from '../components';

export const PositionsPage = () => {
  const state = useDashboardState();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPositions = useFilterPositions(searchTerm);

  // ========================================================================
  // RENDER: LOADING
  // ========================================================================

  if (state.loadingState === 'loading' && state.positions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading message="Carregando posições..." />
      </div>
    );
  }

  // ========================================================================
  // RENDER: CONTEÚDO
  // ========================================================================

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <header>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Minhas Posições
          </h1>
          <p className="text-gray-600">
            Total: {state.positions.length} posições ativas
          </p>
        </header>

        {/* FILTRO DE BUSCA */}
        <Card>
          <input
            type="text"
            placeholder="Buscar por símbolo ou nome do ativo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Card>

        {/* LISTA DE POSIÇÕES */}
        {filteredPositions.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 py-8">
              {searchTerm
                ? 'Nenhuma posição encontrada'
                : 'Você não tem posições'}
            </p>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden space-y-0">
            {filteredPositions.map((position) => (
              <PositionItem key={position.id} position={position} />
            ))}
          </Card>
        )}

        {/* RESUMO DE POSIÇÕES */}
        {filteredPositions.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total de Posições</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPositions.length}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${filteredPositions
                    .reduce((sum, pos) => sum + pos.currentValue, 0)
                    .toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Ganho Total</p>
                <p className="text-2xl font-bold text-green-600">
                  ${filteredPositions
                    .reduce((sum, pos) => sum + pos.gainLoss, 0)
                    .toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Retorno Médio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(
                    filteredPositions.reduce((sum, pos) => sum + pos.gainLossPercent, 0) /
                    filteredPositions.length
                  ).toFixed(2)}
                  %
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
