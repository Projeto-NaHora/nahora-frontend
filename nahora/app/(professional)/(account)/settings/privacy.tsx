import React, { useState, useCallback } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import { getApiErrorMessage } from "@/utils/apiError";
import { profileService } from "@/features/profile/service";

function Row({
  icon,
  title,
  subtitle,
  colors,
}: {
  icon: string;
  title: string;
  subtitle: string;
  colors: any;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: "#f8f9fa" }]}>
        <IconSymbol name={icon as any} size={18} color="#8c8c8c" />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#c4c4c4" />
    </View>
  );
}

export default function PrivacyScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSenha, setDeleteSenha] = useState("");
  const [deleting, setDeleting] = useState(false);

  const openDeleteModal = () => {
    setDeleteSenha("");
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteSenha) {
      Alert.alert("Erro", "Informe sua senha.");
      return;
    }
    setDeleting(true);
    try {
      await profileService.excluirConta(deleteSenha);
      setShowDeleteModal(false);
      Alert.alert("Conta excluída", "Sua conta foi excluída permanentemente.");
      router.replace("/(auth)/(login)");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        getApiErrorMessage(err, "Não foi possível excluir a conta."),
      );
    }
    setDeleting(false);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
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
          Privacidade
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.description}>
          Gerencie as permissões concedidas ao aplicativo e{"\n"}
          controle como seus dados são utilizados.
        </Text>

        {/* Permissões do Dispositivo */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PERMISSÕES DO DISPOSITIVO</Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.background, borderColor: "#eaeaea" },
            ]}
          >
            <Row icon="location-on" title="Localização" subtitle="Necessário para encontrar serviços próximos" colors={colors} />
            <View style={styles.divider} />
            <Row icon="magnifyingglass" title="Câmera" subtitle="Para enviar fotos dos serviços" colors={colors} />
            <View style={styles.divider} />
            <Row icon="doc.text.fill" title="Galeria" subtitle="Anexar imagens aos pedidos" colors={colors} />
            <View style={styles.divider} />
            <Row icon="bell.fill" title="Notificações" subtitle="Alertas sobre propostas e serviços" colors={colors} />
          </View>
        </View>

        {/* Dados e Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DADOS E PRIVACIDADE</Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.background, borderColor: "#eaeaea" },
            ]}
          >
            <Row icon="doc.text.fill" title="Termos de Uso" subtitle="" colors={colors} />
            <View style={styles.divider} />
            <Row icon="lock" title="Política de Privacidade" subtitle="" colors={colors} />
            <View style={styles.divider} />
            <Row icon="doc.text.fill" title="Exportar meus dados" subtitle="" colors={colors} />
          </View>
        </View>

        {/* Avançado */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AVANÇADO</Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.background, borderColor: "#eaeaea" },
            ]}
          >
            <Pressable
              onPress={openDeleteModal}
              style={({ pressed }) => [
                styles.deleteRow,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#fff0f0" }]}>
                <IconSymbol name="close" size={18} color="#e02424" />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.deleteTitle}>Excluir minha conta</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  Apagar permanentemente todos os seus{"\n"}dados
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#c4c4c4" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Delete confirmation modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          {/* Backdrop */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowDeleteModal(false)}
          />

          {/* Modal card */}
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.background },
            ]}
          >
            {/* Red warning icon */}
            <View style={styles.modalIconWrapper}>
              <View style={styles.modalIconCircle}>
                <IconSymbol name="close" size={32} color="#fb2c36" />
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Excluir conta?
            </Text>

            {/* Description */}
            <Text style={styles.modalDescription}>
              Tem certeza que deseja excluir sua conta?{"\n"}
              Esta ação é irreversível e todos os seus{"\n"}
              dados serão apagados permanentemente.
            </Text>

            {/* Password field */}
            <View style={styles.modalFieldGroup}>
              <Text style={[styles.modalFieldLabel, { color: colors.textPrimary }]}>
                Digite sua senha para confirmar
              </Text>
              <View
                style={[
                  styles.modalInputWrapper,
                  {
                    backgroundColor: colors.background,
                    borderColor: "#e5e7eb",
                  },
                ]}
              >
                <IconSymbol name="lock" size={18} color="#6b7280" />
                <TextInput
                  style={[styles.modalInput, { color: colors.textPrimary }]}
                  value={deleteSenha}
                  onChangeText={setDeleteSenha}
                  placeholder="••••••••"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <Pressable
                onPress={handleDelete}
                disabled={deleting}
                style={({ pressed }) => [
                  styles.modalDeleteButton,
                  pressed && styles.modalDeleteButtonPressed,
                ]}
              >
                <Text style={styles.modalDeleteButtonText}>
                  {deleting ? "Excluindo..." : "Excluir conta"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowDeleteModal(false)}
                style={({ pressed }) => [
                  styles.modalCancelButton,
                  pressed && styles.modalCancelButtonPressed,
                ]}
              >
                <Text style={styles.modalCancelButtonText}>
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

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
  backButtonPressed: { opacity: 0.7 },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
  },
  headerSpacer: { width: 44 },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 28, paddingBottom: 60 },

  description: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22.75,
    color: "#8c8c8c",
    paddingHorizontal: 8,
  },

  section: { gap: 12 },
  sectionLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    color: "#8c8c8c",
    letterSpacing: 0.7,
    paddingLeft: 8,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    boxShadow: "0 2px 12px rgba(0,0,0,0.01)",
    paddingVertical: 4,
    paddingHorizontal: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
  },
  rowPressed: { opacity: 0.6 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: { flex: 1, gap: 2 },
  rowTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18.75,
  },
  rowSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 16.25,
  },

  divider: { height: 1, backgroundColor: "#eaeaea" },

  // Delete row
  deleteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
  },
  deleteTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18.75,
    color: "#e02424",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    width: "100%",
    borderRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: "center",
  },
  modalIconWrapper: {
    marginBottom: 20,
  },
  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 12,
  },
  modalDescription: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 23,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 28,
  },

  modalFieldGroup: {
    width: "100%",
    gap: 7,
    marginBottom: 28,
  },
  modalFieldLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 23,
  },
  modalInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    height: 58,
    paddingHorizontal: 16,
  },
  modalInput: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 27,
  },

  modalButtons: {
    width: "100%",
    gap: 14,
  },
  modalDeleteButton: {
    backgroundColor: "#fb2c36",
    height: 60,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  modalDeleteButtonPressed: { opacity: 0.85 },
  modalDeleteButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    color: "#ffffff",
  },
  modalCancelButton: {
    backgroundColor: "rgba(243,244,246,0.5)",
    height: 60,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButtonPressed: { opacity: 0.7 },
  modalCancelButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    color: "#1f2937",
  },
});
