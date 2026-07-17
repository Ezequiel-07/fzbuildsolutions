import React from "react";
import {
  Handle,
  Position,
  type NodeProps,
  NodeResizer,
  type Node,
} from "@xyflow/react";
import { Image as ImageIcon } from "lucide-react";

export type WireframeNodeData = {
  title: string;
  color?: string;
  onChange: (id: string, field: "title" | "color", value: string) => void;
};

type WireframeNode = Node<WireframeNodeData>;

// Tool: Color Picker (only shown when selected)
const ColorPicker = ({
  id,
  data,
  selected,
}: {
  id: string;
  data: WireframeNodeData;
  selected: boolean;
}) => {
  if (!selected) return null;
  return (
    <div className="absolute -top-8 right-0 bg-white shadow-lg border border-slate-200 rounded-lg p-1 flex gap-1 z-50">
      <input
        type="color"
        value={data.color || "#003d9b"}
        onChange={(e) => data.onChange(id, "color", e.target.value)}
        className="w-6 h-6 rounded cursor-pointer"
        onPointerDown={(e) => e.stopPropagation()}
      />
    </div>
  );
};

// 1. Browser Window (Container)
export function BrowserNode({
  id,
  data,
  selected,
  width,
  height,
}: NodeProps<WireframeNode>) {
  const nodeData = data as WireframeNodeData;
  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg border-2 ${selected ? "border-[#003d9b]" : "border-slate-300"} flex flex-col overflow-hidden`}
      style={{ width: width ?? 600, height: height ?? 400 }}
    >
      <NodeResizer
        minWidth={300}
        minHeight={200}
        isVisible={selected}
        lineClassName="border-[#003d9b]"
        handleClassName="w-3 h-3 bg-white border-2 border-[#003d9b] rounded-full"
      />
      <ColorPicker id={id} data={nodeData} selected={selected} />

      {/* Browser Header */}
      <div
        className="bg-slate-100 border-b border-slate-200 h-10 w-full flex items-center px-4 gap-2 flex-shrink-0"
        style={{
          backgroundColor: nodeData.color ? `${nodeData.color}20` : undefined,
        }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="ml-4 bg-white border border-slate-200 rounded-md h-6 flex-grow flex items-center px-3">
          <input
            type="text"
            className="w-full text-xs text-slate-500 bg-transparent outline-none"
            value={nodeData.title}
            placeholder="https://meusite.com"
            onChange={(e) => nodeData.onChange(id, "title", e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow bg-white/50 p-4"></div>

      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

// 2. Button
export function ButtonNode({
  id,
  data,
  selected,
  width,
  height,
}: NodeProps<WireframeNode>) {
  const nodeData = data as WireframeNodeData;
  return (
    <div
      className={`relative rounded-lg shadow-md px-6 py-3 min-w-[120px] flex items-center justify-center ${selected ? "ring-2 ring-offset-2 ring-[#00e3fd]" : ""}`}
      style={{
        backgroundColor: nodeData.color || "#003d9b",
        width: width ?? 120,
        height: height ?? 44,
      }}
    >
      <NodeResizer
        minWidth={80}
        minHeight={30}
        isVisible={selected}
        lineClassName="border-[#003d9b]"
        handleClassName="w-3 h-3 bg-white border-2 border-[#003d9b] rounded-full"
      />
      <ColorPicker id={id} data={nodeData} selected={selected} />
      <input
        type="text"
        className="w-full text-center text-sm font-bold text-white bg-transparent outline-none placeholder-white/70"
        value={nodeData.title}
        placeholder="Botão"
        onChange={(e) => nodeData.onChange(id, "title", e.target.value)}
        onPointerDown={(e) => e.stopPropagation()}
      />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

// 3. Text Block
export function TextNode({
  id,
  data,
  selected,
  width,
  height,
}: NodeProps<WireframeNode>) {
  const nodeData = data as WireframeNodeData;
  return (
    <div
      className={`relative min-w-[200px] p-2 border-2 border-dashed ${selected ? "border-[#003d9b]" : "border-transparent hover:border-slate-200"}`}
      style={{ width: width ?? 200, height: height ?? 60 }}
    >
      <NodeResizer
        minWidth={100}
        minHeight={40}
        isVisible={selected}
        lineClassName="border-[#003d9b]"
        handleClassName="w-3 h-3 bg-white border-2 border-[#003d9b] rounded-full"
      />
      <ColorPicker id={id} data={nodeData} selected={selected} />
      <textarea
        className="w-full h-full min-h-[60px] text-sm bg-transparent outline-none resize-none placeholder-slate-400 font-medium"
        style={{ color: nodeData.color || "#334155" }}
        value={nodeData.title}
        placeholder="Digite seu texto aqui..."
        onChange={(e) => nodeData.onChange(id, "title", e.target.value)}
        onPointerDown={(e) => e.stopPropagation()}
      />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

// 4. Image Placeholder
export function ImageNode({
  id,
  data,
  selected,
  width,
  height,
}: NodeProps<WireframeNode>) {
  const nodeData = data as WireframeNodeData;
  return (
    <div
      className={`relative bg-slate-100 border-2 border-dashed ${selected ? "border-[#003d9b]" : "border-slate-300"} flex flex-col items-center justify-center text-slate-400`}
      style={{ width: width ?? 300, height: height ?? 200 }}
    >
      <NodeResizer
        minWidth={100}
        minHeight={100}
        isVisible={selected}
        lineClassName="border-[#003d9b]"
        handleClassName="w-3 h-3 bg-white border-2 border-[#003d9b] rounded-full"
      />
      <ColorPicker id={id} data={nodeData} selected={selected} />

      <ImageIcon
        className="w-12 h-12 mb-2 opacity-50"
        style={{ color: nodeData.color }}
      />
      <input
        type="text"
        className="w-full text-center text-xs font-medium bg-transparent outline-none px-4"
        style={{ color: nodeData.color || "#64748b" }}
        value={nodeData.title}
        placeholder="Imagem Placeholder"
        onChange={(e) => nodeData.onChange(id, "title", e.target.value)}
        onPointerDown={(e) => e.stopPropagation()}
      />

      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

// 5. Header (Navbar)
export function HeaderNode({
  id,
  data,
  selected,
  width,
  height,
}: NodeProps<WireframeNode>) {
  const nodeData = data as WireframeNodeData;
  return (
    <div
      className={`relative bg-white shadow-sm border ${selected ? "border-[#003d9b]" : "border-slate-200"} flex items-center justify-between px-6`}
      style={{ width: width ?? 600, height: height ?? 64 }}
    >
      <NodeResizer
        minWidth={300}
        minHeight={64}
        isVisible={selected}
        lineClassName="border-[#003d9b]"
        handleClassName="w-3 h-3 bg-white border-2 border-[#003d9b] rounded-full"
      />
      <ColorPicker id={id} data={nodeData} selected={selected} />

      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded bg-slate-200"
          style={{ backgroundColor: nodeData.color || "#e2e8f0" }}
        ></div>
        <div className="w-24 h-4 rounded bg-slate-200"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-2 rounded bg-slate-200"></div>
        <div className="w-12 h-2 rounded bg-slate-200"></div>
        <div className="w-12 h-2 rounded bg-slate-200"></div>
        <div className="w-8 h-8 rounded-full bg-slate-200 ml-4"></div>
      </div>

      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

// 6. Sidebar (Menu)
export function SidebarNode({
  id,
  data,
  selected,
  width,
  height,
}: NodeProps<WireframeNode>) {
  const nodeData = data as WireframeNodeData;
  return (
    <div
      className={`relative bg-slate-50 border-r ${selected ? "border-[#003d9b]" : "border-slate-200"} flex flex-col p-4`}
      style={{ width: width ?? 240, height: height ?? 400 }}
    >
      <NodeResizer
        minWidth={150}
        minHeight={200}
        isVisible={selected}
        lineClassName="border-[#003d9b]"
        handleClassName="w-3 h-3 bg-white border-2 border-[#003d9b] rounded-full"
      />
      <ColorPicker id={id} data={nodeData} selected={selected} />

      <div
        className="w-3/4 h-6 rounded bg-slate-200 mb-8"
        style={{ backgroundColor: nodeData.color || "#e2e8f0" }}
      ></div>
      <div className="space-y-4">
        <div className="w-full h-8 rounded bg-slate-200/50"></div>
        <div className="w-5/6 h-8 rounded bg-slate-200/50"></div>
        <div className="w-4/5 h-8 rounded bg-slate-200/50"></div>
        <div className="w-full h-8 rounded bg-slate-200/50"></div>
      </div>

      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

// 7. Card Layout
export function CardNode({
  id,
  data,
  selected,
  width,
  height,
}: NodeProps<WireframeNode>) {
  const nodeData = data as WireframeNodeData;
  return (
    <div
      className={`relative bg-white rounded-xl shadow-md border ${selected ? "border-[#003d9b]" : "border-slate-200"} p-5 flex flex-col`}
      style={{ width: width ?? 300, height: height ?? 200 }}
    >
      <NodeResizer
        minWidth={200}
        minHeight={150}
        isVisible={selected}
        lineClassName="border-[#003d9b]"
        handleClassName="w-3 h-3 bg-white border-2 border-[#003d9b] rounded-full"
      />
      <ColorPicker id={id} data={nodeData} selected={selected} />

      <div
        className="w-1/3 h-4 rounded bg-slate-200 mb-4"
        style={{ backgroundColor: nodeData.color || "#e2e8f0" }}
      ></div>
      <div className="w-full h-2 rounded bg-slate-100 mb-2"></div>
      <div className="w-5/6 h-2 rounded bg-slate-100 mb-2"></div>
      <div className="w-4/6 h-2 rounded bg-slate-100 mb-6"></div>

      <div className="mt-auto flex justify-end">
        {/* placeholder for actions */}
      </div>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}
