import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import * as DropdownMenu from "zeego/dropdown-menu";
import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";

type MoreButtonProps = {
  pageName: string;
};

const MoreButton = ({ pageName }: MoreButtonProps) => {
  const copyToClipboard = async () => {
    const path = `myapp://(authenticated)/(tabs)/${pageName.toLowerCase()}`;
    await Clipboard.setStringAsync(path);
    toast.success(`Page Link copied to your clipboard`);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity style={styles.button} activeOpacity={0.6}>
          <Ionicons
            name="ellipsis-horizontal-outline"
            size={30}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item
          key="link"
          textValue={`リンクを${pageName}にコピー`}
          onSelect={copyToClipboard}
        >
          <DropdownMenu.ItemTitle>コピー</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: "link",
              pointSize: 24,
            }}
          ></DropdownMenu.ItemIcon>
        </DropdownMenu.Item>

        <DropdownMenu.Group>
          <DropdownMenu.Item key="select">
            <DropdownMenu.ItemTitle>タスクを選択</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: "square.stack",
                pointSize: 24,
              }}
            ></DropdownMenu.ItemIcon>
          </DropdownMenu.Item>

          <DropdownMenu.Item key="view">
            <DropdownMenu.ItemTitle>表示</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: "slider.horizontal.3",
                pointSize: 24,
              }}
            ></DropdownMenu.ItemIcon>
          </DropdownMenu.Item>

          <DropdownMenu.Item key="activity">
            <DropdownMenu.ItemTitle>アクティビティログ</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: "chart.xyaxis.line",
                pointSize: 24,
              }}
            ></DropdownMenu.ItemIcon>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MoreButton;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 4,
  },
});
