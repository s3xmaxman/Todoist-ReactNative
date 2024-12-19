import { Stack, useRouter } from "expo-router";
import { useWindowDimensions, Button, View, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

const Layout = () => {
  const { height } = useWindowDimensions();
  const router = useRouter();
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="task/[id]"
        options={{
          title: "",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="task/new"
        options={{
          title: "",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="task/date-select"
        options={{
          title: "Schedule",
          presentation: "modal",
          unstable_sheetFooter: () => (
            <View style={{ height: 400, backgroundColor: "#fff" }} />
          ),
          headerLeft: () => (
            <Button
              title="Cancel"
              onPress={() => router.back()}
              color={Colors.primary}
            />
          ),
        }}
      />
    </Stack>
  );
};
export default Layout;
