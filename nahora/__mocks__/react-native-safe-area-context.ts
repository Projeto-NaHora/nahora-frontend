import React from 'react';
import { View } from 'react-native';

const MOCK_INSETS = { top: 0, left: 0, right: 0, bottom: 0 };
const MOCK_FRAME = { x: 0, y: 0, width: 320, height: 640 };

export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}

export function SafeAreaView({
  children,
  style,
  ...props
}: {
  children?: React.ReactNode;
  style?: unknown;
  [key: string]: unknown;
}) {
  return React.createElement(View, { style }, children);
}

export function useSafeAreaInsets() {
  return MOCK_INSETS;
}

export function useSafeAreaFrame() {
  return MOCK_FRAME;
}

export const SafeAreaInsetsContext = React.createContext(MOCK_INSETS);
export const SafeAreaFrameContext = React.createContext(MOCK_FRAME);

export default {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
  useSafeAreaFrame,
  SafeAreaInsetsContext,
  SafeAreaFrameContext,
  initialWindowMetrics: {
    frame: MOCK_FRAME,
    insets: MOCK_INSETS,
  },
};
