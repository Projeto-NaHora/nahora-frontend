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
  location: string;
  experienceYears: string;
  // Profile step 2 — Specialties
  about: string;
  especialidades: string[];
  // Profile step 3 — Portfolio
  portfolioPhotos: string[];
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
  setLocation: (location: string) => void;
  setExperienceYears: (years: string) => void;
  setAbout: (about: string) => void;
  setEspecialidades: (tags: string[]) => void;
  addPortfolioPhoto: (uri: string) => void;
  removePortfolioPhoto: (index: number) => void;
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
  location: "",
  experienceYears: "",
  about: "",
  especialidades: [],
  portfolioPhotos: [],
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
  setLocation: (location) => set({ location }),
  setExperienceYears: (experienceYears) => set({ experienceYears }),
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
  reset: () => set({ ...initialState }),
}));
