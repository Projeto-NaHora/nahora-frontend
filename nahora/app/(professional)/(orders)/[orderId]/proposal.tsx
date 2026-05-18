import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePedidoResumoFromList } from "@/features/professional/hooks/usePedidoResumoFromList";
import { useCreateProposal } from "@/features/proposals/hooks/useCreateProposal";
import { ProposalFormContent } from "@/features/proposals/components/ProposalFormContent";
import { TURNO_LABEL } from "@/features/orders/types";

export default function ProposalScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const pedidoId = Number(orderId);

  const { pedido, isLoading, error } = usePedidoResumoFromList(pedidoId);

  const {
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
    onSubmit,
    onCancel,
    onBack,
    onSelectDate,
    onSelectStartTime,
    onSelectEndTime,
    onConfirmSlot,
    onCloseModal,
  } = useCreateProposal(pedidoId, router, pedido?.dataDesejada);

  const turnoLabel = turnoKey ? (TURNO_LABEL[turnoKey] ?? turnoKey) : "";

  return (
    <ProposalFormContent
      pedido={pedido}
      isLoading={isLoading}
      error={error ?? undefined}
      control={control}
      errors={errors}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      horarios={horarios}
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
