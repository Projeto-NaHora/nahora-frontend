import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

import { Borders, Colors, Fonts, Radii } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  CATEGORIA_LABEL,
  TURNO_OPTIONS,
  URGENCIA_OPTIONS,
  ESTADO_OPTIONS,
  type CriarPedidoFormValues,
} from "../types";

// ── Extracted sub-components ──

function OrderEditFormAddressSection({
  control,
  errors,
  colors,
  enderecoDiferente,
  isBuscandoCep,
}: {
  control: Control<CriarPedidoFormValues>;
  errors: FieldErrors<CriarPedidoFormValues>;
  colors: typeof Colors.light;
  enderecoDiferente: boolean;
  isBuscandoCep: boolean;
}) {
  return (
    <View
      style={[
        styles.addressToggleCard,
        { backgroundColor: colors.surface + "50", borderColor: colors.border },
      ]}
    >
      <Controller
        control={control}
        name="enderecoDiferente"
        render={({ field: { onChange, value } }) => (
          <Pressable
            style={styles.checkboxRow}
            onPress={() => onChange(!value)}
          >
            <View
              style={[
                styles.checkbox,
                value
                  ? {
                      backgroundColor: colors.brand,
                      borderColor: colors.brand,
                    }
                  : {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
              ]}
            >
              {value && (
                <IconSymbol name="chevron.left" size={14} color="#fff" />
              )}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.textPrimary }]}>
              Usar endereço diferente do meu{"\n"}endereço padrão
            </Text>
          </Pressable>
        )}
      />
      {enderecoDiferente && (
        <View style={styles.enderecoSection}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              CEP
            </Text>
            <View style={styles.cepRow}>
              <Controller
                control={control}
                name="cep"
                render={({ field: { onChange, onBlur, value } }) => {
                  const digits = (value || "").replace(/\D/g, "");
                  const display =
                    digits.length > 5
                      ? `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
                      : digits;
                  return (
                    <TextInput
                      style={[
                        styles.textInput,
                        styles.cepInput,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        },
                      ]}
                      placeholder="00000-000"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="numeric"
                      maxLength={9}
                      editable={!isBuscandoCep}
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(text.replace(/\D/g, ""))}
                      value={display}
                    />
                  );
                }}
              />
              {isBuscandoCep && (
                <ActivityIndicator size="small" color={colors.brand} />
              )}
            </View>
            {errors.cep?.message && (
              <Text style={[styles.fieldError, { color: colors.error }]}>
                {errors.cep.message}
              </Text>
            )}
          </View>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Logradouro
            </Text>
            <Controller
              control={control}
              name="logradouro"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="Rua..."
                  placeholderTextColor={colors.placeholder}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.logradouro?.message && (
              <Text style={[styles.fieldError, { color: colors.error }]}>
                {errors.logradouro.message}
              </Text>
            )}
          </View>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Número
            </Text>
            <Controller
              control={control}
              name="numero"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="123"
                  placeholderTextColor={colors.placeholder}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.numero?.message && (
              <Text style={[styles.fieldError, { color: colors.error }]}>
                {errors.numero.message}
              </Text>
            )}
          </View>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Complemento
            </Text>
            <Controller
              control={control}
              name="complemento"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="Apto, bloco..."
                  placeholderTextColor={colors.placeholder}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Bairro
            </Text>
            <Controller
              control={control}
              name="bairro"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="Centro"
                  placeholderTextColor={colors.placeholder}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.bairro?.message && (
              <Text style={[styles.fieldError, { color: colors.error }]}>
                {errors.bairro.message}
              </Text>
            )}
          </View>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Cidade
            </Text>
            <Controller
              control={control}
              name="cidade"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="São Paulo"
                  placeholderTextColor={colors.placeholder}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.cidade?.message && (
              <Text style={[styles.fieldError, { color: colors.error }]}>
                {errors.cidade.message}
              </Text>
            )}
          </View>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Estado
            </Text>
            <Controller
              control={control}
              name="estado"
              render={({ field: { onChange, value } }) => (
                <EstadoPicker value={value} onChange={onChange} />
              )}
            />
            {errors.estado?.message && (
              <Text style={[styles.fieldError, { color: colors.error }]}>
                {errors.estado.message}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function OrderEditFormMediaSection({
  colors,
  mediaUris,
  existingUrls,
  isUploadingMedia,
  uploadError,
  isSubmitting,
  onPickFromCamera,
  onPickFromGallery,
  onRemoveMedia,
  onRemoveExistingUrl,
}: {
  colors: typeof Colors.light;
  mediaUris: string[];
  existingUrls?: string[];
  isUploadingMedia: boolean;
  uploadError?: string | null;
  isSubmitting: boolean;
  onPickFromCamera: () => void;
  onPickFromGallery: () => void;
  onRemoveMedia: (index: number) => void;
  onRemoveExistingUrl?: (index: number) => void;
}) {
  const urls = existingUrls ?? [];
  const hasAnyMedia = urls.length > 0 || mediaUris.length > 0;

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
        Imagens do pedido
      </Text>
      <View style={styles.mediaRow}>
        <Pressable
          style={[
            styles.mediaButton,
            { backgroundColor: colors.surfaceAccent },
          ]}
          onPress={onPickFromCamera}
          disabled={isSubmitting || isUploadingMedia}
        >
          <IconSymbol name="camera.fill" size={22} color={colors.brand} />
          <Text style={[styles.mediaButtonText, { color: colors.brand }]}>
            Câmera
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.mediaButton,
            { backgroundColor: colors.surfaceAccent },
          ]}
          onPress={onPickFromGallery}
          disabled={isSubmitting || isUploadingMedia}
        >
          <IconSymbol
            name="photo.on.rectangle"
            size={22}
            color={colors.brand}
          />
          <Text style={[styles.mediaButtonText, { color: colors.brand }]}>
            Galeria
          </Text>
        </Pressable>
      </View>
      {hasAnyMedia && (
        <View style={styles.mediaPreviewRow}>
          {/* URLs remotas já salvas */}
          {urls.map((url, index) => (
            <View key={`existing-${index}`} style={styles.mediaPreviewItem}>
              <Image source={{ uri: url }} style={styles.mediaPreviewImage} />
              <Pressable
                style={[
                  styles.mediaRemoveBadge,
                  { backgroundColor: colors.brand },
                ]}
                onPress={() => onRemoveExistingUrl?.(index)}
                disabled={isSubmitting || isUploadingMedia}
              >
                <IconSymbol name="xmark" size={12} color="#fff" />
              </Pressable>
            </View>
          ))}
          {/* URIs locais novas */}
          {mediaUris.map((uri, index) => (
            <View
              key={`new-${index}`}
              style={[styles.mediaPreviewItem, styles.mediaPreviewItemNew]}
            >
              <Image source={{ uri }} style={styles.mediaPreviewImage} />
              <Pressable
                style={[
                  styles.mediaRemoveBadge,
                  { backgroundColor: colors.error },
                ]}
                onPress={() => onRemoveMedia(index)}
                disabled={isSubmitting || isUploadingMedia}
              >
                <IconSymbol name="xmark" size={12} color="#fff" />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      {isUploadingMedia && (
        <Text style={[styles.mediaStatusText, { color: colors.brand }]}>
          Enviando imagens...
        </Text>
      )}
      {uploadError && (
        <Text style={[styles.mediaStatusText, { color: colors.error }]}>
          {uploadError}
        </Text>
      )}
    </View>
  );
}

function OrderEditFormActionsRow({
  colors,
  isSubmitting,
  onClear,
  onSubmit,
}: {
  colors: typeof Colors.light;
  isSubmitting: boolean;
  onClear: () => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.actionsRow}>
      <Pressable
        style={[
          styles.actionButton,
          styles.actionOutline,
          { borderColor: colors.border },
        ]}
        onPress={onClear}
      >
        <Text
          style={[styles.actionButtonText, { color: colors.textSecondary }]}
        >
          Limpar
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.actionButton,
          { backgroundColor: colors.brand },
          isSubmitting && styles.buttonDisabled,
        ]}
        onPress={onSubmit}
        disabled={isSubmitting}
      >
        <Text style={[styles.actionButtonText, { color: colors.onBrand }]}>
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </Pressable>
    </View>
  );
}

/** Dropdown/picker for Tipo (categoria) */
function CategoriaPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const categorias = Object.entries(CATEGORIA_LABEL);

  return (
    <>
      <Pressable
        style={[
          styles.pickerField,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[
            styles.pickerText,
            value
              ? { color: colors.textPrimary }
              : { color: colors.placeholder },
          ]}
        >
          {value ? (CATEGORIA_LABEL[value] ?? value) : "Ex: encanador"}
        </Text>
        <IconSymbol
          name="chevron.down"
          size={18}
          color={colors.textSecondary}
        />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Tipo de Serviço
            </Text>
            <FlatList
              data={categorias}
              keyExtractor={([key]) => key}
              renderItem={({ item: [key, label] }) => (
                <Pressable
                  style={[
                    styles.modalItem,
                    key === value && {
                      backgroundColor: colors.brand + "15",
                    },
                  ]}
                  onPress={() => {
                    onChange(key);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color:
                          key === value
                            ? colors.brand
                            : colors.textPrimary,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

/** Dropdown/picker for Estado (UF) */
function EstadoPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <>
      <Pressable
        style={[
          styles.pickerField,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[
            styles.pickerText,
            value
              ? { color: colors.textPrimary }
              : { color: colors.placeholder },
          ]}
        >
          {value || "SP"}
        </Text>
        <IconSymbol
          name="chevron.down"
          size={18}
          color={colors.textSecondary}
        />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Estado
            </Text>
            <FlatList
              data={ESTADO_OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.modalItem,
                    item.value === value && {
                      backgroundColor: colors.brand + "15",
                    },
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color:
                          item.value === value
                            ? colors.brand
                            : colors.textPrimary,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

// ── Props ──

type OrderEditFormFlags = {
  /** Se true, o formulário está sendo enviado */
  isSubmitting: boolean;
  /** Se true, está consultando o CEP na API ViaCEP */
  isBuscandoCep: boolean;
  /** Se true, usar endereço diferente */
  enderecoDiferente: boolean;
  /** Se true, está fazendo upload para o servidor */
  isUploadingMedia: boolean;
};

type OrderEditFormContentProps = {
  control: Control<CriarPedidoFormValues>;
  flags: OrderEditFormFlags;
  errorMessage: string | null;
  /** Erros de validação do react-hook-form (Zod + backend) */
  errors: FieldErrors<CriarPedidoFormValues>;
  /** URIs locais das mídias selecionadas (para preview) */
  mediaUris: string[];
  /** Mensagem de erro de permissão ou upload */
  uploadError: string | null;
  /** Abre a câmera */
  onPickFromCamera: () => void;
  /** Abre a galeria */
  onPickFromGallery: () => void;
  /** Remove mídia NOVA pelo índice */
  onRemoveMedia: (index: number) => void;
  /** URLs remotas já salvas no pedido (modo edição) */
  existingUrls?: string[];
  /** Remove URL existente pelo índice */
  onRemoveExistingUrl?: (index: number) => void;
  onSubmit: () => void;
  onClear: () => void;
};

// ── Main Component ──

export function OrderEditFormContent({
  control,
  flags,
  errorMessage,
  errors,
  mediaUris,
  uploadError,
  onPickFromCamera,
  onPickFromGallery,
  onRemoveMedia,
  existingUrls,
  onRemoveExistingUrl,
  onSubmit,
  onClear,
}: OrderEditFormContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const {
    isSubmitting,
    isBuscandoCep,
    enderecoDiferente,
    isUploadingMedia,
  } = flags;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>
          Edição de pedido
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Preencha as informações do seu pedido
        </Text>
      </View>

      {/* Tipo / Categoria */}
      <View style={styles.fieldGroup}>
        <View style={styles.fieldLabelRow}>
          <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
            Tipo
          </Text>
          <IconSymbol
            name="square.and.pencil"
            size={16}
            color={colors.textSecondary}
          />
        </View>
        <Controller
          control={control}
          name="categoria"
          render={({ field: { onChange, value } }) => (
            <CategoriaPicker value={value} onChange={onChange} />
          )}
        />
        {errors.categoria?.message && (
          <Text style={[styles.fieldError, { color: colors.error }]}>
            {errors.categoria.message}
          </Text>
        )}
      </View>

      {/* Urgência */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
          Urgência
        </Text>
        <Controller
          control={control}
          name="urgencia"
          render={({ field: { onChange, value } }) => (
            <View style={styles.turnoRow}>
              {URGENCIA_OPTIONS.map((opt) => {
                const selected = value === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[
                      styles.turnoChip,
                      selected
                        ? {
                            backgroundColor: colors.surfaceAccent,
                            borderColor: colors.brand,
                          }
                        : {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                          },
                    ]}
                    onPress={() => onChange(opt.value)}
                  >
                    <View
                      style={[
                        styles.radio,
                        selected
                          ? { borderColor: colors.brand }
                          : {
                              borderColor: colors.textSecondary + "80",
                            },
                      ]}
                    >
                      {selected && (
                        <View
                          style={[
                            styles.radioDot,
                            { backgroundColor: colors.brand },
                          ]}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.turnoLabel,
                        {
                          color: selected
                            ? colors.brand
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
        {errors.urgencia?.message && (
          <Text style={[styles.fieldError, { color: colors.error }]}>
            {errors.urgencia.message}
          </Text>
        )}
      </View>

      <OrderEditFormAddressSection
        control={control}
        errors={errors}
        colors={colors}
        enderecoDiferente={enderecoDiferente}
        isBuscandoCep={isBuscandoCep}
      />

      {/* Descrição */}
      <View style={styles.fieldGroup}>
        <View style={styles.fieldLabelRow}>
          <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
            Descrição
          </Text>
          <IconSymbol
            name="square.and.pencil"
            size={16}
            color={colors.textSecondary}
          />
        </View>
        <Controller
          control={control}
          name="descricao"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Ex: Necessito um pintor para pintar meu muro."
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <Text
                style={[styles.charCounter, { color: colors.textSecondary }]}
              >
                {(value ?? "").length}/500
              </Text>
            </>
          )}
        />
        {errors.descricao?.message && (
          <Text style={[styles.fieldError, { color: colors.error }]}>
            {errors.descricao.message}
          </Text>
        )}
      </View>

      <OrderEditFormMediaSection
        colors={colors}
        mediaUris={mediaUris}
        existingUrls={existingUrls}
        isUploadingMedia={isUploadingMedia}
        uploadError={uploadError}
        isSubmitting={isSubmitting}
        onPickFromCamera={onPickFromCamera}
        onPickFromGallery={onPickFromGallery}
        onRemoveMedia={onRemoveMedia}
        onRemoveExistingUrl={onRemoveExistingUrl}
      />

      {/* Turno disponível */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
          Turno disponível
        </Text>
        <Controller
          control={control}
          name="turno"
          render={({ field: { onChange, value } }) => (
            <View style={styles.turnoRow}>
              {TURNO_OPTIONS.map((opt) => {
                const selected = value === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[
                      styles.turnoChip,
                      selected
                        ? {
                            backgroundColor: colors.surfaceAccent,
                            borderColor: colors.brand,
                          }
                        : {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                          },
                    ]}
                    onPress={() => onChange(opt.value)}
                  >
                    <View
                      style={[
                        styles.radio,
                        selected
                          ? { borderColor: colors.brand }
                          : {
                              borderColor: colors.textSecondary + "80",
                            },
                      ]}
                    >
                      {selected && (
                        <View
                          style={[
                            styles.radioDot,
                            { backgroundColor: colors.brand },
                          ]}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.turnoLabel,
                        {
                          color: selected
                            ? colors.brand
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
        {errors.turno?.message && (
          <Text style={[styles.fieldError, { color: colors.error }]}>
            {errors.turno.message}
          </Text>
        )}
      </View>

      {/* Error */}
      {errorMessage ? (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {errorMessage}
        </Text>
      ) : null}

      <OrderEditFormActionsRow
        colors={colors}
        isSubmitting={isSubmitting}
        onClear={onClear}
        onSubmit={onSubmit}
      />

      {/* Privacy */}
      <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
        Política de Privacidade
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  // Header
  headerSection: {
    marginTop: 27,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 27,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    lineHeight: 37,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
    lineHeight: 23,
    marginTop: 4,
  },
  // Field group
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    lineHeight: 23,
  },
  // Picker / Dropdown field
  pickerField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 58,
    borderRadius: Radii.lg,
    borderWidth: Borders.thin,
    paddingHorizontal: 18,
  },
  pickerText: {
    fontSize: 18,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
    lineHeight: 27,
    flex: 1,
  },
  // Address toggle card
  addressToggleCard: {
    borderRadius: Radii.lg,
    borderWidth: Borders.thin,
    padding: 18,
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 27,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  checkboxLabel: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    lineHeight: 23,
    flex: 1,
  },
  // CEP row with spinner
  cepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cepInput: {
    flex: 1,
  },
  // Endereço (inside card)
  enderecoSection: {
    marginTop: 18,
  },
  // TextArea
  textArea: {
    borderRadius: Radii.lg,
    borderWidth: Borders.thin,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 66,
    fontSize: 18,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
    lineHeight: 27,
    minHeight: 140,
  },
  charCounter: {
    textAlign: "right",
    fontSize: 13,
    marginTop: 4,
    marginRight: 4,
  },
  // TextInput single-line (endereço fields)
  textInput: {
    borderRadius: Radii.lg,
    borderWidth: Borders.thin,
    height: 58,
    paddingHorizontal: 18,
    fontSize: 18,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
    lineHeight: 27,
  },
  // Media buttons
  mediaRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 14,
  },
  mediaButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    height: 70,
    borderRadius: Radii.lg,
  },
  mediaButtonText: {
    fontSize: 16,
    fontFamily: Fonts?.sans,
    fontWeight: "600",
    lineHeight: 20,
  },
  // Turno chips
  turnoRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 12,
  },
  turnoChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 55,
    borderRadius: Radii.lg,
    borderWidth: 2,
    gap: 9,
    paddingHorizontal: 9,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  turnoLabel: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    fontWeight: "600",
    lineHeight: 23,
  },
  // Media preview
  mediaPreviewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  mediaPreviewItem: {
    position: "relative",
  },
  mediaPreviewItemNew: {
    borderWidth: 2,
    borderColor: "#F26F21",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 2,
  },
  mediaPreviewImage: {
    width: 80,
    height: 80,
    borderRadius: Radii.md,
  },
  mediaRemoveBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaStatusText: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    fontWeight: "500",
    marginTop: 10,
  },
  // Error
  errorText: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    marginBottom: 12,
    textAlign: "center",
  },
  fieldError: {
    fontSize: 13,
    fontFamily: Fonts?.sans,
    fontWeight: "500",
    marginTop: 6,
  },
  // Action buttons
  actionsRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 20,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    height: 57,
    borderRadius: Radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  actionOutline: {
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    lineHeight: 27,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  // Privacy
  privacyText: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "60%",
    borderRadius: Radii.lg,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radii.md,
    marginBottom: 4,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: Fonts?.sans,
    fontWeight: "500",
  },
});
