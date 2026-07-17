import React from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

export type CustomNodeData = {
  title: string;
  subtitle: string;
  color: string;
  onChange: (id: string, field: "title" | "subtitle", value: string) => void;
};

type CustomNode = Node<CustomNodeData>;

export function CustomNode({ id, data, selected }: NodeProps<CustomNode>) {
  return (
    <div
      className={`relative bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 w-56 transition-all border-2 ${
        selected
          ? "border-[#003d9b] scale-105 shadow-2xl z-50"
          : "border-slate-200"
      }`}
      style={{
        borderColor: selected ? data.color : "transparent",
        boxShadow: selected
          ? `0 10px 25px -5px ${data.color}40`
          : "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      }}
    >
      {/* Target handle (left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 transition-colors"
        style={{ borderColor: data.color, left: -6 }}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: data.color }}
          />
          <input
            type="text"
            className="w-full bg-transparent border-none text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200 rounded px-1 -ml-1"
            value={data.title}
            placeholder="Nome do componente"
            onChange={(e) => data.onChange(id, "title", e.target.value)}
            onPointerDown={(e) => e.stopPropagation()} // Allow selecting text without dragging
          />
        </div>

        <input
          type="text"
          className="w-full bg-transparent border-none text-[10px] text-slate-500 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-200 rounded px-1"
          value={data.subtitle}
          placeholder="Ex: Next.js, Banco de dados..."
          onChange={(e) => data.onChange(id, "subtitle", e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </div>

      {/* Source handle (right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 transition-colors"
        style={{ borderColor: data.color, right: -6 }}
      />
    </div>
  );
}
