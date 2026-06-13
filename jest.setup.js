/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

// Mock device localization so i18n can resolve a locale during tests.
jest.mock('react-native-localize', () => ({
  getLocales: () => [
    { countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false },
  ],
  findBestLanguageTag: () => ({ languageTag: 'en-US', isRTL: false }),
}));

// Mock the MMKV native storage with a simple in-memory implementation.
jest.mock('react-native-mmkv', () => {
  const store = new Map();
  return {
    MMKV: jest.fn().mockImplementation(() => ({
      set: (key, value) => store.set(key, value),
      getString: (key) => store.get(key),
      delete: (key) => store.delete(key),
      getAllKeys: () => Array.from(store.keys()),
      addOnValueChangedListener: () => ({ remove: () => {} }),
    })),
  };
});

// Vector icons render to a simple component in tests.
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
