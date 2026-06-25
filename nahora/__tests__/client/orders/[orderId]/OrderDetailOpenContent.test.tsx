import React from "react";
import { render, screen, fireEvent } from "@tests/test-utils";
import { ActivityIndicator, Pressable } from "react-native";
import { OrderDetailOpenContent } from "@/features/orders/components/OrderDetailOpenContent";
import { createMockPedido } from "@tests/factories/orders";

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockPedido = createMockPedido();

function TestHarness(
  overrides: Partial<React.ComponentProps<typeof OrderDetailOpenContent>> = {},
) {
  const defaults: React.ComponentProps<typeof OrderDetailOpenContent> = {
    pedido: mockPedido,
    isLoading: false,
    error: undefined,
    onBack: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onViewProposals: jest.fn(),
    acceptedProposalId: undefined,
  };
  return <OrderDetailOpenContent {...defaults} {...overrides} />;
}

describe("OrderDetailOpenContent", () => {
  test("renders loading indicator when isLoading is true", () => {
    render(<TestHarness pedido={undefined} isLoading={true} />);
    const indicators = screen.UNSAFE_getAllByType(ActivityIndicator);
    expect(indicators.length).toBeGreaterThan(0);
  });

  test("renders error text on error", () => {
    render(
      <TestHarness
        pedido={undefined}
        isLoading={false}
        error={new Error("fail")}
      />,
    );
    expect(
      screen.getByText("Erro ao carregar pedido."),
    ).toBeOnTheScreen();
  });

  test("renders header title 'Detalhe do Pedido'", () => {
    render(<TestHarness />);
    expect(screen.getByText("Detalhe do Pedido")).toBeOnTheScreen();
  });

  test("renders status badge 'Em aberto'", () => {
    render(<TestHarness />);
    expect(screen.getByText("Em aberto")).toBeOnTheScreen();
  });

  test("renders category heading from CATEGORIA_LABEL", () => {
    render(<TestHarness />);
    expect(screen.getByText("Instalação elétrica")).toBeOnTheScreen();
  });

  test("renders Data and Turno labels in info card", () => {
    render(<TestHarness />);
    expect(screen.getByText("Data")).toBeOnTheScreen();
    expect(screen.getByText("Turno")).toBeOnTheScreen();
  });

  test("renders formatted date and turno values", () => {
    render(<TestHarness />);
    // dataDesejada: '2026-05-22T08:00:00Z' → "22/05/2026", "Manhã"
    expect(screen.getByText("22/05/2026")).toBeOnTheScreen();
    expect(screen.getByText("Manhã")).toBeOnTheScreen();
  });

  test("renders Endereço label and formatted address", () => {
    render(<TestHarness />);
    expect(screen.getByText("Endereço")).toBeOnTheScreen();
    expect(
      screen.getByText("Rua das Flores, 123 – Centro, São Paulo"),
    ).toBeOnTheScreen();
  });

  test("renders '—' when endereco is null", () => {
    render(
      <TestHarness
        pedido={createMockPedido({ endereco: null })}
      />,
    );
    // "—" is different from the formatted address above
    expect(screen.queryByText(/Rua das Flores/)).not.toBeOnTheScreen();
  });

  test("renders DESCRIÇÃO label and description text", () => {
    render(<TestHarness />);
    expect(screen.getByText("DESCRIÇÃO")).toBeOnTheScreen();
    expect(
      screen.getByText(
        "A torradeira não liga mais. Preciso de conserto urgente.",
      ),
    ).toBeOnTheScreen();
  });

  test("renders timeline with all 4 stages", () => {
    render(<TestHarness />);
    expect(screen.getByText("Linha do tempo")).toBeOnTheScreen();
    expect(screen.getByText("Pedido criado")).toBeOnTheScreen();
    expect(screen.getByText("Avaliação de propostas")).toBeOnTheScreen();
    expect(
      screen.getByText("Verifique os profissionais"),
    ).toBeOnTheScreen();
    expect(screen.getByText("Serviço em andamento")).toBeOnTheScreen();
    expect(screen.getByText("Concluído")).toBeOnTheScreen();
  });

  test("renders action buttons 'Editar' and 'Excluir'", () => {
    render(<TestHarness />);
    expect(screen.getByText("Editar")).toBeOnTheScreen();
    expect(screen.getByText("Excluir")).toBeOnTheScreen();
  });

  test("renders main CTA 'Verificar Propostas'", () => {
    render(<TestHarness />);
    expect(screen.getByText("Verificar Propostas")).toBeOnTheScreen();
  });

  test("calls onBack when back button pressed", () => {
    const onBack = jest.fn();
    render(<TestHarness onBack={onBack} />);

    const buttons = screen.UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(buttons[0]);
    expect(onBack).toHaveBeenCalled();
  });

  test("calls onEdit when Editar button pressed", () => {
    const onEdit = jest.fn();
    render(<TestHarness onEdit={onEdit} />);

    fireEvent.press(screen.getByText("Editar"));
    expect(onEdit).toHaveBeenCalled();
  });

  test("calls onDelete when Excluir button pressed", () => {
    const onDelete = jest.fn();
    render(<TestHarness onDelete={onDelete} />);

    fireEvent.press(screen.getByText("Excluir"));
    expect(onDelete).toHaveBeenCalled();
  });

  test("calls onViewProposals when Verificar Propostas pressed", () => {
    const onViewProposals = jest.fn();
    render(<TestHarness onViewProposals={onViewProposals} />);

    fireEvent.press(screen.getByText("Verificar Propostas"));
    expect(onViewProposals).toHaveBeenCalled();
  });

  test("renders 'Falar com prestador' CTA when status is EM_ANDAMENTO", () => {
    render(
      <TestHarness
        pedido={createMockPedido({ status: "EM_ANDAMENTO" })}
        acceptedProposalId={10}
      />,
    );
    expect(screen.getByText("Falar com prestador")).toBeOnTheScreen();
    expect(screen.queryByText("Verificar Propostas")).not.toBeOnTheScreen();
  });

  test("renders 'Falar com prestador' CTA when status is AGUARDANDO_VALIDACAO", () => {
    render(
      <TestHarness
        pedido={createMockPedido({ status: "AGUARDANDO_VALIDACAO" })}
        acceptedProposalId={10}
      />,
    );
    expect(screen.getByText("Falar com prestador")).toBeOnTheScreen();
    expect(screen.queryByText("Verificar Propostas")).not.toBeOnTheScreen();
  });

  test("navigates to chat when 'Falar com prestador' pressed", () => {
    render(
      <TestHarness
        pedido={createMockPedido({ status: "EM_ANDAMENTO" })}
        acceptedProposalId={42}
      />,
    );
    fireEvent.press(screen.getByText("Falar com prestador"));
    expect(mockPush).toHaveBeenCalledWith("/(client)/(chats)/42");
  });

  test("does not navigate when 'Falar com prestador' pressed without acceptedProposalId", () => {
    render(
      <TestHarness
        pedido={createMockPedido({ status: "EM_ANDAMENTO" })}
      />,
    );
    fireEvent.press(screen.getByText("Falar com prestador"));
    expect(mockPush).not.toHaveBeenCalled();
  });
});
