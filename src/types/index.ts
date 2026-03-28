/**
 * TIPOS FUNDAMENTAIS DO DASHBOARD DE INVESTIMENTOS
 * 
 * PRINCÍPIOS:
 * - Tipos bem definidos eliminam bugs em tempo de compilação
 * - Evita any/unknown sem necessidade
 * - Facilita documentação automática e refatorações
 */

export type AssetType = 'stock' | 'fund' | 'fixed-income' | 'crypto' | 'etf';
export type TransactionType = 'buy' | 'sell' | 'dividend' | 'interest';

/**
 * Representa um ativo individual (ação, fundo, etc.)
 */
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  currentPrice: number;
  change24h: number; // Percentual de mudança em 24h
  change24hPercent: number;
}

/**
 * Representa uma posição de investimento do usuário
 * (quantidade de um ativo que ele possui)
 */
export interface Position {
  id: string;
  assetId: string;
  asset: Asset;
  quantity: number;
  averageCost: number;
  currentValue: number; // currentValue = quantity * asset.currentPrice
  gainLoss: number; // lucro/prejuízo em valor monetário
  gainLossPercent: number; // lucro/prejuízo em percentual
}

/**
 * Representa uma transação de compra/venda
 */
export interface Transaction {
  id: string;
  assetId: string;
  asset: Asset;
  type: TransactionType;
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  date: Date;
  notes?: string;
}

/**
 * Representa o portfólio completo do usuário
 */
export interface Portfolio {
  id: string;
  userId: string;
  positions: Position[];
  totalValue: number; // Soma de todos os assets
  totalInvested: number; // Soma do capital investido
  totalGainLoss: number; // Lucro/prejuízo total
  totalGainLossPercent: number; // Percentual do lucro/prejuízo
  lastUpdated: Date;
}

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: Date;
}

/**
 * Estado de carregamento
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Contexto de estado global
 */
export interface DashboardState {
  portfolio: Portfolio | null;
  positions: Position[];
  assets: Asset[];
  transactions: Transaction[];
  loadingState: LoadingState;
  error: string | null;
  lastSyncTime: Date | null;
}
