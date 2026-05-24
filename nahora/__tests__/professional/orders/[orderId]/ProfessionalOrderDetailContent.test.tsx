import React from "react";
import { render, screen, fireEvent } from "@tests/test-utils";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { ProfessionalOrderDetailContent } from "@/features/orders/components/ProfessionalOrderDetailContent";
import { createMockPedido } from "@tests/factories/orders";

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

const mockPedido = createMockPedido();

function TestHarness(
  overrides: Partial<
    React.ComponentProps<typeof ProfessionalOrderDetailContent>
  > = {},
) {
  const defaults: React.ComponentProps<
    typeof ProfessionalOrderDetailContent
  > = {
    pedido: mockPedido,
    isLoading: false,
    error: undefined,
    onBack: jest.fn(),
    onVerPerfil: jest.fn(),
    onMostrarInteresse: jest.fn(),
  };
  return <ProfessionalOrderDetailContent {...defaults} {...overrides} />;
}

describe("ProfessionalOrderDetailContent", () => {
  // --- Loading / Error / Empty states ---

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
    expect(screen.getByText("Erro ao carregar pedido.")).toBeOnTheScreen();
  });

  test("returns null when no pedido and not loading/error", () => {
    const { UNSAFE_root } = render(
      <TestHarness pedido={undefined} isLoading={false} error={undefined} />,
    );
    // When component returns null, root's rendered output is empty
    expect(screen.queryByText("Detalhes do pedido")).not.toBeOnTheScreen();
  });

  // --- Header ---

  test("renders header title 'Detalhes do pedido'", () => {
    render(<TestHarness />);
    expect(screen.getByText("Detalhes do pedido")).toBeOnTheScreen();
  });

  test("calls onBack when back button pressed", () => {
    const onBack = jest.fn();
    render(<TestHarness onBack={onBack} />);
    const buttons = screen.UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(buttons[0]);
    expect(onBack).toHaveBeenCalled();
  });

  // --- Status badge ---

  test("renders status badge 'Em aberto' for ABERTO status", () => {
    render(<TestHarness />);
    expect(screen.getByText(/Em aberto/)).toBeOnTheScreen();
  });

  test("renders urgency text in badge when URGENTE", () => {
    render(
      <TestHarness
        pedido={createMockPedido({ urgencia: "URGENTE", status: "ABERTO" })}
      />,
    );
    expect(screen.getByText(/Urgente/)).toBeOnTheScreen();
  });

  test("renders urgency text in badge when NORMAL", () => {
    render(
      <TestHarness
        pedido={createMockPedido({ urgencia: "NORMAL", status: "ABERTO" })}
      />,
    );
    expect(screen.getByText(/Normal/)).toBeOnTheScreen();
  });

  // --- Category title ---

  test("renders category title from CATEGORIA_LABEL", () => {
    render(<TestHarness />);
    expect(screen.getByText("Instalação elétrica")).toBeOnTheScreen();
  });

  // --- Client card ---

  test("renders client initials from getInitials", () => {
    render(<TestHarness />);
    // "João Silva" → "JS"
    expect(screen.getByText("JS")).toBeOnTheScreen();
  });

  test("renders client name", () => {
    render(<TestHarness />);
    expect(screen.getByText("João Silva")).toBeOnTheScreen();
  });

  test("does not render rating row (no 'como cliente' text)", () => {
    render(<TestHarness />);
    expect(screen.queryByText(/como cliente/)).not.toBeOnTheScreen();
  });

  test("renders description text", () => {
    render(<TestHarness />);
    expect(
      screen.getByText(
        /A torradeira não liga mais\.\s*Preciso de conserto urgente\./,
      ),
    ).toBeOnTheScreen();
  });

  // --- Details card ---

  test("renders 'Turno Disponível' label", () => {
    render(<TestHarness />);
    expect(screen.getByText("Turno Disponível")).toBeOnTheScreen();
  });

  test("renders turno value (Manhã from 08:00)", () => {
    render(<TestHarness />);
    expect(screen.getByText("Manhã")).toBeOnTheScreen();
  });

  test("does not render 'Distância' label (field not available)", () => {
    render(<TestHarness />);
    expect(screen.queryByText("Distância")).not.toBeOnTheScreen();
  });

  test("renders 'Endereço' label", () => {
    render(<TestHarness />);
    expect(screen.getByText("Endereço")).toBeOnTheScreen();
  });

  test("renders formatted address from endereco", () => {
    render(<TestHarness />);
    expect(
      screen.getByText("Rua das Flores, 123 – Centro, São Paulo"),
    ).toBeOnTheScreen();
  });

  test("renders '—' when endereco is null", () => {
    render(<TestHarness pedido={createMockPedido({ endereco: null })} />);
    expect(screen.getByText("—")).toBeOnTheScreen();
  });

  test("renders '—' for turno when dataDesejada is empty", () => {
    render(<TestHarness pedido={createMockPedido({ dataDesejada: "" })} />);
    expect(screen.getByText("Turno Disponível")).toBeOnTheScreen();
    // The turno value row shows "—" when date is invalid
    const dashElements = screen.getAllByText("—");
    expect(dashElements.length).toBeGreaterThanOrEqual(1);
  });

  // --- Action buttons ---

  test("renders 'Ver perfil' button", () => {
    render(<TestHarness />);
    expect(screen.getByText("Ver perfil")).toBeOnTheScreen();
  });

  test("calls onVerPerfil when 'Ver perfil' pressed", () => {
    const onVerPerfil = jest.fn();
    render(<TestHarness onVerPerfil={onVerPerfil} />);
    fireEvent.press(screen.getByText("Ver perfil"));
    expect(onVerPerfil).toHaveBeenCalled();
  });

  test("hides 'Ver perfil' button when onVerPerfil is not provided", () => {
    render(<TestHarness onVerPerfil={undefined} />);
    expect(screen.queryByText("Ver perfil")).not.toBeOnTheScreen();
  });

  test("renders 'Mostrar interesse' button", () => {
    render(<TestHarness />);
    expect(screen.getByText("Mostrar interesse")).toBeOnTheScreen();
  });

  test("calls onMostrarInteresse when 'Mostrar interesse' pressed", () => {
    const onMostrarInteresse = jest.fn();
    render(<TestHarness onMostrarInteresse={onMostrarInteresse} />);
    fireEvent.press(screen.getByText("Mostrar interesse"));
    expect(onMostrarInteresse).toHaveBeenCalled();
  });

  // --- Warning notice ---

  test("renders warning icon and text", () => {
    render(<TestHarness />);
    expect(screen.getByText(/⚠️/)).toBeOnTheScreen();
    expect(
      screen.getByText(
        /Ao mostrar interesse, o cliente receberá notificação e poderá entrar em contato./,
      ),
    ).toBeOnTheScreen();
  });
});
