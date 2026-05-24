import { Redirect } from "expo-router";
import { useUser } from "./_UserContext";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4e8" }}>
        <ActivityIndicator size="large" color="#8faa4f" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/list-of-shoplists" />;
  }

  return <Redirect href="/login" />;
}
