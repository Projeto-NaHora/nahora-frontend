import { create } from "zustand";

export interface SuggestedProfessional {
  id: string;
  nome: string;
  categoria: string;
  localizacao: string;
  notaMedia: number;
  totalAvaliacoes: number;
  isPlus: boolean;
}

export interface RecentOrder {
  id: string;
  titulo: string;
  nomeProfissional: string;
  data: string; // ISO ou formato exibido no card
  status: "em_andamento" | "concluido" | "cancelado"; // ajuste conforme enums do backend se necessário
  descricao: string;
}

interface HomeStoreState {
  suggestedProfessionals: SuggestedProfessional[];
  recentOrders: RecentOrder[];
  selectedCategory: string | null;
  setSuggestedProfessionals: (list: SuggestedProfessional[]) => void;
  setRecentOrders: (list: RecentOrder[]) => void;
  setSelectedCategory: (category: string | null) => void;
}

export const useHomeStore = create<HomeStoreState>((set) => ({
  suggestedProfessionals: [],
  recentOrders: [],
  selectedCategory: null,
  setSuggestedProfessionals: (list) => set({ suggestedProfessionals: list }),
  setRecentOrders: (list) => set({ recentOrders: list }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
