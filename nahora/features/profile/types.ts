import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  phone: z.string().min(1, "Celular é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export interface ProfessionalProfile {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  fotoPerfil?: string;
}

export interface EditProfilePayload {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
}
