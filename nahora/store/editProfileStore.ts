import { create } from "zustand";

interface EditProfileState {
  nome: string;
  cargo: string;
  experienceYears: string;
  profilePhotoUri: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  raioAtuacaoKm: string;
  about: string;
  cpf: string;
  especialidades: string[];
  portfolioPhotos: string[];
  categorias: string[];
  latitude: number | null;
  longitude: number | null;
  isLoaded: boolean;
  isFetching: boolean;
}

interface EditProfileActions {
  setNome: (v: string) => void;
  setCargo: (v: string) => void;
  setExperienceYears: (v: string) => void;
  setProfilePhotoUri: (v: string | null) => void;
  setCep: (v: string) => void;
  setLogradouro: (v: string) => void;
  setNumero: (v: string) => void;
  setComplemento: (v: string) => void;
  setBairro: (v: string) => void;
  setCidade: (v: string) => void;
  setEstado: (v: string) => void;
  setRaioAtuacaoKm: (v: string) => void;
  setCpf: (v: string) => void;
  setAbout: (v: string) => void;
  setEspecialidades: (v: string[]) => void;
  setCategorias: (v: string[]) => void;
  setLatitude: (v: number | null) => void;
  setLongitude: (v: number | null) => void;
  addPortfolioPhoto: (uri: string) => void;
  removePortfolioPhoto: (index: number) => void;
  hydrate: (data: Partial<EditProfileState>) => void;
  markLoaded: () => void;
  setFetching: () => void;
  reset: () => void;
}

const initialState: EditProfileState = {
  nome: "",
  cargo: "",
  experienceYears: "",
  profilePhotoUri: null,
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  raioAtuacaoKm: "",
  about: "",
  cpf: "",
  especialidades: [],
  portfolioPhotos: [],
  categorias: [],
  latitude: null,
  longitude: null,
  isLoaded: false,
  isFetching: false,
};

export const useEditProfileStore = create<EditProfileState & EditProfileActions>(
  (set) => ({
    ...initialState,
    setNome: (v) => set({ nome: v }),
    setCargo: (v) => set({ cargo: v }),
    setExperienceYears: (v) => set({ experienceYears: v }),
    setProfilePhotoUri: (v) => set({ profilePhotoUri: v }),
    setCep: (v) => set({ cep: v }),
    setLogradouro: (v) => set({ logradouro: v }),
    setNumero: (v) => set({ numero: v }),
    setComplemento: (v) => set({ complemento: v }),
    setBairro: (v) => set({ bairro: v }),
    setCidade: (v) => set({ cidade: v }),
    setEstado: (v) => set({ estado: v }),
    setRaioAtuacaoKm: (v) => set({ raioAtuacaoKm: v }),
    setCpf: (v) => set({ cpf: v }),
    setAbout: (v) => set({ about: v }),
    setEspecialidades: (v) => set({ especialidades: v }),
    setCategorias: (v) => set({ categorias: v }),
    setLatitude: (v) => set({ latitude: v }),
    setLongitude: (v) => set({ longitude: v }),
    addPortfolioPhoto: (uri) =>
      set((s) => ({ portfolioPhotos: [...s.portfolioPhotos, uri] })),
    removePortfolioPhoto: (index) =>
      set((s) => ({
        portfolioPhotos: s.portfolioPhotos.filter((_, i) => i !== index),
      })),
    hydrate: (data) => set(data),
    markLoaded: () => set({ isLoaded: true, isFetching: false }),
    setFetching: () => set({ isFetching: true }),
    reset: () => set(initialState),
  }),
);
