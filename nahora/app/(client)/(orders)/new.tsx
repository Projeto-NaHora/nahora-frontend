import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { OrderFormContent } from "@/features/orders/components/OrderFormContent";
import { useCreateOrderForm } from "@/features/orders/hooks/useCreateOrderForm";

export default function NewOrderScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const {
    control,
    isSubmitting,
    isBuscandoCep,
    enderecoDiferente,
    errorMessage,
    errors,
    midiasPicker,
    onSubmit,
    handleClear,
  } = useCreateOrderForm();

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
          Pedido
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Form content */}
      <OrderFormContent
        control={control}
        flags={{
          isSubmitting,
          isBuscandoCep,
          enderecoDiferente,
          isUploadingMedia: midiasPicker.isUploading,
          isEditing: false,
        }}
        errorMessage={errorMessage}
        errors={errors}
        mediaUris={midiasPicker.mediaUris}
        uploadError={midiasPicker.uploadError}
        onPickFromCamera={midiasPicker.pickFromCamera}
        onPickFromGallery={midiasPicker.pickFromGallery}
        onRemoveMedia={midiasPicker.removeMedia}
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
});
