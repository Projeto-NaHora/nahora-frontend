import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useRegisterStore } from "@/store/registerStore";
import { parseApiError } from "@/utils/apiError";
import { authService } from "../service";

export function useUploadDocuments() {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const rgFrontUri = useRegisterStore((state) => state.rgFrontUri);
  const rgBackUri = useRegisterStore((state) => state.rgBackUri);
  const selfieUri = useRegisterStore((state) => state.selfieUri);
  const setRgFrontUrl = useRegisterStore((state) => state.setRgFrontUrl);
  const setRgBackUrl = useRegisterStore((state) => state.setRgBackUrl);
  const setSelfieUrl = useRegisterStore((state) => state.setSelfieUrl);

  const upload = async (): Promise<boolean> => {
    if (!rgFrontUri || !rgBackUri || !selfieUri) {
      Alert.alert(
        "Atenção",
        "Selecione todos os documentos antes de continuar.",
      );
      return false;
    }

    setErrorMessage(null);
    setErrorStatus(null);
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

      await authService.enviarDocumentos({
        rgFrente: rgFrontResp.url,
        rgVerso: rgBackResp.url,
        selfieComDocumento: selfieResp.url,
      });

      return true;
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message);
      setErrorStatus(parsed.statusCode ?? null);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, errorMessage, errorStatus };
}
