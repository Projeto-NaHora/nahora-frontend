import { renderHook, waitFor } from "@tests/test-utils";
import { useProposalsByPedido } from "@/features/proposals/hooks/useProposals";
import { proposalsService } from "@/features/proposals/service";
import { createMockPropostaList } from "@tests/factories/proposals";

jest.mock("@/features/proposals/service", () => ({
  proposalsService: { listarPorPedido: jest.fn() },
}));

describe("useProposalsByPedido", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches proposals by pedidoId", async () => {
    const mockList = createMockPropostaList(2);
    (proposalsService.listarPorPedido as jest.Mock).mockResolvedValue(mockList);

    const { result } = renderHook(() => useProposalsByPedido(1));

    await waitFor(() => {
      expect(result.current.proposals).toEqual(mockList);
    });
    expect(proposalsService.listarPorPedido).toHaveBeenCalledWith(1);
  });

  test("returns empty array when no data", async () => {
    (proposalsService.listarPorPedido as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useProposalsByPedido(1));

    await waitFor(() => {
      expect(result.current.proposals).toEqual([]);
    });
  });

  test("skips fetch when pedidoId is 0", () => {
    const { result } = renderHook(() => useProposalsByPedido(0));

    expect(result.current.proposals).toEqual([]);
    expect(proposalsService.listarPorPedido).not.toHaveBeenCalled();
  });

  test("sets isError on failure", async () => {
    (proposalsService.listarPorPedido as jest.Mock).mockRejectedValue(new Error("API error"));

    const { result } = renderHook(() => useProposalsByPedido(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  test("exposes refreshProposals as mutate function", () => {
    const { result } = renderHook(() => useProposalsByPedido(1));

    expect(typeof result.current.refreshProposals).toBe("function");
  });
});
