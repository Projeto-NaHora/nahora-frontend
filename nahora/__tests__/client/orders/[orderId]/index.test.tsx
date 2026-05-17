import React from "react";
import { render, screen } from "@tests/test-utils";
import PedidoAbertoScreen from "@/app/(client)/(orders)/[orderId]/index";

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

jest.mock("@/features/orders/hooks/useOrders", () => ({
  useOrderDetail: (_id: number) => ({
    data: undefined,
    isLoading: true,
    error: undefined,
    isValidating: false,
    mutate: jest.fn(),
  }),
}));

jest.mock("@/features/orders/components/OrderDetailOpenContent", () => ({
  OrderDetailOpenContent: () => null,
}));

const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
  useLocalSearchParams: () => ({ orderId: "42" }),
}));

describe("PedidoAbertoScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders screen without crashing", () => {
    render(<PedidoAbertoScreen />);
    // Renders the mocked content component (returns null), but the screen mounts successfully
    expect(screen).toBeTruthy();
  });
});
