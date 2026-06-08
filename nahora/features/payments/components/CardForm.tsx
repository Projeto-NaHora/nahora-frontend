import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const cardSchema = z.object({
  numeroCartao: z
    .string()
    .min(16, "Número do cartão inválido")
    .max(19, "Número do cartão inválido"),
  nomeCartao: z.string().min(3, "Nome é obrigatório"),
  validade: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Use o formato MM/AA"),
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
  const {
    control,
    handleSubmit,
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

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

  return (
    <View>
      {/* Número do cartão */}
      <View style={styles.field}>
        <Text style={styles.label}>Número do cartão</Text>
        <Controller
          control={control}
          name="numeroCartao"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputRow}>
              <View style={styles.cardIcon} />
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#8c8c8c"
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
          <Text style={styles.error}>{errors.numeroCartao.message}</Text>
        )}
      </View>

      {/* Nome no cartão */}
      <View style={styles.field}>
        <Text style={styles.label}>Nome no cartão</Text>
        <Controller
          control={control}
          name="nomeCartao"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputSimple}
              placeholder="Como está impresso"
              placeholderTextColor="#8c8c8c"
              autoCapitalize="characters"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.nomeCartao && (
          <Text style={styles.error}>{errors.nomeCartao.message}</Text>
        )}
      </View>

      {/* Validade + CVV */}
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>Validade</Text>
          <Controller
            control={control}
            name="validade"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.inputSimple}
                placeholder="MM/AA"
                placeholderTextColor="#8c8c8c"
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
            <Text style={styles.error}>{errors.validade.message}</Text>
          )}
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>CVV</Text>
          <Controller
            control={control}
            name="cvv"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.inputSimple}
                placeholder="•••"
                placeholderTextColor="#8c8c8c"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={value}
                onChangeText={(t) => onChange(t.replace(/\D/g, ""))}
              />
            )}
          />
          {errors.cvv && (
            <Text style={styles.error}>{errors.cvv.message}</Text>
          )}
        </View>
      </View>

      {/* Parcelas */}
      <View style={styles.field}>
        <Text style={styles.label}>Parcelas</Text>
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
                      ? styles.parcelaChipSelected
                      : styles.parcelaChipDefault,
                  ]}
                >
                  <Text
                    style={
                      value === n
                        ? styles.parcelaTextSelected
                        : styles.parcelaTextDefault
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
          <Text style={styles.error}>{errors.parcelas.message}</Text>
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
                value && styles.checkboxChecked,
              ]}
            >
              {value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Salvar cartão para futuras compras
            </Text>
          </Pressable>
        )}
      />

      {/* Botão de pagamento */}
      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        style={[styles.payButton, loading && styles.payButtonDisabled]}
      >
        <Text style={styles.payButtonText}>
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
    color: "#111111",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eaeaea",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  cardIcon: {
    width: 20,
    height: 14,
    borderWidth: 1,
    borderColor: "#8c8c8c",
    borderRadius: 2,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111111",
    fontFamily: "monospace",
  },
  inputSimple: {
    borderWidth: 1,
    borderColor: "#eaeaea",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111111",
    backgroundColor: "#ffffff",
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
  parcelaChipSelected: {
    backgroundColor: "#fff2e5",
    borderColor: "#f27b24",
  },
  parcelaChipDefault: {
    backgroundColor: "#ffffff",
    borderColor: "#eaeaea",
  },
  parcelaTextSelected: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f27b24",
  },
  parcelaTextDefault: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8c8c8c",
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
    borderColor: "#eaeaea",
  },
  checkboxChecked: {
    backgroundColor: "#f27b24",
    borderColor: "#f27b24",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#8c8c8c",
  },
  payButton: {
    backgroundColor: "#f27b24",
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
    color: "#ffffff",
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
});
