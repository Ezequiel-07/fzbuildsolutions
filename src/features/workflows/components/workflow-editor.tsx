"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  useReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { CustomNode } from "./custom-node";
import {
  BrowserNode,
  ButtonNode,
  TextNode,
  ImageNode,
  HeaderNode,
  SidebarNode,
  CardNode,
} from "./wireframe-nodes";
import { Trash2 } from "lucide-react";

// Register custom nodes
const nodeTypes = {
  customNode: CustomNode,
  wireframeBrowser: BrowserNode,
  wireframeButton: ButtonNode,
  wireframeText: TextNode,
  wireframeImage: ImageNode,
  wireframeHeader: HeaderNode,
  wireframeSidebar: SidebarNode,
  wireframeCard: CardNode,
} as NodeTypes;

const initialNodes: Node[] = [
  {
    id: "1",
    type: "customNode",
    position: { x: 200, y: 150 },
    data: {
      title: "Frontend App",
      subtitle: "Next.js, TailwindCSS",
      color: "#003d9b",
      onChange: () => {}, // injected later
    },
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 500, y: 150 },
    data: {
      title: "API Gateway",
      subtitle: "Node.js, Express",
      color: "#00e3fd",
      onChange: () => {},
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
];

function Editor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, deleteElements } = useReactFlow();
  const [isOverTrash, setIsOverTrash] = useState(false);

  const [activeTab, setActiveTab] = useState<"arch" | "wire">("arch");

  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeDataChange = useCallback(
    (id: string, field: "title" | "subtitle", value: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            node.data = {
              ...node.data,
              [field]: value,
            };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );

  // Inject the onChange handler into the nodes data
  const nodesWithHandler = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onChange: onNodeDataChange,
    },
  }));

  const addNodeByType = useCallback(
    (type: string, position: { x: number; y: number }) => {
      let newNode: Node<Record<string, unknown>> | null = null;

      // Architecture nodes
      if (
        [
          "app",
          "api",
          "db",
          "storage",
          "auth",
          "mobile",
          "serverless",
        ].includes(type)
      ) {
        let color = "#003d9b";
        let title = "App";
        if (type === "app") {
          color = "#003d9b";
          title = "Frontend App";
        }
        if (type === "api") {
          color = "#00e3fd";
          title = "API Gateway";
        }
        if (type === "db") {
          color = "#f97316";
          title = "Banco de Dados";
        }
        if (type === "storage") {
          color = "#eab308";
          title = "Storage (Arquivos)";
        }
        if (type === "auth") {
          color = "#ef4444";
          title = "Autenticação";
        }
        if (type === "mobile") {
          color = "#8b5cf6";
          title = "Mobile App";
        }
        if (type === "serverless") {
          color = "#10b981";
          title = "Cloud Function";
        }

        newNode = {
          id: uuidv4(),
          type: "customNode",
          position,
          data: {
            title,
            subtitle: "Descrição...",
            color,
            onChange: onNodeDataChange,
          },
        };
      }
      // Wireframe nodes
      else if (
        [
          "wf-browser",
          "wf-button",
          "wf-text",
          "wf-image",
          "wf-header",
          "wf-sidebar",
          "wf-card",
        ].includes(type)
      ) {
        let nodeType = "wireframeBrowser";
        let title = "";

        if (type === "wf-browser") {
          nodeType = "wireframeBrowser";
          title = "https://meusite.com";
        }
        if (type === "wf-button") {
          nodeType = "wireframeButton";
          title = "Salvar";
        }
        if (type === "wf-text") {
          nodeType = "wireframeText";
          title = "Título da Seção";
        }
        if (type === "wf-image") {
          nodeType = "wireframeImage";
          title = "Imagem Placeholder";
        }
        if (type === "wf-header") {
          nodeType = "wireframeHeader";
          title = "";
        }
        if (type === "wf-sidebar") {
          nodeType = "wireframeSidebar";
          title = "";
        }
        if (type === "wf-card") {
          nodeType = "wireframeCard";
          title = "";
        }

        newNode = {
          id: uuidv4(),
          type: nodeType,
          position,
          data: { title, onChange: onNodeDataChange },
        };
      }

      if (newNode) {
        setNodes((nds) => nds.concat(newNode!));
      }
    },
    [onNodeDataChange, setNodes],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNodeByType(type, position);
    },
    [screenToFlowPosition, addNodeByType],
  );

  const onNodeDrag = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const mouseEvent = event as MouseEvent;
      const trash = document.getElementById("trash-zone");
      if (trash) {
        const rect = trash.getBoundingClientRect();
        if (
          mouseEvent.clientX >= rect.left &&
          mouseEvent.clientX <= rect.right &&
          mouseEvent.clientY >= rect.top &&
          mouseEvent.clientY <= rect.bottom
        ) {
          setIsOverTrash(true);
        } else {
          setIsOverTrash(false);
        }
      }
    },
    [setIsOverTrash],
  );

  const onNodeDragStop = useCallback(
    (_event: MouseEvent | TouchEvent, node: Node) => {
      if (isOverTrash) {
        deleteElements({ nodes: [{ id: node.id }] });
        setIsOverTrash(false);
      }
    },
    [isOverTrash, deleteElements],
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onAddNodeClick = (type: string) => {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + (Math.random() * 50 - 25),
      y: window.innerHeight / 2 + (Math.random() * 50 - 25),
    });
    addNodeByType(type, position);
  };

  return (
    <div className="flex-grow glass-card bg-[#f8f9fb]/60 backdrop-blur-md border border-white/50 rounded-3xl relative overflow-hidden shadow-2xl shadow-blue-900/10 flex">
      {/* Left Toolbar */}
      <div className="w-72 border-r border-slate-200/50 bg-white/50 flex flex-col items-start py-6 px-4 z-10 shadow-lg overflow-y-auto">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full mb-6">
          <button
            onClick={() => setActiveTab("arch")}
            className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-all ${activeTab === "arch" ? "bg-white text-[#003d9b] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            Arquitetura
          </button>
          <button
            onClick={() => setActiveTab("wire")}
            className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-all ${activeTab === "wire" ? "bg-white text-[#003d9b] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            Wireframes
          </button>
        </div>

        <h3 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Componentes
        </h3>
        <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
          Clique no componente para adicionar ao quadro, ou arraste e solte.
        </p>

        <div className="w-full space-y-3">
          {activeTab === "arch" && (
            <>
              {/* App */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-[#003d9b] hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("app")}
                onDragStart={(event) => onDragStart(event, "app")}
                draggable
              >
                <div className="w-4 h-4 rounded bg-[#003d9b] shadow-sm flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Web App / Frontend
                </span>
              </div>
              {/* Mobile */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-[#8b5cf6] hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("mobile")}
                onDragStart={(event) => onDragStart(event, "mobile")}
                draggable
              >
                <div className="w-4 h-4 rounded-full bg-[#8b5cf6] shadow-sm flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  App Mobile
                </span>
              </div>
              {/* API */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-[#00e3fd] hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("api")}
                onDragStart={(event) => onDragStart(event, "api")}
                draggable
              >
                <div className="w-4 h-4 rounded-full bg-[#00e3fd] shadow-sm flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  API Gateway
                </span>
              </div>
              {/* Database */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-[#f97316] hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("db")}
                onDragStart={(event) => onDragStart(event, "db")}
                draggable
              >
                <div className="w-3.5 h-3.5 bg-[#f97316] rotate-45 rounded-sm shadow-sm flex-shrink-0 ml-0.5" />
                <span className="text-xs font-bold text-slate-700">
                  Banco de Dados
                </span>
              </div>
              {/* Storage */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-[#eab308] hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("storage")}
                onDragStart={(event) => onDragStart(event, "storage")}
                draggable
              >
                <div className="w-4 h-4 bg-[#eab308] rounded-sm shadow-sm flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Storage (Arquivos)
                </span>
              </div>
              {/* Auth */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-[#ef4444] hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("auth")}
                onDragStart={(event) => onDragStart(event, "auth")}
                draggable
              >
                <div className="w-4 h-4 rounded-full bg-transparent border-[3px] border-[#ef4444] shadow-sm flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Autenticação (Auth)
                </span>
              </div>
              {/* Serverless */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-[#10b981] hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("serverless")}
                onDragStart={(event) => onDragStart(event, "serverless")}
                draggable
              >
                <div
                  className="w-4 h-4 bg-[#10b981] shadow-sm flex-shrink-0"
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                />
                <span className="text-xs font-bold text-slate-700">
                  Cloud Function
                </span>
              </div>
            </>
          )}

          {activeTab === "wire" && (
            <>
              {/* Browser */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-slate-400 hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("wf-browser")}
                onDragStart={(event) => onDragStart(event, "wf-browser")}
                draggable
              >
                <div className="w-5 h-4 border-2 border-slate-300 rounded flex-shrink-0 flex flex-col">
                  <div className="border-b-2 border-slate-300 h-1.5 w-full flex gap-0.5 px-0.5 pt-0.5">
                    <div className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                    <div className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Navegador (Tela)
                </span>
              </div>
              {/* Button */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-[#003d9b] hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("wf-button")}
                onDragStart={(event) => onDragStart(event, "wf-button")}
                draggable
              >
                <div className="w-5 h-3 bg-[#003d9b] rounded flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Botão (Ação)
                </span>
              </div>
              {/* Text */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-slate-400 hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("wf-text")}
                onDragStart={(event) => onDragStart(event, "wf-text")}
                draggable
              >
                <div className="w-5 h-4 border border-dashed border-slate-400 rounded-sm flex-shrink-0 flex flex-col justify-center items-center">
                  <span className="text-[8px] font-bold text-slate-400 font-serif">
                    T
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Bloco de Texto
                </span>
              </div>
              {/* Image */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-slate-400 hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("wf-image")}
                onDragStart={(event) => onDragStart(event, "wf-image")}
                draggable
              >
                <div className="w-5 h-5 bg-slate-200 border-2 border-slate-300 rounded-sm flex-shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Imagem (Banner)
                </span>
              </div>
              {/* Header */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-slate-400 hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("wf-header")}
                onDragStart={(event) => onDragStart(event, "wf-header")}
                draggable
              >
                <div className="w-5 h-2 bg-slate-200 border border-slate-300 rounded-sm flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Cabeçalho
                </span>
              </div>
              {/* Sidebar */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-slate-400 hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("wf-sidebar")}
                onDragStart={(event) => onDragStart(event, "wf-sidebar")}
                draggable
              >
                <div className="w-2 h-5 bg-slate-200 border border-slate-300 rounded-sm flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Menu Lateral
                </span>
              </div>
              {/* Card */}
              <div
                className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-slate-400 hover:shadow-md transition-all active:scale-95"
                onClick={() => onAddNodeClick("wf-card")}
                onDragStart={(event) => onDragStart(event, "wf-card")}
                draggable
              >
                <div className="w-4 h-4 bg-slate-100 border border-slate-300 rounded shadow-sm flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Card (Bloco)
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="flex-grow h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodesWithHandler}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{ animated: true, type: "smoothstep" }}
        >
          <Background color="#cbd5e1" gap={24} size={2} />
          <Controls className="bg-white/80 backdrop-blur-md shadow-lg border border-slate-100 rounded-xl overflow-hidden mb-4" />

          {/* Trash Zone */}
          <div
            id="trash-zone"
            className={`absolute bottom-6 right-6 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xl border-2 z-50 ${isOverTrash ? "bg-red-500 border-red-600 text-white scale-110 shadow-red-500/50" : "bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200"}`}
          >
            <Trash2 className="w-8 h-8" />
          </div>
        </ReactFlow>
      </div>
    </div>
  );
}

export function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <Editor />
    </ReactFlowProvider>
  );
}
