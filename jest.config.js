module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-vector-icons|react-native-gesture-handler|react-native-safe-area-context)/)',
  ],
};
