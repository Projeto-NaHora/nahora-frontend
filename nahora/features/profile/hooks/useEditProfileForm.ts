// features/profile/hooks/useEditProfileForm.ts
import { useCallback, useEffect } from "react";
import { mutate } from "swr";
import { useEditProfileStore } from "@/store/editProfileStore";
import { useAuthStore } from "@/store/authStore";
import { profileService } from "@/features/profile/service";
import { profileKeys } from "@/features/profile/hooks/useProfile";

export function useEditProfileForm(opts?: { initialize?: boolean }) {
  const store = useEditProfileStore();

  useEffect(() => {
    if (!opts?.initialize) return;
    let cancelled = false;

    const authNome = useAuthStore.getState().user?.nome ?? "";
    useEditProfileStore.getState().reset();
    useEditProfileStore.getState().setNome(authNome);
    useEditProfileStore.getState().setFetching();

    profileService
      .buscarPerfilParaEdicao()
      .then((data) => {
        if (cancelled) return;
        useEditProfileStore.getState().hydrate({
          nome: data.nome || authNome,
          cargo: data.profissao ?? "",
          experienceYears:
            data.anosExperiencia != null ? String(data.anosExperiencia) : "",
          profilePhotoUri: data.foto ?? null,
          cep: data.cep ?? "",
          logradouro: data.logradouro ?? "",
          numero: data.numero ?? "",
          complemento: data.complemento ?? "",
          bairro: data.bairro ?? "",
          cidade: data.cidade ?? "",
          estado: data.estado ?? "",
          raioAtuacaoKm:
            data.raioAtuacaoKm != null ? String(data.raioAtuacaoKm) : "",
          about: data.bio ?? "",
          especialidades: data.especialidades ?? [],
          portfolioPhotos: data.portfolio ?? [],
          categorias: data.categorias ?? [],
        });
        useEditProfileStore.getState().markLoaded();
      })
      .catch(() => {
        if (cancelled) return;
        useEditProfileStore.getState().markLoaded();
      });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveProfile = useCallback(async () => {
    const s = useEditProfileStore.getState();

    const fotoUrl =
      s.profilePhotoUri && !isRemoteUrl(s.profilePhotoUri)
        ? await profileService.uploadFoto(s.profilePhotoUri, "PERFIL")
        : (s.profilePhotoUri ?? undefined);

    const portfolioUrls = await Promise.all(
      s.portfolioPhotos.map((uri) =>
        isRemoteUrl(uri) ? uri : profileService.uploadFoto(uri, "PORTIFOLIO"),
      ),
    );

    const anos = s.experienceYears ? Number(s.experienceYears) : undefined;
    const raio = s.raioAtuacaoKm ? Number(s.raioAtuacaoKm) : undefined;

    await profileService.salvarPerfil({
      nome: s.nome || undefined,
      profissao: s.cargo || undefined,
      anosExperiencia: anos && !Number.isNaN(anos) ? anos : undefined,
      fotoPerfil: fotoUrl,
      cep: s.cep || undefined,
      logradouro: s.logradouro || undefined,
      numero: s.numero || undefined,
      complemento: s.complemento || undefined,
      bairro: s.bairro || undefined,
      cidade: s.cidade || undefined,
      estado: s.estado || undefined,
      raioAtuacaoKm: raio && !Number.isNaN(raio) ? raio : undefined,
      bio: s.about || undefined,
      especialidades: s.especialidades.length ? s.especialidades : undefined,
      categorias: s.categorias.length ? s.categorias : undefined,
      latitude: s.latitude ?? undefined,
      longitude: s.longitude ?? undefined,
      urlsFotosPortfolio: portfolioUrls.length ? portfolioUrls : undefined,
    });

    // Invalida o cache do SWR para forçar o refetch dos dados do perfil
    await mutate(profileKeys.professionalProfile);
  }, []);


  return {
    nome: store.nome,
    cargo: store.cargo,
    experienceYears: store.experienceYears,
    profilePhotoUri: store.profilePhotoUri,
    cep: store.cep,
    logradouro: store.logradouro,
    numero: store.numero,
    complemento: store.complemento,
    bairro: store.bairro,
    cidade: store.cidade,
    estado: store.estado,
    raioAtuacaoKm: store.raioAtuacaoKm,
    about: store.about,
    cpf: store.cpf,
    especialidades: store.especialidades,
    portfolioPhotos: store.portfolioPhotos,
    categorias: store.categorias,
    latitude: store.latitude,
    longitude: store.longitude,
    isLoaded: store.isLoaded,
    isFetching: store.isFetching,
    setNome: store.setNome,
    setCargo: store.setCargo,
    setExperienceYears: store.setExperienceYears,
    setProfilePhotoUri: store.setProfilePhotoUri,
    setCep: store.setCep,
    setLogradouro: store.setLogradouro,
    setNumero: store.setNumero,
    setComplemento: store.setComplemento,
    setBairro: store.setBairro,
    setCidade: store.setCidade,
    setEstado: store.setEstado,
    setRaioAtuacaoKm: store.setRaioAtuacaoKm,
    setCpf: store.setCpf,
    setAbout: store.setAbout,
    setEspecialidades: store.setEspecialidades,
    setCategorias: store.setCategorias,
    setLatitude: store.setLatitude,
    setLongitude: store.setLongitude,
    addPortfolioPhoto: store.addPortfolioPhoto,
    removePortfolioPhoto: store.removePortfolioPhoto,
    saveProfile,
  };
}

function isRemoteUrl(uri: string) {
  return uri.startsWith("http");
}
