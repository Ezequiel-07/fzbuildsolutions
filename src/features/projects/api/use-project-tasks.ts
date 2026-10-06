"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

export interface ProjectTask {
  id: string;
  projectId: string;
  text: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  assignedTo?: string;
  dueDate?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

export function useProjectTasks(projectId?: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const tasksRef = collection(db, "tasks");
      const q = query(tasksRef, where("projectId", "==", projectId));
      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ProjectTask[];

      // Sort in memory by createdAt descending or done status
      return items.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
    },
    enabled: !!projectId,
  });
}

export function useAllTasks() {
  return useQuery({
    queryKey: ["tasks", "all"],
    queryFn: async () => {
      const tasksRef = collection(db, "tasks");
      const snapshot = await getDocs(tasksRef);

      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ProjectTask[];

      return items.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ProjectTask, "id">) => {
      const tasksRef = collection(db, "tasks");
      const docRef = await addDoc(tasksRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", "all"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      done,
    }: {
      id: string;
      projectId: string;
      done: boolean;
    }) => {
      const docRef = doc(db, "tasks", id);
      await updateDoc(docRef, { done });
      return { id, done };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", "all"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; projectId: string }) => {
      const docRef = doc(db, "tasks", id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", "all"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
