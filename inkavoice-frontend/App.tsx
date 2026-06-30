import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}