/**
 * HOOKS CUSTOMIZADOS - LÓGICA DE NEGÓCIOS
 * 
 * WHY:
 * - Separa lógica do componente (componentes ficam focados em UI)
 * - Reutiliza lógica em vários componentes
 * - Facilita testes (testa-se o hook, não o componente)
 * - Maior legibilidade e manutenibilidade
 * 
 * PADRÃO:
 * - useSearch* = hooks para buscar/carregar dados
 * - useCalculate* = hooks para calcular/processar dados
 * - useHandle* = hooks para ações do usuário
 */

import { useEffect, useCallback, useState } from 'react';
import {
  useDashboardState,
  useDashboardDispatch,
} from '../context/DashboardContext';
import { dashboardApi } from '../services/dashboardApi';
import type { Position, Asset } from '../types';

// ============================================================================
// HOOK: CARREGAR DADOS DO DASHBOARD
// ============================================================================

/**
 * Hook para carregar dados iniciais do dashboard
 * 
 * RESPONSABILIDADES:
 * - Busca portfólio, posições, ativos na API
 * - Atualiza o contexto global
 * - Gerencia estados de carregamento e erro
 * 
 * USO:
 * const { isLoading, error } = useDashboardData('user-123');
 */
export const useDashboardData = (userId: string) => {
  const dispatch = useDashboardDispatch();
  const { loadingState, error } = useDashboardState();
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadData = useCallback(async () => {
    // Evita carregar múltiplas vezes
    if (hasLoaded) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: 'loading' });

      // Carrega dados em paralelo (mais eficiente)
      const [portfolio, assets, transactions] = await Promise.all([
        dashboardApi.getPortfolio(userId),
        dashboardApi.getAssets(),
        dashboardApi.getTransactions(userId),
      ]);

      // Atualiza contexto
      dispatch({ type: 'SET_PORTFOLIO', payload: portfolio });
      dispatch({ type: 'SET_POSITIONS', payload: portfolio.positions });
      dispatch({ type: 'SET_ASSETS', payload: assets });
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      dispatch({ type: 'SET_ERROR', payload: null });

      setHasLoaded(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: 'error' });
    }
  }, [userId, dispatch, hasLoaded]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    isLoading: loadingState === 'loading',
    isError: loadingState === 'error',
    error,
  };
};

// ============================================================================
// HOOK: CALCULAR MÉTRICAS DO PORTFÓLIO
// ============================================================================

interface PortfolioMetrics {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  bestPosition: Position | null;
  worstPosition: Position | null;
  topAssets: Asset[];
}

/**
 * Hook para calcular métricas do portfólio
 * 
 * RESPONSABILIDADES:
 * - Calcula totais
 * - Encontra melhor/pior posição
 * - Ordena top assets
 * 
 * USO:
 * const metrics = usePortfolioMetrics();
 */
export const usePortfolioMetrics = (): PortfolioMetrics => {
  const state = useDashboardState();

  return {
    totalValue: state.portfolio?.totalValue ?? 0,
    totalInvested: state.portfolio?.totalInvested ?? 0,
    totalGainLoss: state.portfolio?.totalGainLoss ?? 0,
    totalGainLossPercent: state.portfolio?.totalGainLossPercent ?? 0,
    bestPosition:
      state.positions.length > 0
        ? state.positions.reduce((best, pos) =>
            pos.gainLossPercent > best.gainLossPercent ? pos : best
          )
        : null,
    worstPosition:
      state.positions.length > 0
        ? state.positions.reduce((worst, pos) =>
            pos.gainLossPercent < worst.gainLossPercent ? pos : worst
          )
        : null,
    topAssets: state.assets
      .sort((a, b) => b.currentPrice - a.currentPrice)
      .slice(0, 5),
  };
};

// ============================================================================
// HOOK: REFRESCAR PREÇOS (POLLING)
// ============================================================================

/**
 * Hook para atualizar preços em tempo real
 * 
 * RESPONSABILIDADES:
 * - Faz polling de preços a cada intervalo
 * - Para quando componente desmonta
 * - Permite controlar intervalo de update
 * 
 * USO:
 * useRefreshPrices(30000); // Atualiza a cada 30s
 */
export const useRefreshPrices = (intervalMs: number = 30000) => {
  const dispatch = useDashboardDispatch();

  useEffect(() => {
    if (intervalMs <= 0) return;

    const interval = setInterval(async () => {
      try {
        const updatedAssets = await dashboardApi.refreshPrices();
        dispatch({ type: 'SET_ASSETS', payload: updatedAssets });
      } catch (error) {
        console.error('Erro ao atualizar preços:', error);
      }
    }, intervalMs);

    // Cleanup: para o intervalo quando componente desmonta
    return () => clearInterval(interval);
  }, [intervalMs, dispatch]);
};

// ============================================================================
// HOOK: CRIAR TRANSAÇÃO
// ============================================================================

/**
 * Hook para criar nova transação
 * 
 * RESPONSABILIDADES:
 * - Valida dados
 * - Faz chamada à API
 * - Atualiza estado local
 * - Retorna função para disparar ação
 * 
 * USO:
 * const { execute, isLoading } = useCreateTransaction();
 * await execute(userId, transactionData);
 */
export const useCreateTransaction = () => {
  const dispatch = useDashboardDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (userId: string, transactionData: any) => {
      setIsLoading(true);
      setError(null);

      try {
        const newTransaction = await dashboardApi.createTransaction(
          userId,
          transactionData
        );

        // Atualiza lista de transações no contexto
        dispatch({
          type: 'SET_TRANSACTIONS',
          payload: [...(dispatch as any)?.state?.transactions, newTransaction],
        });

        return newTransaction;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao criar transação';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  return { execute, isLoading, error };
};

// ============================================================================
// HOOK: FILTRAR E BUSCAR POSIÇÕES
// ============================================================================

/**
 * Hook para filtrar e buscar posições
 * 
 * USO:
 * const filtered = useFilterPositions('BTC'); // busca por símbolo
 */
export const useFilterPositions = (searchTerm: string = '') => {
  const state = useDashboardState();
  const [filtered, setFiltered] = useState(state.positions);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(state.positions);
      return;
    }

    const term = searchTerm.toLowerCase();
    const result = state.positions.filter(
      (pos) =>
        pos.asset.name.toLowerCase().includes(term) ||
        pos.asset.symbol.toLowerCase().includes(term)
    );

    setFiltered(result);
  }, [searchTerm, state.positions]);

  return filtered;
};
