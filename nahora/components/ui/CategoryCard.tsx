import React from 'react';
import { View, Text, StyleSheet, GestureResponderEvent, Pressable } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';

export type Category = {
  id: string;
  name: string;
  emoji: string;
  slug?: string;
};

export type CategoryCardProps = {
  category: Category;
  onPress?: (event: GestureResponderEvent) => void;
  size?: number; // defaults to the visual size from the design (116)
  style?: any;
};

/**
 * Square category button used in the grid on B02 design.
 * Visual cues from Figma:
 * - White background, subtle gray border (#f0f0f0)
 * - Rounded corners (16px)
 * - Emoji centered on top, label below (centered)
 *
 * Tailwind suggestion (visual reference):
 * "w-28 h-28 bg-white border border-gray-200 rounded-lg items-center justify-center"
 */
export function CategoryCard({ category, onPress, size = 116, style }: CategoryCardProps) {
  const borderColor = useThemeColor({ light: '#f0f0f0' }, 'border');
  const bg = useThemeColor({}, 'background');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { width: size, height: size, backgroundColor: bg, borderColor },
        style,
      ]}
    >
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji} accessibilityElementsHidden>
          {category.emoji}
        </Text>
      </View>

      <ThemedText style={styles.label} numberOfLines={2} ellipsizeMode="tail">
        {category.name}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  emojiWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
  },
  emoji: {
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
  },
});

export default CategoryCard;
