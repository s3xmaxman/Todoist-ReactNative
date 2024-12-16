import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { ClerkProvider } from "@clerk/clerk-expo";

const CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

const InitialLayout = () => {
  return <Stack />;
};

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <InitialLayout />
    </ClerkProvider>
  );
};

export default RootLayout;
