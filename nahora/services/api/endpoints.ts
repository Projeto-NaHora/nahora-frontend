// services/api/endpoints.ts
export const ENDPOINTS = {
  // Upload de arquivos
  UPLOAD_DOCUMENTO: "/files/upload",

  // Auth (público — sem JWT)
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
  REGISTER_CLIENTE: "/auth/register/cliente",
  REGISTER_PROFISSIONAL: "/auth/register/profissional",
  LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  REFRESH_TOKEN: "/auth/refresh",

  // Pedidos (requer JWT)
  PEDIDOS: "/pedidos",
  PEDIDO: (id: number) => `/pedidos/${id}`,
  MEUS_PEDIDOS: "/pedidos/meus",
  PEDIDOS_DISPONIVEIS: "/pedidos/disponiveis",

  // Propostas
  PROPOSTAS: (pedidoId: number) => `/pedidos/${pedidoId}/propostas`,
  CRIAR_PROPOSTA: (pedidoId: number) => `/pedidos/${pedidoId}/propostas`,
  PROPOSTA: (id: number) => `/propostas/${id}`,
  ACEITAR_PROPOSTA: (id: number) => `/propostas/${id}/aceitar`,
  RECUSAR_PROPOSTA: (id: number) => `/propostas/${id}/recusar`,

  // Chat (histórico REST — mensagens em tempo real via WebSocket)
  CONVERSA: (id: number) => `/conversas/${id}`,
  MENSAGENS: (conversaId: number) => `/conversas/${conversaId}/mensagens`,

  // Pagamentos
  PAGAMENTO: (propostaId: number) => `/propostas/${propostaId}/pagamento`,
  CONFIRMAR_CONCLUSAO: (pedidoId: number) => `/pedidos/${pedidoId}/confirmar`,

  // Avaliações
  AVALIAR: (pedidoId: number) => `/pedidos/${pedidoId}/avaliacoes`,

  // Notificações
  NOTIFICACOES: "/notificacoes",
  MARCAR_LIDA: (id: number) => `/notificacoes/${id}/lida`,

  // Perfil
  COMPLETAR_PERFIL: "/profissionais/perfil",
  PERFIL_CLIENTE: "/clientes/me",
  PERFIL_PROFISSIONAL: "/profissionais/me",
  PROFISSIONAL: (id: number) => `/profissionais/${id}`,
  PROFISSIONAIS: "/profissionais",
} as const;
