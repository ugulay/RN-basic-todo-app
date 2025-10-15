import './src/i18n';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TodoList from './src/components/TodoList';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <TodoList />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;