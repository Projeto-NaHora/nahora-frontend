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
  });

  test("acceptProposal calls API and invalidates SWR caches", async () => {
    (proposalsService.aceitar as jest.Mock).mockResolvedValue({ conversaId: 10 });

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useProposalActions(1, onSuccess));

    await result.current.acceptProposal(5);

    expect(proposalsService.aceitar).toHaveBeenCalledWith(1, 5);
    expect(mockMutate).toHaveBeenCalledWith(ENDPOINTS.PROPOSTAS(1));
    expect(mockMutate).toHaveBeenCalledWith("order-1");
    expect(onSuccess).toHaveBeenCalled();
  });

  test("rejectProposal calls API and invalidates SWR caches", async () => {
    (proposalsService.recusar as jest.Mock).mockResolvedValue(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useProposalActions(1, onSuccess));

    await result.current.rejectProposal(5);

    expect(proposalsService.recusar).toHaveBeenCalledWith(1, 5);
    expect(mockMutate).toHaveBeenCalledWith(ENDPOINTS.PROPOSTAS(1));
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
});
