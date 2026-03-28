/**
 * LOADING - Indicador de carregamento animado
 * 
 * USO:
 * <Loading message="Carregando dados..." size="medium" />
 * 
 * CARACTERÍSTICAS:
 * - Spinner animado
 * - Mensagem customizável
 * - Tamanhos: small, medium, large
 * - Animação suave com CSS
 */

export interface LoadingProps {
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
