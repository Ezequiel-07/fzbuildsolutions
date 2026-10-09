import { describe, it, expect } from "vitest";

export type ServiceOrderStatus =
  | "PENDENTE"
  | "EM_ROTA"
  | "CHECKPOINT_ATINGIDO"
  | "FOTO_ENVIADA"
  | "CONCLUIDA"
  | "CANCELADA";

export interface CheckpointPhoto {
  id: string;
  storageUrl: string;
  capturedAt: string;
  latitude: number;
  longitude: number;
  fileSizeBytes: number;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
}

export interface ServiceOrder {
  id: string;
  driverId: string;
  clientName: string;
  status: ServiceOrderStatus;
  checkpoints: CheckpointPhoto[];
  timeline: { status: ServiceOrderStatus; timestamp: string }[];
  updatedAt: string;
}

export function advanceOrderStatus(
  order: ServiceOrder,
  nextStatus: ServiceOrderStatus,
  photo?: CheckpointPhoto,
): ServiceOrder {
  const allowedTransitions: Record<ServiceOrderStatus, ServiceOrderStatus[]> = {
    PENDENTE: ["EM_ROTA", "CANCELADA"],
    EM_ROTA: ["CHECKPOINT_ATINGIDO", "CANCELADA"],
    CHECKPOINT_ATINGIDO: ["FOTO_ENVIADA", "CONCLUIDA"],
    FOTO_ENVIADA: ["CONCLUIDA", "CHECKPOINT_ATINGIDO"],
    CONCLUIDA: [],
    CANCELADA: [],
  };

  if (!allowedTransitions[order.status]?.includes(nextStatus)) {
    throw new Error(
      `Transição inválida de status: ${order.status} -> ${nextStatus}`,
    );
  }

  const updatedCheckpoints = photo
    ? [...order.checkpoints, photo]
    : order.checkpoints;

  const now = new Date().toISOString();

  return {
    ...order,
    status: nextStatus,
    checkpoints: updatedCheckpoints,
    timeline: [...order.timeline, { status: nextStatus, timestamp: now }],
    updatedAt: now,
  };
}

export function validateStoragePhoto(
  photo: CheckpointPhoto,
  orderId: string,
): boolean {
  // Validate path pattern in Firebase Storage
  const expectedPrefix = `https://firebasestorage.googleapis.com/v0/b/fz-build.appspot.com/o/checkpoints%2F${orderId}%2F`;
  if (!photo.storageUrl.startsWith(expectedPrefix)) {
    return false;
  }

  // Validate mime type
  if (!["image/jpeg", "image/png", "image/webp"].includes(photo.mimeType)) {
    return false;
  }

  // Validate size (max 10MB)
  if (photo.fileSizeBytes <= 0 || photo.fileSizeBytes > 10 * 1024 * 1024) {
    return false;
  }

  // Validate coordinates
  if (
    photo.latitude < -90 ||
    photo.latitude > 90 ||
    photo.longitude < -180 ||
    photo.longitude > 180
  ) {
    return false;
  }

  return true;
}

export class OfflineSyncQueue {
  private queue: Array<{ id: string; action: string; payload: unknown }> = [];

  enqueue(item: { id: string; action: string; payload: unknown }) {
    // Avoid duplicate action ids
    if (this.queue.some((q) => q.id === item.id)) return;
    this.queue.push(item);
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  drain(): Array<{ id: string; action: string; payload: unknown }> {
    const items = [...this.queue];
    this.queue = [];
    return items;
  }
}

describe("Service Orders, Checkpoints & Driver Sync Workflow", () => {
  const initialOrder: ServiceOrder = {
    id: "OS-2026-001",
    driverId: "driver-123",
    clientName: "Empresa ABC Tubarão",
    status: "PENDENTE",
    checkpoints: [],
    timeline: [{ status: "PENDENTE", timestamp: new Date().toISOString() }],
    updatedAt: new Date().toISOString(),
  };

  it("advances order through its complete lifecycle up to completion", () => {
    let order = advanceOrderStatus(initialOrder, "EM_ROTA");
    expect(order.status).toBe("EM_ROTA");

    order = advanceOrderStatus(order, "CHECKPOINT_ATINGIDO");
    expect(order.status).toBe("CHECKPOINT_ATINGIDO");

    const photo: CheckpointPhoto = {
      id: "photo-001",
      storageUrl:
        "https://firebasestorage.googleapis.com/v0/b/fz-build.appspot.com/o/checkpoints%2FOS-2026-001%2Fphoto-001.jpg?alt=media",
      capturedAt: new Date().toISOString(),
      latitude: -28.4812,
      longitude: -49.0068,
      fileSizeBytes: 2048500,
      mimeType: "image/jpeg",
    };

    order = advanceOrderStatus(order, "FOTO_ENVIADA", photo);
    expect(order.status).toBe("FOTO_ENVIADA");
    expect(order.checkpoints).toHaveLength(1);
    expect(order.checkpoints[0].id).toBe("photo-001");

    order = advanceOrderStatus(order, "CONCLUIDA");
    expect(order.status).toBe("CONCLUIDA");
    expect(order.timeline).toHaveLength(5);
  });

  it("throws error on invalid status transitions", () => {
    expect(() => advanceOrderStatus(initialOrder, "CONCLUIDA")).toThrow(
      "Transição inválida de status: PENDENTE -> CONCLUIDA",
    );
  });

  it("validates Firebase Storage checkpoint photo format and geo metadata", () => {
    const validPhoto: CheckpointPhoto = {
      id: "photo-002",
      storageUrl:
        "https://firebasestorage.googleapis.com/v0/b/fz-build.appspot.com/o/checkpoints%2FOS-2026-001%2Fphoto-002.jpg?alt=media",
      capturedAt: new Date().toISOString(),
      latitude: -28.48,
      longitude: -49.01,
      fileSizeBytes: 1024000,
      mimeType: "image/jpeg",
    };

    expect(validateStoragePhoto(validPhoto, "OS-2026-001")).toBe(true);

    const invalidPhotoWrongOrder: CheckpointPhoto = {
      ...validPhoto,
      storageUrl:
        "https://firebasestorage.googleapis.com/v0/b/fz-build.appspot.com/o/checkpoints%2FOS-9999-999%2Fphoto-002.jpg?alt=media",
    };
    expect(validateStoragePhoto(invalidPhotoWrongOrder, "OS-2026-001")).toBe(
      false,
    );

    const oversizedPhoto: CheckpointPhoto = {
      ...validPhoto,
      fileSizeBytes: 15 * 1024 * 1024, // 15MB
    };
    expect(validateStoragePhoto(oversizedPhoto, "OS-2026-001")).toBe(false);
  });

  it("manages offline driver queue synchronization idempotently", () => {
    const syncQueue = new OfflineSyncQueue();

    syncQueue.enqueue({
      id: "sync-1",
      action: "UPDATE_STATUS",
      payload: { status: "EM_ROTA" },
    });

    // Duplicate submission while still offline
    syncQueue.enqueue({
      id: "sync-1",
      action: "UPDATE_STATUS",
      payload: { status: "EM_ROTA" },
    });

    syncQueue.enqueue({
      id: "sync-2",
      action: "UPLOAD_PHOTO",
      payload: { photoId: "photo-001" },
    });

    expect(syncQueue.getPendingCount()).toBe(2);

    const syncedItems = syncQueue.drain();
    expect(syncedItems).toHaveLength(2);
    expect(syncQueue.getPendingCount()).toBe(0);
  });
});
