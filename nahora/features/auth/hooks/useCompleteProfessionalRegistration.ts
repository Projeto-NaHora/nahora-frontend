import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRegisterStore } from "@/store/registerStore";
import { useProfessionalStore } from "@/store/professionalStore";
import { parseApiError } from "@/utils/apiError";
import type { CategoriaServico } from "@/types/enums";
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
    const setTokens = useAuthStore.getState().setTokens;
    const setProfile = useProfessionalStore.getState().setProfile;

    setIsSubmitting(true);
    setErrorMessage(null);
    setErrorStatus(null);

    try {
      // ── 1. Upload portfolio photos ──
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

      // ── 2. Register professional ──
      const anosExperiencia = parseInt(state.experienceYears, 10) || 0;

      const registerPayload = {
        nome: `${state.firstName} ${state.lastName}`.trim(),
        email: state.email,
        telefone: state.phone,
        senha: state.password,
        categoriaServico: state.profession?.id ?? "",
        cpf: state.cpf,
        especialidades: state.especialidades,
        anosExperiencia,
        areaAtuacao: state.location ? [state.location] : [],
        rgFrenteUrl: state.rgFrontUrl!,
        rgVersoUrl: state.rgBackUrl!,
        selfieUrl: state.selfieUrl!,
      };

      const registerData = await authService.registerProfessional(
        registerPayload,
      );

      await setTokens(
        registerData.accessToken,
        registerData.refreshToken,
        registerData.tipoUsuario,
      );

      // ── 3. Complete profile ──
      const categorias: CategoriaServico[] = state.profession?.id
        ? [state.profession.id as CategoriaServico]
        : [];

      const profileData = await authService.completarPerfil({
        bio: state.about,
        categorias,
        especialidades: state.especialidades,
        anosExperiencia,
        urlsFotos: portfolioUrls,
      });

      setProfile(profileData);

      // ── 4. Cleanup & navigate ──
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
