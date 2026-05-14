import type { TipoUsuario } from "@/types/enums";

export interface Mensagem {
  /**
   * ID único da mensagem gerado pelo backend.
   */
  id: number;

  /**
   * ID da conversa (vinculada à proposta) a qual esta mensagem pertence.
   */
  conversaId: number;

  /**
   * O texto enviado pelo usuário.
   */
  conteudo: string;

  /**
   * ID do usuário que enviou a mensagem (pode ser o ID do Cliente ou do Profissional).
   */
  remetenteId: number;

  /**
   * Define se quem enviou foi um CLIENTE ou PROFISSIONAL.
   * Crucial para a UI decidir se a bolha de chat fica na esquerda ou direita.
   */
  tipoRemetente: TipoUsuario;

  /**
   * Data e hora exata que o backend registrou a mensagem (formato ISO 8601).
   */
  criadoEm: string;

  /**
   * (Opcional) Flag para indicar se a mensagem já foi lida pela outra parte.
   */
  lida?: boolean;
}
