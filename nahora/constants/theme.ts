/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
const brandColor = "#F97415";
const errorColor = "#DC2626";
const successColor = "#34C759";
const surfaceMutedLight = "#F9F9F9";
const borderLight = "#D9D9D9";
const placeholderLight = "#CCCCCC";
const onBrandLight = "#FAFAFA";
const textSecondaryLight = "#9CA3AF";
const surfaceAccentLight = "#FEF0E8";
const surfaceRedLight = "#FCE8E8";
const surfaceYellowLight = "#FEF3C7";
const surfaceGreenLight = "#D1FAE5";
const surfaceBlueLight = "#E6F0FF";
const surfaceGrayLight = "#F3F4F6";

const surfaceMutedDark = "#1E1E1E";
const borderDark = "#3A3A3A";
const placeholderDark = "#6D6D6D";
const onBrandDark = "#FAFAFA";
const textSecondaryDark = "#9BA1A6";
const surfaceAccentDark = "#2A1A10";
const surfaceRedDark = "#2A1515";
const surfaceYellowDark = "#2A2510";
const surfaceGreenDark = "#152A1A";
const surfaceBlueDark = "#15202A";
const surfaceGrayDark = "#2A2A2A";

const chatLight = {
  brandOrange: "#f27b24",
  incomingBubble: "#f4f6f8",
  proposalBg: "#fff2e5",
  proposalBorder: "#fad3bc",
  proposalText: "#e67215",
  onlineGreen: "#10b981",
  mutedText: "#8c8c8c",
  surfaceLight: "#f8f9fa",
  borderSubtle: "#eaeaea",
  darkText: "#111111",
  readReceipt: "#f27b24",
  readReceiptSent: "#8c8c8c",
  white: "#ffffff",
};

const chatDark = {
  brandOrange: "#f27b24",
  incomingBubble: "#2A2A2A",
  proposalBg: "#3D2E1F",
  proposalBorder: "#5C432A",
  proposalText: "#f27b24",
  onlineGreen: "#34d399",
  mutedText: "#9BA1A6",
  surfaceLight: "#2A2A2A",
  borderSubtle: "#3A3A3A",
  darkText: "#ECEDEE",
  readReceipt: "#f27b24",
  readReceiptSent: "#9BA1A6",
  white: "#151718",
};

export const Colors = {
  light: {
    text: "#11181C",
    textPrimary: "#000000",
    textSecondary: textSecondaryLight,
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    brand: brandColor,
    error: errorColor,
    success: successColor,
    surface: surfaceMutedLight,
    border: borderLight,
    placeholder: placeholderLight,
    onBrand: onBrandLight,
    link: brandColor,
    chat: chatLight,
    surfaceAccent: surfaceAccentLight,
    surfaceRed: surfaceRedLight,
    surfaceYellow: surfaceYellowLight,
    surfaceGreen: surfaceGreenLight,
    surfaceBlue: surfaceBlueLight,
    surfaceGray: surfaceGrayLight,
  },
  dark: {
    text: "#ECEDEE",
    textPrimary: "#ECEDEE",
    textSecondary: textSecondaryDark,
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    brand: brandColor,
    error: errorColor,
    success: successColor,
    surface: surfaceMutedDark,
    border: borderDark,
    placeholder: placeholderDark,
    onBrand: onBrandDark,
    link: brandColor,
    chat: chatDark,
    surfaceAccent: surfaceAccentDark,
    surfaceRed: surfaceRedDark,
    surfaceYellow: surfaceYellowDark,
    surfaceGreen: surfaceGreenDark,
    surfaceBlue: surfaceBlueDark,
    surfaceGray: surfaceGrayDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  screenHorizontal: 53,
  screenTop: 40,
  screenBottom: 40,
  logoToTitle: 16,
  titleToForm: 80,
  titleSubtitleGap: 4,
  formGap: 16,
  otpToButton: 18,
  formToForgot: 8,
  forgotToButton: 36,
  buttonToSignup: 8,
  inputPaddingHorizontal: 20,
  inputPaddingVertical: 17,
  signupGap: 4,
};

export const Sizes = {
  formWidth: 322,
  inputHeight: 54,
  buttonHeight: 54,
  logoWidth: 186,
  logoHeight: 85,
  otpBoxWidth: 48,
  otpBoxHeight: 52,
};

export const Radii = {
  md: 10,
  lg: 12,
  pill: 32,
};

export const FontSizes = {
  logo: 53.43,
  title: 28,
  body: 14,
  caption: 12,
};

export const LineHeights = {
  logo: 85,
  title: 36,
  body: 20,
};

export const LetterSpacing = {
  logo: -1.6,
  body: -0.24,
  title: 0,
};

export const Borders = {
  thin: 1,
};
