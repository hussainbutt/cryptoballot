import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";

// Disable header for all routes in this layout
export default function AdminLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" options={{ title: "" }} />
        <Stack.Screen name="elections" options={{ title: "" }} />
        <Stack.Screen name="candidates" options={{ title: "" }} />
        <Stack.Screen name="parties" options={{ title: "" }} />
        <Stack.Screen name="voters" options={{ title: "" }} />
        <Stack.Screen name="+not-found" options={{ title: "" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
