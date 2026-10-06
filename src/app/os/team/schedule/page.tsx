"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTeam } from "@/features/team/api/use-team";
import {
  useAllocations,
  useCreateAllocation,
  useUpdateAllocation,
  type TeamAllocation,
} from "@/features/team/api/use-allocations";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { ProgressBar } from "@/components/os/panel";

const DAYS = [
  { key: "seg", label: "Segunda", date: "Seg" },
  { key: "ter", label: "Terça", date: "Ter" },
  { key: "qua", label: "Quarta", date: "Qua" },
  { key: "qui", label: "Quinta", date: "Qui" },
  { key: "sex", label: "Sexta", date: "Sex" },
] as const;

export default function SchedulePage() {
  const { data: team = [], isLoading: isLoadingTeam } = useTeam();
  const { data: storedAllocations = [], isLoading: isLoadingAllocations } =
    useAllocations();
  const createAllocation = useCreateAllocation();
  const updateAllocation = useUpdateAllocation();

  const [activeWeekOffset, setActiveWeekOffset] = useState(0);

  // If allocations exist in Firestore, use them; otherwise, map from team members
  const scheduleRows: TeamAllocation[] =
    storedAllocations.length > 0
      ? storedAllocations
      : team.map((m) => ({
          id: m.id,
          memberId: m.id,
          memberName: m.name,
          role: m.role || "Engenharia",
          capacityHours: 40,
          projects: m.allocations?.map((a) => a.projectName) || [
            "FZ OS Interno",
          ],
          hours: {
            seg: 8,
            ter: 8,
            qua: 8,
            qui: 8,
            sex: 8,
          },
        }));

  // Calculations
  const totalAllocatedHours = scheduleRows.reduce((acc, row) => {
    return (
      acc +
      (row.hours.seg +
        row.hours.ter +
        row.hours.qua +
        row.hours.qui +
        row.hours.sex)
    );
  }, 0);

  const totalCapacity = Math.max(1, scheduleRows.length * 40);
  const occupancyRate = Math.min(
    100,
    Math.round((totalAllocatedHours / totalCapacity) * 100),
  );

  const handleUpdateHour = async (
    row: TeamAllocation,
    dayKey: "seg" | "ter" | "qua" | "qui" | "sex",
    newVal: number,
  ) => {
    const clamped = Math.max(0, Math.min(12, newVal));
    const nextHours = { ...row.hours, [dayKey]: clamped };

    try {
      if (storedAllocations.some((a) => a.id === row.id)) {
        await updateAllocation.mutateAsync({
          id: row.id,
          data: { hours: nextHours },
        });
      } else {
        await createAllocation.mutateAsync({
          memberId: row.memberId || row.id,
          memberName: row.memberName,
          role: row.role,
          capacityHours: row.capacityHours || 40,
          projects: row.projects || ["FZ Build"],
          hours: nextHours,
        });
      }
      toast.success("Carga horária atualizada!");
    } catch {
      toast.error("Erro ao salvar alocação.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda & Alocação Semanal"
        description="Matriz operacional de horas dedicadas da equipe por squad e projeto"
        actions={
          <div className="flex items-center gap-2">
            <Link href="/os/team">
              <Button variant="secondary">
                <Users className="h-4 w-4" />
                <span>Ver Especialistas</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Capacity & Occupancy Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Panel className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-os-muted">
            <span>Taxa de Ocupação da Squad</span>
            <span className="font-bold text-os-fg font-mono">
              {occupancyRate}%
            </span>
          </div>
          <ProgressBar value={occupancyRate} />
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-primary/10 text-os-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Horas Alocadas na Semana</p>
            <p className="text-xl font-bold text-os-fg">
              {totalAllocatedHours}h
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-success/10 text-os-success">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Capacidade Total</p>
            <p className="text-xl font-bold text-os-fg">{totalCapacity}h</p>
          </div>
        </Panel>
      </div>

      {/* Week Navigator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveWeekOffset((w) => w - 1)}
            className="p-1.5 rounded-lg border border-os-border bg-os-surface hover:bg-os-surface-2 text-os-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-os-fg font-mono px-2">
            Semana{" "}
            {activeWeekOffset === 0
              ? "Atual"
              : `${activeWeekOffset > 0 ? "+" : ""}${activeWeekOffset}`}
          </span>
          <button
            onClick={() => setActiveWeekOffset((w) => w + 1)}
            className="p-1.5 rounded-lg border border-os-border bg-os-surface hover:bg-os-surface-2 text-os-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <span className="text-xs text-os-muted">
          Segunda a Sexta · 40h semanais padrão
        </span>
      </div>

      {/* Schedule Grid Table */}
      <Panel className="overflow-hidden">
        {isLoadingTeam || isLoadingAllocations ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-os-primary" />
          </div>
        ) : scheduleRows.length === 0 ? (
          <div className="p-8 text-center text-xs text-os-muted">
            Nenhum membro disponível para alocação.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-os-border bg-os-surface-2/60 text-os-muted font-mono font-medium">
                  <th className="py-3 px-4 w-60">MEMBRO / SQUAD</th>
                  {DAYS.map((d) => (
                    <th key={d.key} className="py-3 px-4 text-center">
                      <span className="block text-os-fg">{d.label}</span>
                      <span className="text-[10px] text-os-muted">
                        {d.date}
                      </span>
                    </th>
                  ))}
                  <th className="py-3 px-4 text-center">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border">
                {scheduleRows.map((row) => {
                  const memberTotal =
                    row.hours.seg +
                    row.hours.ter +
                    row.hours.qua +
                    row.hours.qui +
                    row.hours.sex;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-os-surface-2/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-os-fg truncate">
                          {row.memberName}
                        </p>
                        <p className="text-[11px] text-os-muted truncate">
                          {row.role}
                        </p>
                        {row.projects && row.projects.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {row.projects.slice(0, 2).map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.2 rounded bg-os-primary/10 text-os-primary text-[9px] font-medium"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {DAYS.map((d) => {
                        const val = row.hours[d.key];
                        return (
                          <td key={d.key} className="py-3 px-4 text-center">
                            <input
                              type="number"
                              min={0}
                              max={12}
                              value={val}
                              onChange={(e) =>
                                handleUpdateHour(
                                  row,
                                  d.key,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-12 p-1.5 text-center font-mono font-bold rounded-lg border border-os-border bg-os-surface text-os-fg focus:outline-none focus:ring-1 focus:ring-os-ring"
                            />
                            <span className="block text-[10px] text-os-muted mt-0.5">
                              h
                            </span>
                          </td>
                        );
                      })}

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono font-bold px-2.5 py-1 rounded-md text-xs ${
                            memberTotal > 40
                              ? "bg-os-danger/10 text-os-danger"
                              : memberTotal === 40
                                ? "bg-os-success/10 text-os-success"
                                : "bg-os-surface-2 text-os-fg"
                          }`}
                        >
                          {memberTotal}h
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
