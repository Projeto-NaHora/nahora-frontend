/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',

  setupFiles: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    '\\.(png|jpg|jpeg|gif|svg|webp|bmp|ttf|otf)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^expo-secure-store$': '<rootDir>/__mocks__/expo-secure-store.ts',
    '^expo-symbols$': '<rootDir>/__mocks__/expo-symbols.ts',
    '^expo-router$': '<rootDir>/__mocks__/expo-router.ts',
    '^expo-router/entry$': '<rootDir>/__mocks__/expo-router-entry.ts',
    '^react-native-safe-area-context$':
      '<rootDir>/__mocks__/react-native-safe-area-context.ts',
  },

  modulePathIgnorePatterns: [
    '<rootDir>/.expo',
    '<rootDir>/node_modules',
  ],

  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/?(*.)+(spec|test).{ts,tsx}',
  ],

  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'features/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
    '!**/coverage/**',
    '!app.json',
    '!metro.config.js',
  ],

  clearMocks: true,
  restoreMocks: true,
  testEnvironment: 'node',
};
