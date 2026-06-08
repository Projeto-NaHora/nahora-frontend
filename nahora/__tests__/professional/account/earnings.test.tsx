import React from "react";
import { render, screen } from "@tests/test-utils";

// Mocks
jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));
jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));
jest.mock("@expo/vector-icons/MaterialIcons", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("expo-font", () => ({
  isLoaded: () => true,
  loadAsync: jest.fn(),
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

// Mock the earnings hook with data that includes a servico with statusPagamento=undefined
jest.mock(
  "@/features/professional/historico/hooks/useEarningsHistory",
  () => ({
    useEarningsHistory: () => ({
      ganhos: {
        mes: 5,
        ano: 2026,
        totalRecebido: 450.0,
        totalServicos: 3,
        taxaConclusao: 66.7,
      },
      servicos: [
        {
          pedidoId: 1,
          titulo: "Instalação de chuveiro",
          dataPagamento: "2026-05-15",
          valorRecebido: 200.0,
          statusPagamento: "RECEBIDO",
          clienteNome: "João Silva",
          clienteIniciais: "JS",
        },
        {
          pedidoId: 2,
          titulo: "Reboco de parede",
          dataPagamento: "2026-05-10",
          valorRecebido: 150.0,
          // statusPagamento intentionally undefined — triggers the crash without null guard
          statusPagamento: undefined,
          clienteNome: "Maria Souza",
          clienteIniciais: "MS",
        },
        {
          pedidoId: 3,
          titulo: "Pintura de sala",
          dataPagamento: "2026-05-08",
          valorRecebido: 100.0,
          statusPagamento: "LIBERADO",
          clienteNome: "Carlos Lima",
          clienteIniciais: "CL",
        },
      ],
      isLoading: false,
      error: undefined,
      mesAtual: 5,
      anoAtual: 2026,
      irParaMesAnterior: jest.fn(),
      irParaMesProximo: jest.fn(),
      isCurrentMonth: true,
    }),
  }),
);

import EarningsScreen from "@/app/(professional)/(account)/earnings";

describe("EarningsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing when servico.statusPagamento is undefined (regression)", () => {
    // Should not throw TypeError: Cannot read property 'replace' of undefined
    expect(() => render(<EarningsScreen />)).not.toThrow();

    // Should still render the cards for items with valid status
    expect(screen.getByText("Instalação de chuveiro")).toBeOnTheScreen();
    expect(screen.getByText("Pintura de sala")).toBeOnTheScreen();
  });
});
