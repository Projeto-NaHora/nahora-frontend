import { render } from "@tests/test-utils";
import ProposalScreen from "@/app/(professional)/(orders)/[orderId]/proposal";

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useLocalSearchParams: () => ({ orderId: "42" }),
}));

jest.mock(
  "@/features/professional/hooks/usePedidoResumoFromList",
  () => ({
    usePedidoResumoFromList: jest.fn(),
  }),
);

jest.mock("@/features/proposals/hooks/useCreateProposal", () => ({
  useCreateProposal: jest.fn(),
}));

jest.mock(
  "@/features/proposals/components/ProposalFormContent",
  () => ({
    ProposalFormContent: jest.fn(() => null),
  }),
);

import { usePedidoResumoFromList } from "@/features/professional/hooks/usePedidoResumoFromList";
import { useCreateProposal } from "@/features/proposals/hooks/useCreateProposal";
import { ProposalFormContent } from "@/features/proposals/components/ProposalFormContent";
import { createMockPedido } from "@tests/factories/orders";

const mockPedido = createMockPedido();
const mockFormContent = ProposalFormContent as unknown as jest.Mock;

function stubHook() {
  return {
    form: { getValues: jest.fn(), setValue: jest.fn(), reset: jest.fn() },
    control: {},
    errors: {},
    isSubmitting: false,
    errorMessage: null,
    horarios: [],
    modalState: { step: "idle", selectedDate: null, selectedStart: null, selectedEnd: null, editingIndex: null },
    turnoKey: null,
    onAddHorario: jest.fn(),
    onRemoveHorario: jest.fn(),
    onHorarioChange: jest.fn(),
    onSubmit: jest.fn(),
    handleClear: jest.fn(),
    onCancel: jest.fn(),
    onBack: jest.fn(),
    onSelectDate: jest.fn(),
    onSelectStartTime: jest.fn(),
    onSelectEndTime: jest.fn(),
    onConfirmSlot: jest.fn(),
    onCloseModal: jest.fn(),
  };
}

describe("ProposalScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePedidoResumoFromList as jest.Mock).mockReturnValue({
      pedido: undefined,
      isLoading: true,
      error: undefined,
    });
    (useCreateProposal as jest.Mock).mockReturnValue(stubHook());
  });

  test("renders without crashing", () => {
    render(<ProposalScreen />);
    expect(mockFormContent).toHaveBeenCalled();
  });

  test("passes isLoading from usePedidoResumoFromList", () => {
    render(<ProposalScreen />);
    const props = mockFormContent.mock.calls[0][0];
    expect(props.isLoading).toBe(true);
  });

  test("passes pedido from usePedidoResumoFromList when loaded", () => {
    (usePedidoResumoFromList as jest.Mock).mockReturnValue({
      pedido: mockPedido,
      isLoading: false,
      error: undefined,
    });
    render(<ProposalScreen />);
    const call = mockFormContent.mock.calls[0][0];
    expect(call.pedido).toBe(mockPedido);
    expect(call.isLoading).toBe(false);
    expect(call.error).toBeUndefined();
  });

  test("passes error from usePedidoResumoFromList on failure", () => {
    const err = new Error("Falha");
    (usePedidoResumoFromList as jest.Mock).mockReturnValue({
      pedido: undefined,
      isLoading: false,
      error: err,
    });
    render(<ProposalScreen />);
    expect(mockFormContent.mock.calls[0][0].error).toBe(err);
  });

  test("passes dataDesejada to useCreateProposal", () => {
    const pedidoComTurno = createMockPedido({ dataDesejada: "2026-05-22T08:00:00" });
    (usePedidoResumoFromList as jest.Mock).mockReturnValue({
      pedido: pedidoComTurno,
      isLoading: false,
      error: undefined,
    });
    const hook = stubHook();
    hook.turnoKey = "MANHA";
    (useCreateProposal as jest.Mock).mockReturnValue(hook);

    render(<ProposalScreen />);
    expect(useCreateProposal).toHaveBeenCalledWith(42, expect.anything(), "2026-05-22T08:00:00");
    const props = mockFormContent.mock.calls[0][0];
    expect(props.turnoKey).toBe("MANHA");
    expect(props.turnoLabel).toBe("Manha");
  });

  test("wires hook return values to ProposalFormContent", () => {
    (usePedidoResumoFromList as jest.Mock).mockReturnValue({
      pedido: mockPedido,
      isLoading: false,
      error: undefined,
    });
    const customHook = stubHook();
    customHook.isSubmitting = true;
    customHook.errorMessage = "Erro de rede";
    customHook.horarios = [
      { inicio: "2026-06-06T08:00:00", fim: "2026-06-06T10:00:00" },
    ];
    (useCreateProposal as jest.Mock).mockReturnValue(customHook);

    render(<ProposalScreen />);
    const props = mockFormContent.mock.calls[0][0];
    expect(props.isSubmitting).toBe(true);
    expect(props.errorMessage).toBe("Erro de rede");
    expect(props.horarios).toEqual([
      { inicio: "2026-06-06T08:00:00", fim: "2026-06-06T10:00:00" },
    ]);
  });
});
