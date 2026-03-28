/**
 * PÁGINA: DASHBOARD PRINCIPAL
 * 
 * Exibe:
 * - Resumo do portfólio com atualização dinâmica
 * - Métricas principais
 * - Posições abertas
 * - Ativos em destaque
 */

import { useDashboardData, usePortfolioMetrics, useRefreshPrices } from '../hooks';
import {
  Error,
  PositionItem,
  AssetItem,
} from '../components';
import { useDashboardState } from '../context/DashboardContext';

const USER_ID = 'user-1';

export const DashboardPage = () => {
  // ========================================================================
  // DADOS E ESTADO
  // ========================================================================

  const { isLoading, isError, error } = useDashboardData(USER_ID);
  const state = useDashboardState();
  const metrics = usePortfolioMetrics();

  // Atualiza preços a cada 15 segundos (atualização dinâmica)
  useRefreshPrices(15000);

  // ========================================================================
  // RENDER: LOADING
  // ========================================================================

  if (isLoading && !state.portfolio) {
    return (
      <main className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Carregando seu portfólio...</p>
      </main>
    );
  }

  // ========================================================================
  // RENDER: ERROR
  // ========================================================================

  if (isError) {
    return (
      <main style={{ padding: '2.5rem 2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Error
          message={error || 'Erro ao carregar o dashboard'}
          onRetry={() => window.location.reload()}
        />
      </main>
    );
  }

  // ========================================================================
  // RENDER: CONTEÚDO PRINCIPAL
  // ========================================================================

  return (
    <main>
      {/* HEADER */}
      <header>
        <div>
          <h1>💰 Meu Portfólio</h1>
          <p>
            Acompanhe seu desempenho de investimentos em tempo real
          </p>
        </div>
        <div className="last-update">
          {state.lastSyncTime && (
            <>
              <div className="update-badge">
                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#059669', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
                Atualizado
              </div>
              <span>{state.lastSyncTime.toLocaleTimeString('pt-BR')}</span>
            </>
          )}
        </div>
      </header>

      {/* SEÇÃO 1: MÉTRICAS PRINCIPAIS (4 COLUNAS) */}
      <section>
        <div className="grid grid-4">
          {/* Valor Total */}
          <div className="card stat-card">
            <div className="stat-label">
              <span>💎 Valor Total</span>
            </div>
            <div className="stat-value">
              ${metrics.totalValue.toFixed(0)}
            </div>
            <div className={`stat-change ${metrics.totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
              <span className="stat-arrow">
                {metrics.totalGainLoss >= 0 ? '↑' : '↓'}
              </span>
              ${Math.abs(metrics.totalGainLoss).toFixed(0)} (
              {metrics.totalGainLossPercent.toFixed(2)}%)
            </div>
          </div>

          {/* Capital Investido */}
          <div className="card stat-card">
            <div className="stat-label">
              <span>📊 Investido</span>
            </div>
            <div className="stat-value">
              ${metrics.totalInvested.toFixed(0)}
            </div>
            <div className="stat-change">
              <span>Capital inicial</span>
            </div>
          </div>

          {/* Lucro/Prejuízo */}
          <div className="card stat-card">
            <div className="stat-label">
              <span>📈 Ganho/Perda</span>
            </div>
            <div className="stat-value" style={{
              color: metrics.totalGainLoss >= 0 ? '#059669' : '#DC2626'
            }}>
              ${Math.abs(metrics.totalGainLoss).toFixed(0)}
            </div>
            <div className={`stat-change ${metrics.totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
              <span>
                {metrics.totalGainLoss >= 0 ? 'Lucro' : 'Prejuízo'}
              </span>
            </div>
          </div>

          {/* Retorno (%) */}
          <div className="card stat-card">
            <div className="stat-label">
              <span>🎯 Retorno</span>
            </div>
            <div className="stat-value" style={{
              color: metrics.totalGainLossPercent >= 0 ? '#059669' : '#DC2626'
            }}>
              {metrics.totalGainLossPercent.toFixed(2)}%
            </div>
            <div className={`stat-change ${metrics.totalGainLossPercent >= 0 ? 'positive' : 'negative'}`}>
              <span>
                {metrics.totalGainLossPercent >= 0 ? 'Acima' : 'Abaixo'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: PERFORMANCE (2 COLUNAS) */}
      <section>
        <div className="grid grid-2">
          {/* Melhor Posição */}
          {metrics.bestPosition && (
            <div className="card no-hover">
              <div style={{ padding: '2rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#D1FAE5',
                  color: '#059669',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid #059669'
                }}>
                  <span>🚀</span> Melhor
                </div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700 }}>
                  {metrics.bestPosition.asset.name}
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 0.5rem 0', textTransform: 'uppercase', fontWeight: 600 }}>
                    Desempenho
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', margin: 0, fontFamily: 'monospace' }}>
                    +{metrics.bestPosition.gainLossPercent.toFixed(2)}%
                  </p>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0 }}>
                  Ganho: ${metrics.bestPosition.gainLoss.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Pior Posição */}
          {metrics.worstPosition && (
            <div className="card no-hover">
              <div style={{ padding: '2rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid #DC2626'
                }}>
                  <span>📉</span> Pior
                </div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700 }}>
                  {metrics.worstPosition.asset.name}
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 0.5rem 0', textTransform: 'uppercase', fontWeight: 600 }}>
                    Desempenho
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 900, color: '#DC2626', margin: 0, fontFamily: 'monospace' }}>
                    {metrics.worstPosition.gainLossPercent.toFixed(2)}%
                  </p>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0 }}>
                  Prejuízo: ${Math.abs(metrics.worstPosition.gainLoss).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 3: MINHAS POSIÇÕES */}
      <section style={{paddingBottom: '2rem'}}>
        <div className="card">
          <div className="positions-header">
            <h3>📊 Minhas Posições ({state.positions.length})</h3>
          </div>

          {state.positions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
              Você não tem posições abertas
            </div>
          ) : (
            <div>
              {state.positions.map((position) => (
                <PositionItem key={position.id} position={position} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 4: ATIVOS EM DESTAQUE */}
      <section style={{paddingBottom: '2rem'}}>
        <div className="card">
          <div className="assets-header">
            <h3>⭐ Top Ativos por Capitalização</h3>
          </div>

          {metrics.topAssets.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
              Nenhum ativo disponível
            </div>
          ) : (
            <div>
              {metrics.topAssets.map((asset) => (
                <AssetItem key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 5: RESUMO DETALHADO */}
      {state.positions.length > 0 && (
        <section>
          <div className="summary-card">
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: 700 }}>
              📋 Resumo da Carteira
            </h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-item-label">Posições Abertas</span>
                <span className="summary-item-value">{state.positions.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-item-label">Valor da Carteira</span>
                <span className="summary-item-value" style={{ color: '#059669' }}>
                  ${metrics.totalValue.toFixed(0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-item-label">Total Investido</span>
                <span className="summary-item-value" style={{ color: '#1E40AF' }}>
                  ${metrics.totalInvested.toFixed(0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-item-label">Retorno Médio</span>
                <span className="summary-item-value" style={{
                  color: metrics.totalGainLossPercent >= 0 ? '#059669' : '#DC2626'
                }}>
                  {metrics.totalGainLossPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
