/**
 * CARD - Container genérico reutilizável
 * 
 * USO:
 * <Card>
 *   <p>Conteúdo aqui</p>
 * </Card>
 * 
 * CARACTERÍSTICAS:
 * - Sombra suave
 * - Hover com elevação
 * - Borda discreta
 * - Padding consistente
 */

import { type ReactNode } from 'react';

export interface CardProps {
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
