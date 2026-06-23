import { renderHook, waitFor, act } from "@tests/test-utils";
import { usePedidosDisponiveis } from "@/features/professional/hooks/usePedidosDisponiveis";
import { orderService } from "@/features/orders/service";
import { createMockPedidoDisponivelPage } from "@tests/factories/professional";

jest.mock("@/features/orders/service", () => ({
  orderService: { listarDisponiveis: jest.fn() },
}));

describe("usePedidosDisponiveis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns flat pedidos array from first page", async () => {
    const page = createMockPedidoDisponivelPage(3, 10, 0, 20);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.pedidos).toHaveLength(3);
    });

    expect(orderService.listarDisponiveis).toHaveBeenCalledWith(0, 20, undefined);
  });

  test("loadMore fetches next page and appends pedidos", async () => {
    const page0 = createMockPedidoDisponivelPage(3, 10, 0, 20);
    page0.last = false;
    const page1 = createMockPedidoDisponivelPage(3, 10, 1, 20);
    (orderService.listarDisponiveis as jest.Mock).mockImplementation(
      (_page: number, _size: number, _filtro?: unknown) => {
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

    expect(orderService.listarDisponiveis).toHaveBeenCalledWith(1, 20, undefined);
  });

  test("refresh resets and re-fetches from page 0", async () => {
    const page = createMockPedidoDisponivelPage(2, 2, 0, 20);
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
    const page = createMockPedidoDisponivelPage(3, 3, 0, 20);
    page.last = true;
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
    });
  });

  test("hasMore is true when more pages exist", async () => {
    const page = createMockPedidoDisponivelPage(3, 10, 0, 3);
    page.last = false;
    page.totalPages = 4;
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const { result } = renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(result.current.hasMore).toBe(true);
    });
  });

  test("isLoadingMore is true while fetching next page", async () => {
    const page0 = createMockPedidoDisponivelPage(3, 10, 0, 20);
    page0.last = false;
    const page1 = createMockPedidoDisponivelPage(3, 10, 1, 20);
    let resolvePage1: (value: typeof page1) => void;
    const page1Promise = new Promise<typeof page1>((resolve) => {
      resolvePage1 = resolve;
    });

    (orderService.listarDisponiveis as jest.Mock).mockImplementation(
      (_page: number, _size: number, _filtro?: unknown) => {
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

  test("passes filter params to listarDisponiveis", async () => {
    const page = createMockPedidoDisponivelPage(3, 3, 0, 20);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const filtro = { categoria: "ELETRICA" as const, urgente: true };
    renderHook(() => usePedidosDisponiveis(filtro));

    await waitFor(() => {
      expect(orderService.listarDisponiveis).toHaveBeenCalledWith(0, 20, filtro);
    });
  });

  test("does not send TODAS categoria or null urgente to backend", async () => {
    const page = createMockPedidoDisponivelPage(3, 3, 0, 20);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    renderHook(() => usePedidosDisponiveis());

    await waitFor(() => {
      expect(orderService.listarDisponiveis).toHaveBeenCalledWith(0, 20, undefined);
    });
  });

  test("passes termo filter to listarDisponiveis", async () => {
    const page = createMockPedidoDisponivelPage(1, 1, 0, 20);
    (orderService.listarDisponiveis as jest.Mock).mockResolvedValue(page);

    const filtro = { termo: "eletricista" };
    renderHook(() => usePedidosDisponiveis(filtro));

    await waitFor(() => {
      expect(orderService.listarDisponiveis).toHaveBeenCalledWith(0, 20, filtro);
    });
  });
});
