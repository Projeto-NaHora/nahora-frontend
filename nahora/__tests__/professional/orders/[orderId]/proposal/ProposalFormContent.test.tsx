import React from "react";
import { Modal, Pressable } from "react-native";
import { useForm } from "react-hook-form";
import { render, screen, fireEvent } from "@tests/test-utils";
import { ProposalFormContent } from "@/features/proposals/components/ProposalFormContent";
import { createMockPedido } from "@tests/factories/orders";
import { createMockHorarioSlotList } from "@tests/factories/proposals";
import type { CriarPropostaFormValues, HorarioSlot, HorarioModalState } from "@/features/proposals/types";
import type { Pedido } from "@/features/orders/types";

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));
jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));
jest.mock("@react-native-community/datetimepicker", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) => require("react").createElement(View, { testID: "date-time-picker", ...props }),
  };
});

const IDLE_MODAL: HorarioModalState = {
  step: "idle",
  selectedDate: null,
  selectedStart: null,
  selectedEnd: null,
  editingIndex: null,
};

const DATE_MODAL: HorarioModalState = {
  step: "date",
  selectedDate: null,
  selectedStart: null,
  selectedEnd: null,
  editingIndex: null,
};

type TestOverrides = {
  pedido?: Pedido;
  isLoading?: boolean;
  error?: Error;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  horarios?: HorarioSlot[];
  modalState?: HorarioModalState;
  turnoKey?: string | null;
  turnoLabel?: string;
  onAddHorario?: () => void;
  onRemoveHorario?: (index: number) => void;
  onHorarioChange?: (index: number, field: "inicio" | "fim", value: string) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
  onSelectDate?: (date: Date) => void;
  onSelectStartTime?: (time: Date) => void;
  onSelectEndTime?: (time: Date) => void;
  onConfirmSlot?: () => void;
  onCloseModal?: () => void;
};

