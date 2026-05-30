import { create } from "zustand";
import type { PerfilProfissionalDTO } from "@/features/profile/types";

interface ProfessionalState {
  profile: PerfilProfissionalDTO | null;
  setProfile: (profile: PerfilProfissionalDTO) => void;
  clear: () => void;
}

export const useProfessionalStore = create<ProfessionalState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clear: () => set({ profile: null }),
}));
