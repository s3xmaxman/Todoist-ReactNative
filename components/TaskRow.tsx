import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Todo } from "@/types/interfaces";
import { Colors } from "@/constants/Colors";
import { useSQLiteContext } from "expo-sqlite";

interface TaskRowProps {
  task: Todo;
}

const TaskRow = ({ task }: TaskRowProps) => {
  const db = useSQLiteContext();
  return (
    <View>
      <Text>{task.name}</Text>
    </View>
  );
};

export default TaskRow;

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightBorder,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  taskName: {
    fontSize: 16,
    flex: 1,
  },
  projectName: {
    fontSize: 12,
    color: Colors.dark,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  swipeable: {
    backgroundColor: "#fff",
  },
  rightAction: {
    height: 90,
    backgroundColor: "#8b8a8a",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    flex: 1,
  },
});
