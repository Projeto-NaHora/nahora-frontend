import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { orderService } from "../service";
import { getApiErrorMessage } from "@/utils/apiError";

export function useMidiasPicker() {
  const [mediaUris, setMediaUris] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  /** Remove uma mídia da lista pelo índice */
  const removeMedia = (index: number) => {
    setMediaUris((prev) => prev.filter((_, i) => i !== index));
  };

  /** Faz upload de todas as mídias selecionadas e retorna as URLs */
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
    setIsUploading(false);
    setUploadError(null);
  };

  return {
    /** URIs locais das mídias selecionadas (para preview) */
    mediaUris,
    /** Se true, está fazendo upload para o servidor */
    isUploading,
    /** Mensagem de erro de permissão ou upload */
    uploadError,
    /** Abre a câmera */
    pickFromCamera,
    /** Abre a galeria */
    pickFromGallery,
    /** Remove mídia pelo índice */
    removeMedia,
    /** Envia todas as mídias para o servidor e retorna URLs */
    uploadAll,
    /** Limpa o estado */
    reset,
  };
}
