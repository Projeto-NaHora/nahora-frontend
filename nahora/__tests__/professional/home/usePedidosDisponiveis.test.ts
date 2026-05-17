import { renderHook, waitFor, act } from "@tests/test-utils";
import { usePedidosDisponiveis, enrichWithMockData } from "@/features/professional/hooks/usePedidosDisponiveis";
import { orderService } from "@/features/orders/service";
import { createMockPedidoResumoPage } from "@tests/factories/professional";

jest.mock("@/features/orders/service", () => ({
  orderService: { listarDisponiveis: jest.fn() },
}));

describe("usePedidosDisponiveis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns flat pedidos array from first page", async () => {
    const page = createMockPedidoResumoPage(3, 10, 0, 20);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.pedidos).toHaveLength(3);
    });

    expect(orderService.listarDisponiveis).toHaveBeenCalledWith(0, 20);
  });

  test("loadMore fetches next page and appends pedidos", async () => {
    const page0 = createMockPedidoResumoPage(3, 10, 0, 20);
    page0.last = false;
    const page1 = createMockPedidoResumoPage(3, 10, 1, 20);
    (orderService.listarDisponiveis as jest.Mock).mockImplementation(
      (_page: number, _size: number) => {
        if (_page === 0) return Promise.resolve(page0);
        return Promise.resolve(page1);
      },
    );

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.pedidos).toHaveLength(3);
    });

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.pedidos).toHaveLength(6);
    });

    expect(orderService.listarDisponiveis).toHaveBeenCalledWith(1, 20);
  });

  test("refresh resets and re-fetches from page 0", async () => {
    const page = createMockPedidoResumoPage(2, 2, 0, 20);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.pedidos).toHaveLength(2);
    });

    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(orderService.listarDisponiveis).toHaveBeenCalledTimes(2);
    });
  });

  test("hasMore is false when last page reached", async () => {
    const page = createMockPedidoResumoPage(3, 3, 0, 20);
    page.last = true;
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
    });
  });

  test("hasMore is true when more pages exist", async () => {
    const page = createMockPedidoResumoPage(3, 10, 0, 3);
    page.last = false;
    page.totalPages = 4;
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.hasMore).toBe(true);
    });
  });

  test("isLoadingMore is true while fetching next page", async () => {
    const page0 = createMockPedidoResumoPage(3, 10, 0, 20);
    page0.last = false;
    const page1 = createMockPedidoResumoPage(3, 10, 1, 20);
    let resolvePage1: (value: typeof page1) => void;
    const page1Promise = new Promise<typeof page1>((resolve) => {
      resolvePage1 = resolve;
    });

    (orderService.listarDisponiveis as jest.Mock).mockImplementation(
      (_page: number, _size: number) => {
        if (_page === 0) return Promise.resolve(page0);
        return page1Promise;
      },
    );

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.pedidos).toHaveLength(3);
    });

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(true);
    });

    await act(async () => {
      resolvePage1!(page1);
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });
  });
});

describe("enrichWithMockData", () => {
  test("adds clienteNome to each pedido", () => {
    const input = [1, 2].map((id) => ({
      id,
      descricao: `Descrição do pedido ${id}`,
      categoria: "ELETRICA" as const,
      distanciaKm: 1.2,
      dataPublicacao: "2026-05-17T10:00:00Z",
      urgente: true,
      faixaValorMin: 50,
      faixaValorMax: 150,
      contadorPropostas: 2,
    }));
    const result = enrichWithMockData(input);

    expect(result).toHaveLength(2);
    expect(result[0].clienteNome).toBe("Maria Silva");
    expect(result[1].clienteNome).toBe("João Lima");
  });

  test("returns empty array for undefined", () => {
    expect(enrichWithMockData(undefined)).toEqual([]);
  });
});
