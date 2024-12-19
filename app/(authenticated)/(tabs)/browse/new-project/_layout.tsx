import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Platform, TouchableOpacity, Text } from "react-native";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.backgroundAlt },
        headerTintColor: Colors.primary,
        headerTitleStyle: { color: "#000" },
        headerTransparent: Platform.OS === "ios",
        headerTitle: "",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.dismiss()}
              style={{ paddingHorizontal: "auto" }}
            >
              <Text style={{ color: Colors.primary }}>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="color-select"
        options={{
          headerTitle: "",
        }}
      />
    </Stack>
  );
};

export default Layout;
