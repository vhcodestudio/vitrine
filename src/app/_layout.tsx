import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "../store";
import { LangProvider } from "../i18n";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LangProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </StoreProvider>
      </LangProvider>
    </SafeAreaProvider>
  );
}
