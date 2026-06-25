import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import type { Proposta, HorarioSlot } from "../types";
import { getInitials } from "@/utils/formatters";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
const WEEKDAY_LONG = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function parseSlotDate(slot: HorarioSlot): Date | null {
  const iso = slot.data ?? slot.inicio;
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function formatSlotTime(slot: HorarioSlot): string {
  const inicio = new Date(slot.inicio);
  const fim = new Date(slot.fim);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) return "";
  return `${fmt(inicio)} às ${fmt(fim)}`;
}

function formatDateLong(date: Date): string {
  const weekday = WEEKDAY_LONG[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${weekday}, ${day}/${month}/${date.getFullYear()}`;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type DayGroup = { date: Date; slots: HorarioSlot[] };

function groupSlotsByDay(slots: HorarioSlot[]): DayGroup[] {
  const map = new Map<string, HorarioSlot[]>();
  const ordered: Date[] = [];

  for (const slot of slots) {
    const d = parseSlotDate(slot);
    if (!d) continue;
    const key = d.toISOString().slice(0, 10);
    if (!map.has(key)) {
      map.set(key, []);
      ordered.push(d);
    }
    map.get(key)!.push(slot);
  }

  ordered.sort((a, b) => a.getTime() - b.getTime());

  return ordered.map((date) => ({
    date,
    slots: map.get(date.toISOString().slice(0, 10))!,
  }));
}

function detectExceptions(dayGroups: DayGroup[]): Set<string> {
  const timeCounts = new Map<string, number>();
  for (const group of dayGroups) {
    for (const slot of group.slots) {
      const time = formatSlotTime(slot);
      timeCounts.set(time, (timeCounts.get(time) ?? 0) + 1);
    }
  }

  let maxCount = 0;
  for (const count of timeCounts.values()) {
    if (count > maxCount) maxCount = count;
  }

  const normalTimes = new Set<string>();
  for (const [time, count] of timeCounts) {
    if (count === maxCount) normalTimes.add(time);
  }

  const exceptions = new Set<string>();
  for (const group of dayGroups) {
    for (const slot of group.slots) {
      const time = formatSlotTime(slot);
      if (!normalTimes.has(time)) {
        exceptions.add(group.date.toISOString().slice(0, 10));
        break;
      }
    }
  }

  return exceptions;
}

function useThemeColors() {
  const theme = useColorScheme() ?? "light";
  return Colors[theme];
}

export interface ProposalDetailContentProps {
  proposal: Proposta;
  onBack: () => void;
  onAccept: () => void;
  onReject: () => void;
  isAccepting: boolean;
}

export function ProposalDetailContent({
  proposal,
  onBack,
  onAccept,
  onReject,
  isAccepting,
}: ProposalDetailContentProps) {
  const theme = useThemeColors();
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const horarios = proposal.horariosDisponiveis ?? [];
  const dayGroups = groupSlotsByDay(horarios);
  const exceptionDays = detectExceptions(dayGroups);

  const slotDates = (() => {
    const s = new Set<string>();
    for (const g of dayGroups) s.add(g.date.toISOString().slice(0, 10));
    return s;
  })();

  const calendarDays = (() => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return { cells, label: `${MONTHS[month]} ${year}` };
  })();

  const goToPrevMonth = () => {
    setCalendarMonth((m) => {
      if (m.month === 0) return { year: m.year - 1, month: 11 };
      return { year: m.year, month: m.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setCalendarMonth((m) => {
      if (m.month === 11) return { year: m.year + 1, month: 0 };
      return { year: m.year, month: m.month + 1 };
    });
  };

  const profissional = proposal.profissional;
  const iniciais = getInitials(profissional.nome);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.white }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={[styles.backArrow, { color: theme.chat.darkText }]}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.chat.darkText }]}>
          Detalhes da proposta
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Professional badge + heading area */}
        <View style={styles.topSection}>
          <View
            style={[
              styles.professionalBadge,
              { backgroundColor: theme.chat.proposalBg },
            ]}
          >
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: theme.chat.proposalText },
              ]}
            >
              <Text style={styles.avatarText}>{iniciais}</Text>
            </View>
            <View style={styles.professionalInfo}>
              <Text
                style={[
                  styles.professionalName,
                  { color: theme.chat.proposalText },
                ]}
              >
                {profissional.nome}
              </Text>
              <Text
                style={[
                  styles.professionalSubtitle,
                  { color: "#cd7b40" },
                ]}
              >
                enviou esta oferta
              </Text>
            </View>
          </View>

          <Text
            style={[styles.sectionHeading, { color: theme.chat.darkText }]}
          >
            Revise os dias da prestação do{"\n"}serviço
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.chat.mutedText }]}>
            O prestador definiu os horários abaixo. Verifique se estão de acordo
            com sua disponibilidade.
          </Text>
        </View>

        {/* Calendar card */}
        <View style={styles.calendarCardWrapper}>
          <View
            style={[
              styles.calendarCard,
              { backgroundColor: theme.chat.surfaceLight },
            ]}
          >
            {/* Month selector */}
            <View style={styles.monthSelector}>
              <TouchableOpacity onPress={goToPrevMonth} style={styles.chevron}>
                <Text style={[styles.chevronText, { color: theme.chat.mutedText }]}>‹</Text>
              </TouchableOpacity>
              <Text style={[styles.monthLabel, { color: theme.chat.darkText }]}>
                {calendarDays.label}
              </Text>
              <TouchableOpacity onPress={goToNextMonth} style={styles.chevron}>
                <Text style={[styles.chevronText, { color: theme.chat.darkText }]}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Weekday labels */}
            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((wd) => (
                <View key={wd} style={styles.weekdayCell}>
                  <Text style={[styles.weekdayText, { color: theme.chat.mutedText }]}>
                    {wd}
                  </Text>
                </View>
              ))}
            </View>

            {/* Day grid */}
            <View style={styles.dayGrid}>
              {calendarDays.cells.map((day, i) => {
                if (day === null) {
                  return <View key={`empty-${i}`} style={styles.dayCell} />;
                }
                const dateKey = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const hasSlot = slotDates.has(dateKey);
                return (
                  <View key={dateKey} style={styles.dayCell}>
                    <View
                      style={[
                        styles.dayNumber,
                        hasSlot && {
                          backgroundColor: theme.chat.proposalBg,
                          borderRadius: 8,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          {
                            color: hasSlot
                              ? theme.chat.proposalText
                              : theme.chat.darkText,
                          },
                          hasSlot && styles.dayTextBold,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                    {hasSlot && (
                      <View
                        style={[
                          styles.dayDot,
                          { backgroundColor: theme.chat.proposalText },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            { backgroundColor: theme.chat.surfaceLight, borderColor: theme.chat.borderSubtle },
          ]}
        />

        {/* Time slots section */}
        <View style={styles.timeSlotSection}>
          <Text
            style={[
              styles.timeSlotHeading,
              { color: theme.chat.darkText },
            ]}
          >
            Resumo dos horários
          </Text>

          <View style={styles.timeline}>
            <View
              style={[styles.timelineBar, { borderColor: theme.chat.borderSubtle }]}
            >
              {dayGroups.map((group, gi) => {
                const dateKey = group.date.toISOString().slice(0, 10);
                const isException = exceptionDays.has(dateKey);

                return (
                  <View key={dateKey} style={styles.timelineGroup}>
                    {/* Dot on the timeline */}
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor: isException
                            ? theme.chat.proposalText
                            : "#d1d5db",
                          borderColor: theme.white,
                        },
                      ]}
                    />

                    {/* Content */}
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineDateRow}>
                        <Text
                          style={[
                            styles.timelineDate,
                            {
                              color: isException
                                ? theme.chat.proposalText
                                : theme.chat.darkText,
                            },
                          ]}
                        >
                          {formatDateLong(group.date)}
                        </Text>
                        {isException && (
                          <View
                            style={[
                              styles.exceptionBadge,
                              { backgroundColor: theme.chat.proposalBg },
                            ]}
                          >
                            <Text
                              style={[
                                styles.exceptionBadgeText,
                                { color: theme.chat.proposalText },
                              ]}
                            >
                              EXCEÇÃO
                            </Text>
                          </View>
                        )}
                      </View>

                      {group.slots.map((slot, si) => {
                        const time = formatSlotTime(slot);
                        if (!time) return null;
                        const slotIsException =
                          isException || slot.excecao;

                        return (
                          <View
                            key={si}
                            style={[
                              styles.timeChip,
                              {
                                backgroundColor: slotIsException
                                  ? theme.chat.proposalBg
                                  : theme.chat.surfaceLight,
                                borderColor: slotIsException
                                  ? theme.chat.proposalBorder
                                  : theme.chat.borderSubtle,
                              },
                            ]}
                          >
                            <Text style={styles.timeChipIcon}>🕐</Text>
                            <Text
                              style={[
                                styles.timeChipText,
                                {
                                  color: slotIsException
                                    ? "#cd7b40"
                                    : theme.chat.darkText,
                                },
                              ]}
                            >
                              {time}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            { backgroundColor: theme.chat.surfaceLight, borderColor: theme.chat.borderSubtle },
          ]}
        />

        {/* Financial summary card */}
        <View style={styles.financialSection}>
          <View style={[styles.financialCard, { backgroundColor: "#dff6e6" }]}>
            <View style={styles.financialBlur} />
            <View style={styles.financialContent}>
              <Text style={styles.financialTitle}>Valor total da proposta</Text>
              <Text style={styles.financialDescription}>
                Este é o valor que será cobrado por todos os dias de serviço. O
                pagamento só é liberado após a conclusão.
              </Text>
              <View style={styles.financialValueRow}>
                <Text style={styles.financialCurrency}>R$</Text>
                <Text style={styles.financialValue}>
                  {proposal.valor.toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.white,
            borderColor: theme.chat.borderSubtle,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={onReject}
          disabled={isAccepting}
        >
          <Text style={styles.rejectButtonText}>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.acceptButton,
            { backgroundColor: theme.chat.brandOrange },
            isAccepting && styles.buttonDisabled,
          ]}
          onPress={onAccept}
          disabled={isAccepting}
        >
          {isAccepting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.acceptButtonText}>Aceitar proposta</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(244,244,245,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
    marginLeft: 16,
    letterSpacing: -0.45,
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },

  scroll: {
    flex: 1,
  },

  // Top section (professional badge + heading)
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  professionalBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  professionalInfo: {
    gap: 0,
  },
  professionalName: {
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 14,
  },
  professionalSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  sectionHeading: {
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 30,
    marginTop: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 22.75,
    marginTop: 4,
  },

  // Calendar card
  calendarCardWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  calendarCard: {
    borderRadius: 24,
    padding: 24,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  chevron: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronText: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 20,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 6,
  },
  dayNumber: {
    width: 32,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
  },
  dayTextBold: {
    fontWeight: "700",
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },

  // Divider
  divider: {
    height: 8,
    borderTopWidth: 1,
  },

  // Time slots
  timeSlotSection: {
    paddingTop: 7,
    paddingBottom: 32,
  },
  timeSlotHeading: {
    fontSize: 17,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeline: {
    paddingLeft: 20,
  },
  timelineBar: {
    borderLeftWidth: 1,
    paddingLeft: 18,
  },
  timelineGroup: {
    flexDirection: "row",
    marginBottom: 28,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 4,
    marginLeft: -30,
    marginRight: 10,
  },
  timelineContent: {
    flex: 1,
    gap: 8,
  },
  timelineDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 2,
  },
  timelineDate: {
    fontSize: 15,
    fontWeight: "700",
  },
  exceptionBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  exceptionBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.55,
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  timeChipIcon: {
    fontSize: 14,
  },
  timeChipText: {
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "500",
  },

  // Financial card
  financialSection: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  financialCard: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 23,
    paddingBottom: 24,
    overflow: "hidden",
  },
  financialBlur: {
    position: "absolute",
    bottom: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(198,232,208,0.5)",
  },
  financialContent: {
    gap: 16,
  },
  financialTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f9945",
    lineHeight: 22.5,
  },
  financialDescription: {
    fontSize: 13,
    color: "rgba(31,153,69,0.8)",
    lineHeight: 21.13,
  },
  financialValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  financialCurrency: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f9945",
    lineHeight: 20,
    marginRight: 4,
    marginBottom: 2,
  },
  financialValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1f9945",
    lineHeight: 36,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderTopWidth: 1,
    boxShadow: "0 -4px 16px rgba(0,0,0,0.05)",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#fde8e8",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#d32f2f",
    fontWeight: "700",
    fontSize: 16,
  },
  acceptButton: {
    flex: 2,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
