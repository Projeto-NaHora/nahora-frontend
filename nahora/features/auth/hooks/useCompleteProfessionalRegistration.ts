import { useState } from "react";
import { useRegisterStore } from "@/store/registerStore";
import { useProfessionalStore } from "@/store/professionalStore";
import { useAuthStore } from "@/store/authStore";
import { parseApiError } from "@/utils/apiError";
import { profileService } from "@/features/profile/service";
import { authService } from "../service";

type Options = {
  onSuccess: () => void;
};

export function useCompleteProfessionalRegistration({ onSuccess }: Options) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const submit = async () => {
    const state = useRegisterStore.getState();
    const setProfile = useProfessionalStore.getState().setProfile;

    setIsSubmitting(true);
    setErrorMessage(null);
    setErrorStatus(null);

    try {
      // ── 1. Upload profile photo ──
      let fotoPerfil: string | undefined;
      if (state.profilePhotoUri) {
        const result = await authService.uploadDocumento(
          state.profilePhotoUri,
          "PERFIL",
        );
        fotoPerfil = result.url;
      }

      // ── 2. Upload portfolio photos ──
      let portfolioUrls: string[] = [];
      if (state.portfolioPhotos.length > 0) {
        const results = await Promise.all(
          state.portfolioPhotos.map((uri) =>
            authService.uploadDocumento(uri, "PORTIFOLIO"),
          ),
        );
        portfolioUrls = results.map((r) => r.url);
        state.setPortfolioUrls(portfolioUrls);
      }

      // ── 3. Build and send profile ──
      const anosExperiencia = parseInt(state.experienceYears, 10) || 0;
      const raioAtuacaoKm = parseFloat(state.raioAtuacaoKm) || undefined;

      const profileData = await profileService.salvarPerfil({
        nome: state.nome.trim() || undefined,
        email: state.email || undefined,
        cpf: state.cpf || undefined,
        celular: state.phone || undefined,
        fotoPerfil,
        profissao: state.profession?.label || undefined,
        cep: state.cep || undefined,
        logradouro: state.logradouro || undefined,
        numero: state.numero || undefined,
        complemento: state.complemento || undefined,
        bairro: state.bairro || undefined,
        cidade: state.cidade || undefined,
        estado: state.estado || undefined,
        anosExperiencia: anosExperiencia || undefined,
        bio: state.about || undefined,
        especialidades: state.especialidades.length
          ? state.especialidades
          : undefined,
        categorias: state.profession?.id
          ? [state.profession.id]
          : undefined,
        raioAtuacaoKm,
        latitude: state.latitude ?? undefined,
        longitude: state.longitude ?? undefined,
        urlsFotosPortfolio: portfolioUrls.length ? portfolioUrls : undefined,
      });

      setProfile(profileData);

      // ── 4. Cleanup & navigate ──
      await useAuthStore.getState().setProfessionalOnboarding(null);
      useRegisterStore.getState().reset();
      onSuccess();
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message);
      setErrorStatus(parsed.statusCode ?? null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submit,
    isSubmitting,
    errorMessage,
    errorStatus,
  };
}
