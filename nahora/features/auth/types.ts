import { z } from "zod";

import type { TipoUsuarioApp } from "@/types/enums";

export const loginSchema = z.object({
  identificador: z.string().min(1, "Informe seu e-mail ou número de telefone"),
  password: z.string().min(1, "Informe sua senha"),
});

export const registerPhoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Informe seu número de telefone")
    .regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Formato inválido. Use (xx) xxxxx-xxxx"),
});

export const registerNameSchema = z.object({
  firstName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres"),
});

export const registerEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .email("Formato de e-mail inválido"),
});

export const registerPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Informe sua senha")
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(
        /[^a-zA-Z0-9]/,
        "A senha deve conter pelo menos um caractere especial",
      ),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterPhoneFormValues = z.infer<typeof registerPhoneSchema>;
export type RegisterNameFormValues = z.infer<typeof registerNameSchema>;
export type RegisterEmailFormValues = z.infer<typeof registerEmailSchema>;
export type RegisterPasswordFormValues = z.infer<typeof registerPasswordSchema>;

export type LoginPayload = {
  identificador: string;
  senha: string;
};

export type RegisterClientPayload = {
  telefone: string;
  nome: string;
  email: string;
  senha: string;
};

export type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
  tipoUsuario: string;
};

export type SendOtpPayload = {
  telefone: string;
};

export type VerifyOtpPayload = {
  telefone: string;
  codigo: string;
};

export type SendOtpResponse = {
  message: string;
};

export type VerifyOtpResponse = {
  message: string;
};

export type RegisterProfessionalPayload = {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  categoriaServico: string;
  cpf: string;
  especialidades: string[];
  anosExperiencia: number;
  areaAtuacao: string[];
  rgFrenteUrl: string;
  rgVersoUrl: string;
  selfieUrl: string;
};

export type UploadDocumentoResponse = {
  url: string;
};

export type DocumentoTipo = "RG_FRENTE" | "RG_VERSO" | "SELFIE";

export interface AuthUser {
  id: number;
  nome: string;
  tipo: TipoUsuarioApp;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tipoUsuario: string;
}
