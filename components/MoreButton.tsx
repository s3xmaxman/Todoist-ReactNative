import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";

type MoreButtonProps = {
  pageName: string;
};

const MoreButton = ({ pageName }: MoreButtonProps) => {
  const [visible, setVisible] = useState(false);

  const copyToClipboard = async () => {
    const path = `myapp://(authenticated)/(tabs)/${pageName.toLowerCase()}`;

    await Clipboard.setStringAsync(path);

    toast.success(`Page Link copied to your clipboard`);

    setVisible(false);
  };

  const MenuItem = ({
    title,
    icon,
    onPress,
  }: {
    title: string;
    icon: React.ComponentProps<typeof MaterialIcons>["name"];
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{title}</Text>
      <MaterialIcons name={icon} size={24} color={Colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.6}
        onPress={() => setVisible(true)}
      >
        <Ionicons
          name="ellipsis-horizontal-outline"
          size={30}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <MenuItem
                  title="コピー"
                  icon="link"
                  onPress={copyToClipboard}
                />
                <MenuItem title="タスクを選択" icon="layers" />
                <MenuItem title="表示" icon="tune" />
                <MenuItem title="アクティビティログ" icon="timeline" />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    margin: 16,
    minWidth: 200,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    marginRight: 16,
  },
});

export default MoreButton;
