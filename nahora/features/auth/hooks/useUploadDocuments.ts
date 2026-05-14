import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useRegisterStore } from "@/store/registerStore";
import { getApiErrorMessage } from "@/utils/apiError";
import { authService } from "../service";

export function useUploadDocuments() {
  const [isUploading, setIsUploading] = useState(false);

  const rgFrontUri = useRegisterStore((state) => state.rgFrontUri);
  const rgBackUri = useRegisterStore((state) => state.rgBackUri);
  const selfieUri = useRegisterStore((state) => state.selfieUri);
  const setRgFrontUrl = useRegisterStore((state) => state.setRgFrontUrl);
  const setRgBackUrl = useRegisterStore((state) => state.setRgBackUrl);
  const setSelfieUrl = useRegisterStore((state) => state.setSelfieUrl);

  const upload = useCallback(async (): Promise<boolean> => {
    if (!rgFrontUri || !rgBackUri || !selfieUri) {
      Alert.alert("Atenção", "Selecione todos os documentos antes de continuar.");
      return false;
    }

    setIsUploading(true);

    try {
      const [rgFrontResp, rgBackResp, selfieResp] = await Promise.all([
        authService.uploadDocumento(rgFrontUri, "RG_FRENTE"),
        authService.uploadDocumento(rgBackUri, "RG_VERSO"),
        authService.uploadDocumento(selfieUri, "SELFIE"),
      ]);

      setRgFrontUrl(rgFrontResp.url);
      setRgBackUrl(rgBackResp.url);
      setSelfieUrl(selfieResp.url);

      return true;
    } catch (error) {
      Alert.alert("Erro no upload", getApiErrorMessage(error));
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [rgFrontUri, rgBackUri, selfieUri, setRgFrontUrl, setRgBackUrl, setSelfieUrl]);

  return { upload, isUploading };
}
