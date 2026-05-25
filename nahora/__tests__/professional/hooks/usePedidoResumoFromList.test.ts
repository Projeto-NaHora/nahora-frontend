import { renderHook, waitFor } from "@tests/test-utils";
import { usePedidoResumoFromList } from "@/features/professional/hooks/usePedidoResumoFromList";
import { orderService } from "@/features/orders/service";
import { createMockPedidoResumoPage } from "@tests/factories/professional";

jest.mock("@/features/orders/service", () => ({
  orderService: { listarDisponiveis: jest.fn() },
}));

describe("usePedidoResumoFromList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns pedido when found in first page", async () => {
    const page = createMockPedidoResumoPage(3);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidoResumoFromList(2));

    await waitFor(() => {
      expect(result.current.pedido).toBeDefined();
    });
    expect(result.current.pedido?.id).toBe(2);
    expect(result.current.pedido?.descricao).toBe("Descrição do pedido 2");
  });

  test("returns undefined when orderId not found in loaded pages", async () => {
    const page = createMockPedidoResumoPage(2);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidoResumoFromList(999));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.pedido).toBeUndefined();
  });

  test("maps urgente boolean to urgencia string", async () => {
    const page = createMockPedidoResumoPage(1, 1);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidoResumoFromList(1));

    await waitFor(() => {
      expect(result.current.pedido).toBeDefined();
    });
    expect(result.current.pedido?.urgencia).toBe("URGENTE");
  });

  test("maps categoria through from resume", async () => {
    const page = createMockPedidoResumoPage(1, 1);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidoResumoFromList(1));

    await waitFor(() => {
      expect(result.current.pedido).toBeDefined();
    });
    expect(result.current.pedido?.categoria).toBe("ELETRICA");
  });

  test("defaults status to ABERTO", async () => {
    const page = createMockPedidoResumoPage(1, 1);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidoResumoFromList(1));

    await waitFor(() => {
      expect(result.current.pedido).toBeDefined();
    });
    expect(result.current.pedido?.status).toBe("ABERTO");
  });

  test("enriches with mock clienteNome", async () => {
    const page = createMockPedidoResumoPage(1, 1);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidoResumoFromList(1));

    await waitFor(() => {
      expect(result.current.pedido).toBeDefined();
    });
    expect(result.current.pedido?.clienteNome).toBeTruthy();
    expect(typeof result.current.pedido?.clienteNome).toBe("string");
  });

  test("maps dataDesejada to empty string", async () => {
    const page = createMockPedidoResumoPage(1, 1);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidoResumoFromList(1));

    await waitFor(() => {
      expect(result.current.pedido).toBeDefined();
    });
    expect(result.current.pedido?.dataDesejada).toBe("");
  });
});
