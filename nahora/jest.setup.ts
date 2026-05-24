import 'react-native/jest/setup';
import 'react-native-gesture-handler/jestSetup';
import 'react-native-reanimated/lib/module/jestUtils';

jest.mock('expo-modules-core', () => {
  const actual = jest.requireActual('expo-modules-core');
  return {
    ...(actual as object),
    requireNativeModule: jest.fn().mockImplementation(() => ({})),
    requireNativeViewManager: jest.fn().mockImplementation(() => {
      const { View } = require('react-native');
      return View;
    }),
  };
});
