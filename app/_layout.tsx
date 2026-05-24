import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { ShopListProvider } from "./_ShopListContext";
import { UserProvider, useUser } from "./_UserContext";

function RootLayoutInner() {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4e8" }}>
        <ActivityIndicator size="large" color="#8faa4f" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="registration-first" />
      <Stack.Screen name="restor-pass" />
      <Stack.Screen name="new-pass" />
      <Stack.Screen name="list-of-shoplists" />
      <Stack.Screen name="shoplist-inside" />
      <Stack.Screen name="profil" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <ShopListProvider>
        <RootLayoutInner />
      </ShopListProvider>
    </UserProvider>
  );
}