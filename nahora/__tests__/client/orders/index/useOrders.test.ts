import { renderHook, waitFor } from '@tests/test-utils';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { orderService } from '@/features/orders/service';
import { createMockPedidoPage } from '@tests/factories/orders';

jest.mock('@/features/orders/service', () => ({
  orderService: { listarMeusPedidos: jest.fn() },
}));

describe('useOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches with default params when no args', async () => {
    const mockPage = createMockPedidoPage(2);
    (orderService.listarMeusPedidos as jest.Mock).mockResolvedValue(mockPage);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPage);
    });

    expect(orderService.listarMeusPedidos).toHaveBeenCalledWith(
      undefined,
      0,
      20,
    );
  });

  test('fetches with status filter', async () => {
    const mockPage = createMockPedidoPage(1);
    (orderService.listarMeusPedidos as jest.Mock).mockResolvedValue(mockPage);

    const { result } = renderHook(() => useOrders({ status: 'ABERTO' }));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPage);
    });

    expect(orderService.listarMeusPedidos).toHaveBeenCalledWith(
      'ABERTO',
      0,
      20,
    );
  });

  test('fetches with EM_ANDAMENTO filter as comma-separated statuses', async () => {
    (orderService.listarMeusPedidos as jest.Mock).mockResolvedValue(
      createMockPedidoPage(0),
    );

    renderHook(() => useOrders({ status: 'EM_ANDAMENTO' }));

    await waitFor(() => {
      expect(orderService.listarMeusPedidos).toHaveBeenCalledWith(
        'EM_ANDAMENTO,AGUARDANDO_VALIDACAO',
        0,
        20,
      );
    });
  });

  test('calls listarMeusPedidos with custom page and size', async () => {
    (orderService.listarMeusPedidos as jest.Mock).mockResolvedValue(
      createMockPedidoPage(1),
    );

    renderHook(() => useOrders({ page: 2, size: 10 }));

    await waitFor(() => {
      expect(orderService.listarMeusPedidos).toHaveBeenCalledWith(
        undefined,
        2,
        10,
      );
    });
  });
});
