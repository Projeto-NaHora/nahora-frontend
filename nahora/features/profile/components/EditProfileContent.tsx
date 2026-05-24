import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { editProfileSchema, type EditProfileFormValues } from "../types";

type EditProfileContentProps = {
  initialData?: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    photoUrl?: string;
  };
  isLoading?: boolean;
  onSubmit: (data: EditProfileFormValues) => Promise<void>;
  onChangePhoto?: () => void;
};

export function EditProfileContent({
  initialData,
  isLoading = false,
  onSubmit,
  onChangePhoto,
}: EditProfileContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      city: initialData?.city || "",
    },
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  });

  const renderInput = (
    label: string,
    name: "fullName" | "email" | "phone" | "city",
    placeholder: string,
    keyboardType?: "email-address" | "phone-pad" | "default",
  ) => {
    const error = errors[name];

    return (
      <View style={styles.fieldContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {label}
          </Text>
        </View>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: error ? colors.error : "#EAEAEA",
                  color: colors.textPrimary,
                },
              ]}
              placeholder={placeholder}
              placeholderTextColor={colors.placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType={keyboardType || "default"}
              editable={!isLoading && !isSubmitting}
            />
          )}
        />
        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error.message}
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.surface }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatarContainer, { backgroundColor: "#FFF2E5" }]}>
          <Text style={styles.avatarText}>RB</Text>
        </View>
        <Pressable
          style={styles.changePhotoButton}
          onPress={onChangePhoto}
          disabled={isLoading || isSubmitting}
        >
          <Text style={[styles.changePhotoText, { color: "#E67215" }]}>
            Alterar foto
          </Text>
        </Pressable>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        {renderInput("Nome completo", "fullName", "Digite seu nome completo")}
        {renderInput("E-mail", "email", "Digite seu e-mail", "email-address")}
        {renderInput("Celular", "phone", "(81) 99999-0000", "phone-pad")}
        {renderInput("Cidade", "city", "Sua cidade")}
      </View>

      {/* Submit Button */}
      <Pressable
        style={[
          styles.submitButton,
          { backgroundColor: "#E67215" },
          (isLoading || isSubmitting) && styles.submitButtonDisabled,
        ]}
        onPress={handleFormSubmit}
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Salvar alterações</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  contentContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E67215",
  },
  changePhotoButton: {
    paddingVertical: 4,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  formSection: {
    marginBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    lineHeight: 22.5,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E67215",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
