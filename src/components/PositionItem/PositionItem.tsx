/**
 * POSITION ITEM - Exibe uma posição do portfólio
 * 
 * USO:
 * <PositionItem 
 *   position={position}
 *   onClick={() => navigate(`/positions/${position.id}`)}
 * />
 * 
 * CARACTERÍSTICAS:
 * - Layout horizontal com informações estruturadas
 * - Cores dinâmicas (verde ganho, vermelho perda)
 * - Hover visual
 * - Clicável para navegação
 * 
 * DADOS EXIBIDOS:
 * - Símbolo e nome do ativo
 * - Quantidade de unidades
 * - Valor atual da posição
 * - Ganho/Perda em valor e %
 */

import type { Position } from '../../types';

export interface PositionItemProps {
  position: Position;
  onClick?: () => void;
}

export const PositionItem = ({ position, onClick }: PositionItemProps) => {
  const isGain = position.gainLoss >= 0;

  return (
    <div
      onClick={onClick}
      className="position-item"
    >
      <div className="position-info">
        <div className="position-symbol">
          <span className="position-symbol-name">{position.asset.symbol}</span>
          <span className="position-symbol-subtitle">{position.asset.name}</span>
        </div>
      </div>

      <div className="position-stats">
        <div className="stat-group">
          <span className="stat-group-label">Quantidade</span>
          <span className="stat-group-value">{position.quantity.toFixed(4)}</span>
        </div>
        <div className="stat-group">
          <span className="stat-group-label">Valor Atual</span>
          <span className="stat-group-value">${position.currentValue.toFixed(2)}</span>
        </div>
        <div className="stat-group">
          <span className="stat-group-label">Resultado</span>
          <span className="stat-group-value" style={{ color: isGain ? '#059669' : '#DC2626' }}>
            ${position.gainLoss.toFixed(2)}
          </span>
        </div>
        <div className="stat-group">
          <span className="stat-group-label">Retorno</span>
          <span className={`change-percentage ${isGain ? 'positive' : 'negative'}`}>
            {isGain ? '↑' : '↓'} {Math.abs(position.gainLossPercent).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
