import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import { getApiErrorMessage } from "@/utils/apiError";
import { profileService } from "@/features/profile/service";
import type {
  EnderecoResponse,
  EnderecoRequest,
  TipoEndereco,
} from "@/features/profile/types";
import { useAddressForm, formatCep } from "@/hooks/useAddressForm";
import useSWR from "swr";
import axios from "axios";

const TIPO_OPTIONS: { value: TipoEndereco; label: string }[] = [
  { value: "CASA", label: "Casa" },
  { value: "TRABALHO", label: "Trabalho" },
  { value: "OUTRO", label: "Outro" },
];

// ── Form fields sub-component (extracted for readability) ───────────────────

type AddressFormFieldsProps = {
  tipo: TipoEndereco;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  padrao: boolean;
  cepBuscando: boolean;
  cepError: string | null;
  colors: typeof Colors.light;
  dispatch: React.Dispatch<any>;
  handleCepBlur: () => void;
};

function AddressFormFields({
  tipo,
  cep,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  uf,
  padrao,
  cepBuscando,
  cepError,
  colors,
  dispatch,
  handleCepBlur,
}: AddressFormFieldsProps) {
  return (
    <>
      {/* CEP */}
      <View style={styles.fieldGroup}>
        <View style={styles.fieldLabelRow}>
          <Text style={styles.fieldLabel}>CEP</Text>
          <Pressable onPress={() => Linking.openURL('https://buscacepinter.correios.com.br/')}>
            <Text style={styles.cepLink}>Não sei meu CEP</Text>
          </Pressable>
        </View>
        <View
          style={[
            styles.inputWrapper,
            { backgroundColor: "#f8f9fa", borderColor: "#eaeaea" },
          ]}
        >
          <TextInput
            style={[styles.input, styles.monoInput]}
            value={formatCep(cep)}
            onChangeText={(t) =>
              dispatch({ type: "SET_FIELD", field: "cep", value: t.replace(/\D/g, "") })
            }
            onBlur={handleCepBlur}
            placeholder="00000-000"
            placeholderTextColor="#8c8c8c"
            keyboardType="numeric"
            maxLength={9}
          />
          {cepBuscando && (
            <ActivityIndicator size="small" color={colors.brand} style={styles.cepSpinner} />
          )}
        </View>
        {cepError && (
          <Text style={styles.cepErrorText}>{cepError}</Text>
        )}
      </View>

      {/* Logradouro */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Rua / Avenida</Text>
        <View style={[styles.inputWrapper, { backgroundColor: "#f8f9fa", borderColor: "#eaeaea" }]}>
          <TextInput
            style={styles.input}
            value={logradouro}
            onChangeText={(t) => dispatch({ type: "SET_FIELD", field: "logradouro", value: t })}
            placeholder="Rua"
            placeholderTextColor="#8c8c8c"
          />
        </View>
      </View>

      {/* Número + Complemento */}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.fieldLabel}>Número</Text>
          <View style={[styles.inputWrapper, { backgroundColor: "#f8f9fa", borderColor: "#eaeaea" }]}>
            <TextInput
              style={styles.input}
              value={numero}
              onChangeText={(t) => dispatch({ type: "SET_FIELD", field: "numero", value: t })}
              placeholder="Nº"
              placeholderTextColor="#8c8c8c"
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={[styles.fieldGroup, { flex: 2 }]}>
          <Text style={styles.fieldLabel}>Complemento</Text>
          <View style={[styles.inputWrapper, { backgroundColor: "#f8f9fa", borderColor: "#eaeaea" }]}>
            <TextInput
              style={styles.input}
              value={complemento}
              onChangeText={(t) => dispatch({ type: "SET_FIELD", field: "complemento", value: t })}
              placeholder="Apto, bloco..."
              placeholderTextColor="#8c8c8c"
            />
          </View>
        </View>
      </View>

      {/* Bairro */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Bairro</Text>
        <View style={[styles.inputWrapper, { backgroundColor: "#f8f9fa", borderColor: "#eaeaea" }]}>
          <TextInput
            style={styles.input}
            value={bairro}
            onChangeText={(t) => dispatch({ type: "SET_FIELD", field: "bairro", value: t })}
            placeholder="Bairro"
            placeholderTextColor="#8c8c8c"
          />
        </View>
      </View>

      {/* Cidade + UF */}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, { flex: 3 }]}>
          <Text style={styles.fieldLabel}>Cidade</Text>
          <View style={[styles.inputWrapper, { backgroundColor: "#f8f9fa", borderColor: "#eaeaea" }]}>
            <TextInput
              style={styles.input}
              value={cidade}
              onChangeText={(t) => dispatch({ type: "SET_FIELD", field: "cidade", value: t })}
              placeholder="Cidade"
              placeholderTextColor="#8c8c8c"
            />
          </View>
        </View>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.fieldLabel}>UF</Text>
          <View style={[styles.inputWrapper, { backgroundColor: "#f8f9fa", borderColor: "#eaeaea" }]}>
            <TextInput
              style={styles.input}
              value={uf}
              onChangeText={(t) =>
                dispatch({ type: "SET_FIELD", field: "uf", value: t.toUpperCase().slice(0, 2) })
              }
              placeholder="UF"
              placeholderTextColor="#8c8c8c"
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        </View>
      </View>

      {/* Tipo de endereço */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Tipo de endereço</Text>
        <View style={styles.tipoRow}>
          {TIPO_OPTIONS.map((opt) => {
            const selected = tipo === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => dispatch({ type: "SET_FIELD", field: "tipo", value: opt.value })}
                style={({ pressed }) => [
                  styles.tipoPill,
                  {
                    backgroundColor: selected ? "#fff2e5" : colors.background,
                    borderColor: selected ? "#fad3bc" : "#eaeaea",
                  },
                  pressed && styles.tipoPillPressed,
                ]}
              >
                <Text
                  style={[
                    styles.tipoPillText,
                    { color: selected ? "#e67215" : "#8c8c8c" },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Tornar padrão */}
      <View
        style={[
          styles.padraoCard,
          { backgroundColor: colors.background, borderColor: "#eaeaea" },
        ]}
      >
        <View style={styles.padraoContent}>
          <Text style={[styles.padraoTitle, { color: colors.textPrimary }]}>
            Tornar endereço padrão
          </Text>
          <Text style={[styles.padraoDescription, { color: colors.textSecondary }]}>
            Usar este endereço automaticamente nas{"\n"}
            próximas buscas
          </Text>
        </View>
        <Switch
          value={padrao}
          onValueChange={(v) => dispatch({ type: "SET_FIELD", field: "padrao", value: v })}
          trackColor={{ false: "#d1d5db", true: "#f27b24" }}
          thumbColor="#ffffff"
        />
      </View>
    </>
  );
}

export default function AddScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const editId = id ? Number(id) : undefined;

  // Fetch existing address if editing
  const { data: addresses } = useSWR<EnderecoResponse[]>(
    isEditing ? "enderecos" : null,
    () => profileService.listarEnderecos(),
  );

  const existingAddress = isEditing
    ? addresses?.find((a) => a.id === editId)
    : undefined;

  const {
    tipo,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    uf,
    padrao,
    cepBuscando,
    loaded,
    dispatch,
    handleCepBlur,
    isValid,
    cepError,
  } = useAddressForm(existingAddress);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const payload: EnderecoRequest = {
      tipo,
      cep: cep.replace(/\D/g, ""),
      logradouro,
      numero,
      complemento: complemento || null,
      bairro,
      cidade,
      uf,
    };

    setSaving(true);
    try {
      if (!isEditing) {
        // Check for duplicates before creating
        const existingAddresses = await profileService.listarEnderecos();
        const duplicate = existingAddresses.find(
          (a) => a.cep === payload.cep && a.numero === payload.numero && a.tipo === payload.tipo,
        );
        if (duplicate) {
          Alert.alert("Endereço já cadastrado", "Já existe um endereço com esses dados.");
          setSaving(false);
          return;
        }
      }

      if (isEditing && editId) {
        await profileService.editarEndereco(editId, payload);
        if (padrao) await profileService.definirEnderecoPadrao(editId);
      } else {
        const created = await profileService.criarEndereco(payload);
        if (padrao) await profileService.definirEnderecoPadrao(created.id);
      }
      Alert.alert("Sucesso", "Endereço salvo com sucesso.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        Alert.alert("Endereço já cadastrado", "Já existe um endereço com esses dados.");
      } else {
        Alert.alert(
          "Erro",
          getApiErrorMessage(err, "Não foi possível salvar o endereço."),
        );
      }
    }
    setSaving(false);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: "rgba(244,244,245,0.6)" },
            pressed && styles.backButtonPressed,
          ]}
        >
          <IconSymbol name="chevron.left" size={20} color="#1c1c1e" />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {isEditing ? "Editar endereço" : "Adicionar novo endereço"}
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {isEditing && !existingAddress && !loaded ? (
        <View style={[styles.centered, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AddressFormFields
            tipo={tipo}
            cep={cep}
            logradouro={logradouro}
            numero={numero}
            complemento={complemento}
            bairro={bairro}
            cidade={cidade}
            uf={uf}
            padrao={padrao}
            cepBuscando={cepBuscando}
            cepError={cepError}
            colors={colors}
            dispatch={dispatch}
            handleCepBlur={handleCepBlur}
          />
        </ScrollView>
      )}

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background }]}>
        <Pressable
          onPress={handleSave}
          disabled={!isValid || saving}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: isValid ? "#e67215" : "#d1d5db",
              boxShadow: isValid ? "0 4px 12px rgba(230,114,21,0.2)" : undefined,
            },
            pressed && isValid && styles.saveButtonPressed,
          ]}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text
              style={[
                styles.saveButtonText,
                { color: isValid ? "#ffffff" : "#9ca3af" },
              ]}
            >
              Salvar
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: "rgba(248,249,250,0.4)",
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 120,
  },

  // Fields
  fieldGroup: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 2,
  },
  fieldLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
    color: "#111111",
    paddingLeft: 2,
  },
  cepLink: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    color: "#f27b24",
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 24,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: "#111111",
  },
  monoInput: {
    fontFamily: Fonts?.mono,
  },
  cepSpinner: {
    marginLeft: 8,
  },
  cepErrorText: {
    color: "#DC2626",
    fontSize: 12,
    fontFamily: Fonts?.sans,
    paddingLeft: 2,
    marginTop: 2,
  },

  // Side by side
  row: {
    flexDirection: "row",
    gap: 16,
  },

  // Tipo
  tipoRow: {
    flexDirection: "row",
    gap: 12,
  },
  tipoPill: {
    flex: 1,
    borderRadius: 9999,
    height: 44,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tipoPillPressed: {
    opacity: 0.7,
  },
  tipoPillText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
  },

  // Padrão toggle
  padraoCard: {
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
  },
  padraoContent: {
    flex: 1,
    gap: 4,
  },
  padraoTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22.5,
  },
  padraoDescription: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 19.5,
  },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
});
