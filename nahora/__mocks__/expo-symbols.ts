import React from 'react';
import { View } from 'react-native';

interface SymbolViewProps {
  name: string;
  size?: number;
  tintColor?: string;
  colors?: string | string[];
  type?: 'monochrome' | 'hierarchical' | 'palette' | 'multicolor';
  animationSpec?: unknown;
  style?: unknown;
  resizeMode?: string;
  fallback?: React.ReactNode;
}

export function SymbolView(props: SymbolViewProps) {
  if (props.fallback) {
    return <>{props.fallback}</>;
  }
  return (
    <View
      style={[
        { width: props.size ?? 24, height: props.size ?? 24 },
        props.style as Record<string, unknown>,
      ]}
    />
  );
}

export type { SymbolViewProps };

export type SymbolWeight =
  | 'unspecified'
  | 'ultraLight'
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy'
  | 'black';
