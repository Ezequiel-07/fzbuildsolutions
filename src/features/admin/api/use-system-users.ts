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
  orderBy,
} from "firebase/firestore";

export type UserRole =
  "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER";

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  avatar?: string;
  lastLogin?: { seconds: number; nanoseconds: number } | string;
  mfaEnabled?: boolean;
  createdAt?: { seconds: number; nanoseconds: number };
}

export function useSystemUsers() {
  return useQuery({
    queryKey: ["system-users"],
    queryFn: async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      try {
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as SystemUser[];
      } catch {
        // Fallback if index not yet built
        const snapshot = await getDocs(usersRef);
        return snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as SystemUser[];
      }
    },
  });
}

export function useCreateSystemUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<SystemUser, "id">) => {
      const usersRef = collection(db, "users");
      const docRef = await addDoc(usersRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
    },
  });
}

export function useUpdateSystemUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<SystemUser>;
    }) => {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
    },
  });
}

export function useDeleteSystemUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, "users", id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
    },
  });
}
