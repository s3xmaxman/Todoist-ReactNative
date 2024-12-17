import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ROUTE_TASK_NEW } from "@/constants/route";

const Fab = () => {
  const router = useRouter();

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(ROUTE_TASK_NEW);
  };

  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={onPress}>
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

export default Fab;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    zIndex: 100,
    bottom: 24,
    right: 14,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
});
