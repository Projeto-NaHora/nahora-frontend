import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
} from "react-native";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getInitials } from "@/utils/formatters";
import { TURNO_LABEL, TURNO_TIME_RANGES } from "@/features/orders/types";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type {
  CriarPropostaFormValues,
  HorarioSlot,
  HorarioModalState,
} from "../types";
import type { Pedido } from "@/features/orders/types";

type ProposalFormContentProps = {
  pedido: Pedido | undefined;
  isLoading: boolean;
  error: Error | undefined;
  control: Control<CriarPropostaFormValues>;
  errors: FieldErrors<CriarPropostaFormValues>;
  isSubmitting: boolean;
  errorMessage: string | null;
  horarios: HorarioSlot[];
  modalState: HorarioModalState;
  turnoKey: string | null;
  turnoLabel: string;
  onAddHorario: () => void;
  onRemoveHorario: (index: number) => void;
  onHorarioChange: (index: number, field: "inicio" | "fim", value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onBack: () => void;
  onSelectDate: (date: Date) => void;
  onSelectStartTime: (time: Date) => void;
  onSelectEndTime: (time: Date) => void;
  onConfirmSlot: () => void;
  onCloseModal: () => void;
};

function formatDateShort(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]}`;
}

function formatTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(11, 16);
  return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatTimeFromDate(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDateFromDate(d: Date): string {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]}`;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export function ProposalFormContent({
  pedido,
  isLoading,
  error,
  control,
  errors,
  isSubmitting,
  errorMessage,
  horarios,
  modalState,
  turnoKey,
  turnoLabel,
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
}: ProposalFormContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const clienteNome = pedido?.clienteNome ?? "";
  const initials = getInitials(clienteNome);
  const isModalOpen = modalState.step !== "idle";

  const turnoTimeHint =
    turnoKey && TURNO_TIME_RANGES[turnoKey]
      ? `${TURNO_TIME_RANGES[turnoKey].startHour}h - ${TURNO_TIME_RANGES[turnoKey].endHour}h`
      : "";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.surface }]} onPress={onBack}>
          <IconSymbol name="chevron.left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mostrar Interesse</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Para {clienteNome}
          </Text>
        </View>
      </View>

      {/* SCROLLABLE BODY */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={colors.brand} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>Carregando pedido...</Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.statusContainer}>
            <Text style={[styles.errorStateText, { color: colors.error }]}>
              Erro ao carregar pedido.
            </Text>
          </View>
        )}

        {!isLoading && !error && pedido && (
          <>
            {/* Heading */}
            <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>Criar proposta</Text>

            {/* Client info card */}
            <View style={[styles.clientCard, { borderColor: colors.border }]}>
              <View style={[styles.clientAvatar, { backgroundColor: colors.brand }]}>
                <Text style={[styles.avatarText, { color: colors.onBrand }]}>{initials}</Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={[styles.clientName, { color: colors.textPrimary }]}>{clienteNome}</Text>
                <View style={styles.clientMeta}>
                  <Text style={[styles.serviceCount, { color: colors.textSecondary }]}>
                    {pedido.descricao
                      ? pedido.descricao.split(" ").slice(0, 2).join(" ")
                      : "Servico"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Servico (read-only) */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>Servico</Text>
                <Text style={[styles.requiredAsterisk, { color: colors.error }]}>*</Text>
              </View>
              <View style={[styles.readonlyInput, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Text style={[styles.readonlyText, { color: colors.textPrimary }]} numberOfLines={1}>
                  {pedido.descricao}
                </Text>
              </View>
            </View>

            {/* Valor da mao de obra */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>Valor da mao de obra</Text>
                <Text style={[styles.requiredAsterisk, { color: colors.error }]}>*</Text>
              </View>
              <View style={[styles.priceInputWrapper, { borderColor: colors.brand, backgroundColor: colors.brand + "0D" }]}>
                <View style={styles.priceInputRow}>
                  <Text style={[styles.currencyPrefix, { color: colors.brand }]}>R$</Text>
                  <Controller
                    control={control}
                    name="valorOferecido"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={[styles.priceTextInput, { color: colors.textPrimary }]}
                        keyboardType="decimal-pad"
                        placeholder="0"
                        placeholderTextColor={colors.placeholder}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
                <View style={[styles.suggestionBadge, { borderColor: colors.brand + "33", backgroundColor: colors.background }]}>
                  <Text style={[styles.suggestionText, { color: colors.brand }]}>
                    Sugestao: R$ 90-130
                  </Text>
                </View>
              </View>
              {errors.valorOferecido?.message && (
                <Text style={[styles.fieldError, { color: colors.error }]}>
                  {errors.valorOferecido.message}
                </Text>
              )}
            </View>

            {/* Descricao */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>Descricao</Text>
                <Text style={[styles.optionalHint, { color: colors.textSecondary }]}>
                  Opcional, mas aumenta aceite
                </Text>
              </View>
              <Controller
                control={control}
                name="descricao"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.textPrimary }]}
                    placeholder="Descreva seu servico..."
                    placeholderTextColor={colors.placeholder}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.descricao?.message && (
                <Text style={[styles.fieldError, { color: colors.error }]}>
                  {errors.descricao.message}
                </Text>
              )}
            </View>

            {/* Datas e horarios disponiveis */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                Datas e horarios disponiveis
              </Text>
              {turnoTimeHint !== "" && (
                <Text style={[styles.turnoHint, { color: colors.brand }]}>
                  Turno: {turnoLabel} ({turnoTimeHint})
                </Text>
              )}
              <View style={[styles.availabilityCard, { borderColor: colors.border, backgroundColor: colors.background }]}>
                {horarios.map((slot, index) => (
                  <View
                    key={index}
                    style={[
                      styles.availabilityRow,
                      index < horarios.length - 1 &&
                        [styles.availabilityRowBorder, { borderBottomColor: colors.border }],
                    ]}
                  >
                    <View style={styles.availabilityInfo}>
                      <Text style={[styles.availabilityDate, { color: colors.textPrimary }]}>
                        {formatDateShort(slot.inicio)}
                      </Text>
                      <Text style={[styles.availabilityTime, { color: colors.textSecondary }]}>
                        {slot.inicio && slot.fim
                          ? `${formatTime(slot.inicio)} - ${formatTime(slot.fim)}`
                          : "Defina o horario"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => onRemoveHorario(index)}
                    >
                      <Text style={[styles.removeText, { color: colors.error }]}>remover</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addHorarioButton}
                  onPress={onAddHorario}
                >
                  <Text style={[styles.addHorarioText, { color: colors.brand }]}>
                    + Adicionar horario
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* API error message */}
            {errorMessage && (
              <Text style={[styles.errorBanner, { color: colors.error }]}>{errorMessage}</Text>
            )}
          </>
        )}
      </ScrollView>

      {/* FIXED BOTTOM BAR */}
      <View style={[styles.bottomBar, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.surface }]} onPress={onCancel}>
          <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>Cancelar</Text>
        </TouchableOpacity>
        <View style={styles.buttonGap} />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: colors.brand },
            isSubmitting && styles.sendButtonDisabled,
          ]}
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          <Text style={[styles.sendButtonText, { color: colors.onBrand }]}>
            {isSubmitting ? "Enviando..." : "Enviar proposta"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DATE/TIME PICKER MODAL */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="slide"
        onRequestClose={onCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            {/* Step: Date picker */}
            {modalState.step === "date" && (
              <>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Selecione a data</Text>
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  minimumDate={today}
                  onChange={(_event, date) => {
                    if (date) onSelectDate(date);
                  }}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalCancelButton, { backgroundColor: colors.surface }]}
                    onPress={onCloseModal}
                  >
                    <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Step: Start time */}
            {modalState.step === "start_time" && (
              <>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Horario de inicio</Text>
                {turnoTimeHint !== "" && (
                  <Text style={[styles.modalTurnoHint, { color: colors.brand }]}>
                    Turno: {turnoLabel} ({turnoTimeHint})
                  </Text>
                )}
                <DateTimePicker
                  value={
                    modalState.selectedDate
                      ? new Date(modalState.selectedDate)
                      : new Date()
                  }
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_event, time) => {
                    if (time) onSelectStartTime(time);
                  }}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalCancelButton, { backgroundColor: colors.surface }]}
                    onPress={onCloseModal}
                  >
                    <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <View style={styles.modalButtonGap} />
                  <TouchableOpacity
                    style={[styles.modalSecondaryButton, { backgroundColor: colors.surface }]}
                    onPress={onCloseModal}
                  >
                    <Text style={[styles.modalSecondaryText, { color: colors.textPrimary }]}>Voltar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Step: End time */}
            {modalState.step === "end_time" && (
              <>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Horario de termino</Text>
                <DateTimePicker
                  value={
                    modalState.selectedStart
                      ? new Date(modalState.selectedStart)
                      : new Date()
                  }
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_event, time) => {
                    if (time) onSelectEndTime(time);
                  }}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalCancelButton, { backgroundColor: colors.surface }]}
                    onPress={onCloseModal}
                  >
                    <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <View style={styles.modalButtonGap} />
                  <TouchableOpacity
                    style={[styles.modalSecondaryButton, { backgroundColor: colors.surface }]}
                    onPress={() =>
                      onCloseModal()
                    }
                  >
                    <Text style={[styles.modalSecondaryText, { color: colors.textPrimary }]}>Voltar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Step: Confirm */}
            {modalState.step === "confirm" && (
              <>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Confirmar horario</Text>
                <View style={styles.confirmSummary}>
                  <Text style={[styles.confirmDate, { color: colors.textPrimary }]}>
                    {modalState.selectedDate
                      ? formatDateFromDate(modalState.selectedDate)
                      : ""}
                  </Text>
                  <Text style={[styles.confirmTime, { color: colors.brand }]}>
                    {modalState.selectedStart
                      ? formatTimeFromDate(modalState.selectedStart)
                      : ""}{" "}
                    -{" "}
                    {modalState.selectedEnd
                      ? formatTimeFromDate(modalState.selectedEnd)
                      : ""}
                  </Text>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalCancelButton, { backgroundColor: colors.surface }]}
                    onPress={onCloseModal}
                  >
                    <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <View style={styles.modalButtonGap} />
                  <TouchableOpacity
                    style={[styles.modalSecondaryButton, { backgroundColor: colors.surface }]}
                    onPress={onCloseModal}
                  >
                    <Text style={[styles.modalSecondaryText, { color: colors.textPrimary }]}>Voltar</Text>
                  </TouchableOpacity>
                  <View style={styles.modalButtonGap} />
                  <TouchableOpacity
                    style={[styles.modalConfirmButton, { backgroundColor: colors.brand }]}
                    onPress={onConfirmSlot}
                  >
                    <Text style={[styles.modalConfirmText, { color: colors.onBrand }]}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header
  header: {
    height: 119,
    paddingTop: 60,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitles: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 128,
  },
  // Status states
  statusContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  statusText: {
    fontSize: 14,
    marginTop: 12,
  },
  errorStateText: {
    fontSize: 14,
  },
  // Main title
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 33,
    marginBottom: 24,
  },
  // Client card
  clientCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 32,
    padding: 12,
    height: 70,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
  },
  clientInfo: {
    marginLeft: 12,
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  clientMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  serviceCount: {
    fontSize: 11,
    lineHeight: 17,
  },
  // Field groups
  fieldGroup: {
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 24,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  requiredAsterisk: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  turnoHint: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  // Servico readonly
  readonlyInput: {
    borderRadius: 24,
    borderWidth: 1,
    height: 50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
  },
  readonlyText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  // Valor / price field
  priceInputWrapper: {
    borderRadius: 32,
    borderWidth: 2,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  priceInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  priceTextInput: {
    fontSize: 26,
    fontWeight: "700",
    flex: 1,
    paddingVertical: 0,
  },
  suggestionBadge: {
    alignSelf: "flex-end",
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: "700",
  },
  // Descricao textarea
  textArea: {
    borderRadius: 32,
    borderWidth: 1,
    height: 100,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 22,
  },
  optionalHint: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  // Availability section
  availabilityCard: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: "hidden",
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  availabilityRowBorder: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
  },
  availabilityInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  availabilityDate: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  availabilityTime: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  removeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  addHorarioButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  addHorarioText: {
    fontSize: 14,
    fontWeight: "700",
  },
  // Field error
  fieldError: {
    fontSize: 12,
    marginTop: 4,
  },
  // API error banner
  errorBanner: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 12,
  },
  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  buttonGap: {
    width: 12,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  sendButton: {
    flex: 1.4,
    height: 56,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  modalTurnoHint: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  modalButtonGap: {
    width: 12,
  },
  modalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalSecondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  modalSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalConfirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: "600",
  },
  confirmSummary: {
    alignItems: "center",
    paddingVertical: 24,
  },
  confirmDate: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  confirmTime: {
    fontSize: 18,
    fontWeight: "600",
  },
});
