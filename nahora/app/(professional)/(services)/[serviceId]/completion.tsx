import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { mutate } from "swr";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import { orderService } from "@/features/orders/service";
import { ordersKeys } from "@/features/orders/types";

export default function ProfessionalCompletionScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const pedidoId = Number(serviceId);
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const [selectedMedia, setSelectedMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasMedia = selectedMedia.length > 0;

  const handlePickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão negada", "Precisamos de acesso à galeria para anexar fotos ou vídeos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedMedia((prev) => [...prev, ...result.assets]);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão negada", "Precisamos de acesso à câmera para capturar fotos ou vídeos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedMedia((prev) => [...prev, ...result.assets]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinish = async () => {
    if (!hasMedia || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Upload all media files first
      const urls = await Promise.all(
        selectedMedia.map(async (asset) => {
          return await orderService.uploadMidia(asset.uri, "FINALIZAR");
        }),
      );

      // Conclude the service with the uploaded URLs
      await orderService.concluirServico(pedidoId);

      // Invalidate caches
      mutate(ordersKeys.meusServicos);
      mutate(ordersKeys.detail(pedidoId));

      // Navigate to success
      router.replace(`/(professional)/(services)/${pedidoId}/success`);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível finalizar o serviço. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  const isVideo = (asset: ImagePicker.ImagePickerAsset) => {
    return asset.type === "video" || asset.mimeType?.startsWith("video/");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: colors.surfaceGray },
            pressed && styles.backBtnPressed,
          ]}
        >
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Finalizar Serviço
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Anexe pelo menos uma foto ou vídeo como evidência da execução do
          serviço antes de finalizar.
        </Text>

        {/* Media picker buttons */}
        <View style={styles.pickerRow}>
          <Pressable
            onPress={handlePickMedia}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.pickerBtn,
              { backgroundColor: colors.surfaceGray, borderColor: colors.border },
              pressed && styles.pickerBtnPressed,
            ]}
          >
            <Feather name="image" size={22} color={colors.text} />
            <Text style={[styles.pickerBtnText, { color: colors.text }]}>Galeria</Text>
          </Pressable>

          <Pressable
            onPress={handleTakePhoto}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.pickerBtn,
              { backgroundColor: colors.surfaceGray, borderColor: colors.border },
              pressed && styles.pickerBtnPressed,
            ]}
          >
            <Feather name="camera" size={22} color={colors.text} />
            <Text style={[styles.pickerBtnText, { color: colors.text }]}>Câmera</Text>
          </Pressable>
        </View>

        {/* Media preview grid */}
        {selectedMedia.length > 0 && (
          <View style={styles.previewSection}>
            <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
              {selectedMedia.length} {selectedMedia.length === 1 ? "arquivo selecionado" : "arquivos selecionados"}
            </Text>
            <View style={styles.previewGrid}>
              {selectedMedia.map((asset, index) => (
                <View key={asset.uri + index} style={styles.previewItem}>
                  {isVideo(asset) ? (
                    <View style={[styles.previewPlaceholder, { backgroundColor: colors.surfaceGray }]}>
                      <Feather name="video" size={32} color={colors.textSecondary} />
                    </View>
                  ) : (
                    <Image source={{ uri: asset.uri }} style={styles.previewImage} />
                  )}
                  <Pressable
                    onPress={() => handleRemoveMedia(index)}
                    disabled={isSubmitting}
                    style={styles.removeBtn}
                  >
                    <Feather name="x" size={16} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty state */}
        {!hasMedia && (
          <View style={styles.emptyState}>
            <Feather name="camera-off" size={48} color={colors.icon} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma mídia selecionada
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
              Adicione pelo menos uma foto ou vídeo
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleFinish}
          disabled={!hasMedia || isSubmitting}
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: hasMedia ? colors.brand : colors.surfaceGray },
            pressed && hasMedia && styles.submitBtnPressed,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={[
                styles.submitBtnText,
                { color: hasMedia ? "#FFFFFF" : colors.icon },
              ]}
            >
              Finalizar Serviço
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnPressed: { opacity: 0.7 },
  headerTitle: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
  },
  headerSpacer: { width: 44 },

  scroll: { flex: 1 },
  scrollContent: { padding: 24, gap: 24, paddingBottom: 40 },

  description: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 16,
  },

  // Picker buttons
  pickerRow: {
    flexDirection: "row",
    gap: 12,
  },
  pickerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  pickerBtnPressed: { opacity: 0.7 },
  pickerBtnText: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "600",
  },

  // Preview
  previewSection: { gap: 12 },
  previewLabel: {
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  previewItem: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: "400",
  },

  // Footer
  footer: {
    padding: 24,
    paddingBottom: 48,
    borderTopWidth: 1,
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitBtnPressed: { opacity: 0.85 },
  submitBtnText: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "700",
  },
});
