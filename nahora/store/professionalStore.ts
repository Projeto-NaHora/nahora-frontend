import { create } from "zustand";
import type { PerfilProfissionalResponse } from "@/features/auth/types";

interface ProfessionalState {
  profile: PerfilProfissionalResponse | null;
  setProfile: (profile: PerfilProfissionalResponse) => void;
  clear: () => void;
}

export const useProfessionalStore = create<ProfessionalState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clear: () => set({ profile: null }),
}));
