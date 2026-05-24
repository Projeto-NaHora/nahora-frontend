const mockGetItemAsync = jest.fn<() => Promise<string | null>>().mockResolvedValue(null);
const mockSetItemAsync = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
const mockDeleteItemAsync = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
const mockIsAvailableAsync = jest.fn<() => Promise<boolean>>().mockResolvedValue(true);

const AFTER_FIRST_UNLOCK = 'AFTER_FIRST_UNLOCK';
const AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY = 'AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY';
const ALWAYS = 'ALWAYS';
const WHEN_PASSCODE_SET_THIS_DEVICE_ONLY = 'WHEN_PASSCODE_SET_THIS_DEVICE_ONLY';
const WHEN_UNLOCKED = 'WHEN_UNLOCKED';
const WHEN_UNLOCKED_THIS_DEVICE_ONLY = 'WHEN_UNLOCKED_THIS_DEVICE_ONLY';

export {
  AFTER_FIRST_UNLOCK,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  ALWAYS,
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  WHEN_UNLOCKED,
  WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  mockGetItemAsync as getItemAsync,
  mockSetItemAsync as setItemAsync,
  mockDeleteItemAsync as deleteItemAsync,
  mockIsAvailableAsync as isAvailableAsync,
};

const SecureStore = {
  AFTER_FIRST_UNLOCK,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  ALWAYS,
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  WHEN_UNLOCKED,
  WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  getItemAsync: mockGetItemAsync,
  setItemAsync: mockSetItemAsync,
  deleteItemAsync: mockDeleteItemAsync,
  isAvailableAsync: mockIsAvailableAsync,
};

export default SecureStore;
