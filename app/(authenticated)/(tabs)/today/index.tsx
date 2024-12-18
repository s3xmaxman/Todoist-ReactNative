import Fab from "@/components/Fab";
import { useSQLiteContext } from "expo-sqlite";
import {
  StyleSheet,
  Text,
  RefreshControl,
  View,
  SectionList,
} from "react-native";
import { useState, useEffect } from "react";
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

const Page = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  useDrizzleStudio(db);

  const { data } = useLiveQuery(
    drizzleDb
      .select()
      .from(todos)
      .leftJoin(projects, eq(todos.project_id, projects.id))
      .where(eq(todos.completed, 0))
  );

  useEffect(() => {
    const formattedData = data?.map((item) => ({
      ...item.todos,
      project_name: item.projects?.name,
      project_color: item.projects?.color,
    }));
  }, [data]);

  return (
    <View>
      <Text>Page</Text>
    </View>
  );
};

export default Page;
