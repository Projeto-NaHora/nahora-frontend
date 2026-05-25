import React from "react";
import { render, screen } from "@tests/test-utils";
import DetalhePropostaScreen from "@/app/(client)/(orders)/[orderId]/proposals/[proposalId]";
import { createMockProposta } from "@tests/factories/proposals";

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

jest.mock("@/features/proposals/hooks/useProposals", () => ({
  useProposalDetail: jest.fn(),
  useProposalActions: jest.fn(),
}));

jest.mock("@/features/proposals/components/ProposalDetailContent", () => ({
  ProposalDetailContent: jest.fn(() => null),
}));

import { useProposalDetail, useProposalActions } from "@/features/proposals/hooks/useProposals";
import { ProposalDetailContent } from "@/features/proposals/components/ProposalDetailContent";

const mockBack = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
  useLocalSearchParams: () => ({ orderId: "42", proposalId: "7" }),
}));

describe("DetalhePropostaScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading indicator when loading", () => {
    (useProposalDetail as jest.Mock).mockReturnValue({
      proposal: undefined,
      isLoading: true,
      isError: false,
    });
    (useProposalActions as jest.Mock).mockReturnValue({
      acceptProposal: jest.fn(),
      rejectProposal: jest.fn(),
    });

    render(<DetalhePropostaScreen />);
    expect(
      screen.UNSAFE_getByType(require("react-native").ActivityIndicator),
    ).toBeTruthy();
  });

  test("renders error text when there is an error", () => {
    (useProposalDetail as jest.Mock).mockReturnValue({
      proposal: undefined,
      isLoading: false,
      isError: true,
    });
    (useProposalActions as jest.Mock).mockReturnValue({
      acceptProposal: jest.fn(),
      rejectProposal: jest.fn(),
    });

    render(<DetalhePropostaScreen />);
    expect(
      screen.getByText("Erro ao carregar proposta."),
    ).toBeOnTheScreen();
  });

  test("renders ProposalDetailContent with correct props when data is loaded", () => {
    const mockProposal = createMockProposta({ id: 7, pedidoId: 42, valor: 350 });
    (useProposalDetail as jest.Mock).mockReturnValue({
      proposal: mockProposal,
      isLoading: false,
      isError: false,
    });
    (useProposalActions as jest.Mock).mockReturnValue({
      acceptProposal: jest.fn(),
      rejectProposal: jest.fn(),
    });

    render(<DetalhePropostaScreen />);

    const calls = (ProposalDetailContent as jest.Mock).mock.calls[0][0];
    expect(calls.proposal).toEqual(mockProposal);
    expect(calls.onBack).toBeDefined();
    expect(calls.onAccept).toBeDefined();
    expect(calls.onReject).toBeDefined();
    expect(calls.isAccepting).toBe(false);
  });

  test("passes hooks with correct pedidoId and propostaId from route params", () => {
    (useProposalDetail as jest.Mock).mockReturnValue({
      proposal: createMockProposta({ id: 7, pedidoId: 42 }),
      isLoading: false,
      isError: false,
    });
    (useProposalActions as jest.Mock).mockReturnValue({
      acceptProposal: jest.fn(),
      rejectProposal: jest.fn(),
    });

    render(<DetalhePropostaScreen />);

    expect(useProposalDetail).toHaveBeenCalledWith(42, 7);
  });

  test("calls useProposalActions with correct pedidoId", () => {
    (useProposalDetail as jest.Mock).mockReturnValue({
      proposal: createMockProposta({ id: 7, pedidoId: 42 }),
      isLoading: false,
      isError: false,
    });
    (useProposalActions as jest.Mock).mockReturnValue({
      acceptProposal: jest.fn(),
      rejectProposal: jest.fn(),
    });

    render(<DetalhePropostaScreen />);

    expect(useProposalActions).toHaveBeenCalledWith(42);
  });
});
