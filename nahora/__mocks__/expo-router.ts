import React from 'react';
import { Text } from 'react-native';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockNavigate = jest.fn();
const mockSetParams = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockReload = jest.fn();
const mockDismiss = jest.fn();
const mockDismissTo = jest.fn();
const mockDismissAll = jest.fn();

export function useRouter() {
  return {
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    navigate: mockNavigate,
    setParams: mockSetParams,
    canGoBack: mockCanGoBack,
    reload: mockReload,
    dismiss: mockDismiss,
    dismissTo: mockDismissTo,
    dismissAll: mockDismissAll,
  };
}

export const router = {
  push: mockPush,
  replace: mockReplace,
  back: mockBack,
  navigate: mockNavigate,
  setParams: mockSetParams,
  canGoBack: mockCanGoBack,
  reload: mockReload,
  dismiss: mockDismiss,
  dismissTo: mockDismissTo,
  dismissAll: mockDismissAll,
};

export function useLocalSearchParams<T = Record<string, string>>(): T {
  return {} as T;
}

export function useGlobalSearchParams<T = Record<string, string>>(): T {
  return {} as T;
}

export function useSegments() {
  return [];
}

export function usePathname() {
  return '/';
}

export function useNavigation() {
  return {};
}

export function useFocusEffect(cb: () => void) {
  cb();
}

export function useRootNavigation() {
  return null;
}

export function useRootNavigationState() {
  return {};
}

export function useNavigationContainerRef() {
  return null;
}

export function useUnstableGlobalHref() {
  return '/';
}

export const Stack = {
  Screen: ({
    children,
  }: {
    children?: React.ReactNode;
  }) => children ?? null,
};

export const Tabs = {
  Screen: ({
    children,
  }: {
    children?: React.ReactNode;
  }) => children ?? null,
};

export function Slot(props: { children?: React.ReactNode }) {
  return props.children ?? null;
}

export function Navigator({ children }: { children?: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}

export function ErrorBoundary({ error }: { error: Error }) {
  return React.createElement(
    Text,
    null,
    'Error: ' + error.message,
  );
}

export const SplashScreen = {
  hide: jest.fn().mockResolvedValue(undefined),
  preventAutoHideAsync: jest.fn().mockResolvedValue(undefined),
};

export function Link({
  children,
}: {
  children?: React.ReactNode;
  href?: string;
}) {
  return React.createElement(React.Fragment, null, children);
}

export function Redirect() {
  return null;
}

export const withLayoutContext = jest.fn();
export const ExpoRoot = jest.fn();
export const Sitemap = jest.fn();
export const Unmatched = jest.fn();
export const useSitemap = jest.fn();
