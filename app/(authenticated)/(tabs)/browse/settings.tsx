import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";

const ICONS = [
  {
    name: "Default",
    icon: require("@/assets/images/icon.png"),
  },
  {
    name: "Dark",
    icon: require("@/assets/images/icon-dark.png"),
  },
  {
    name: "Green",
    icon: require("@/assets/images/icon-green.png"),
  },
  {
    name: "Blue",
    icon: require("@/assets/images/icon-blue.png"),
  },
];

const Page = () => {
  const headerHeight = useHeaderHeight();
  const [activeIcon, setActiveIcon] = useState("Default");

  const onChangeIcon = async (icon: string) => {};

  return (
    <View style={[styles.container, { marginTop: headerHeight }]}>
      <TouchableOpacity style={styles.proButton} onPress={() => {}}>
        <Ionicons name="star-outline" size={24} color={Colors.primary} />

        <View style={styles.proButtonContent}>
          <Text style={styles.proButtonText}>Upgrade to Pro</Text>
          <Text style={styles.proButtonSubtitle}>
            Upgrade to unlock all features
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={24} color={Colors.dark} />
      </TouchableOpacity>

      <View style={styles.actions}>
        {ICONS.map((icon) => (
          <TouchableOpacity
            key={icon.name}
            style={styles.btn}
            onPress={() => onChangeIcon(icon.name)}
          >
            <Image source={icon.icon} style={{ width: 60, height: 60 }} />
            <Text style={{ color: Colors.primary, fontSize: 18 }}>
              {icon.name}
            </Text>
            {activeIcon.toLowerCase() === icon.name.toLowerCase() && (
              <Ionicons name="checkmark" size={24} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  proButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    gap: 10,
  },
  proButtonContent: {
    flex: 1,
    gap: 5,
  },
  proButtonText: {
    fontSize: 16,
  },
  proButtonSubtitle: {
    fontSize: 14,
    color: Colors.lightText,
  },
  actions: {
    backgroundColor: "rgba(256, 256, 256, 0.1)",
    borderRadius: 16,
    gap: 0,
    margin: 20,
  },
  btn: {
    padding: 14,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
});
