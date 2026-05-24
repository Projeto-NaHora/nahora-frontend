import React from "react";
import { TouchableOpacity } from "react-native";
import { render, screen } from "@tests/test-utils";
import { AvailableOrderCard } from "@/features/professional/components/AvailableOrderCard";
import { createMockPedidoResumo } from "@tests/factories/professional";
import { enrichWithMockData } from "@/features/professional/hooks/usePedidosDisponiveis";
import { Colors } from "@/constants/theme";

const mockUseColorScheme = jest.fn(() => "light");
jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => mockUseColorScheme(),
}));
jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

const mockPedido = enrichWithMockData([createMockPedidoResumo()])[0];

describe("AvailableOrderCard", () => {
  test("renders category label", () => {
    render(<AvailableOrderCard pedido={mockPedido} onPress={jest.fn()} />);
    const matches = screen.getAllByText("Instalação elétrica");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  test('renders "Urgente" badge when urgente is true', () => {
    render(<AvailableOrderCard pedido={mockPedido} onPress={jest.fn()} />);
    expect(screen.getByText("Urgente")).toBeOnTheScreen();
  });

  test('renders "Normal" badge when urgente is false', () => {
    const normal = enrichWithMockData([
      createMockPedidoResumo({ urgente: false }),
    ])[0];
    render(<AvailableOrderCard pedido={normal} onPress={jest.fn()} />);
    expect(screen.getByText("Normal")).toBeOnTheScreen();
  });

  test("renders client name, distance, and time ago", () => {
    render(<AvailableOrderCard pedido={mockPedido} onPress={jest.fn()} />);

    expect(screen.getByText(/Maria Silva/)).toBeOnTheScreen();
    expect(screen.getByText(/1,2 km/)).toBeOnTheScreen();
    expect(screen.getByText(/há/)).toBeOnTheScreen();
  });

  test("renders description", () => {
    render(<AvailableOrderCard pedido={mockPedido} onPress={jest.fn()} />);
    expect(
      screen.getByText("Instalar tomadas no quarto e sala. Tenho os materiais."),
    ).toBeOnTheScreen();
  });

  test("renders proposal count info", () => {
    render(<AvailableOrderCard pedido={mockPedido} onPress={jest.fn()} />);
    expect(screen.getByText(/2 propostas/)).toBeOnTheScreen();
  });

  test("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<AvailableOrderCard pedido={mockPedido} onPress={onPress} />);

    const cards = screen.UNSAFE_getAllByType(TouchableOpacity);
    cards[0].props.onPress();
    expect(onPress).toHaveBeenCalledWith(mockPedido);
  });

  test("uses theme background color in light mode", () => {
    mockUseColorScheme.mockReturnValue("light");
    render(<AvailableOrderCard pedido={mockPedido} onPress={jest.fn()} />);

    const cards = screen.UNSAFE_getAllByType(TouchableOpacity);
    const bgStyle = cards[0].props.style.find(
      (s: any) => s?.backgroundColor,
    );
    expect(bgStyle.backgroundColor).toBe(Colors.light.background);
  });

  test("uses theme background color in dark mode", () => {
    mockUseColorScheme.mockReturnValue("dark");
    render(<AvailableOrderCard pedido={mockPedido} onPress={jest.fn()} />);

    const cards = screen.UNSAFE_getAllByType(TouchableOpacity);
    const bgStyle = cards[0].props.style.find(
      (s: any) => s?.backgroundColor,
    );
    expect(bgStyle.backgroundColor).toBe(Colors.dark.background);
  });
});
