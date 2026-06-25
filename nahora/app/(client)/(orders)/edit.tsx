import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { OrderEditFormContent } from "@/features/orders/components/OrderEditFormContent";
import { useEditOrderForm } from "@/features/orders/hooks/useEditOrderForm";

export default function EditOrderScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const pedidoId = Number(orderId);

  const {
    pedido,
    control,
    isSubmitting,
    isBuscandoCep,
    enderecoDiferente,
    errorMessage,
    errors,
    isLoadingOrder,
    orderError,
    midiasPicker,
    onSubmit,
    handleClear,
  } = useEditOrderForm(pedidoId);

  // Redirect if order is not in ABERTO status
  if (pedido && pedido.status !== "ABERTO") {
    return <Redirect href={`/(client)/(orders)/${orderId}`} />;
  }

  // Loading state: pedido is being fetched and form not yet pre-filled
  if (isLoadingOrder || !pedido) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Pressable
            style={[
              styles.headerButton,
              { backgroundColor: colors.surface + "99" },
            ]}
            onPress={() => router.back()}
          >
            <IconSymbol
              name="chevron.left"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Edição
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          {orderError ? (
            <>
              <Text style={[styles.loadingText, { color: colors.error }]}>
                Erro ao carregar pedido.
              </Text>
              <Pressable
                style={[
                  styles.retryButton,
                  { backgroundColor: colors.brand },
                ]}
                onPress={() => router.back()}
              >
                <Text
                  style={[
                    styles.retryButtonText,
                    { color: colors.onBrand },
                  ]}
                >
                  Voltar
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color={colors.brand} />
              <Text
                style={[
                  styles.loadingText,
                  { color: colors.textSecondary },
                ]}
              >
                Carregando pedido...
              </Text>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable
          style={[
            styles.headerButton,
            { backgroundColor: colors.surface + "99" },
          ]}
          onPress={() => router.back()}
        >
          <IconSymbol
            name="chevron.left"
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Edição
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Form content */}
      <OrderEditFormContent
        control={control}
        flags={{
          isSubmitting,
          isBuscandoCep,
          enderecoDiferente,
          isUploadingMedia: midiasPicker.isUploading,
        }}
        errorMessage={errorMessage}
        errors={errors}
        mediaUris={midiasPicker.mediaUris}
        uploadError={midiasPicker.uploadError}
        existingUrls={midiasPicker.existingUrls}
        onPickFromCamera={midiasPicker.pickFromCamera}
        onPickFromGallery={midiasPicker.pickFromGallery}
        onRemoveMedia={midiasPicker.removeMedia}
        onRemoveExistingUrl={midiasPicker.removeExistingUrl}
        onSubmit={onSubmit}
        onClear={handleClear}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
    lineHeight: 27,
    letterSpacing: -0.45,
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "500",
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "700",
  },
});
