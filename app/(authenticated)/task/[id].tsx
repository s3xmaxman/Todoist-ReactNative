import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { todos, projects } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import TodoForm from "@/components/TodoForm";

const Page = () => {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db);

  const { data } = useLiveQuery(
    drizzleDB
      .select()
      .from(todos)
      .where(eq(todos.id, Number(id)))
      .leftJoin(projects, eq(todos.project_id, projects.id))
  );

  if (!data || data.length === 0) return null;

  const todo = {
    ...data?.[0].todos,
    project_name: data?.[0].projects?.name || "",
    project_color: data?.[0].projects?.color || "",
  };

  return <TodoForm todo={todo} />;
};

export default Page;

const styles = StyleSheet.create({});
