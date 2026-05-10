import * as SecureStore from "expo-secure-store";

/**
 * Utility wrapper for expo-secure-store to handle persistent
 * sensitive data like Refresh Tokens.
 */
export const storage = {
  /**
   * Saves a string value to secure storage.
   * Used by authStore.ts to persist the refreshToken.
   */
  set: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`[Storage] Error setting key "${key}":`, error);
    }
  },

  /**
   * Retrieves a string value from secure storage.
   * Used by the Axios interceptor for silent refresh.
   */
  get: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`[Storage] Error getting key "${key}":`, error);
      return null;
    }
  },

  /**
   * Removes an item from secure storage.
   * Used during the logout flow.
   */
  delete: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[Storage] Error deleting key "${key}":`, error);
    }
  },
};
