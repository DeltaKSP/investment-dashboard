/**
 * ASSET ITEM - Exibe um ativo disponível
 * 
 * USO:
 * <AssetItem 
 *   asset={bitcoin}
 *   onClick={() => navigate(`/assets/${asset.id}`)}
 * />
 * 
 * CARACTERÍSTICAS:
 * - Layout horizontal com informações estruturadas
 * - Preço em tempo real
 * - Variação 24h com indicador visual (↑/↓)
 * - Cores dinâmicas (verde alta, vermelho queda)
 * - Hover visual
 * - Clicável para detalhes
 * 
 * DADOS EXIBIDOS:
 * - Símbolo e nome do ativo
 * - Preço atual em USD
 * - Mudança 24h em valor absoluto
 * - Variação 24h em percentual
 */

import type { Asset } from '../../types';

export interface AssetItemProps {
  asset: Asset;
  onClick?: () => void;
}

export const AssetItem = ({ asset, onClick }: AssetItemProps) => {
  const isUp = asset.change24h >= 0;

  return (
    <div
      onClick={onClick}
      className="asset-item"
    >
      <div className="asset-info">
        <div className="asset-symbol">
          <span className="asset-symbol-name">{asset.symbol}</span>
          <span className="asset-symbol-subtitle">{asset.name}</span>
        </div>
      </div>

      <div className="asset-stats">
        <div className="stat-group">
          <span className="stat-group-label">Preço Atual</span>
          <span className="stat-group-value">${asset.currentPrice.toFixed(2)}</span>
        </div>
        <div className="stat-group">
          <span className="stat-group-label">Mudança 24h</span>
          <span className="stat-group-value" style={{ color: isUp ? '#059669' : '#DC2626' }}>
            ${Math.abs(asset.change24h).toFixed(2)}
          </span>
        </div>
        <div className="stat-group">
          <span className="stat-group-label">Variação 24h</span>
          <span className={`change-percentage ${isUp ? 'positive' : 'negative'}`}>
            {isUp ? '↑' : '↓'} {Math.abs(asset.change24hPercent).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
