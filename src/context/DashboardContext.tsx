/**
 * CONTEXTO GLOBAL DO DASHBOARD
 * 
 * WHY:
 * - Centraliza estado compartilhado entre componentes
 * - Evita prop drilling excessivo
 * - Facilita sincronização de dados
 * 
 * COMO FUNCIONA:
 * 1. DashboardProvider envolve a aplicação
 * 2. Componentes consomem contexto via useDashboard hook
 * 3. Ações são despachadas para atualizar estado
 */

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';

import type {
  DashboardState,
  Portfolio,
  Position,
  Asset,
  Transaction,
  LoadingState,
} from '../types';

// ============================================================================
// TIPOS DAS AÇÕES
// ============================================================================

type DashboardAction =
  | { type: 'SET_LOADING'; payload: LoadingState }
  | { type: 'SET_PORTFOLIO'; payload: Portfolio }
  | { type: 'SET_POSITIONS'; payload: Position[] }
  | { type: 'SET_ASSETS'; payload: Asset[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const initialState: DashboardState = {
  portfolio: null,
  positions: [],
  assets: [],
  transactions: [],
  loadingState: 'idle',
  error: null,
  lastSyncTime: null,
};

// ============================================================================
// REDUCER
// ============================================================================

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loadingState: action.payload,
        error: action.payload === 'error' ? state.error : null,
      };

    case 'SET_PORTFOLIO':
      return {
        ...state,
        portfolio: action.payload,
        lastSyncTime: new Date(),
        loadingState: 'success',
      };

    case 'SET_POSITIONS':
      return {
        ...state,
        positions: action.payload,
        lastSyncTime: new Date(),
      };

    case 'SET_ASSETS':
      return {
        ...state,
        assets: action.payload,
      };

    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loadingState: action.payload ? 'error' : state.loadingState,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
};

// ============================================================================
// CONTEXTO
// ============================================================================

interface DashboardContextType {
  state: DashboardState;
  dispatch: Dispatch<DashboardAction>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// ============================================================================
// PROVIDER
// ============================================================================

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

// ============================================================================
// HOOK CUSTOMIZADO
// ============================================================================

/**
 * Hook para acessar o contexto do dashboard
 * 
 * IMPORTANTE: Deve ser usado dentro de <DashboardProvider>
 * 
 * Exemplo de uso:
 * const { state, dispatch } = useDashboard();
 */
export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      'useDashboard deve ser usado dentro de <DashboardProvider>'
    );
  }

  return context;
};

// ============================================================================
// HOOKS PARA AÇÕES ESPECÍFICAS (CONVENIENTES)
// ============================================================================

/**
 * Hook para obter apenas o estado (sem precisar acessar state.state)
 */
export const useDashboardState = () => {
  const { state } = useDashboard();
  return state;
};

/**
 * Hook para obter apenas o dispatch (sem precisar acessar dispatch.dispatch)
 */
export const useDashboardDispatch = () => {
  const { dispatch } = useDashboard();
  return dispatch;
};
