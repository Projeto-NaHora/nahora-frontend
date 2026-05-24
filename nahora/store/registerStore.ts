import { create } from "zustand";

import type { TipoUsuarioApp } from "@/types/enums";

export type ProfessionOption = {
  id: string;
  label: string;
  icon: string;
};

type RegisterState = {
  role: TipoUsuarioApp | null;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profession: ProfessionOption | null;
  rgFrontUri: string | null;
  rgBackUri: string | null;
  selfieUri: string | null;
  // Uploaded document URLs
  rgFrontUrl: string | null;
  rgBackUrl: string | null;
  selfieUrl: string | null;
  // Profile step 1 — Personal details
  profilePhotoUri: string | null;
  cpf: string;
  cargo: string;
  experienceYears: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  latitude: number | null;
  longitude: number | null;
  raioAtuacaoKm: string;
  // Profile step 2 — Specialties
  about: string;
  especialidades: string[];
  // Profile step 3 — Portfolio
  portfolioPhotos: string[];
  portfolioUrls: string[];
  setRole: (role: TipoUsuarioApp) => void;
  setPhone: (phone: string) => void;
  setName: (firstName: string, lastName: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setProfession: (profession: ProfessionOption) => void;
  setRgFrontUri: (uri: string | null) => void;
  setRgBackUri: (uri: string | null) => void;
  setSelfieUri: (uri: string | null) => void;
  setRgFrontUrl: (url: string | null) => void;
  setRgBackUrl: (url: string | null) => void;
  setSelfieUrl: (url: string | null) => void;
  setProfilePhotoUri: (uri: string | null) => void;
  setCpf: (cpf: string) => void;
  setCargo: (cargo: string) => void;
  setExperienceYears: (years: string) => void;
  setCep: (cep: string) => void;
  setLogradouro: (logradouro: string) => void;
  setNumero: (numero: string) => void;
  setComplemento: (complemento: string) => void;
  setBairro: (bairro: string) => void;
  setCidade: (cidade: string) => void;
  setEstado: (estado: string) => void;
  setLatitude: (latitude: number | null) => void;
  setLongitude: (longitude: number | null) => void;
  setRaioAtuacaoKm: (raioAtuacaoKm: string) => void;
  setAbout: (about: string) => void;
  setEspecialidades: (tags: string[]) => void;
  addPortfolioPhoto: (uri: string) => void;
  removePortfolioPhoto: (index: number) => void;
  setPortfolioUrls: (urls: string[]) => void;
  reset: () => void;
};

const initialState = {
  role: null,
  phone: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  profession: null,
  rgFrontUri: null,
  rgBackUri: null,
  selfieUri: null,
  rgFrontUrl: null,
  rgBackUrl: null,
  selfieUrl: null,
  profilePhotoUri: null,
  cpf: "",
  cargo: "",
  experienceYears: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  latitude: null,
  longitude: null,
  raioAtuacaoKm: "",
  about: "",
  especialidades: [],
  portfolioPhotos: [],
  portfolioUrls: [],
};

export const useRegisterStore = create<RegisterState>((set) => ({
  ...initialState,
  setRole: (role) => set({ role }),
  setPhone: (phone) => set({ phone }),
  setName: (firstName, lastName) => set({ firstName, lastName }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setProfession: (profession) => set({ profession }),
  setRgFrontUri: (rgFrontUri) => set({ rgFrontUri }),
  setRgBackUri: (rgBackUri) => set({ rgBackUri }),
  setSelfieUri: (selfieUri) => set({ selfieUri }),
  setRgFrontUrl: (rgFrontUrl) => set({ rgFrontUrl }),
  setRgBackUrl: (rgBackUrl) => set({ rgBackUrl }),
  setSelfieUrl: (selfieUrl) => set({ selfieUrl }),
  setProfilePhotoUri: (profilePhotoUri) => set({ profilePhotoUri }),
  setCpf: (cpf) => set({ cpf }),
  setCargo: (cargo) => set({ cargo }),
  setExperienceYears: (experienceYears) => set({ experienceYears }),
  setCep: (cep) => set({ cep }),
  setLogradouro: (logradouro) => set({ logradouro }),
  setNumero: (numero) => set({ numero }),
  setComplemento: (complemento) => set({ complemento }),
  setBairro: (bairro) => set({ bairro }),
  setCidade: (cidade) => set({ cidade }),
  setEstado: (estado) => set({ estado }),
  setLatitude: (latitude) => set({ latitude }),
  setLongitude: (longitude) => set({ longitude }),
  setRaioAtuacaoKm: (raioAtuacaoKm) => set({ raioAtuacaoKm }),
  setAbout: (about) => set({ about }),
  setEspecialidades: (especialidades) => set({ especialidades }),
  addPortfolioPhoto: (uri) =>
    set((state) => ({
      portfolioPhotos: [...state.portfolioPhotos, uri],
    })),
  removePortfolioPhoto: (index) =>
    set((state) => ({
      portfolioPhotos: state.portfolioPhotos.filter((_, i) => i !== index),
    })),
  setPortfolioUrls: (portfolioUrls) => set({ portfolioUrls }),
  reset: () => set({ ...initialState }),
}));
