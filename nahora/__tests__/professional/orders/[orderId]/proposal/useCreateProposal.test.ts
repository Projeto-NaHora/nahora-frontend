import { renderHook, act, waitFor } from "@tests/test-utils";
import { useCreateProposal } from "@/features/proposals/hooks/useCreateProposal";
import { proposalsService } from "@/features/proposals/service";
import { createMockProposta } from "@tests/factories/proposals";

jest.mock("@/features/proposals/service", () => ({
  proposalsService: { criar: jest.fn() },
}));

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockRouter = { push: mockPush, back: mockBack };
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({ orderId: "42" }),
}));

describe("useCreateProposal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns default form values", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    expect(result.current.control).toBeDefined();
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  test("horarios starts empty", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    expect(result.current.horarios).toEqual([]);
  });

  test("modalState starts idle", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    expect(result.current.modalState.step).toBe("idle");
    expect(result.current.modalState.selectedDate).toBeNull();
  });

  // -- Modal flow tests --

  test("onAddHorario opens modal at date step", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    act(() => {
      result.current.onAddHorario();
    });

    expect(result.current.modalState.step).toBe("date");
    expect(result.current.horarios).toHaveLength(0);
  });

  test("onCloseModal resets modal state to idle", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    act(() => {
      result.current.onAddHorario();
    });
    expect(result.current.modalState.step).toBe("date");

    act(() => {
      result.current.onCloseModal();
    });
    expect(result.current.modalState.step).toBe("idle");
  });

  test("onSelectDate advances to start_time for future date", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));
    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    act(() => {
      result.current.onSelectDate(futureDate);
    });

    expect(result.current.modalState.step).toBe("start_time");
    expect(result.current.modalState.selectedDate).toEqual(futureDate);
  });

  test("onSelectDate rejects past date", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));
    act(() => {
      result.current.onAddHorario();
    });
    const pastDate = new Date("2020-01-01");

    act(() => {
      result.current.onSelectDate(pastDate);
    });

    expect(result.current.modalState.step).toBe("date");
  });

  test("onSelectStartTime advances to end_time when within turno", () => {
    const { result } = renderHook(() =>
      useCreateProposal(42, mockRouter, "2026-05-22T08:00:00"),
    );
    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    const startTime = new Date(futureDate);
    startTime.setHours(9, 0, 0, 0);

    act(() => {
      result.current.onSelectStartTime(startTime);
    });

    expect(result.current.modalState.step).toBe("end_time");
    expect(result.current.modalState.selectedStart).toEqual(startTime);
  });

  test("onSelectStartTime rejects time outside turno", () => {
    const { result } = renderHook(() =>
      useCreateProposal(42, mockRouter, "2026-05-22T08:00:00"),
    ); // MANHA: 08-12
    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    const badTime = new Date(futureDate);
    badTime.setHours(14, 0, 0, 0); // outside MANHA

    act(() => {
      result.current.onSelectStartTime(badTime);
    });

    expect(result.current.modalState.step).toBe("start_time");
  });

  test("onSelectStartTime allows any time when no turno data", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));
    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    const anyTime = new Date(futureDate);
    anyTime.setHours(15, 0, 0, 0);

    act(() => {
      result.current.onSelectStartTime(anyTime);
    });

    expect(result.current.modalState.step).toBe("end_time");
  });

  test("onSelectEndTime advances to confirm when after start", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));
    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    const startTime = new Date(futureDate);
    startTime.setHours(9, 0, 0, 0);
    act(() => {
      result.current.onSelectStartTime(startTime);
    });
    const endTime = new Date(futureDate);
    endTime.setHours(11, 0, 0, 0);

    act(() => {
      result.current.onSelectEndTime(endTime);
    });

    expect(result.current.modalState.step).toBe("confirm");
    expect(result.current.modalState.selectedEnd).toEqual(endTime);
  });

  test("onSelectEndTime rejects time before or equal to start", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));
    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    const startTime = new Date(futureDate);
    startTime.setHours(9, 0, 0, 0);
    act(() => {
      result.current.onSelectStartTime(startTime);
    });
    const badEnd = new Date(futureDate);
    badEnd.setHours(9, 0, 0, 0); // equals start

    act(() => {
      result.current.onSelectEndTime(badEnd);
    });

    expect(result.current.modalState.step).toBe("end_time");
  });

  test("onConfirmSlot builds ISO strings and adds horario", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));
    act(() => {
      result.current.onAddHorario();
    });

    const futureDate = new Date(2026, 5, 6); // Jun 6 2026
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    const startTime = new Date(2026, 5, 6, 8, 0, 0);
    act(() => {
      result.current.onSelectStartTime(startTime);
    });
    const endTime = new Date(2026, 5, 6, 10, 0, 0);
    act(() => {
      result.current.onSelectEndTime(endTime);
    });

    act(() => {
      result.current.onConfirmSlot();
    });

    expect(result.current.horarios).toHaveLength(1);
    expect(result.current.horarios[0]).toEqual({
      inicio: "2026-06-06T08:00:00",
      fim: "2026-06-06T10:00:00",
    });
    expect(result.current.modalState.step).toBe("idle");
  });

  test("does not add more than 3 horarios", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    for (let i = 0; i < 4; i++) {
      act(() => {
        result.current.onAddHorario();
      });
      if (result.current.modalState.step === "date") {
        const futureDate = new Date(2026, 5, 6 + i);
        act(() => {
          result.current.onSelectDate(futureDate);
        });
        const start = new Date(2026, 5, 6 + i, 8, 0, 0);
        act(() => {
          result.current.onSelectStartTime(start);
        });
        const end = new Date(2026, 5, 6 + i, 10, 0, 0);
        act(() => {
          result.current.onSelectEndTime(end);
        });
        act(() => {
          result.current.onConfirmSlot();
        });
      }
    }

    expect(result.current.horarios).toHaveLength(3);
  });

  // -- Submission tests --

  test("onSubmit calls proposalsService.criar and navigates on success", async () => {
    const mockProposta = createMockProposta();
    (proposalsService.criar as jest.Mock).mockResolvedValue(mockProposta);

    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    act(() => {
      result.current.form.setValue("valorOferecido", "150");
    });
    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date(2026, 5, 6);
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    act(() => {
      result.current.onSelectStartTime(new Date(2026, 5, 6, 8, 0, 0));
    });
    act(() => {
      result.current.onSelectEndTime(new Date(2026, 5, 6, 10, 0, 0));
    });
    act(() => {
      result.current.onConfirmSlot();
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(proposalsService.criar).toHaveBeenCalledWith(42, {
      valorOferecido: 150,
      descricao: undefined,
      horariosDisponiveis: [
        { inicio: "2026-06-06T08:00:00", fim: "2026-06-06T10:00:00" },
      ],
    });
    expect(mockPush).toHaveBeenCalledWith(
      "/(professional)/(orders)/42/proposal-sent",
    );
  });

  test("onSubmit includes descricao when filled", async () => {
    (proposalsService.criar as jest.Mock).mockResolvedValue(createMockProposta());

    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    act(() => {
      result.current.form.setValue("valorOferecido", "200");
      result.current.form.setValue("descricao", "Descricao de teste");
    });
    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date(2026, 5, 6);
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    act(() => {
      result.current.onSelectStartTime(new Date(2026, 5, 6, 8, 0, 0));
    });
    act(() => {
      result.current.onSelectEndTime(new Date(2026, 5, 6, 10, 0, 0));
    });
    act(() => {
      result.current.onConfirmSlot();
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(proposalsService.criar).toHaveBeenCalledWith(42, {
      valorOferecido: 200,
      descricao: "Descricao de teste",
      horariosDisponiveis: [
        { inicio: "2026-06-06T08:00:00", fim: "2026-06-06T10:00:00" },
      ],
    });
  });

  test("onSubmit sets errorMessage on failure", async () => {
    (proposalsService.criar as jest.Mock).mockRejectedValue(
      new Error("Erro de rede"),
    );

    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    act(() => {
      result.current.form.setValue("valorOferecido", "150");
    });
    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date(2026, 5, 6);
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    act(() => {
      result.current.onSelectStartTime(new Date(2026, 5, 6, 8, 0, 0));
    });
    act(() => {
      result.current.onSelectEndTime(new Date(2026, 5, 6, 10, 0, 0));
    });
    act(() => {
      result.current.onConfirmSlot();
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(result.current.errorMessage).toBe("Erro ao enviar proposta. Tente novamente.");
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("handleClear resets form, horarios, and modalState", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    act(() => {
      result.current.form.setValue("valorOferecido", "150");
      result.current.form.setValue("descricao", "alguma coisa");
      result.current.onAddHorario();
    });

    act(() => {
      result.current.handleClear();
    });

    expect(result.current.form.getValues("valorOferecido")).toBe("");
    expect(result.current.form.getValues("descricao")).toBe("");
    expect(result.current.horarios).toEqual([]);
    expect(result.current.modalState.step).toBe("idle");
    expect(result.current.errorMessage).toBeNull();
  });

  test("does not submit when horarios is empty", async () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    act(() => {
      result.current.form.setValue("valorOferecido", "150");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(proposalsService.criar).not.toHaveBeenCalled();
  });

  test("does not submit when valorOferecido is empty", async () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    act(() => {
      result.current.onAddHorario();
    });
    const futureDate = new Date(2026, 5, 6);
    act(() => {
      result.current.onSelectDate(futureDate);
    });
    act(() => {
      result.current.onSelectStartTime(new Date(2026, 5, 6, 8, 0, 0));
    });
    act(() => {
      result.current.onSelectEndTime(new Date(2026, 5, 6, 10, 0, 0));
    });
    act(() => {
      result.current.onConfirmSlot();
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(proposalsService.criar).not.toHaveBeenCalled();
  });

  test("turnoKey is derived from dataDesejada", () => {
    const { result } = renderHook(() =>
      useCreateProposal(42, mockRouter, "2026-05-22T08:00:00"),
    );

    expect(result.current.turnoKey).toBe("MANHA");
  });

  test("turnoKey is null when dataDesejada is empty", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    expect(result.current.turnoKey).toBeNull();
  });

  test("onRemoveHorario removes slot at index", () => {
    const { result } = renderHook(() => useCreateProposal(42, mockRouter));

    // Add first slot
    act(() => {
      result.current.onAddHorario();
    });
    act(() => {
      result.current.onSelectDate(new Date(2026, 5, 6));
    });
    act(() => {
      result.current.onSelectStartTime(new Date(2026, 5, 6, 8, 0, 0));
    });
    act(() => {
      result.current.onSelectEndTime(new Date(2026, 5, 6, 10, 0, 0));
    });
    act(() => {
      result.current.onConfirmSlot();
    });

    // Add second slot
    act(() => {
      result.current.onAddHorario();
    });
    act(() => {
      result.current.onSelectDate(new Date(2026, 5, 7));
    });
    act(() => {
      result.current.onSelectStartTime(new Date(2026, 5, 7, 8, 0, 0));
    });
    act(() => {
      result.current.onSelectEndTime(new Date(2026, 5, 7, 10, 0, 0));
    });
    act(() => {
      result.current.onConfirmSlot();
    });

    expect(result.current.horarios).toHaveLength(2);

    act(() => {
      result.current.onRemoveHorario(0);
    });

    expect(result.current.horarios).toHaveLength(1);
  });
});
