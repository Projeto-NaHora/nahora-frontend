import { useEffect, useRef } from "react";
import { profileService } from "@/features/profile/service";
import { useAuthStore } from "@/store/authStore";

const POLLING_INTERVAL_MS = 10_000;

export function useVerificacaoPolling(onApproved: () => void) {
  const onApprovedRef = useRef(onApproved);
  // Sync the latest callback in an effect, not during render,
  // to satisfy React Compiler's refs-during-render rule
  useEffect(() => {
    onApprovedRef.current = onApproved;
  });

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval>;

    const stop = () => {
      cancelled = true;
      if (intervalId !== undefined) clearInterval(intervalId);
    };

    const poll = async () => {
      // Stop if the store already moved past "aguardando" (e.g. a previous
      // poll already approved and the navigation callback is still in-flight).
      if (useAuthStore.getState().professionalOnboarding !== "aguardando") {
        stop();
        return;
      }

      try {
        const perfil = await profileService.buscarPerfilParaEdicao();

        if (cancelled) return;

        if (perfil.statusVerificacao === "VERIFICADO") {
          // Cancel BEFORE calling the callback — prevents a second poll
          // from firing while the async handleApproval awaits storage.set().
          stop();
          onApprovedRef.current();
        }
      } catch {
        // silently ignore network errors — polling will retry
      }
    };

    poll();
    intervalId = setInterval(poll, POLLING_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, []);
}
