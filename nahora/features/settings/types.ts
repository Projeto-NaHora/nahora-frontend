// features/settings/types.ts

/** GET /api/v1/usuarios/preferencias */
export interface UserPreferences {
  notificacoesPush: boolean;
  mensagensWhatsapp: boolean;
  emailsPromocionais: boolean;
}

/** PATCH /api/v1/usuarios/preferencias */
export interface UpdatePreferencesPayload {
  notificacoesPush?: boolean;
  mensagensWhatsapp?: boolean;
  emailsPromocionais?: boolean;
}

export type DisplayMode = "light" | "dark" | "system";

/** PUT /api/v1/usuarios/senha */
export interface ChangePasswordPayload {
  senhaAtual: string;
  novaSenha: string;
}
