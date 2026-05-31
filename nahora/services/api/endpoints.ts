// services/api/endpoints.ts
export const ENDPOINTS = {
  // Upload de arquivos
  UPLOAD_DOCUMENTO: "/files/upload",

  // Auth (público — sem JWT)
  ENVIAR_OTP: "/auth/enviar-otp",
  VERIFICAR_OTP: "/auth/verificar-otp",
  CADASTRO_NOME: "/auth/cadastro/nome",
  CADASTRO_EMAIL: "/auth/cadastro/email",
  CADASTRO_SENHA: "/auth/cadastro/senha",
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
  PEDIDO_PUBLICO: (id: number) => `/pedidos/${id}/public`,

  // Propostas
  PROPOSTAS: (pedidoId: number) => `/pedidos/${pedidoId}/propostas`,
  CRIAR_PROPOSTA: (pedidoId: number) => `/pedidos/${pedidoId}/propostas`,
  PROPOSTA: (pedidoId: number, propostaId: number) =>
    `/pedidos/${pedidoId}/propostas/${propostaId}`,
  ACEITAR_PROPOSTA: (pedidoId: number, propostaId: number) =>
    `/pedidos/${pedidoId}/propostas/${propostaId}/aceitar`,
  RECUSAR_PROPOSTA: (pedidoId: number, propostaId: number) =>
    `/pedidos/${pedidoId}/propostas/${propostaId}/recusar`,

  // Chat (conversation list + message history REST)
  CONVERSAS: "/conversas",
  MENSAGENS: (conversaId: number) => `/conversas/${conversaId}/mensagens`,
  PROPOSTA_CONVERSA: (propostaId: number) =>
    `/propostas/${propostaId}/conversa`,

  // Pagamentos
  PAGAMENTO: (propostaId: number) => `/propostas/${propostaId}/pagamento`,
  CONFIRMAR_CONCLUSAO: (pedidoId: number) => `/pedidos/${pedidoId}/confirmar`,

  // Avaliações
  AVALIAR: (pedidoId: number) => `/pedidos/${pedidoId}/avaliacoes`,

  // Notificações
  NOTIFICACOES: "/notificacoes",
  MARCAR_LIDA: (id: number) => `/notificacoes/${id}/lida`,

  // Perfil / cadastro profissional
  COMPLETAR_PERFIL: "/profissionais/perfil",
  PROFISSIONAL_CATEGORIA: "/profissionais/categoria",
  PROFISSIONAL_DOCUMENTOS: "/profissionais/documentos",
  PERFIL_CLIENTE: "/clientes/me",
  PERFIL_PROFISSIONAL: "/profissionais/me",
  UPLOAD_PROFILE_PHOTO: "/files/upload/profile",
  PROFISSIONAL: (id: number) => `/profissionais/${id}`,
  PROFISSIONAIS: "/profissionais",

  // Favoritos
  FAVORITOS: "/clientes/me/favoritos",
  FAVORITAR: (id: number) => `/profissionais/${id}/favoritar`,
} as const;
