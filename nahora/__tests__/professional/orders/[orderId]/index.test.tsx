import React from "react";
import { render, screen, fireEvent } from "@tests/test-utils";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import ProfessionalOrderDetailScreen from "@/app/(professional)/(orders)/[orderId]/index";
import { createMockPedido } from "@tests/factories/orders";

const mockPedido = createMockPedido();
const mockBack = jest.fn();
const mockPush = jest.fn();
const mockUsePedidoPublico = jest.fn(() => ({
  pedido: undefined,
  isLoading: true,
  error: undefined,
}));

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

jest.mock(
  "@/features/professional/hooks/usePedidoPublico",
  () => ({
    usePedidoPublico: (id: number) => mockUsePedidoPublico(id),
  }),
);

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
  useLocalSearchParams: () => ({ orderId: "42" }),
}));

describe("ProfessionalOrderDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePedidoPublico.mockImplementation(() => ({
      pedido: undefined,
      isLoading: true,
      error: undefined,
    }));
  });

  test("renders loading indicator when isLoading", () => {
    render(<ProfessionalOrderDetailScreen />);
    const indicators = screen.UNSAFE_getAllByType(ActivityIndicator);
    expect(indicators.length).toBeGreaterThan(0);
  });

  test("passes orderId from URL params to usePedidoPublico hook", () => {
    render(<ProfessionalOrderDetailScreen />);
    expect(mockUsePedidoPublico).toHaveBeenCalledWith(42);
  });

  test("renders order data when loaded", () => {
    mockUsePedidoPublico.mockImplementation(() => ({
      pedido: mockPedido,
      isLoading: false,
      error: undefined,
    }));
    render(<ProfessionalOrderDetailScreen />);
    expect(screen.getByText("Instalação elétrica")).toBeOnTheScreen();
  });

  test("back button navigates back", () => {
    mockUsePedidoPublico.mockImplementation(() => ({
      pedido: mockPedido,
      isLoading: false,
      error: undefined,
    }));
    render(<ProfessionalOrderDetailScreen />);
    const buttons = screen.UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(buttons[0]);
    expect(mockBack).toHaveBeenCalled();
  });
});
