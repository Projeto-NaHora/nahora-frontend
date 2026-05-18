import React from "react";
import { render, screen, fireEvent } from "@tests/test-utils";
import PropostasScreen from "@/app/(client)/(orders)/[orderId]/proposals";
import { createMockPropostaList } from "@tests/factories/proposals";

jest.mock("@/features/proposals/hooks/useProposals", () => ({
  useProposalsByPedido: jest.fn(),
}));

jest.mock("@/features/orders/hooks/useOrders", () => ({
  useOrderDetail: jest.fn(),
}));

import { useProposalsByPedido } from "@/features/proposals/hooks/useProposals";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";

const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
  useLocalSearchParams: () => ({ orderId: "42" }),
}));

const mockOrder = {
  data: {
    id: 42,
    clienteId: 1,
    clienteNome: "Cliente",
    categoria: "ELETRICA",
    descricao: "Instalação de tomadas",
    fotos: [],
    urgencia: "NORMAL",
    dataDesejada: "2026-04-13T18:00:00",
    status: "ABERTO",
    criadoEm: "2026-04-10T10:00:00",
  },
  error: null,
  isLoading: false,
  mutate: jest.fn(),
};

describe("PropostasScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useOrderDetail as jest.Mock).mockReturnValue(mockOrder);
  });

  test("renders loading state", () => {
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: [],
      isLoading: true,
      isError: false,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    expect(
      screen.UNSAFE_getByType(require("react-native").ActivityIndicator),
    ).toBeTruthy();
  });

  test("renders error state", () => {
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: [],
      isLoading: false,
      isError: true,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    expect(
      screen.getByText("Erro ao carregar propostas. Tente novamente."),
    ).toBeOnTheScreen();
  });

  test("renders empty state", () => {
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: [],
      isLoading: false,
      isError: false,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    expect(
      screen.getByText("Nenhuma proposta recebida ainda."),
    ).toBeOnTheScreen();
  });

  test("renders header with back button and title in empty state", () => {
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: [],
      isLoading: false,
      isError: false,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    expect(screen.getByText("Interessados")).toBeOnTheScreen();
    expect(screen.getByText("←")).toBeOnTheScreen();
  });

  test("renders proposals list from hook data", () => {
    const mockList = createMockPropostaList(2);
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: mockList,
      isLoading: false,
      isError: false,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    expect(screen.getByText("Profissional 1")).toBeOnTheScreen();
    expect(screen.getByText("Profissional 2")).toBeOnTheScreen();
  });

  test("renders filter chips when proposals exist", () => {
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: createMockPropostaList(2),
      isLoading: false,
      isError: false,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    expect(screen.getByText("Melhor avaliação")).toBeOnTheScreen();
    expect(screen.getByText("Menor preço")).toBeOnTheScreen();
    expect(screen.getByText("Mais...")).toBeOnTheScreen();
  });

  test('renders "Todos (n)" chip with proposal count', () => {
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: createMockPropostaList(3),
      isLoading: false,
      isError: false,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    expect(screen.getByText("Todos (3)")).toBeOnTheScreen();
  });

  test("renders count badge with correct number", () => {
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: createMockPropostaList(3),
      isLoading: false,
      isError: false,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    expect(screen.getByText("3")).toBeOnTheScreen();
  });

  test("renders order info banner with category and status", () => {
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: createMockPropostaList(1),
      isLoading: false,
      isError: false,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    expect(screen.getByText("Instalação elétrica")).toBeOnTheScreen();
    expect(screen.getByText(/Em aberto/)).toBeOnTheScreen();
  });

  test("navigates back when back button pressed", () => {
    (useProposalsByPedido as jest.Mock).mockReturnValue({
      proposals: createMockPropostaList(1),
      isLoading: false,
      isError: false,
      refreshProposals: jest.fn(),
    });

    render(<PropostasScreen />);
    fireEvent.press(screen.getByText("←"));
    expect(mockBack).toHaveBeenCalled();
  });
});
