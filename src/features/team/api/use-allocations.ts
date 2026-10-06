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
} from "firebase/firestore";

export interface TeamAllocation {
  id: string;
  memberId: string;
  memberName: string;
  role: string;
  avatar?: string;
  capacityHours: number;
  projects: string[];
  hours: {
    seg: number;
    ter: number;
    qua: number;
    qui: number;
    sex: number;
  };
  createdAt?: { seconds: number; nanoseconds: number };
}

export function useAllocations() {
  return useQuery({
    queryKey: ["allocations"],
    queryFn: async () => {
      const ref = collection(db, "allocations");
      const snapshot = await getDocs(ref);

      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as TeamAllocation[];

      return items;
    },
  });
}

export function useCreateAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<TeamAllocation, "id">) => {
      const ref = collection(db, "allocations");
      const docRef = await addDoc(ref, {
        ...data,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
    },
  });
}

export function useUpdateAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TeamAllocation>;
    }) => {
      const docRef = doc(db, "allocations", id);
      await updateDoc(docRef, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
    },
  });
}

export function useDeleteAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, "allocations", id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
    },
  });
}
