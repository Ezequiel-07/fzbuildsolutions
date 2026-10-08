"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileSpreadsheet,
  Link as LinkIcon,
  Upload,
  CheckCircle2,
  Loader2,
  Search,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Layers,
  Sparkles,
  Landmark,
  ShieldCheck,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  useGoogleSpreadsheets,
  useReadSheetMutation,
} from "../api/use-google-sheets";
import {
  useTransactions,
  useBatchCreateTransactions,
  CreateTransactionInput,
} from "../api/use-transactions";
import {
  parseOfxString,
  OfxParseResult,
  OfxTransaction,
} from "../services/ofx-parser-service";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { toast } from "sonner";

interface ImportSpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportSource = "ofx" | "drive" | "url" | "file";
type Step = "source" | "mapping" | "preview";

const DEFAULT_CATEGORIES = [
  "MRR / Mensalidade",
  "Pagamento de Projeto",
  "Consultoria",
  "Outros Recebimentos",
  "Infraestrutura Cloud",
  "Marketing & Vendas",
  "Software & Licenças",
  "Salários & Freelancers",
  "Impostos & Taxas",
  "Administrativo",
  "Outros Gastos",
];

export function ImportSpreadsheetModal({
  isOpen,
  onClose,
}: ImportSpreadsheetModalProps) {
  // Step state
  const [step, setStep] = useState<Step>("source");
  const [sourceType, setSourceType] = useState<ImportSource>("ofx");

  // Source inputs
  const [urlInput, setUrlInput] = useState("");
  const [driveSearch, setDriveSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOfxFile, setSelectedOfxFile] = useState<File | null>(null);

  // Loaded sheet data (CSV / Google Sheets)
  const [sheetData, setSheetData] = useState<{
    title: string;
    activeSheet: string;
    sheetTabs: Array<{ id?: number; title: string }>;
    rows: string[][];
    spreadsheetId?: string;
  } | null>(null);

  // Loaded OFX data
  const [ofxData, setOfxData] = useState<OfxParseResult | null>(null);
  const [ofxItems, setOfxItems] = useState<OfxTransaction[]>([]);

  // Mapping state (para planilhas)
  const [hasHeader, setHasHeader] = useState(true);
  const [colDescription, setColDescription] = useState<number>(-1);
  const [colAmount, setColAmount] = useState<number>(-1);
  const [colType, setColType] = useState<number>(-1);
  const [typeMode, setTypeMode] = useState<"auto" | "column" | "in" | "out">(
    "auto",
  );
  const [colCategory, setColCategory] = useState<number>(-1);
  const [defaultCategory, setDefaultCategory] = useState("Outros Recebimentos");
  const [colDate, setColDate] = useState<number>(-1);

  // Hooks
  const { data: existingTransactions = [] } = useTransactions();
  const {
    data: driveStatus,
    isLoading: isDriveLoading,
    refetch: refetchDrive,
  } = useGoogleSpreadsheets();
  const readSheet = useReadSheetMutation();
  const batchCreate = useBatchCreateTransactions();

  // Conjunto de FITIDs já cadastrados no banco para evitar duplicidade na conciliação
  const existingFitids = useMemo(() => {
    return new Set(existingTransactions.map((t) => t.fitid).filter(Boolean));
  }, [existingTransactions]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep("source");
      setSourceType("ofx");
      setSheetData(null);
      setOfxData(null);
      setOfxItems([]);
      setSelectedOfxFile(null);
      setSelectedFile(null);
    }
  }, [isOpen]);

  // Headers list based on first row (para planilhas)
  const headers = useMemo(() => {
    if (!sheetData || sheetData.rows.length === 0) return [];
    return sheetData.rows[0].map((cell, idx) => ({
      index: idx,
      label: cell.trim() || `Coluna ${idx + 1}`,
    }));
  }, [sheetData]);

  // Intelligent auto-detection of column mapping para planilhas
  useEffect(() => {
    if (!sheetData || sheetData.rows.length === 0) return;
    const headerRow = sheetData.rows[0].map((c) =>
      c
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    );

    // Auto-detect Description
    const descIdx = headerRow.findIndex(
      (h) =>
        h.includes("descri") ||
        h.includes("historico") ||
        h.includes("nome") ||
        h.includes("item") ||
        h.includes("cliente") ||
        h.includes("titulo"),
    );
    if (descIdx !== -1) setColDescription(descIdx);
    else if (headerRow.length > 1) setColDescription(1);
    else setColDescription(0);

    // Auto-detect Amount
    const amountIdx = headerRow.findIndex(
      (h) =>
        h.includes("valor") ||
        h.includes("preco") ||
        h.includes("total") ||
        h.includes("quantia") ||
        h.includes("amount") ||
        h.includes("r$"),
    );
    if (amountIdx !== -1) setColAmount(amountIdx);
    else if (headerRow.length > 2) setColAmount(2);

    // Auto-detect Type
    const typeIdx = headerRow.findIndex(
      (h) =>
        h.includes("tipo") ||
        h.includes("natureza") ||
        h.includes("operacao") ||
        h.includes("e/s"),
    );
    if (typeIdx !== -1) {
      setColType(typeIdx);
      setTypeMode("column");
    } else {
      setTypeMode("auto");
    }

    // Auto-detect Category
    const catIdx = headerRow.findIndex(
      (h) =>
        h.includes("categ") || h.includes("classific") || h.includes("centro"),
    );
    if (catIdx !== -1) setColCategory(catIdx);

    // Auto-detect Date
    const dateIdx = headerRow.findIndex(
      (h) =>
        h.includes("data") ||
        h.includes("vencimento") ||
        h.includes("pagamento") ||
        h.includes("emissao") ||
        h.includes("compet"),
    );
    if (dateIdx !== -1) setColDate(dateIdx);
  }, [sheetData]);

  // Parse helper functions para planilhas
  const parseCurrency = (
    val: string,
  ): { amount: number; isNegative: boolean } => {
    if (!val) return { amount: 0, isNegative: false };
    const clean = val.trim();
    const isNegative =
      clean.startsWith("-") ||
      clean.endsWith("-") ||
      (clean.startsWith("(") && clean.endsWith(")"));

    let numStr = clean.replace(/[R$\s()]/g, "").replace("-", "");

    if (numStr.includes(",") && numStr.includes(".")) {
      numStr = numStr.replace(/\./g, "").replace(",", ".");
    } else if (numStr.includes(",")) {
      numStr = numStr.replace(",", ".");
    }

    const parsed = parseFloat(numStr);
    return {
      amount: isNaN(parsed) ? 0 : Math.abs(parsed),
      isNegative,
    };
  };

  const parseDateString = (val?: string): string | undefined => {
    if (!val) return undefined;
    const clean = val.trim();

    const dmy = clean.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{2,4})$/);
    if (dmy) {
      const day = dmy[1].padStart(2, "0");
      const month = dmy[2].padStart(2, "0");
      let year = dmy[3];
      if (year.length === 2) year = `20${year}`;
      return `${year}-${month}-${day}T12:00:00.000Z`;
    }

    const ymd = clean.match(/^(\d{4})[\/\.-](\d{1,2})[\/\.-](\d{1,2})$/);
    if (ymd) {
      const year = ymd[1];
      const month = ymd[2].padStart(2, "0");
      const day = ymd[3].padStart(2, "0");
      return `${year}-${month}-${day}T12:00:00.000Z`;
    }

    return undefined;
  };

  // Process rows into parsed transactions (para planilhas normais)
  const parsedSheetTransactions = useMemo(() => {
    if (!sheetData || sheetData.rows.length === 0) return [];
    const dataRows = hasHeader ? sheetData.rows.slice(1) : sheetData.rows;

    const list: Array<
      CreateTransactionInput & { rawRowIndex: number; isValid: boolean }
    > = [];

    dataRows.forEach((row, idx) => {
      if (!row || row.every((c) => !c || c.trim() === "")) return;

      const desc =
        colDescription >= 0 && row[colDescription]
          ? row[colDescription].trim()
          : `Lançamento #${idx + 1}`;

      const rawAmount =
        colAmount >= 0 && row[colAmount] ? row[colAmount].trim() : "0";
      const { amount, isNegative } = parseCurrency(rawAmount);

      let type: "in" | "out" = "out";
      if (typeMode === "in") {
        type = "in";
      } else if (typeMode === "out") {
        type = "out";
      } else if (typeMode === "column" && colType >= 0 && row[colType]) {
        const typeVal = row[colType].toLowerCase();
        if (
          typeVal.includes("receita") ||
          typeVal.includes("entrada") ||
          typeVal.includes("credito") ||
          typeVal.includes("in") ||
          typeVal.includes("venda") ||
          typeVal.startsWith("c") ||
          typeVal === "e"
        ) {
          type = "in";
        } else {
          type = "out";
        }
      } else {
        type = isNegative ? "out" : "in";
      }

      let category = defaultCategory;
      if (colCategory >= 0 && row[colCategory] && row[colCategory].trim()) {
        category = row[colCategory].trim();
      }

      const rawDate = colDate >= 0 ? row[colDate] : undefined;
      const customDate = parseDateString(rawDate);

      list.push({
        description: desc,
        amount,
        type,
        category,
        customDate,
        rawRowIndex: idx + 1,
        isValid: amount > 0 && desc.length > 0,
        origin: "google_sheets",
      });
    });

    return list;
  }, [
    sheetData,
    hasHeader,
    colDescription,
    colAmount,
    colType,
    typeMode,
    colCategory,
    defaultCategory,
    colDate,
  ]);

  // Totals in preview
  const totals = useMemo(() => {
    if (ofxData) {
      const selectedOnes = ofxItems.filter((t) => t.selected);
      const totalIn = selectedOnes
        .filter((t) => t.type === "in")
        .reduce((acc, t) => acc + t.amount, 0);
      const totalOut = selectedOnes
        .filter((t) => t.type === "out")
        .reduce((acc, t) => acc + t.amount, 0);
      const alreadyCount = ofxItems.filter((t) => t.alreadyImported).length;

      return {
        count: selectedOnes.length,
        totalCount: ofxItems.length,
        invalidCount: 0,
        alreadyImportedCount: alreadyCount,
        totalIn,
        totalOut,
        balance: totalIn - totalOut,
      };
    }

    const validOnes = parsedSheetTransactions.filter((t) => t.isValid);
    const totalIn = validOnes
      .filter((t) => t.type === "in")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalOut = validOnes
      .filter((t) => t.type === "out")
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      count: validOnes.length,
      totalCount: parsedSheetTransactions.length,
      invalidCount: parsedSheetTransactions.length - validOnes.length,
      alreadyImportedCount: 0,
      totalIn,
      totalOut,
      balance: totalIn - totalOut,
    };
  }, [ofxData, ofxItems, parsedSheetTransactions]);

  // Processamento de OFX (C6 Bank e outros)
  const handleProcessOfx = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseOfxString(text);

      if (parsed.transactions.length === 0) {
        toast.error("Nenhuma transação financeira encontrada no arquivo OFX.");
        return;
      }

      // Identificar transações que já foram importadas antes
      const itemsWithMatch = parsed.transactions.map((t) => {
        const isDuplicated = existingFitids.has(t.fitid);
        return {
          ...t,
          alreadyImported: isDuplicated,
          selected: !isDuplicated, // desmarcado por padrão se já conciliado
        };
      });

      setOfxData(parsed);
      setOfxItems(itemsWithMatch);
      setSheetData(null); // limpa modo planilha
      setStep("preview"); // OFX pula o mapeamento de colunas pois já vem padronizado!

      const dupCount = itemsWithMatch.filter((t) => t.alreadyImported).length;
      if (dupCount > 0) {
        toast.info(
          `Extrato do ${parsed.bankName} lido com sucesso! ${dupCount} transação(ões) já conciliada(s) foram desmarcadas.`,
        );
      } else {
        toast.success(
          `Extrato do ${parsed.bankName} lido: ${itemsWithMatch.length} movimentações prontas para conciliação!`,
        );
      }
    } catch (err: unknown) {
      console.error("[OFX_PARSE_ERROR]", err);
      const msg =
        err instanceof Error ? err.message : "Erro ao processar arquivo OFX";
      toast.error(msg);
    }
  };

  // Actions de Planilhas
  const handleLoadFromDrive = async (fileId: string) => {
    try {
      const res = await readSheet.mutateAsync({ spreadsheetId: fileId });
      setSheetData({
        ...res.data,
        spreadsheetId: fileId,
      });
      setOfxData(null);
      setStep("mapping");
      toast.success(`Planilha "${res.data.title}" carregada com sucesso!`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao carregar planilha";
      toast.error(msg);
    }
  };

  const handleLoadFromUrl = async () => {
    if (!urlInput.trim()) {
      toast.error("Por favor, cole a URL da planilha.");
      return;
    }
    try {
      const res = await readSheet.mutateAsync({ url: urlInput.trim() });
      setSheetData({
        ...res.data,
      });
      setOfxData(null);
      setStep("mapping");
      toast.success(`Planilha "${res.data.title}" carregada com sucesso!`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao carregar planilha";
      toast.error(msg);
    }
  };

  const handleLoadFromFile = async () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo CSV.");
      return;
    }
    try {
      const text = await selectedFile.text();
      const res = await readSheet.mutateAsync({ csvText: text });
      setSheetData({
        ...res.data,
        title: selectedFile.name,
      });
      setOfxData(null);
      setStep("mapping");
      toast.success(`Arquivo "${selectedFile.name}" carregado!`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao carregar arquivo";
      toast.error(msg);
    }
  };

  const handleSwitchSheetTab = async (tabTitle: string) => {
    if (!sheetData?.spreadsheetId) return;
    try {
      const res = await readSheet.mutateAsync({
        spreadsheetId: sheetData.spreadsheetId,
        sheetName: tabTitle,
      });
      setSheetData({
        ...res.data,
        spreadsheetId: sheetData.spreadsheetId,
      });
      toast.success(`Aba "${tabTitle}" carregada.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao alternar aba";
      toast.error(msg);
    }
  };

  // Toggle seleção individual no OFX
  const handleToggleOfxSelect = (index: number) => {
    setOfxItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  // Toggle selecionar todos no OFX
  const handleToggleAllOfx = () => {
    const allSelected = ofxItems.every((item) => item.selected);
    setOfxItems((prev) =>
      prev.map((item) => ({ ...item, selected: !allSelected })),
    );
  };

  // Troca de categoria de uma linha no OFX
  const handleUpdateOfxCategory = (index: number, newCategory: string) => {
    setOfxItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, category: newCategory } : item,
      ),
    );
  };

  // Confirmação final da importação
  const handleConfirmImport = async () => {
    // 1. Caso OFX
    if (ofxData) {
      const selectedItems = ofxItems.filter((t) => t.selected);
      if (selectedItems.length === 0) {
        toast.error("Selecione ao menos uma transação para importar.");
        return;
      }

      const toCreate: CreateTransactionInput[] = selectedItems.map((t) => ({
        description: t.memo,
        amount: t.amount,
        type: t.type,
        category: t.category,
        customDate: t.date,
        fitid: t.fitid,
        bank: ofxData.bankName,
        origin: "ofx",
      }));

      try {
        const res = await batchCreate.mutateAsync(toCreate);
        toast.success(
          `${res.totalCreated} lançamentos do ${ofxData.bankName} conciliados e importados!`,
        );
        onClose();
      } catch (err: unknown) {
        console.error("[OFX_IMPORT_ERROR]", err);
        toast.error("Erro ao salvar lançamentos bancários.");
      }
      return;
    }

    // 2. Caso Planilha (CSV / Sheets)
    const validItems: CreateTransactionInput[] = parsedSheetTransactions
      .filter((t) => t.isValid)
      .map((t) => ({
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: t.category,
        customDate: t.customDate,
        origin: "google_sheets",
      }));

    if (validItems.length === 0) {
      toast.error("Nenhuma transação válida identificada para importação.");
      return;
    }

    try {
      const res = await batchCreate.mutateAsync(validItems);
      toast.success(
        `${res.totalCreated} transações importadas com sucesso para o Financeiro!`,
      );
      onClose();
    } catch (err: unknown) {
      console.error("[IMPORT_ERROR]", err);
      toast.error("Erro ao importar transações. Tente novamente.");
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0c1222] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden text-slate-800 dark:text-slate-100 z-10 font-sans"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                {ofxData ? (
                  <Landmark className="w-5 h-5 text-[#0066ff]" />
                ) : (
                  <FileSpreadsheet className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>
                    {ofxData
                      ? `Conciliação Bancária · ${ofxData.bankName}`
                      : "Importar Planilha & Extrato Financeiro"}
                  </span>
                  <StatusBadge size="sm" tone={ofxData ? "accent" : "info"}>
                    {ofxData ? "Extrato OFX" : "Google Sheets & Drive"}
                  </StatusBadge>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Conciliação automática via extrato bancário C6 / OFX ou
                  planilhas do Google Drive
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Strip */}
          <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-white/[0.01] border-b border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  step === "source"
                    ? "bg-[#003d9b] text-white"
                    : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                }`}
              >
                1
              </span>
              <span
                className={
                  step === "source"
                    ? "font-bold text-slate-900 dark:text-white"
                    : ""
                }
              >
                Origem do Arquivo
              </span>
              <span className="opacity-40">→</span>

              {/* Se for OFX, pula passo 2 */}
              {!ofxData && (
                <>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full ${
                      step === "mapping"
                        ? "bg-[#003d9b] text-white"
                        : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    2
                  </span>
                  <span
                    className={
                      step === "mapping"
                        ? "font-bold text-slate-900 dark:text-white"
                        : ""
                    }
                  >
                    Mapeamento
                  </span>
                  <span className="opacity-40">→</span>
                </>
              )}

              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  step === "preview"
                    ? "bg-[#003d9b] text-white"
                    : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                }`}
              >
                {ofxData ? 2 : 3}
              </span>
              <span
                className={
                  step === "preview"
                    ? "font-bold text-slate-900 dark:text-white"
                    : ""
                }
              >
                {ofxData ? "Conciliação & Prévia" : "Prévia & Confirmação"}
              </span>
            </div>

            {ofxData ? (
              <span className="text-[11px] font-mono text-[#0066ff] flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" />
                <span>{ofxData.bankName}</span>
                {ofxData.startDate && (
                  <span>
                    ({ofxData.startDate} a {ofxData.endDate})
                  </span>
                )}
              </span>
            ) : sheetData ? (
              <span className="text-[11px] font-mono text-[#0066ff] truncate max-w-[220px]">
                {sheetData.title}
              </span>
            ) : null}
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* ──────── STEP 1: SOURCE ──────── */}
            {step === "source" && (
              <div className="space-y-6">
                {/* Source Selection Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                  <button
                    onClick={() => setSourceType("ofx")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                      sourceType === "ofx"
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-[#0066ff]" />
                    <span>Extrato C6 / OFX</span>
                  </button>
                  <button
                    onClick={() => setSourceType("drive")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                      sourceType === "drive"
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <span>Google Drive</span>
                  </button>
                  <button
                    onClick={() => setSourceType("url")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                      sourceType === "url"
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 text-[#0066ff]" />
                    <span>Link do Sheets</span>
                  </button>
                  <button
                    onClick={() => setSourceType("file")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                      sourceType === "file"
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Upload className="w-4 h-4 text-purple-500" />
                    <span>Arquivo CSV</span>
                  </button>
                </div>

                {/* TAB: EXTRATO BANCÁRIO OFX (C6 BANK & BANCOS) */}
                {sourceType === "ofx" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0066ff]/10 via-[#0066ff]/5 to-transparent border border-[#0066ff]/20 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#0066ff]/10 text-[#0066ff] flex items-center justify-center shrink-0 mt-0.5">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          Conciliação Automática de Extrato Bancário (.OFX)
                        </span>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                          No Web Banking ou App do{" "}
                          <strong>C6 Bank Empresas (PJ)</strong>, acesse{" "}
                          <strong>
                            Conta &gt; Extrato &gt; Exportar Extrato &gt;
                            Formato OFX
                          </strong>
                          . O arquivo traz datas exatas, identificadores únicos
                          (FITID) e valores de Pix, cartões e transferências.
                        </p>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 dark:border-white/15 rounded-2xl p-8 text-center space-y-3 hover:border-[#0066ff] transition-colors">
                      <Landmark className="w-9 h-9 text-[#0066ff] mx-auto opacity-80" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {selectedOfxFile
                            ? selectedOfxFile.name
                            : "Arraste ou selecione o arquivo .OFX do C6 Bank"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Compatível com C6 Bank, Itaú, Nubank, Inter, Bradesco
                          e Santander
                        </p>
                      </div>

                      <input
                        type="file"
                        accept=".ofx,.qfx,text/plain"
                        className="hidden"
                        id="ofx-file-input"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setSelectedOfxFile(file);
                            handleProcessOfx(file);
                          }
                        }}
                      />

                      <label
                        htmlFor="ofx-file-input"
                        className="inline-block px-5 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                      >
                        {selectedOfxFile
                          ? "Trocar Arquivo OFX"
                          : "Selecionar Extrato .OFX"}
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Prevenção de duplicidade (FITID)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                        <Sparkles className="w-3.5 h-3.5 text-[#0066ff] shrink-0" />
                        <span>Sugestão inteligente de categorias</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>Processamento local seguro</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: GOOGLE DRIVE */}
                {sourceType === "drive" && (
                  <div className="space-y-4">
                    {driveStatus?.connected ? (
                      <>
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>
                              Conectado com{" "}
                              <strong className="text-emerald-700 dark:text-emerald-300">
                                {driveStatus.email}
                              </strong>
                            </span>
                          </div>
                          <button
                            onClick={() => refetchDrive()}
                            className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                          >
                            Atualizar lista
                          </button>
                        </div>

                        {/* Search in drive */}
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Buscar planilha no seu Google Drive..."
                            value={driveSearch}
                            onChange={(e) => setDriveSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003d9b]"
                          />
                        </div>

                        {/* List of files */}
                        {isDriveLoading ? (
                          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
                            <Loader2 className="w-6 h-6 animate-spin text-[#0066ff]" />
                            <span>
                              Carregando planilhas do seu Google Drive...
                            </span>
                          </div>
                        ) : driveStatus.files.length === 0 ? (
                          <div className="py-10 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6">
                            Nenhuma planilha encontrada no Google Drive. Cole o
                            link na aba &quot;Link do Sheets&quot;.
                          </div>
                        ) : (
                          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                            {driveStatus.files
                              .filter((f) =>
                                f.name
                                  .toLowerCase()
                                  .includes(driveSearch.toLowerCase()),
                              )
                              .map((file) => (
                                <div
                                  key={file.id}
                                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-4 transition-colors"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                                      <FileSpreadsheet className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                        {file.name}
                                      </p>
                                      <p className="text-[10px] text-slate-400 font-mono">
                                        Modificado em{" "}
                                        {file.modifiedTime
                                          ? new Date(
                                              file.modifiedTime,
                                            ).toLocaleDateString("pt-BR")
                                          : "—"}
                                      </p>
                                    </div>
                                  </div>

                                  <Button
                                    variant="primary"
                                    size="sm"
                                    disabled={readSheet.isPending}
                                    onClick={() => handleLoadFromDrive(file.id)}
                                  >
                                    {readSheet.isPending ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <span>Selecionar</span>
                                    )}
                                  </Button>
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Not Connected Banner */
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/[0.03] dark:to-white/[0.01] border border-slate-200 dark:border-white/10 text-center space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#0066ff]/10 text-[#0066ff] mx-auto flex items-center justify-center">
                          <Layers className="w-6 h-6" />
                        </div>
                        <div className="max-w-md mx-auto space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Conecte sua Conta do Google
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Vincule o Google Drive para buscar suas planilhas
                            diretamente por aqui, com atualização em tempo real.
                          </p>
                        </div>

                        <div className="pt-2">
                          <a
                            href="/api/auth/google/connect?returnUrl=/os/finance/transactions"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold transition-all shadow-md"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Conectar Google Drive / Sheets</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: GOOGLE SHEETS LINK */}
                {sourceType === "url" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Link Compartilhado do Google Sheets
                      </label>
                      <input
                        type="url"
                        placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs.../edit"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003d9b]"
                      />
                      <p className="text-[11px] text-slate-400">
                        Dica: Certifique-se de que a planilha está configurada
                        como{" "}
                        <em>&quot;Qualquer pessoa com o link pode ler&quot;</em>{" "}
                        caso sua conta Google não esteja conectada.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      disabled={readSheet.isPending || !urlInput.trim()}
                      onClick={handleLoadFromUrl}
                      leadingIcon={
                        readSheet.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )
                      }
                    >
                      {readSheet.isPending
                        ? "Acessando Planilha..."
                        : "Carregar Planilha"}
                    </Button>
                  </div>
                )}

                {/* TAB: LOCAL CSV FILE */}
                {sourceType === "file" && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 dark:border-white/15 rounded-2xl p-8 text-center space-y-3 hover:border-[#0066ff] transition-colors">
                      <Upload className="w-8 h-8 text-purple-500 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {selectedFile
                            ? selectedFile.name
                            : "Clique para selecionar o arquivo CSV"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Exportações do Google Sheets, Excel (.csv) e extratos
                          tabulados
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        id="csv-file-input"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                      <label
                        htmlFor="csv-file-input"
                        className="inline-block px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        {selectedFile
                          ? "Alterar Arquivo"
                          : "Escolher Arquivo .csv"}
                      </label>
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      disabled={readSheet.isPending || !selectedFile}
                      onClick={handleLoadFromFile}
                      leadingIcon={
                        readSheet.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )
                      }
                    >
                      {readSheet.isPending
                        ? "Processando..."
                        : "Processar Arquivo CSV"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ──────── STEP 2: MAPPING (PLANILHAS) ──────── */}
            {step === "mapping" && sheetData && (
              <div className="space-y-6">
                {/* Sheet Tabs selector if available */}
                {sheetData.sheetTabs && sheetData.sheetTabs.length > 1 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Aba da Planilha:
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {sheetData.sheetTabs.map((tab) => (
                        <button
                          key={tab.title}
                          onClick={() => handleSwitchSheetTab(tab.title)}
                          disabled={readSheet.isPending}
                          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                            sheetData.activeSheet === tab.title
                              ? "bg-[#003d9b] text-white shadow-sm"
                              : "bg-slate-200/70 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {tab.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Header Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      A primeira linha contém cabeçalhos?
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Se ativado, a linha de títulos será desconsiderada nos
                      lançamentos
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasHeader}
                    onChange={(e) => setHasHeader(e.target.checked)}
                    className="w-4 h-4 rounded text-[#003d9b] focus:ring-[#003d9b]"
                  />
                </div>

                {/* Column Mapping Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Descrição */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Coluna de Descrição{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <StatusBadge size="sm" tone="info">
                        Obrigatório
                      </StatusBadge>
                    </div>
                    <select
                      value={colDescription}
                      onChange={(e) =>
                        setColDescription(Number(e.target.value))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <option value={-1}>-- Selecione a Coluna --</option>
                      {headers.map((h) => (
                        <option key={h.index} value={h.index}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Valor */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Coluna de Valor (R$){" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <StatusBadge size="sm" tone="info">
                        Obrigatório
                      </StatusBadge>
                    </div>
                    <select
                      value={colAmount}
                      onChange={(e) => setColAmount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <option value={-1}>-- Selecione a Coluna --</option>
                      {headers.map((h) => (
                        <option key={h.index} value={h.index}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Tipo de Lançamento (Receita / Despesa)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTypeMode("auto")}
                        className={`text-xs py-2 px-2.5 rounded-xl font-semibold border ${
                          typeMode === "auto"
                            ? "bg-[#003d9b] text-white border-transparent"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        Auto (Sinal +/-)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTypeMode("column")}
                        className={`text-xs py-2 px-2.5 rounded-xl font-semibold border ${
                          typeMode === "column"
                            ? "bg-[#003d9b] text-white border-transparent"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        Usar Coluna
                      </button>
                      <button
                        type="button"
                        onClick={() => setTypeMode("in")}
                        className={`text-xs py-2 px-2.5 rounded-xl font-semibold border ${
                          typeMode === "in"
                            ? "bg-emerald-600 text-white border-transparent"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        Tudo Receita (+)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTypeMode("out")}
                        className={`text-xs py-2 px-2.5 rounded-xl font-semibold border ${
                          typeMode === "out"
                            ? "bg-rose-600 text-white border-transparent"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        Tudo Despesa (-)
                      </button>
                    </div>

                    {typeMode === "column" && (
                      <select
                        value={colType}
                        onChange={(e) => setColType(Number(e.target.value))}
                        className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                      >
                        <option value={-1}>
                          -- Selecione a Coluna de Tipo --
                        </option>
                        {headers.map((h) => (
                          <option key={h.index} value={h.index}>
                            {h.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Categoria */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Categoria do Lançamento
                    </label>
                    <select
                      value={colCategory}
                      onChange={(e) => setColCategory(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <option value={-1}>
                        -- Usar Categoria Padrão Fixa --
                      </option>
                      {headers.map((h) => (
                        <option key={h.index} value={h.index}>
                          Coluna: {h.label}
                        </option>
                      ))}
                    </select>

                    {colCategory === -1 && (
                      <select
                        value={defaultCategory}
                        onChange={(e) => setDefaultCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                      >
                        {DEFAULT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Data */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Coluna de Data (Opcional)
                    </label>
                    <select
                      value={colDate}
                      onChange={(e) => setColDate(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <option value={-1}>
                        -- Sem Data (Usar data de hoje) --
                      </option>
                      {headers.map((h) => (
                        <option key={h.index} value={h.index}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ──────── STEP 3: PREVIEW & CONCILIAÇÃO ──────── */}
            {step === "preview" && (
              <div className="space-y-6">
                {/* Se for OFX, exibe banner do banco */}
                {ofxData && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0066ff]/10 text-[#0066ff] flex items-center justify-center shrink-0">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {ofxData.bankName}
                          </span>
                          <StatusBadge size="sm" tone="accent">
                            Extrato Conciliável
                          </StatusBadge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Período: {ofxData.startDate || "Início"} até{" "}
                          {ofxData.endDate || "Fim"}
                          {ofxData.accountId &&
                            ` · Conta: ${ofxData.accountId}`}
                        </p>
                      </div>
                    </div>

                    {ofxData.balance !== undefined && (
                      <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-white/10 sm:pl-4">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Saldo no Extrato
                        </span>
                        <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                          {formatCurrency(ofxData.balance)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                      Lançamentos {ofxData ? "Selecionados" : "Válidos"}
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                      {totals.count} / {totals.totalCount}
                    </span>
                    {totals.alreadyImportedCount > 0 && (
                      <span className="text-[10px] text-amber-500 font-medium block mt-0.5">
                        {totals.alreadyImportedCount} já conciliado(s)
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block uppercase">
                      Total Receitas (+)
                    </span>
                    <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1 block">
                      {formatCurrency(totals.totalIn)}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block uppercase">
                      Total Despesas (-)
                    </span>
                    <span className="text-xl font-extrabold text-rose-700 dark:text-rose-300 mt-1 block">
                      {formatCurrency(totals.totalOut)}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0066ff]/10 border border-[#0066ff]/20">
                    <span className="text-[11px] font-semibold text-[#60a5fa] block uppercase">
                      Saldo Líquido do Lote
                    </span>
                    <span className="text-xl font-extrabold text-[#0066ff] dark:text-blue-400 mt-1 block">
                      {formatCurrency(totals.balance)}
                    </span>
                  </div>
                </div>

                {/* ──────── TABELA DE TRANSAÇÕES OFX (CONCILIAÇÃO) ──────── */}
                {ofxData ? (
                  <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleToggleAllOfx}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        >
                          {ofxItems.every((i) => i.selected) ? (
                            <CheckSquare className="w-4 h-4 text-[#0066ff]" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                          <span>Selecionar Todas</span>
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Itens já conciliados vêm desmarcados por segurança
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="px-4 py-2 w-8">Sel.</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Data</th>
                            <th className="px-4 py-2">Descrição no Extrato</th>
                            <th className="px-4 py-2">Categoria Sugerida</th>
                            <th className="px-4 py-2 text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {ofxItems.map((item, idx) => (
                            <tr
                              key={item.fitid}
                              className={`transition-colors ${
                                item.alreadyImported
                                  ? "bg-slate-50/70 dark:bg-white/[0.01] opacity-60"
                                  : "hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                              }`}
                            >
                              <td className="px-4 py-2.5">
                                <input
                                  type="checkbox"
                                  checked={!!item.selected}
                                  onChange={() => handleToggleOfxSelect(idx)}
                                  className="w-4 h-4 rounded text-[#003d9b] focus:ring-[#003d9b] cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-2.5">
                                {item.alreadyImported ? (
                                  <StatusBadge size="sm" tone="neutral">
                                    Já Conciliado
                                  </StatusBadge>
                                ) : (
                                  <StatusBadge
                                    size="sm"
                                    tone={
                                      item.type === "in" ? "success" : "danger"
                                    }
                                  >
                                    {item.type === "in" ? "Receita" : "Despesa"}
                                  </StatusBadge>
                                )}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                {item.displayDate}
                              </td>
                              <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-white max-w-[240px] truncate">
                                {item.memo}
                              </td>
                              <td className="px-4 py-2.5">
                                <select
                                  value={item.category}
                                  onChange={(e) =>
                                    handleUpdateOfxCategory(idx, e.target.value)
                                  }
                                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none"
                                >
                                  {DEFAULT_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td
                                className={`px-4 py-2.5 text-right font-bold whitespace-nowrap ${
                                  item.type === "in"
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {formatCurrency(item.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* ──────── TABELA DE PLANILHA NORMAL ──────── */
                  <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        Amostra dos Dados Mapeados (Primeiros{" "}
                        {Math.min(10, totals.count)} itens)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Revise antes de salvar
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="px-4 py-2">Tipo</th>
                            <th className="px-4 py-2">Descrição</th>
                            <th className="px-4 py-2">Categoria</th>
                            <th className="px-4 py-2">Data</th>
                            <th className="px-4 py-2 text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {parsedSheetTransactions
                            .filter((t) => t.isValid)
                            .slice(0, 10)
                            .map((t, i) => (
                              <tr
                                key={i}
                                className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                              >
                                <td className="px-4 py-2.5">
                                  <StatusBadge
                                    size="sm"
                                    tone={
                                      t.type === "in" ? "success" : "danger"
                                    }
                                  >
                                    {t.type === "in" ? "Receita" : "Despesa"}
                                  </StatusBadge>
                                </td>
                                <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-white">
                                  {t.description}
                                </td>
                                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">
                                  {t.category}
                                </td>
                                <td className="px-4 py-2.5 text-slate-400 font-mono text-[11px]">
                                  {t.customDate
                                    ? new Date(t.customDate).toLocaleDateString(
                                        "pt-BR",
                                      )
                                    : "Hoje"}
                                </td>
                                <td
                                  className={`px-4 py-2.5 text-right font-bold ${
                                    t.type === "in"
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-rose-600 dark:text-rose-400"
                                  }`}
                                >
                                  {formatCurrency(t.amount)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-white/[0.02]">
            {step === "source" ? (
              <Button variant="secondary" size="md" onClick={onClose}>
                Cancelar
              </Button>
            ) : step === "mapping" ? (
              <Button
                variant="secondary"
                size="md"
                leadingIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setStep("source")}
              >
                Voltar à Origem
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                leadingIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => {
                  if (ofxData) {
                    setStep("source");
                  } else {
                    setStep("mapping");
                  }
                }}
              >
                {ofxData ? "Trocar Extrato OFX" : "Ajustar Mapeamento"}
              </Button>
            )}

            {step === "source" ? null : step === "mapping" ? (
              <Button
                variant="primary"
                size="md"
                trailingIcon={<ArrowRight className="w-4 h-4" />}
                disabled={colDescription === -1 || colAmount === -1}
                onClick={() => {
                  if (colDescription === -1 || colAmount === -1) {
                    toast.error(
                      "Selecione as colunas obrigatórias de Descrição e Valor.",
                    );
                    return;
                  }
                  setStep("preview");
                }}
              >
                Avançar para Prévia
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                disabled={batchCreate.isPending || totals.count === 0}
                leadingIcon={
                  batchCreate.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )
                }
                onClick={handleConfirmImport}
              >
                {batchCreate.isPending
                  ? "Conciliando Lançamentos..."
                  : ofxData
                    ? `Confirmar e Conciliar ${totals.count} Lançamento(s)`
                    : `Confirmar Importação de ${totals.count} Transações`}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
