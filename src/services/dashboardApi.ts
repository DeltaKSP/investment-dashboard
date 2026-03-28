/**
 * CAMADA DE SERVIÇO DE API
 * 
 * WHY:
 * - Centraliza lógica de comunicação com backend
 * - Facilita mocking para testes
 * - Desacopla componentes da lógica de HTTP
 * - Um ponto único para adicionar autenticação, logging, etc.
 * 
 * NOTA: Por enquanto, simulamos a API com dados mockados.
 *       Em produção, usaria Axios/Fetch real.
 */

import type {
  Portfolio,
  Position,
  Asset,
  Transaction,
} from '../types';

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

// API_BASE_URL e API_TIMEOUT mantidos para referência futura quando conectar com backend real
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';
// const API_TIMEOUT = 5000;

// ============================================================================
// TIPOS PARA API DO COINGECKO
// ============================================================================

interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
}

// ============================================================================
// DADOS MOCK (FALLBACK)
// ============================================================================

/**
 * Dados mockados como fallback se API falhar
 * Em produção, vêm do backend real
 */
const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'crypto',
    currentPrice: 66316,
    change24h: -2416.81,
    change24hPercent: -3.52,
  },
  {
    id: 'asset-2',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'crypto',
    currentPrice: 3500,
    change24h: -150,
    change24hPercent: -4.11,
  },
  {
    id: 'asset-3',
    name: 'Cardano',
    symbol: 'ADA',
    type: 'crypto',
    currentPrice: 0.98,
    change24h: 0.05,
    change24hPercent: 5.38,
  },
];

const mockPositions: Position[] = [
  {
    id: 'pos-1',
    assetId: 'bitcoin',
    asset: mockAssets[0],
    quantity: 0.5,
    averageCost: 45000,
    currentValue: 33158,
    gainLoss: 13158,
    gainLossPercent: 47.36,
  },
  {
    id: 'pos-2',
    assetId: 'ethereum',
    asset: mockAssets[1],
    quantity: 2,
    averageCost: 2000,
    currentValue: 7000,
    gainLoss: 3000,
    gainLossPercent: 75,
  },
];

const mockPortfolio: Portfolio = {
  id: 'portfolio-1',
  userId: 'user-1',
  positions: mockPositions,
  totalValue: 40158,
  totalInvested: 19000,
  totalGainLoss: 21158,
  totalGainLossPercent: 111.36,
  lastUpdated: new Date(),
};

// @ts-ignore - mockPortfolio é mantido para referência
const mockTransactions: Transaction[] = [
    {
    id: 'tx-1',
    assetId: 'bitcoin',
    asset: mockAssets[0],
    type: 'buy',
    quantity: 0.5,
    pricePerUnit: 45000,
    totalValue: 22500,
    date: new Date('2024-01-15'),
  },
  {
    id: 'tx-2',
    assetId: 'ethereum',
    asset: mockAssets[1],
    type: 'buy',
    quantity: 2,
    pricePerUnit: 2000,
    totalValue: 4000,
    date: new Date('2024-02-20'),
  },
];

// ============================================================================
// HELPER PARA REQUISIÇÕES
// ============================================================================

/**
 * Busca dados de ativos do CoinGecko
 */
async function fetchCoinGeckoData(): Promise<Asset[]> {
  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '10',
      sparkline: 'false',
    });

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status ${response.status}`);
    }

    const data: CoinGeckoMarketData[] = await response.json();

    // Transforma dados da API em Assets
    return data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      type: 'crypto' as const,
      currentPrice: coin.current_price,
      change24h: coin.price_change_24h ?? 0,
      change24hPercent: coin.price_change_percentage_24h ?? 0,
    }));
  } catch (error) {
    console.error('Erro ao buscar dados do CoinGecko:', error);
    // Retorna dados mock se API falhar
    return mockAssets;
  }
}

/**
 * Simula uma requisição HTTP com delay (para dados mock)
 */
async function simulateApiCall<T>(data: T, delayMs = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}

/**
 * Cria posições simuladas a partir dos ativos
 * Em produção, viriam do banco de dados do usuário
 */
function generateMockPositions(assets: Asset[]): Position[] {
  // Simula que o usuário tem investimento nos 3 primeiros ativos
  return assets.slice(0, 3).map((asset, index) => {
    // Preço médio simulado (menor que o preço atual para mostrar ganho)
    const averageCost = asset.currentPrice * (0.7 + Math.random() * 0.1);
    const quantity = [0.5, 2, 100][index]; // Quantidade varia por ativo
    const currentValue = quantity * asset.currentPrice;
    const gainLoss = currentValue - quantity * averageCost;
    const gainLossPercent = (gainLoss / (quantity * averageCost)) * 100;

    return {
      id: `pos-${asset.id}`,
      assetId: asset.id,
      asset,
      quantity,
      averageCost,
      currentValue,
      gainLoss,
      gainLossPercent,
    };
  });
}

/**
 * Calcula portfólio a partir das posições
 */
function calculatePortfolio(positions: Position[]): Portfolio {
  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalInvested = positions.reduce(
    (sum, pos) => sum + pos.quantity * pos.averageCost,
    0
  );
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return {
    id: 'portfolio-1',
    userId: 'user-1',
    positions,
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    lastUpdated: new Date(),
  };
}

// ============================================================================
// SERVIÇO DE API - MÉTODOS PÚBLICOS
// ============================================================================

export const dashboardApi = {
  /**
   * Busca o portfólio do usuário
   * 
   * Em produção: GET /users/{userId}/portfolio
   */
  async getPortfolio(_userId: string): Promise<Portfolio> {
    const assets = await fetchCoinGeckoData();
    const positions = generateMockPositions(assets);
    return calculatePortfolio(positions);
  },

  /**
   * Busca todas as posições do usuário
   * 
   * Em produção: GET /users/{userId}/positions
   */
  async getPositions(_userId: string): Promise<Position[]> {
    const assets = await fetchCoinGeckoData();
    return generateMockPositions(assets);
  },

  /**
   * Busca lista de ativos disponíveis
   * 
   * Em produção: GET /assets
   * Agora busca dados reais do CoinGecko
   */
  async getAssets(): Promise<Asset[]> {
    return fetchCoinGeckoData();
  },

  /**
   * Busca histórico de transações
   * 
   * Em produção: GET /users/{userId}/transactions
   */
  async getTransactions(_userId: string): Promise<Transaction[]> {
    return simulateApiCall(mockTransactions, 1000);
  },

  /**
   * Obtém preço/dados atualizados de um ativo
   * 
   * Em produção: GET /assets/{assetId}/price
   */
  async getAssetPrice(assetId: string): Promise<Asset> {
    const assets = await fetchCoinGeckoData();
    const asset = assets.find((a) => a.id === assetId);
    
    if (!asset) {
      throw new Error(`Asset ${assetId} not found`);
    }
    
    return asset;
  },

  /**
   * Cria uma nova transação
   * 
   * Em produção: POST /users/{userId}/transactions
   */
  async createTransaction(
    _userId: string,
    transaction: Omit<Transaction, 'id' | 'date'>
  ): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
      date: new Date(),
    };
    return simulateApiCall(newTransaction, 600);
  },

  /**
   * Atualiza preços em tempo real (para polling/websocket)
   * 
   * Em produção: seria feito via WebSocket em tempo real
   */
  async refreshPrices(): Promise<Asset[]> {
    return fetchCoinGeckoData();
  },
};

// ============================================================================
// TIPOS EXPORTADOS
// ============================================================================

export type DashboardApi = typeof dashboardApi;
