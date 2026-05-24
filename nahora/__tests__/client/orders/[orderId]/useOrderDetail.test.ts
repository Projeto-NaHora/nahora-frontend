import { renderHook, waitFor } from "@tests/test-utils";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { orderService } from "@/features/orders/service";
import { createMockPedido } from "@tests/factories/orders";

jest.mock("@/features/orders/service", () => ({
  orderService: { buscarPorId: jest.fn() },
}));

describe("useOrderDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches order by id", async () => {
    const mockPedido = createMockPedido({ id: 42 });
    (orderService.buscarPorId as jest.Mock).mockResolvedValue(mockPedido);

    const { result } = renderHook(() => useOrderDetail(42));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPedido);
    });

    expect(orderService.buscarPorId).toHaveBeenCalledWith(42);
  });

  test("returns no data when id is 0", () => {
    const { result } = renderHook(() => useOrderDetail(0));

    expect(result.current.data).toBeUndefined();
    expect(orderService.buscarPorId).not.toHaveBeenCalled();
  });
});
