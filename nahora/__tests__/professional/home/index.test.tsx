import React from "react";
import { render, screen } from "@tests/test-utils";
import { useAuthStore } from "@/store/authStore";
import { createMockUser } from "@tests/factories/auth";

const mockPush = jest.fn();

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));
jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), replace: jest.fn() }),
}));
jest.mock("@/features/professional/hooks/usePedidosDisponiveis", () => ({
  usePedidosDisponiveis: () => ({
    pedidos: [
      {
        id: 1,
        titulo: "Descrição do pedido 1",
        categoria: "ELETRICA" as const,
        distanciaKm: 1.2,
        criadoEm: "2026-05-17T10:00:00",
        nomeCliente: "Maria Silva",
        avaliacaoCliente: 4.8,
        statusPedido: "ABERTO" as const,
      },
      {
        id: 2,
        titulo: "Descrição do pedido 2",
        categoria: "PEDREIRO" as const,
        distanciaKm: 2.5,
        criadoEm: "2026-05-17T09:00:00",
        nomeCliente: "João Lima",
        avaliacaoCliente: 4.5,
        statusPedido: "ABERTO" as const,
      },
    ],
    isLoading: false,
    isLoadingMore: false,
    hasMore: false,
    error: undefined,
    refresh: jest.fn(),
    loadMore: jest.fn(),
  }),
}));

import ProfessionalHomeScreen from "@/app/(professional)/(home)/index";

describe("ProfessionalHomeScreen", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: createMockUser({ nome: "Maria Oliveira", tipo: "PROFISSIONAL" }),
    });
    jest.clearAllMocks();
  });

  test("renders greeting with authenticated user name", () => {
    render(<ProfessionalHomeScreen />);
    expect(screen.getByText(/Olá/)).toBeOnTheScreen();
    expect(screen.getByText("Maria Oliveira!")).toBeOnTheScreen();
  });

  test("renders avatar with authenticated user initials", () => {
    render(<ProfessionalHomeScreen />);
    expect(screen.getByText("MO")).toBeOnTheScreen();
  });

  test("renders Home tab as active", () => {
    render(<ProfessionalHomeScreen />);
    expect(screen.getByText("Home")).toBeOnTheScreen();
  });

  test('renders "Pedidos disponíveis" heading', () => {
    render(<ProfessionalHomeScreen />);
    expect(screen.getByText("Pedidos disponíveis")).toBeOnTheScreen();
  });

  test("renders filter chips", () => {
    render(<ProfessionalHomeScreen />);
    expect(screen.getByText("Todas as áreas")).toBeOnTheScreen();
  });

  test("renders available order cards from data", () => {
    render(<ProfessionalHomeScreen />);
    expect(screen.getByText("Descrição do pedido 1")).toBeOnTheScreen();
    expect(screen.getByText("Descrição do pedido 2")).toBeOnTheScreen();
  });

  test("renders stat cards", () => {
    render(<ProfessionalHomeScreen />);
    expect(screen.getByText("Na área")).toBeOnTheScreen();
    expect(screen.getByText("Avaliação")).toBeOnTheScreen();
    expect(screen.getByText("Este mês")).toBeOnTheScreen();
  });
});
