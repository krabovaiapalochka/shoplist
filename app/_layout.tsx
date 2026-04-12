import { Stack } from "expo-router";
import { ShopListProvider } from "./ShopListContext";

export default function RootLayout() {
  return (
    <ShopListProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="registration-first" />
        <Stack.Screen name="restor-pass" />
        <Stack.Screen name="new-pass" />
        <Stack.Screen name="list-of-shoplists" />
        <Stack.Screen name="shoplist-inside" />
        <Stack.Screen name="profil" />
      </Stack>
    </ShopListProvider>
  );
}