import { useEffect } from "react";
import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/store/authStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { user, accessToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Wait until the navigator is fully mounted AND not stale
    if (!navigationState?.key || navigationState.stale !== false) return;
    if (!segments[0]) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inClientGroup = segments[0] === "(client)";
    const inProfGroup = segments[0] === "(professional)";

    if (!user || !accessToken) {
      if (!inAuthGroup) {
        router.replace("/(auth)/(login)");
      }
    } else if (user.tipo === "CLIENTE") {
      if (!inClientGroup) {
        router.replace("/(client)");
      }
    } else if (user.tipo === "PROFISSIONAL") {
      if (!inProfGroup) {
        router.replace("/(professional)");
      }
    }
  }, [user, accessToken, segments, router, navigationState]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="(professional)" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
