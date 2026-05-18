import React from "react";
import { render, screen, fireEvent } from "@tests/test-utils";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import ProfessionalOrderDetailScreen from "@/app/(professional)/(orders)/[orderId]/index";
import { createMockPedido } from "@tests/factories/orders";

const mockPedido = createMockPedido();
const mockBack = jest.fn();
const mockPush = jest.fn();
const mockUsePedidoResumoFromList = jest.fn(() => ({
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
  "@/features/professional/hooks/usePedidoResumoFromList",
  () => ({
    usePedidoResumoFromList: (id: number) => mockUsePedidoResumoFromList(id),
  }),
);

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
  useLocalSearchParams: () => ({ orderId: "42" }),
}));

describe("ProfessionalOrderDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePedidoResumoFromList.mockImplementation(() => ({
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

  test("passes orderId from URL params to usePedidoResumoFromList hook", () => {
    render(<ProfessionalOrderDetailScreen />);
    expect(mockUsePedidoResumoFromList).toHaveBeenCalledWith(42);
  });

  test("renders order data when loaded", () => {
    mockUsePedidoResumoFromList.mockImplementation(() => ({
      pedido: mockPedido,
      isLoading: false,
      error: undefined,
    }));
    render(<ProfessionalOrderDetailScreen />);
    expect(screen.getByText("Instalação elétrica")).toBeOnTheScreen();
  });

  test("back button navigates back", () => {
    mockUsePedidoResumoFromList.mockImplementation(() => ({
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
