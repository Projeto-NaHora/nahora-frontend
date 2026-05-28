import { useEffect, useRef } from "react";
import { profileService } from "@/features/profile/service";

const POLLING_INTERVAL_MS = 10_000;

export function useVerificacaoPolling(onApproved: () => void) {
  const onApprovedRef = useRef(onApproved);
  onApprovedRef.current = onApproved;

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const perfil = await profileService.buscarPerfilParaEdicao();
        if (!cancelled && perfil.statusVerificacao === "VERIFICADO") {
          onApprovedRef.current();
        }
      } catch {
        // silently ignore network errors — polling will retry
      }
    };

    poll();
    const id = setInterval(poll, POLLING_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);
}
