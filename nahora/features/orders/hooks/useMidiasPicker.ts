import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { orderService } from "../service";
import { getApiErrorMessage } from "@/utils/apiError";

export function useMidiasPicker() {
  const [mediaUris, setMediaUris] = useState<string[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /** Inicializa as URLs remotas já salvas no pedido (modo edição) */
  const initExistingUrls = useCallback((urls: string[]) => {
    setExistingUrls(urls.filter((u) => u && u.length > 0));
  }, []);

  /** Remove uma URL remota existente pelo índice */
  const removeExistingUrl = useCallback((index: number) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /** Abre a câmera para capturar uma foto */
  const pickFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setUploadError("Permissão de câmera não concedida.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setMediaUris((prev) => [...prev, result.assets[0].uri]);
        setUploadError(null);
      }
    } catch (err) {
      setUploadError(getApiErrorMessage(err, "Erro ao abrir câmera."));
    }
  };

  /** Abre a galeria para selecionar uma ou mais imagens */
  const pickFromGallery = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setUploadError("Permissão de galeria não concedida.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uris = result.assets.map((a) => a.uri);
        setMediaUris((prev) => [...prev, ...uris]);
        setUploadError(null);
      }
    } catch (err) {
      setUploadError(getApiErrorMessage(err, "Erro ao abrir galeria."));
    }
  };

  /** Remove uma mídia NOVA da lista pelo índice (URIs locais) */
  const removeMedia = (index: number) => {
    setMediaUris((prev) => prev.filter((_, i) => i !== index));
  };

  /** Faz upload de todas as mídias NOVAS e retorna as URLs */
  const uploadAll = async (): Promise<string[]> => {
    if (mediaUris.length === 0) return [];
    setIsUploading(true);
    setUploadError(null);

    try {
      const urls = await Promise.all(
        mediaUris.map((uri) => orderService.uploadMidia(uri, "PEDIDO")),
      );
      return urls;
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "Erro ao fazer upload das imagens.",
      );
      setUploadError(message);
      setIsUploading(false);
      throw err;
    }
  };

  /** Reseta o estado (após submit ou clear) */
  const reset = () => {
    setMediaUris([]);
    setExistingUrls([]);
    setIsUploading(false);
    setUploadError(null);
  };

  /** Se há qualquer mídia (existente ou nova) */
  const hasAnyMedia = existingUrls.length > 0 || mediaUris.length > 0;

  return {
    /** URIs locais das mídias selecionadas (para preview) */
    mediaUris,
    /** URLs remotas já salvas no pedido (modo edição) */
    existingUrls,
    /** Se true, está fazendo upload para o servidor */
    isUploading,
    /** Mensagem de erro de permissão ou upload */
    uploadError,
    /** Inicializa as URLs remotas existentes */
    initExistingUrls,
    /** Abre a câmera */
    pickFromCamera,
    /** Abre a galeria */
    pickFromGallery,
    /** Remove mídia NOVA pelo índice */
    removeMedia,
    /** Remove URL existente pelo índice */
    removeExistingUrl,
    /** Envia todas as mídias NOVAS para o servidor e retorna URLs */
    uploadAll,
    /** Limpa o estado */
    reset,
    /** Se há qualquer mídia (existente ou nova) */
    hasAnyMedia,
  };
}
