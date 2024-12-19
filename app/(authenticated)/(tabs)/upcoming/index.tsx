import Fab from "@/components/Fab";
import { StyleSheet, Text } from "react-native";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
} from "react-native-calendars";
import { todos, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { format, parse } from "date-fns";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Todo } from "@/types/interfaces";
import { Colors } from "@/constants/Colors";
import { MarkedDates } from "react-native-calendars/src/types";
import TaskRow from "@/components/TaskRow";

// @ts-ignore fix for defaultProps warning: https://github.com/wix/react-native-calendars/issues/2455
ExpandableCalendar.defaultProps = undefined;

interface Section {
  title: string;
  data: Todo[];
}

const Page = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const today = new Date().toISOString();
  const { data } = useLiveQuery(
    drizzleDb
      .select()
      .from(todos)
      .leftJoin(projects, eq(todos.project_id, projects.id))
      .where(eq(todos.completed, 0))
  );
  const [agendaItems, setAgendaItems] = useState<Section[]>([]);

  /**
   * タスクデータにプロジェクト名と色を追加
   * @param {Array<Object>} data - タスクデータとプロジェクトデータを含む配列
   * @returns {Array<Object>} プロジェクト名と色を含むタスクデータの配列
   */
  const withProjectData = data?.map((item) => ({
    ...item.todos,
    project_name: item.projects?.name,
    project_color: item.projects?.color,
  }));

  /**
   * カレンダーにマークする日付を格納するオブジェクト
   * @type {MarkedDates}
   */
  const markedDates: MarkedDates = {};

  /**
   *  due_dateがあるタスクを抽出し、カレンダーにマークする
   *  @param {Object} todo - タスクデータ
   */
  withProjectData
    .map((todo) => {
      if (todo.due_date) {
        markedDates[new Date(todo.due_date).toISOString().split("T")[0]] = {
          marked: true,
          dotColor: todo.project_color,
        };
      }
    })
    .filter(Boolean);

  useEffect(() => {
    /**
     * タスクデータにプロジェクト名と色を追加
     * @param {Array<Object>} data - タスクデータとプロジェクトデータを含む配列
     * @returns {Array<Object>} プロジェクト名と色を含むタスクデータの配列
     */
    const formattedData = data?.map((item) => ({
      ...item.todos,
      project_name: item.projects?.name,
      project_color: item.projects?.color,
    }));

    /**
     * タスクを日付ごとにグループ化
     * @param {Object} acc - グループ化されたタスクを格納するオブジェクト
     * @param {Object} task - タスクデータ
     * @returns {Object} 日付ごとにグループ化されたタスク
     */
    const groupedByDay = formattedData?.reduce(
      (acc: { [key: string]: Todo[] }, task) => {
        const day = format(new Date(task.due_date || new Date()), "dd-MM-yyyy");
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(task);
        return acc;
      },
      {}
    );

    /**
     * グループ化されたタスクデータをSectionListで表示するための形式に変換
     * @param {Array<Array>} groupedByDay - グループ化されたタスクデータ
     * @returns {Array<Object>} SectionListで表示するためのデータ
     */
    const listData: Section[] = Object.entries(groupedByDay || {}).map(
      ([day, tasks]) => ({
        title: day,
        data: tasks,
      })
    );

    /**
     * SectionListのデータを日付順にソート
     * @param {Object} a - SectionListのデータ
     * @param {Object} b - SectionListのデータ
     * @returns {number} ソート結果
     */
    listData.sort((a, b) => {
      const dateA = new Date(a.data[0].due_date || new Date());
      const dateB = new Date(b.data[0].due_date || new Date());
      return dateA.getTime() - dateB.getTime();
    });

    setAgendaItems(listData);
  }, [data]);

  return (
    <>
      <CalendarProvider
        date={today}
        showTodayButton={true}
        theme={{
          todayButtonTextColor: "#000000",
        }}
      >
        <ExpandableCalendar
          closeOnDayPress
          hideArrows
          markedDates={markedDates}
          theme={{
            todayTextColor: Colors.primary,
            todayButtonFontSize: 24,
            textDisabledColor: Colors.lightText,
            textDayFontWeight: "300",
            textMonthFontWeight: "bold",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: "white",
            todayButtonTextColor: "#0026ff",
          }}
        />
        <AgendaList
          sections={agendaItems}
          renderItem={({ item }) => <TaskRow task={item} />}
          renderSectionHeader={(section) => {
            const sectionTitle = section as unknown as string;
            const date = parse(sectionTitle, "dd-MM-yyyy", new Date());
            return (
              <Text style={styles.header}>{format(date, "d MMM · dddd")}</Text>
            );
          }}
          theme={{
            dayTextColor: "#000000",
            agendaDayTextColor: "#ff00ff",
            textDayHeaderFontWeight: "bold",
          }}
        />
      </CalendarProvider>
      <Fab />
    </>
  );
};
export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
