import React, { type ReactElement } from 'react';
import {
  render,
  renderHook,
  type RenderOptions,
  type RenderHookOptions,
} from '@testing-library/react-native';
import { SWRConfig } from 'swr';

function TestProviders({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
        loadingTimeout: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: TestProviders, ...options });
}

function customRenderHook<Result, Props>(
  hook: (initialProps: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'>,
) {
  return renderHook(hook, { wrapper: TestProviders, ...options });
}

export * from '@testing-library/react-native';
export { customRender as render };
export { customRenderHook as renderHook };
