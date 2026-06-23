import React, { useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { storage } from "@/utils/storage";

const SAVED_CARD_KEY = "nahora_saved_card";

interface SavedCardData {
  numeroCartao: string;
  nomeCartao: string;
  validade: string;
}

const cardSchema = z.object({
  numeroCartao: z
    .string()
    .min(16, "Número do cartão inválido")
    .max(19, "Número do cartão inválido"),
  nomeCartao: z.string().min(3, "Nome é obrigatório"),
  validade: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Use o formato MM/AA")
    .refine(
      (val) => {
        const [mm, aa] = val.split("/").map(Number);
        if (mm < 1 || mm > 12) return false;
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        if (aa < currentYear) return false;
        if (aa === currentYear && mm < currentMonth) return false;
        return true;
      },
      { message: "Cartão expirado ou data inválida" },
    ),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
  parcelas: z.coerce.number().int().min(1).max(12).default(1),
  salvarCartao: z.boolean().default(false),
});

export type CardFormValues = z.infer<typeof cardSchema>;

interface CardFormProps {
  valor: number;
  loading: boolean;
  onSubmit: (values: CardFormValues) => void;
}

export function CardForm({ valor, loading, onSubmit }: CardFormProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      numeroCartao: "",
      nomeCartao: "",
      validade: "",
      cvv: "",
      parcelas: 1,
      salvarCartao: false,
    },
  });

  // Load saved card data on mount
  useEffect(() => {
    storage.get(SAVED_CARD_KEY).then((json) => {
      if (!json) return;
      try {
        const saved: SavedCardData = JSON.parse(json);
        reset({
          numeroCartao: saved.numeroCartao ?? "",
          nomeCartao: saved.nomeCartao ?? "",
          validade: saved.validade ?? "",
          cvv: "",
          parcelas: 1,
          salvarCartao: true,
        });
      } catch {
        // Corrupted data — ignore and let user type fresh
      }
    });
  }, [reset]);

  const handleFormSubmit = (values: CardFormValues) => {
    // Save card data (without CVV) if user opted in
    if (values.salvarCartao) {
      const toSave: SavedCardData = {
        numeroCartao: values.numeroCartao,
        nomeCartao: values.nomeCartao,
        validade: values.validade,
      };
      storage.set(SAVED_CARD_KEY, JSON.stringify(toSave));
    } else {
      storage.delete(SAVED_CARD_KEY);
    }
    onSubmit(values);
  };

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

  return (
    <View>
      {/* Número do cartão */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Número do cartão</Text>
        <Controller
          control={control}
          name="numeroCartao"
          render={({ field: { onChange, value } }) => (
            <View style={[styles.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={[styles.cardIcon, { borderColor: colors.icon }]} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={colors.placeholder}
                keyboardType="number-pad"
                maxLength={19}
                value={value}
                onChangeText={(t) =>
                  onChange(
                    t
                      .replace(/\D/g, "")
                      .replace(/(\d{4})(?=\d)/g, "$1 ")
                      .trim(),
                  )
                }
              />
            </View>
          )}
        />
        {errors.numeroCartao && (
          <Text style={[styles.error, { color: colors.error }]}>{errors.numeroCartao.message}</Text>
        )}
      </View>

      {/* Nome no cartão */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Nome no cartão</Text>
        <Controller
          control={control}
          name="nomeCartao"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.inputSimple, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Como está impresso"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="characters"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.nomeCartao && (
          <Text style={[styles.error, { color: colors.error }]}>{errors.nomeCartao.message}</Text>
        )}
      </View>

      {/* Validade + CVV */}
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={[styles.label, { color: colors.text }]}>Validade</Text>
          <Controller
            control={control}
            name="validade"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.inputSimple, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="MM/AA"
                placeholderTextColor={colors.placeholder}
                keyboardType="number-pad"
                maxLength={5}
                value={value}
                onChangeText={(t) => {
                  const cleaned = t.replace(/\D/g, "");
                  if (cleaned.length >= 3) {
                    onChange(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
                  } else {
                    onChange(cleaned);
                  }
                }}
              />
            )}
          />
          {errors.validade && (
            <Text style={[styles.error, { color: colors.error }]}>{errors.validade.message}</Text>
          )}
        </View>
        <View style={styles.halfField}>
          <Text style={[styles.label, { color: colors.text }]}>CVV</Text>
          <Controller
            control={control}
            name="cvv"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.inputSimple, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="•••"
                placeholderTextColor={colors.placeholder}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={value}
                onChangeText={(t) => onChange(t.replace(/\D/g, ""))}
              />
            )}
          />
          {errors.cvv && (
            <Text style={[styles.error, { color: colors.error }]}>{errors.cvv.message}</Text>
          )}
        </View>
      </View>

      {/* Parcelas */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Parcelas</Text>
        <Controller
          control={control}
          name="parcelas"
          render={({ field: { onChange, value } }) => (
            <View style={styles.parcelasRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => onChange(n)}
                  style={[
                    styles.parcelaChip,
                    value === n
                      ? { backgroundColor: colors.surface, borderColor: colors.brand }
                      : { backgroundColor: colors.background, borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={
                      value === n
                        ? [styles.parcelaText, { color: colors.brand }]
                        : [styles.parcelaText, { color: colors.textSecondary }]
                    }
                  >
                    {n}x
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
        {errors.parcelas && (
          <Text style={[styles.error, { color: colors.error }]}>{errors.parcelas.message}</Text>
        )}
      </View>

      {/* Salvar cartão toggle */}
      <Controller
        control={control}
        name="salvarCartao"
        render={({ field: { onChange, value } }) => (
          <Pressable
            onPress={() => onChange(!value)}
            style={styles.checkboxRow}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: colors.border },
                value && { backgroundColor: colors.brand, borderColor: colors.brand },
              ]}
            >
              {value && <Text style={[styles.checkmark, { color: colors.onBrand }]}>✓</Text>}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.textSecondary }]}>
              Salvar cartão para futuras compras
            </Text>
          </Pressable>
        )}
      />

      {/* Botão de pagamento */}
      <Pressable
        onPress={handleSubmit(handleFormSubmit)}
        disabled={loading}
        style={[styles.payButton, { backgroundColor: colors.brand }, loading && styles.payButtonDisabled]}
      >
        <Text style={[styles.payButtonText, { color: colors.onBrand }]}>
          {loading ? "Processando..." : `Pagar ${formatted}`}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  cardIcon: {
    width: 20,
    height: 14,
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "monospace",
  },
  inputSimple: {
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
  },
  parcelasRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  parcelaChip: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  parcelaText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  payButton: {
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
