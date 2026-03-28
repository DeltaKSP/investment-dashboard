/**
 * BUTTON - Botão reutilizável com variantes
 * 
 * USO:
 * <Button variant="primary" isLoading={loading}>
 *   Enviar
 * </Button>
 * 
 * VARIANTES:
 * - primary: Azul, ação principal
 * - secondary: Cinza, ação secundária
 * - danger: Vermelho, ação destrutiva
 * 
 * CARACTERÍSTICAS:
 * - Estados: normal, hover, disabled, loading
 * - Transições suaves
 * - Accessível com propriedades HTML
 */

import { type ReactNode } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