function renderComponent(overrides: TestOverrides = {}) {
  const {
    pedido,
    isLoading = false,
    error,
    isSubmitting = false,
    errorMessage = null,
    horarios,
    modalState = IDLE_MODAL,
    turnoKey = null,
    turnoLabel = "",
    onAddHorario = jest.fn(),
    onRemoveHorario = jest.fn(),
    onHorarioChange = jest.fn(),
    onSubmit = jest.fn(),
    onCancel = jest.fn(),
    onBack = jest.fn(),
    onSelectDate = jest.fn(),
    onSelectStartTime = jest.fn(),
    onSelectEndTime = jest.fn(),
    onConfirmSlot = jest.fn(),
    onCloseModal = jest.fn(),
  } = overrides;

  function Inner() {
    const { control } = useForm<CriarPropostaFormValues>({
      defaultValues: { valorOferecido: "", descricao: "" },
    });

    return (
      <ProposalFormContent
        pedido={pedido}
        isLoading={isLoading}
        error={error}
        control={control}
        errors={{}}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        horarios={horarios ?? []}
        modalState={modalState}
        turnoKey={turnoKey}
        turnoLabel={turnoLabel}
        onAddHorario={onAddHorario}
        onRemoveHorario={onRemoveHorario}
        onHorarioChange={onHorarioChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onBack={onBack}
        onSelectDate={onSelectDate}
        onSelectStartTime={onSelectStartTime}
        onSelectEndTime={onSelectEndTime}
        onConfirmSlot={onConfirmSlot}
        onCloseModal={onCloseModal}
      />
    );
  }

  const result = render(<Inner />);
  return {
    ...result,
    onAddHorario,
    onRemoveHorario,
    onHorarioChange,
    onSubmit,
    onCancel,
    onBack,
    onSelectDate,
    onSelectStartTime,
    onSelectEndTime,
    onConfirmSlot,
    onCloseModal,
  };
}

describe("ProposalFormContent", () => {
  const mockPedido = createMockPedido();

  test("renders loading state", () => {
    renderComponent({ isLoading: true });
    expect(screen.getByText("Carregando pedido...")).toBeOnTheScreen();
  });

  test("renders error state", () => {
    renderComponent({ error: new Error("Falha") });
    expect(screen.getByText("Erro ao carregar pedido.")).toBeOnTheScreen();
  });

  test("renders header with back button and title", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("Mostrar Interesse")).toBeOnTheScreen();
  });

  test("renders header subtitle with client name", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("Para João Silva")).toBeOnTheScreen();
  });

  test("calls onBack when back button pressed", () => {
    const { onBack } = renderComponent({ pedido: mockPedido });
    const buttons = screen.UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(buttons[0]);
    expect(onBack).toHaveBeenCalled();
  });

  test("renders Criar proposta heading", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("Criar proposta")).toBeOnTheScreen();
  });

  test("renders client initials in avatar", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("JS")).toBeOnTheScreen();
  });

  test("renders client name in card", () => {
    renderComponent({ pedido: mockPedido });
    const names = screen.getAllByText("João Silva");
    expect(names.length).toBeGreaterThanOrEqual(1);
  });

  test("renders categoria label", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("ELETRICA")).toBeOnTheScreen();
  });

  test("renders Valor da mao de obra label", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("Valor da mao de obra")).toBeOnTheScreen();
  });

  test("renders R$ prefix in price field", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("R$")).toBeOnTheScreen();
  });

  test("renders Descricao label", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("Descricao")).toBeOnTheScreen();
  });

  test("renders optional hint for descricao", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("Opcional, mas aumenta aceite")).toBeOnTheScreen();
  });

  test("renders Datas e horarios disponiveis label", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("Datas e horarios disponiveis")).toBeOnTheScreen();
  });

  test("renders Adicionar horario button", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("+ Adicionar horario")).toBeOnTheScreen();
  });

  test("renders horario slots when present", () => {
    const slots = createMockHorarioSlotList(1);
    renderComponent({ pedido: mockPedido, horarios: slots });
    expect(screen.getByText("remover")).toBeOnTheScreen();
  });

  test("calls onAddHorario when add button pressed", () => {
    const { onAddHorario } = renderComponent({ pedido: mockPedido });
    fireEvent.press(screen.getByText("+ Adicionar horario"));
    expect(onAddHorario).toHaveBeenCalled();
  });

  test("renders Cancelar button", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("Cancelar")).toBeOnTheScreen();
  });

  test("renders Enviar proposta button", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.getByText("Enviar proposta")).toBeOnTheScreen();
  });

  test("calls onCancel when Cancelar pressed", () => {
    const { onCancel } = renderComponent({ pedido: mockPedido });
    fireEvent.press(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalled();
  });

  test("calls onSubmit when Enviar proposta pressed", () => {
    const { onSubmit } = renderComponent({ pedido: mockPedido });
    fireEvent.press(screen.getByText("Enviar proposta"));
    expect(onSubmit).toHaveBeenCalled();
  });

  test("shows Enviando... when submitting", () => {
    renderComponent({ pedido: mockPedido, isSubmitting: true });
    expect(screen.getByText("Enviando...")).toBeOnTheScreen();
  });

  test("renders error message banner when set", () => {
    renderComponent({ pedido: mockPedido, errorMessage: "Erro de rede" });
    expect(screen.getByText("Erro de rede")).toBeOnTheScreen();
  });

  // -- Modal tests --
  test("renders modal when modalState.step is not idle", () => {
    renderComponent({ pedido: mockPedido, modalState: DATE_MODAL });
    expect(screen.getByText("Selecione a data")).toBeOnTheScreen();
  });

  test("renders turno hint when turnoKey is provided", () => {
    renderComponent({
      pedido: mockPedido,
      turnoKey: "MANHA",
      turnoLabel: "Manha",
    });
    expect(screen.getByText("Turno: Manha (8h - 12h)")).toBeOnTheScreen();
  });

  test("does not render turno hint when turnoKey is null", () => {
    renderComponent({ pedido: mockPedido });
    expect(screen.queryByText(/Turno:/)).not.toBeOnTheScreen();
  });

  test("calls onCloseModal when Cancelar pressed in modal", () => {
    const { onCloseModal } = renderComponent({
      pedido: mockPedido,
      modalState: DATE_MODAL,
    });
    const cancelButtons = screen.getAllByText("Cancelar");
    // The modal Cancelar is inside the modal, the bottom bar also has Cancelar
    fireEvent.press(cancelButtons[cancelButtons.length - 1]);
    expect(onCloseModal).toHaveBeenCalled();
  });
});
