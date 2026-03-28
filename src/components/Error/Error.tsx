/**
 * ERROR - Componente de exibição de erros
 * 
 * USO:
 * <Error 
 *   message="Algo deu errado!" 
 *   onRetry={() => refetch()}
 * />
 * 
 * CARACTERÍSTICAS:
 * - Exibe mensagem de erro
 * - Botão retry opcional
 * - Estilos visuais claros (vermelho)
 * - Ícone de alerta
 */

export interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export const Error = ({ message, onRetry }: ErrorProps) => {
  return (
    <div className="error-box">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>Erro</h3>
        <p>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="error-retry"
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
};
