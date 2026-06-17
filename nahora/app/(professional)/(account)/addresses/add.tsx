import React, { useState, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import useSWR, { mutate } from "swr";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import { getApiErrorMessage } from "@/utils/apiError";
import { buscarCep } from "@/services/cep";
import { profileService } from "@/features/profile/service";
import type { PerfilProfissionalDTO } from "@/features/profile/types";

export default function AddScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const { data: profile } = useSWR<PerfilProfissionalDTO>(
    "perfil-profissional",
    () => profileService.buscarPerfilParaEdicao(),
  );

  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cepBuscando, setCepBuscando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (profile && !loaded) {
      setCep(profile.cep ?? "");
      setLogradouro(profile.logradouro ?? "");
      setNumero(profile.numero ?? "");
      setComplemento(profile.complemento ?? "");
      setBairro(profile.bairro ?? "");
      setCidade(profile.cidade ?? "");
      setEstado(profile.estado ?? "");
      setLoaded(true);
    }
  }, [profile, loaded]);

  const handleCepBlur = useCallback(async () => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setCepBuscando(true);
    try {
      const result = await buscarCep(digits);
      if (result) {
        setLogradouro(result.logradouro ?? "");
        setBairro(result.bairro ?? "");
        setCidade(result.cidade ?? "");
        setEstado(result.estado ?? "");
      }
    } catch {
      // Silently ignore CEP lookup errors
    } finally {
      setCepBuscando(false);
    }
  }, [cep]);

  const formatCep = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    return digits;
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await profileService.salvarPerfil({
        cep: cep.replace(/\D/g, "") || undefined,
        logradouro: logradouro || undefined,
        numero: numero || undefined,
        complemento: complemento || undefined,
        bairro: bairro || undefined,
        cidade: cidade || undefined,
        estado: estado || undefined,
      });

      // Invalidate caches so the address list + profile pick up the new address
      await mutate("perfil-profissional");

      Alert.alert("Sucesso", "Endereço salvo com sucesso.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Erro",
        getApiErrorMessage(err, "Não foi possível salvar o endereço."),
      );
    } finally {
      setSaving(false);
    }
  }, [cep, logradouro, numero, complemento, bairro, cidade, estado]);

  const isValid =
    cep.replace(/\D/g, "").length === 8 &&
    logradouro &&
    numero &&
    bairro &&
    cidade &&
    estado;

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
          Editar endereço
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {!profile && !loaded ? (
        <View style={[styles.centered, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* CEP */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>CEP</Text>
              <Pressable>
                <Text style={styles.cepLink}>Não sei meu CEP</Text>
              </Pressable>
            </View>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: "#f8f9fa",
                  borderColor: "#eaeaea",
                },
              ]}
            >
              <TextInput
                style={[styles.input, styles.monoInput]}
                value={formatCep(cep)}
                onChangeText={(t) => setCep(t.replace(/\D/g, ""))}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                placeholderTextColor="#8c8c8c"
                keyboardType="numeric"
                maxLength={9}
              />
              {cepBuscando && (
                <ActivityIndicator
                  size="small"
                  color={colors.brand}
                  style={styles.cepSpinner}
                />
              )}
            </View>
          </View>

          {/* Logradouro */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Rua / Avenida</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: "#f8f9fa",
                  borderColor: "#eaeaea",
                },
              ]}
            >
              <TextInput
                style={styles.input}
                value={logradouro}
                onChangeText={setLogradouro}
                placeholder="Rua"
                placeholderTextColor="#8c8c8c"
              />
            </View>
          </View>

          {/* Número + Complemento side by side */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Número</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: "#f8f9fa",
                    borderColor: "#eaeaea",
                  },
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={numero}
                  onChangeText={setNumero}
                  placeholder="Nº"
                  placeholderTextColor="#8c8c8c"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.fieldGroup, { flex: 2 }]}>
              <Text style={styles.fieldLabel}>Complemento</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: "#f8f9fa",
                    borderColor: "#eaeaea",
                  },
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={complemento}
                  onChangeText={setComplemento}
                  placeholder="Apto, bloco..."
                  placeholderTextColor="#8c8c8c"
                />
              </View>
            </View>
          </View>

          {/* Bairro */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bairro</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: "#f8f9fa",
                  borderColor: "#eaeaea",
                },
              ]}
            >
              <TextInput
                style={styles.input}
                value={bairro}
                onChangeText={setBairro}
                placeholder="Bairro"
                placeholderTextColor="#8c8c8c"
              />
            </View>
          </View>

          {/* Cidade + UF side by side */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 3 }]}>
              <Text style={styles.fieldLabel}>Cidade</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: "#f8f9fa",
                    borderColor: "#eaeaea",
                  },
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={cidade}
                  onChangeText={setCidade}
                  placeholder="Cidade"
                  placeholderTextColor="#8c8c8c"
                />
              </View>
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>UF</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: "#f8f9fa",
                    borderColor: "#eaeaea",
                  },
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={estado}
                  onChangeText={(t) => setEstado(t.toUpperCase().slice(0, 2))}
                  placeholder="UF"
                  placeholderTextColor="#8c8c8c"
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>
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
              shadowOpacity: isValid ? 0.2 : 0,
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

  // Side by side
  row: {
    flexDirection: "row",
    gap: 16,
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
    shadowColor: "#e67215",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
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
