import Fab from "@/components/Fab";
import TaskRow from "@/components/TaskRow";
import { useSQLiteContext } from "expo-sqlite";
import {
  StyleSheet,
  Text,
  RefreshControl,
  View,
  SectionList,
} from "react-native";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { projects, todos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import Animated, {
  StretchInY,
  LayoutAnimationConfig,
} from "react-native-reanimated";
import { Todo } from "@/types/interfaces";

interface Section {
  title: string;
  data: Todo[];
}

const Page = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const { top } = useSafeAreaInsets();
  const [sectionListData, setSectionListData] = useState<Section[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useDrizzleStudio(db);

  const { data } = useLiveQuery(
    drizzleDb
      .select()
      .from(todos)
      .leftJoin(projects, eq(todos.project_id, projects.id))
      .where(eq(todos.completed, 0))
  );

  useEffect(() => {
    // 取得したデータを整形し、Todoインターフェースにproject_nameとproject_colorを追加
    const formattedData = data?.map((item) => ({
      ...item.todos,
      project_name: item.projects?.name,
      project_color: item.projects?.color,
    }));

    // 整形したデータを日付ごとにグループ化
    const groupedByDay = formattedData?.reduce(
      (acc: { [key: string]: Todo[] }, task) => {
        // due_dateが存在しない場合は現在の日付を使用
        const date = task.due_date ? new Date(task.due_date) : new Date();
        // 日付を "d MMM · eee" の形式でフォーマット
        const day = format(date, "d MMM · eee");
        // グループ化されたデータに同じ日付のタスクを追加
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(task);
        return acc;
      },
      {}
    );

    // グループ化されたデータをSectionListで表示するための形式に変換
    const listData: Section[] = Object.entries(groupedByDay || {}).map(
      ([day, tasks]) => ({
        title: day,
        data: tasks,
      })
    );

    // SectionListのデータを日付順にソート
    listData.sort((a, b) => {
      // due_dateが存在しない場合は現在の日付を使用
      const dateA = new Date(a.data[0].due_date || new Date());
      const dateB = new Date(b.data[0].due_date || new Date());
      return dateA.getTime() - dateB.getTime();
    });

    // 変換・ソートしたデータをstateにセット
    setSectionListData(listData);
  }, [data]);

  const loadTasks = async () => {};

  return (
    <View style={[styles.container, { paddingTop: top - 36 }]}>
      <SectionList
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        sections={sectionListData}
        renderItem={({ item }) => (
          <LayoutAnimationConfig>
            <Animated.View entering={StretchInY}>
              <TaskRow task={item} />
            </Animated.View>
          </LayoutAnimationConfig>
        )}
        renderSectionHeader={({ section }) => {
          return <Text style={styles.header}>{section.title}</Text>;
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadTasks} />
        }
      />
      <Fab />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 82,
  },
  header: {
    fontSize: 16,
    backgroundColor: "#fff",
    fontWeight: "bold",
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightBorder,
  },
});
