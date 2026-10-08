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
  writeBatch,
  Timestamp,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: "in" | "out";
  projectId?: string;
  createdAt?: { seconds: number; nanoseconds: number };
  fitid?: string;
  bank?: string;
  origin?: "manual" | "google_sheets" | "ofx";
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const transRef = collection(db, "transactions");
      const q = query(transRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Transaction, "id" | "createdAt">) => {
      const transRef = collection(db, "transactions");
      const docRef = await addDoc(transRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Transaction>;
    }) => {
      const docRef = doc(db, "transactions", id);
      await updateDoc(docRef, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, "transactions", id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export interface CreateTransactionInput extends Omit<
  Transaction,
  "id" | "createdAt"
> {
  customDate?: string;
}

export function useBatchCreateTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: CreateTransactionInput[]) => {
      if (items.length === 0) return { totalCreated: 0 };

      const transRef = collection(db, "transactions");
      const batchSize = 400;
      let totalCreated = 0;

      for (let i = 0; i < items.length; i += batchSize) {
        const chunk = items.slice(i, i + batchSize);
        const batch = writeBatch(db);

        for (const item of chunk) {
          const newDocRef = doc(transRef);
          const { customDate, ...data } = item;

          let timestamp = serverTimestamp();
          if (customDate) {
            const parsed = new Date(customDate);
            if (!isNaN(parsed.getTime())) {
              timestamp = Timestamp.fromDate(parsed) as unknown as ReturnType<
                typeof serverTimestamp
              >;
            }
          }

          batch.set(newDocRef, {
            ...data,
            createdAt: timestamp,
          });
          totalCreated++;
        }

        await batch.commit();
      }

      return { totalCreated };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
