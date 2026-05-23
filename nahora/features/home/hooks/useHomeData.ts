import { useCallback } from "react";
import {
  useHomeStore,
  SuggestedProfessional,
  RecentOrder,
} from "../../../store/homeStore";

// Dados mockados baseados no Figma (B01)
const MOCK_SUGGESTED_PROFESSIONALS: SuggestedProfessional[] = [
  {
    id: "1",
    nome: "Roberto Barbosa",
    categoria: "Eletricista",
    localizacao: "Vila Mariana, SP",
    notaMedia: 4.9,
    totalAvaliacoes: 124,
    isPlus: true,
  },
  {
    id: "2",
    nome: "Carlos Lima",
    categoria: "Encanador",
    localizacao: "Moema, SP",
    notaMedia: 4.8,
    totalAvaliacoes: 98,
    isPlus: false,
  },
  {
    id: "3",
    nome: "Fernanda Souza",
    categoria: "Pintora",
    localizacao: "Pinheiros, SP",
    notaMedia: 5.0,
    totalAvaliacoes: 76,
    isPlus: true,
  },
];

const MOCK_RECENT_ORDERS: RecentOrder[] = [
  {
    id: "101",
    titulo: "Troca de disjuntor",
    nomeProfissional: "Roberto Barbosa",
    data: "2024-05-10",
    status: "concluido",
    descricao: "Troca do disjuntor principal do quadro de luz.",
  },
  {
    id: "102",
    titulo: "Desentupir pia",
    nomeProfissional: "Carlos Lima",
    data: "2024-05-08",
    status: "em_andamento",
    descricao: "Desentupimento da pia da cozinha.",
  },
];

export function useHomeData() {
  const setSuggestedProfessionals = useHomeStore(
    (s) => s.setSuggestedProfessionals,
  );
  const setRecentOrders = useHomeStore((s) => s.setRecentOrders);

  // Carrega dados mockados
  const loadHomeData = useCallback(() => {
    setSuggestedProfessionals(MOCK_SUGGESTED_PROFESSIONALS);
    setRecentOrders(MOCK_RECENT_ORDERS);
  }, [setSuggestedProfessionals, setRecentOrders]);

  return { loadHomeData };
}
