import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { proposalsService } from "../service";
import { parseApiError } from "@/utils/apiError";
import { TURNO_TIME_RANGES, getTurnoKey } from "@/features/orders/types";
import type {
  CriarPropostaFormValues,
  CriarPropostaPayload,
  HorarioSlot,
  HorarioModalState,
} from "../types";

const schema = z.object({
  valorOferecido: z
    .string()
    .min(1, "Informe o valor da mao de obra")
    .regex(/^\d+([.,]\d{1,2})?$/, "Valor invalido"),
  descricao: z.string().max(500, "Maximo de 500 caracteres").optional().or(z.literal("")),
});

const INITIAL_MODAL_STATE: HorarioModalState = {
  step: "idle",
  selectedDate: null,
  selectedStart: null,
  selectedEnd: null,
  editingIndex: null,
};

function buildISOFromDateAndTime(date: Date, time: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(time.getHours()).padStart(2, "0");
  const min = String(time.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:00`;
}

function isWithinTurno(date: Date, turnoKey: string | null): boolean {
  if (!turnoKey) return true;
  const range = TURNO_TIME_RANGES[turnoKey];
  if (!range) return true;
  const hour = date.getHours();
  const minute = date.getMinutes();
  const startMinutes = range.startHour * 60;
  const endMinutes = range.endHour * 60;
  const slotMinutes = hour * 60 + minute;
  return slotMinutes >= startMinutes && slotMinutes < endMinutes;
}

export function useCreateProposal(
  orderId: number,
  router: ReturnType<typeof useRouter>,
  dataDesejada?: string,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<HorarioSlot[]>([]);
  const [modalState, setModalState] = useState<HorarioModalState>(INITIAL_MODAL_STATE);

  const turnoKey = getTurnoKey(dataDesejada);

  const form = useForm<CriarPropostaFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      valorOferecido: "",
      descricao: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const onAddHorario = () => {
    if (horarios.length >= 3) return;
    setModalState({
      step: "date",
      selectedDate: null,
      selectedStart: null,
      selectedEnd: null,
      editingIndex: null,
    });
  };

  const onCloseModal = () => {
    setModalState(INITIAL_MODAL_STATE);
  };

  const onSelectDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;
    setModalState((prev) => ({
      ...prev,
      step: "start_time",
      selectedDate: date,
    }));
  };

  const onSelectStartTime = (time: Date) => {
    if (!isWithinTurno(time, turnoKey)) return;
    setModalState((prev) => ({
      ...prev,
      step: "end_time",
      selectedStart: time,
    }));
  };

  const onSelectEndTime = (time: Date) => {
    const { selectedStart } = modalState;
    if (!selectedStart) return;
    if (time.getTime() <= selectedStart.getTime()) return;
    setModalState((prev) => ({
      ...prev,
      step: "confirm",
      selectedEnd: time,
    }));
  };

  const onConfirmSlot = () => {
    const { selectedDate, selectedStart, selectedEnd, editingIndex } = modalState;
    if (!selectedDate || !selectedStart || !selectedEnd) return;

    const inicio = buildISOFromDateAndTime(selectedDate, selectedStart);
    const fim = buildISOFromDateAndTime(selectedDate, selectedEnd);

    setHorarios((prev) => {
      const newSlot: HorarioSlot = { inicio, fim };
      if (editingIndex !== null) {
        return prev.map((s, i) => (i === editingIndex ? newSlot : s));
      }
      if (prev.length >= 3) return prev;
      return [...prev, newSlot];
    });

    setModalState(INITIAL_MODAL_STATE);
  };

  const onRemoveHorario = (index: number) => {
    setHorarios((prev) => prev.filter((_, i) => i !== index));
  };

  const onHorarioChange = (index: number, field: "inicio" | "fim", value: string) => {
    setHorarios((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      ),
    );
  };

  const onSubmit = async (data: CriarPropostaFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    if (horarios.length === 0) {
      setIsSubmitting(false);
      return;
    }

    const valorOferecido = parseFloat(
      data.valorOferecido.replace(",", "."),
    );

    if (isNaN(valorOferecido) || valorOferecido <= 0) {
      setIsSubmitting(false);
      return;
    }

    const payload: CriarPropostaPayload = {
      valorOferecido,
      horariosDisponiveis: horarios,
    };

    if (data.descricao && data.descricao.trim().length > 0) {
      payload.descricao = data.descricao.trim();
    }

    try {
      await proposalsService.criar(orderId, payload);
      router.push(`/(professional)/(orders)/${orderId}/proposal-sent`);
    } catch (error) {
      const parsed = parseApiError(
        error,
        "Erro ao enviar proposta. Tente novamente.",
      );
      setErrorMessage(parsed.message);

      for (const [field, message] of Object.entries(parsed.fieldErrors)) {
        if (field in form.getValues()) {
          setError(field as keyof CriarPropostaFormValues, {
            type: "server",
            message,
          });
        }
      }
    }
    setIsSubmitting(false);
  };

  const handleClear = () => {
    form.reset({ valorOferecido: "", descricao: "" });
    setHorarios([]);
    setModalState(INITIAL_MODAL_STATE);
    setErrorMessage(null);
  };

  const onCancel = () => {
    router.back();
  };

  const onBack = () => {
    router.back();
  };

  return {
    form,
    control,
    errors,
    isSubmitting,
    errorMessage,
    horarios,
    modalState,
    turnoKey,
    onAddHorario,
    onRemoveHorario,
    onHorarioChange,
    onSubmit: handleSubmit(onSubmit),
    handleClear,
    onCancel,
    onBack,
    onSelectDate,
    onSelectStartTime,
    onSelectEndTime,
    onConfirmSlot,
    onCloseModal,
  };
}
