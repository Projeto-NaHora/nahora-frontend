// features/profile/hooks/useEditProfileForm.ts
// Hook para o fluxo de edição de perfil público (public-profile-1/2/3).
// Usa mock enquanto o endpoint PUT /profissionais/me não está pronto.

import { useState, useCallback } from "react";

// ---- MOCK: remover e substituir por GET /profissionais/me ----
const MOCK_PROFILE = {
  nome: "Roberto Barbosa",
  cargo: "Eletricista",
  experienceYears: "12",
  profilePhotoUri: null as string | null,
  cep: "50000000",
  logradouro: "Rua da Aurora",
  numero: "123",
  complemento: "Apto 45",
  bairro: "Boa Vista",
  cidade: "Recife",
  estado: "PE",
  raioAtuacaoKm: "10",
  about: "Eletricista com mais de 10 anos de experiência em instalações residenciais e comerciais.",
  especialidades: ["Instalação Elétrica", "Manutenção", "Quadros de Distribuição"] as string[],
  portfolioPhotos: [] as string[],
  latitude: -8.0475 as number | null,
  longitude: -34.8770 as number | null,
};

export function useEditProfileForm() {
  const [nome, setNome] = useState(MOCK_PROFILE.nome);
  const [cargo, setCargo] = useState(MOCK_PROFILE.cargo);
  const [experienceYears, setExperienceYears] = useState(MOCK_PROFILE.experienceYears);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(MOCK_PROFILE.profilePhotoUri);
  const [cep, setCep] = useState(MOCK_PROFILE.cep);
  const [logradouro, setLogradouro] = useState(MOCK_PROFILE.logradouro);
  const [numero, setNumero] = useState(MOCK_PROFILE.numero);
  const [complemento, setComplemento] = useState(MOCK_PROFILE.complemento);
  const [bairro, setBairro] = useState(MOCK_PROFILE.bairro);
  const [cidade, setCidade] = useState(MOCK_PROFILE.cidade);
  const [estado, setEstado] = useState(MOCK_PROFILE.estado);
  const [raioAtuacaoKm, setRaioAtuacaoKm] = useState(MOCK_PROFILE.raioAtuacaoKm);
  const [about, setAbout] = useState(MOCK_PROFILE.about);
  const [especialidades, setEspecialidades] = useState<string[]>(MOCK_PROFILE.especialidades);
  const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>(MOCK_PROFILE.portfolioPhotos);
  const [latitude, setLatitude] = useState<number | null>(MOCK_PROFILE.latitude);
  const [longitude, setLongitude] = useState<number | null>(MOCK_PROFILE.longitude);

  // ---- Substituir por chamada PUT /profissionais/me ----
  const saveProfile = useCallback(async () => {
    // TODO: quando o endpoint estiver pronto:
    // const payload = { nome, cargo, ... };
    // await api.put(ENDPOINTS.PERFIL_PROFISSIONAL, payload);
    console.log("[EditProfile] Dados salvos (mock):", {
      nome, cargo, experienceYears, cep, logradouro, numero,
      complemento, bairro, cidade, estado, raioAtuacaoKm,
      about, especialidades, portfolioPhotos, latitude, longitude,
    });
  }, [
    nome, cargo, experienceYears, cep, logradouro, numero,
    complemento, bairro, cidade, estado, raioAtuacaoKm,
    about, especialidades, portfolioPhotos, latitude, longitude,
  ]);

  return {
    // Profile step 1
    nome,
    cargo,
    experienceYears,
    profilePhotoUri,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    raioAtuacaoKm,
    latitude,
    longitude,
    setNome,
    setCargo,
    setExperienceYears,
    setProfilePhotoUri,
    setCep,
    setLogradouro,
    setNumero,
    setComplemento,
    setBairro,
    setCidade,
    setEstado,
    setLatitude,
    setLongitude,
    setRaioAtuacaoKm,
    // Profile step 2
    about,
    especialidades,
    setAbout,
    setEspecialidades,
    // Profile step 3
    portfolioPhotos,
    addPortfolioPhoto: useCallback((uri: string) => {
      setPortfolioPhotos((prev) => [...prev, uri]);
    }, []),
    removePortfolioPhoto: useCallback((index: number) => {
      setPortfolioPhotos((prev) => prev.filter((_, i) => i !== index));
    }, []),
    saveProfile,
  };
}
