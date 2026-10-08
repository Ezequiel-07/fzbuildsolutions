"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import type { SoftwareEstimate, CreateEstimateInput } from "../types";

export function useEstimates() {
  return useQuery({
    queryKey: ["estimates"],
    queryFn: async () => {
      try {
        const estimatesRef = collection(db, "estimates");
        const q = query(estimatesRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as SoftwareEstimate[];
      } catch (err) {
        console.warn(
          "[useEstimates] Falha ao ordenar por createdAt, consultando sem ordenação:",
          err,
        );
        const estimatesRef = collection(db, "estimates");
        const snapshot = await getDocs(estimatesRef);
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as SoftwareEstimate[];
      }
    },
  });
}

export function useEstimate(id?: string) {
  return useQuery({
    queryKey: ["estimates", id],
    queryFn: async () => {
      if (!id) return null;
      const docRef = doc(db, "estimates", id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as SoftwareEstimate;
    },
    enabled: Boolean(id),
  });
}

export function useCreateEstimate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEstimateInput) => {
      const estimatesRef = collection(db, "estimates");
      const docRef = await addDoc(estimatesRef, {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estimates"] });
    },
  });
}

export function useUpdateEstimate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateEstimateInput>;
    }) => {
      const docRef = doc(db, "estimates", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["estimates"] });
      queryClient.invalidateQueries({ queryKey: ["estimates", variables.id] });
    },
  });
}

export function useDeleteEstimate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, "estimates", id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estimates"] });
    },
  });
}

export function useConvertEstimateToProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (estimate: SoftwareEstimate) => {
      // 1. Cria projeto na coleção 'projects'
      const projectsRef = collection(db, "projects");
      const projectDoc = await addDoc(projectsRef, {
        name: estimate.title,
        description: `Projeto gerado a partir do Orçamento ${estimate.proposalNumber}. Cliente: ${estimate.clientName}. Total de ${estimate.totalHours}h estimadas.`,
        budget: estimate.totalPrice,
        clientId: estimate.clientId || "",
        status: "To Do",
        progress: 0,
        createdAt: serverTimestamp(),
      });

      // 2. Atualiza status da proposta para "approved" e referencia o projectId
      const estimateRef = doc(db, "estimates", estimate.id);
      await updateDoc(estimateRef, {
        status: "approved",
        projectId: projectDoc.id,
        updatedAt: serverTimestamp(),
      });

      return projectDoc.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estimates"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
