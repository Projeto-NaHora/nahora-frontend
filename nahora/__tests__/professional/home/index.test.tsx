import React from "react";
import { render, screen } from "@tests/test-utils";

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));
jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("@/features/professional/hooks/usePedidosDisponiveis", () => ({
  enrichWithMockData: (pedidos: any) => {
    if (!pedidos) return [];
    return pedidos.map((p: any, i: number) => ({
      ...p,
      clienteNome: ["Maria Silva", "João Lima", "Ana Costa", "Carlos Souza", "Fernanda Rocha"][i % 5],
    }));
  },
  usePedidosDisponiveis: () => ({
    data: {
      content: [
        {
          id: 1,
          descricao: "Descrição do pedido 1",
          categoria: "ELETRICA" as const,
          distanciaKm: 1.2,
          dataPublicacao: "2026-05-17T10:00:00Z",
          urgente: true,
          faixaValorMin: 50,
          faixaValorMax: 150,
          contadorPropostas: 2,
        },
        {
          id: 2,
          descricao: "Descrição do pedido 2",
          categoria: "PEDREIRO" as const,
          distanciaKm: 2.5,
          dataPublicacao: "2026-05-17T09:00:00Z",
          urgente: false,
          faixaValorMin: 100,
          faixaValorMax: 300,
          contadorPropostas: 0,
        },
      ],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 20,
      first: true,
      last: true,
      empty: false,
    },
    isLoading: false,
    isValidating: false,
    error: undefined,
    mutate: jest.fn(),
  }),
}));

import ProfessionalHomeScreen from "@/app/(professional)/(home)/index";

describe("ProfessionalHomeScreen", () => {
  test("renders greeting", () => {
    render(<ProfessionalHomeScreen />);
    expect(screen.getByText(/Olá/)).toBeOnTheScreen();
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
