import {
  Stack,
  useNavigationContainerRef,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { ActivityIndicator, LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cache";
import { Colors } from "@/constants/Colors";
import { Suspense, useEffect } from "react";
import { ROUTE_TODAY } from "@/constants/route";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import migrations from "@/drizzle/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { addDummyData } from "@/utils/addDummyData";

const CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

function Loading() {
  return <ActivityIndicator size="large" color={Colors.primary} />;
}

const InitialLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(authenticated)";

    if (isSignedIn && !inAuthGroup) {
      router.replace(ROUTE_TODAY);
    } else if (!isSignedIn && pathname !== "/") {
      router.replace("/");
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {
  const expoDB = openDatabaseSync("todos.db");
  const db = drizzle(expoDB);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success) return;
    addDummyData(db);
  }, [success]);

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <Suspense fallback={<Loading />}>
          <SQLiteProvider
            databaseName="todos.db"
            options={{ enableChangeListener: true }}
            useSuspense
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <InitialLayout />
              <Toaster />
            </GestureHandlerRootView>
          </SQLiteProvider>
        </Suspense>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootLayout;
