import { renderHook, waitFor } from "@tests/test-utils";
import { usePedidosDisponiveis, enrichWithMockData } from "@/features/professional/hooks/usePedidosDisponiveis";
import { orderService } from "@/features/orders/service";
import { createMockPedidoResumoList, createMockPedidoResumoPage } from "@tests/factories/professional";

jest.mock("@/features/orders/service", () => ({
  orderService: { listarDisponiveis: jest.fn() },
}));

describe("usePedidosDisponiveis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls listarDisponiveis with page/size defaults and returns paginated data", async () => {
    const mockPage = createMockPedidoResumoPage(2);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(mockPage);

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPage);
    });

    expect(orderService.listarDisponiveis).toHaveBeenCalledWith(0, 20);
  });

  test("passes page and size params", () => {
    renderHook(() => usePedidosDisponiveis(2, 10));
    expect(orderService.listarDisponiveis).toHaveBeenCalledWith(2, 10);
  });
});

describe("enrichWithMockData", () => {
  test("adds clienteNome to each pedido", () => {
    const input = createMockPedidoResumoList(2);
    const result = enrichWithMockData(input);

    expect(result).toHaveLength(2);
    expect(result[0].clienteNome).toBe("Maria Silva");
    expect(result[1].clienteNome).toBe("João Lima");
  });

  test("returns empty array for undefined", () => {
    expect(enrichWithMockData(undefined)).toEqual([]);
  });
});
