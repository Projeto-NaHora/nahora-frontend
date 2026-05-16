import React, { type ReactElement } from 'react';
import {
  render,
  type RenderOptions,
} from '@testing-library/react-native';
import { SWRConfig } from 'swr';

function TestProviders({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{ provider: () => new Map(), dedupingInterval: 0 }}
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

export * from '@testing-library/react-native';
export { customRender as render };
