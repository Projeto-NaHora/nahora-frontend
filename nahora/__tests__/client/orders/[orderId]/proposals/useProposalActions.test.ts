import { renderHook, waitFor } from "@tests/test-utils";
import { useProposalActions } from "@/features/proposals/hooks/useProposals";
import { proposalsService } from "@/features/proposals/service";
import { ENDPOINTS } from "@/services/api/endpoints";

jest.mock("@/features/proposals/service", () => ({
  proposalsService: { aceitar: jest.fn(), recusar: jest.fn() },
}));

const mockMutate = jest.fn().mockResolvedValue(undefined);
jest.mock("swr", () => {
  const actual = jest.requireActual("swr");
  return {
    __esModule: true,
    ...actual,
    default: actual.default,
    useSWRConfig: () => ({ mutate: mockMutate }),
  };
});

describe("useProposalActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMutate.mockResolvedValue(undefined);
  });

  test("acceptProposal calls API, optimistically updates cache, and revalidates order", async () => {
    (proposalsService.aceitar as jest.Mock).mockResolvedValue({ conversaId: 10 });

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useProposalActions(1, onSuccess));

    await result.current.acceptProposal(5);

    expect(proposalsService.aceitar).toHaveBeenCalledWith(1, 5);
    // Optimistic update (revalidate: false, function updater)
    expect(mockMutate).toHaveBeenCalledWith(
      ENDPOINTS.PROPOSTAS(1),
      expect.any(Function),
      { revalidate: false },
    );
    // Order revalidation (fire-and-forget)
    expect(mockMutate).toHaveBeenCalledWith("order-1");
    expect(onSuccess).toHaveBeenCalled();
  });

  test("rejectProposal calls API, optimistically updates cache, and revalidates order", async () => {
    (proposalsService.recusar as jest.Mock).mockResolvedValue(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useProposalActions(1, onSuccess));

    await result.current.rejectProposal(5);

    expect(proposalsService.recusar).toHaveBeenCalledWith(1, 5);
    // Optimistic update (revalidate: false, function updater)
    expect(mockMutate).toHaveBeenCalledWith(
      ENDPOINTS.PROPOSTAS(1),
      expect.any(Function),
      { revalidate: false },
    );
    // Order revalidation (fire-and-forget)
    expect(mockMutate).toHaveBeenCalledWith("order-1");
    expect(onSuccess).toHaveBeenCalled();
  });

  test("acceptProposal calls onSuccess even when mutate fails", async () => {
    (proposalsService.aceitar as jest.Mock).mockResolvedValue({ conversaId: 10 });
    mockMutate.mockRejectedValue(new Error("revalidation failed"));

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useProposalActions(1, onSuccess));

    // should not throw — Promise.allSettled never rejects
    await result.current.acceptProposal(5);
    expect(onSuccess).toHaveBeenCalled();
  });

  test("acceptProposal optimistically updates proposals cache with ACEITA status", async () => {
    (proposalsService.aceitar as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useProposalActions(1));
    await result.current.acceptProposal(5);

    // First mutate call should be the optimistic update with revalidate:false
    const optimisticCall = mockMutate.mock.calls.find(
      (call: any[]) => call[0] === ENDPOINTS.PROPOSTAS(1) && call[2]?.revalidate === false,
    );
    expect(optimisticCall).toBeDefined();

    // The updater function should mark proposal 5 as ACEITA
    const updaterFn = optimisticCall[1] as (cached: any) => any;
    const cached = [
      { id: 5, status: "PENDENTE", valor: 100 },
      { id: 8, status: "PENDENTE", valor: 200 },
    ];
    const updated = updaterFn(cached);
    expect(updated).toEqual([
      { id: 5, status: "ACEITA", valor: 100 },
      { id: 8, status: "PENDENTE", valor: 200 },
    ]);
  });

  test("acceptProposal updater handles empty cache", async () => {
    (proposalsService.aceitar as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useProposalActions(1));
    await result.current.acceptProposal(5);

    const optimisticCall = mockMutate.mock.calls.find(
      (call: any[]) => call[0] === ENDPOINTS.PROPOSTAS(1) && call[2]?.revalidate === false,
    );
    expect(optimisticCall).toBeDefined();
    const updaterFn = optimisticCall![1] as (cached: any) => any;
    expect(updaterFn(undefined)).toBeUndefined();
  });

  test("rejectProposal optimistically updates proposals cache with REJEITADA status", async () => {
    (proposalsService.recusar as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProposalActions(1));
    await result.current.rejectProposal(5);

    // First mutate call should be the optimistic update with revalidate:false
    const optimisticCall = mockMutate.mock.calls.find(
      (call: any[]) => call[0] === ENDPOINTS.PROPOSTAS(1) && call[2]?.revalidate === false,
    );
    expect(optimisticCall).toBeDefined();

    // The updater function should mark proposal 5 as REJEITADA
    const updaterFn = optimisticCall[1] as (cached: any) => any;
    const cached = [
      { id: 5, status: "PENDENTE", valor: 100 },
    ];
    const updated = updaterFn(cached);
    expect(updated).toEqual([
      { id: 5, status: "REJEITADA", valor: 100 },
    ]);
  });
});
