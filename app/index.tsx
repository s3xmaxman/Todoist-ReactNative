import { Colors } from "@/constants/Colors";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

/**
 * ログイン画面のコンポーネントです。
 * ユーザーがAppleまたはGoogleアカウントを使用してログインするためのインターフェースを提供します。
 */
const LoginScreen = () => {
  const { top } = useSafeAreaInsets();
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  /**
   * Appleアカウントを使用してログインするための関数です。
   * OAuthフローを開始し、セッションIDが作成された場合、それをアクティブに設定します。
   */
  const handleAppleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startAppleOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Googleアカウントを使用してログインするための関数です。
   * OAuthフローを開始し、セッションIDが作成された場合、それをアクティブに設定します。
   */
  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 指定されたリンクを開くための関数です。
   * Todoistのウェブサイトを開きます。
   */
  const openLink = () => {
    WebBrowser.openBrowserAsync("https://todoist.com");
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Image
        source={require("@/assets/images/todoist-logo.png")}
        style={styles.loginImage}
      />
      <Image
        source={require("@/assets/images/login.png")}
        style={styles.banner}
      />
      <Text style={styles.title}>仕事や生活を整えよう</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.btn]} onPress={handleAppleLogin}>
          <Ionicons name="logo-apple" size={24} />
          <Text style={[styles.btnText]}>Appleで続ける</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn]} onPress={handleGoogleLogin}>
          <Ionicons name="logo-google" size={24} />
          <Text style={[styles.btnText]}>Googleで続ける</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn]} onPress={handleAppleLogin}>
          <Ionicons name="logo-apple" size={24} />
          <Text style={[styles.btnText]}>メールで続ける</Text>
        </TouchableOpacity>

        <Text style={styles.description}>
          続行することで、Todoistの{" "}
          <Text style={styles.link} onPress={openLink}>
            利用規約
          </Text>{" "}
          および{" "}
          <Text style={styles.link} onPress={openLink}>
            プライバシーポリシー
          </Text>
          に同意したものとみなされます。
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    gap: 40,
    marginTop: 20,
  },
  loginImage: {
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
  banner: {
    height: 280,
    resizeMode: "contain",
  },
  title: {
    marginHorizontal: 50,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    gap: 20,
    marginHorizontal: 40,
  },
  btn: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 6,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.lightBorder,
    borderWidth: StyleSheet.hairlineWidth,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "500",
  },
  description: {
    fontSize: 12,
    textAlign: "center",
    color: Colors.lightText,
  },
  link: {
    color: Colors.lightText,
    fontSize: 12,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
