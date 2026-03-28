/**
 * COMPONENTES BÁSICOS - REUTILIZÁVEIS
 * 
 * PRINCÍPIOS:
 * - Componentes pequenos e sem lógica de negócios
 * - Focados apenas em renderizar UI
 * - Props bem tipadas
 * - Fáceis de testar
 */

import { type ReactNode } from 'react';

// ============================================================================
// CARD - Container genérico
// ============================================================================

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6 border border-gray-200
        hover:shadow-lg transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ============================================================================
// STAT CARD - Exibe uma estatística
// ============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changePercent?: number;
  isNegative?: boolean;
  icon?: ReactNode;
}

export const StatCard = ({
  label,
  value,
  change,
  changePercent,
  isNegative = false,
  icon,
}: StatCardProps) => {
  const textColor = isNegative ? 'text-red-600' : 'text-green-600';

  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="text-2xl font-bold text-gray-900">{value}</div>

      {change !== undefined && changePercent !== undefined && (
        <div className={`text-sm font-semibold ${textColor}`}>
          {isNegative ? '-' : '+'}
          {change} ({changePercent}%)
        </div>
      )}
    </Card>
  );
};

// ============================================================================
// LOADING - Indicador de carregamento
// ============================================================================

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const Loading = ({
  message = 'Carregando...',
  size = 'medium',
}: LoadingProps) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-3">
      <div className={`${sizeClass} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

// ============================================================================
// ERROR - Exibe erro
// ============================================================================

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export const Error = ({ message, onRetry }: ErrorProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start space-x-3">
        <div className="text-red-600 text-lg">⚠️</div>
        <div>
          <h3 className="font-semibold text-red-900">Erro</h3>
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-red-600 hover:text-red-700 underline"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};

// ============================================================================
// POSITION ITEM - Exibe uma posição do portfólio
// ============================================================================

import type { Position } from '../types';

interface PositionItemProps {
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

// ============================================================================
// ASSET ITEM - Exibe um ativo disponível
// ============================================================================

import type { Asset } from '../types';

interface AssetItemProps {
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

// ============================================================================
// BUTTON - Botão reutilizável
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const baseClass =
    'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClass = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant];

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseClass} ${variantClass}`}
    >
      {isLoading ? '⏳ Carregando...' : children}
    </button>
  );
};
