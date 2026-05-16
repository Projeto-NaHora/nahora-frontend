import 'react-native/jest/setup';
import 'react-native-gesture-handler/jestSetup';
import 'react-native-reanimated/lib/module/jestUtils';

jest.mock('expo-modules-core', () => {
  const actual = jest.requireActual('expo-modules-core');
  return {
    ...(actual as object),
    requireNativeModule: jest.fn().mockImplementation((moduleName: string) => {
      if (moduleName === 'ExpoSecureStore') {
        const { NativeModulesProxy } = actual as {
          NativeModulesProxy: Record<string, unknown>;
        };
        return NativeModulesProxy.ExpoSecureStore ?? {};
      }
      return {};
    }),
    requireNativeViewManager: jest.fn().mockImplementation(() => {
      const { View } = require('react-native');
      return View;
    }),
  };
});
