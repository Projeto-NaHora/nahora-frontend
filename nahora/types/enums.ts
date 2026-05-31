// types/enums.ts

export type CategoriaServico =
  | "ELETRICA"
  | "PEDREIRO"
  | "ENCANAMENTO"
  | "PINTURA"
  | "MARCENARIA";

export type Urgencia = "BAIXA" | "NORMAL" | "URGENTE";

export type StatusPedido =
  | "ABERTO"
  | "EM_ANDAMENTO"
  | "AGUARDANDO_VALIDACAO"
  | "CONCLUIDO"
  | "CANCELADO"
  | "EM_DISPUTA";

export type StatusProposta = "PENDENTE" | "ACEITA" | "REJEITADA" | "EXPIRADA";

export type StatusConversa = "ABERTA" | "SOMENTE_LEITURA" | "EM_DISPUTA" | "FECHADA";

export type StatusMensagem = "ENVIADA" | "ENTREGUE" | "LIDA";

export type StatusPagamento =
  | "PENDENTE"
  | "CAPTURADO"
  | "LIBERADO"
  | "REEMBOLSO"
  | "EM_DISPUTA";

export type MetodoPagamento = "PIX" | "CARTAO_CREDITO";

export type StatusVerificacao =
  | "CADASTRO_INCOMPLETO"
  | "AGUARDANDO_VERIFICACAO"
  | "VERIFICADO"
  | "REJEITADO";

export type TipoNotificacao =
  | "NOVO_PEDIDO"
  | "NOVA_PROPOSTA"
  | "PROPOSTA_ACEITA"
  | "NOVA_MENSAGEM"
  | "SERVICO_CONCLUIDO"
  | "PAGAMENTO_LIBERADO"
  | "DISPUTA_ABERTA"
  | "AVALIACAO_RECEBIDA"
  | "VERIFICACAO_APROVADA";

export type MotivoDenuncia =
  | "FRAUDE"
  | "ASSEDIO"
  | "SERVICO_RUIM"
  | "NAO_COMPARECEU"
  | "CONTATO_FORA_APP"
  | "PERFIL_FALSO"
  | "OUTRO";

export type TipoUsuario = "CLIENTE" | "PROFISSIONAL" | "ADMIN";

export type TipoUsuarioApp = Exclude<TipoUsuario, "ADMIN">;
