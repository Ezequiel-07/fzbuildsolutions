export interface OfxTransaction {
  fitid: string;
  type: "in" | "out";
  amount: number;
  date: string; // ISO date YYYY-MM-DDTHH:mm:ss.sssZ
  displayDate: string; // DD/MM/YYYY
  memo: string;
  category: string;
  bank?: string;
  selected?: boolean;
  alreadyImported?: boolean;
}

export interface OfxParseResult {
  bankName: string;
  bankId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  balance?: number;
  transactions: OfxTransaction[];
}

/**
 * Sugere uma categoria financeira baseada nas palavras-chave do extrato bancário
 */
export function suggestCategory(memo: string, type: "in" | "out"): string {
  const text = (memo || "").toLowerCase();

  // Receitas (Entradas)
  if (type === "in") {
    if (
      text.includes("mrr") ||
      text.includes("mensalidade") ||
      text.includes("recorrencia") ||
      text.includes("assinatura")
    ) {
      return "MRR / Mensalidade";
    }
    if (
      text.includes("projeto") ||
      text.includes("software") ||
      text.includes("app") ||
      text.includes("desenvolvimento") ||
      text.includes("fatura") ||
      text.includes("contrato") ||
      text.includes("sprint")
    ) {
      return "Pagamento de Projeto";
    }
    if (
      text.includes("consultoria") ||
      text.includes("mentoria") ||
      text.includes("advisor")
    ) {
      return "Consultoria";
    }
    return "Outros Recebimentos";
  }

  // Despesas (Saídas)
  if (
    text.includes("aws") ||
    text.includes("amazon web") ||
    text.includes("google cloud") ||
    text.includes("gcp") ||
    text.includes("vercel") ||
    text.includes("azure") ||
    text.includes("digitalocean") ||
    text.includes("cloudflare") ||
    text.includes("github") ||
    text.includes("supabase") ||
    text.includes("firebase") ||
    text.includes("host")
  ) {
    return "Infraestrutura Cloud";
  }

  if (
    text.includes("salario") ||
    text.includes("folha") ||
    text.includes("pro-labore") ||
    text.includes("pro labore") ||
    text.includes("fgts") ||
    text.includes("inss") ||
    text.includes("adiantamento") ||
    text.includes("beneficio")
  ) {
    return "Salários & Freelancers";
  }

  if (
    text.includes("google ads") ||
    text.includes("facebook") ||
    text.includes("meta ads") ||
    text.includes("linkedin ads") ||
    text.includes("anuncio") ||
    text.includes("marketing") ||
    text.includes("agencia")
  ) {
    return "Marketing & Vendas";
  }

  if (
    text.includes("adobe") ||
    text.includes("jetbrains") ||
    text.includes("chatgpt") ||
    text.includes("openai") ||
    text.includes("anthropic") ||
    text.includes("slack") ||
    text.includes("notion") ||
    text.includes("figma") ||
    text.includes("linear") ||
    text.includes("canva") ||
    text.includes("licenca") ||
    text.includes("software")
  ) {
    return "Software & Licenças";
  }

  if (
    text.includes("darf") ||
    text.includes("das ") ||
    text.includes("das-") ||
    text.includes("simples nacional") ||
    text.includes("tributo") ||
    text.includes("imposto") ||
    text.includes("irrf") ||
    text.includes("iss") ||
    text.includes("gps")
  ) {
    return "Impostos & Taxas";
  }

  if (
    text.includes("tarifa") ||
    text.includes("manutencao") ||
    text.includes("ted ") ||
    text.includes("doc ") ||
    text.includes("anuidade") ||
    text.includes("iof") ||
    text.includes("juros") ||
    text.includes("pacote servicos") ||
    text.includes("contabilidade") ||
    text.includes("contador") ||
    text.includes("aluguel") ||
    text.includes("coworking") ||
    text.includes("cartorio")
  ) {
    return "Administrativo";
  }

  return "Outros Gastos";
}

/**
 * Converte data no formato OFX (ex: 20261005120000[-3:BRT] ou 20261005) para ISO string e DD/MM/YYYY
 */
function parseOfxDate(dateStr: string): { iso: string; display: string } {
  if (!dateStr || dateStr.length < 8) {
    const now = new Date();
    return {
      iso: now.toISOString(),
      display: now.toLocaleDateString("pt-BR"),
    };
  }

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  const iso = `${year}-${month}-${day}T12:00:00.000Z`;
  const display = `${day}/${month}/${year}`;

  return { iso, display };
}

/**
 * Extrai o conteúdo de uma tag no padrão OFX (compatível com XML fechado e SGML aberto)
 */
function extractTagValue(xmlBlock: string, tagName: string): string {
  // 1. Tentar formato XML padrão: <TAG>VALOR</TAG>
  const closedRegex = new RegExp(
    `<${tagName}>([\\s\\S]*?)<\\/${tagName}>`,
    "i",
  );
  const closedMatch = xmlBlock.match(closedRegex);
  if (closedMatch && closedMatch[1]) {
    return closedMatch[1].trim();
  }

  // 2. Tentar formato SGML: <TAG>VALOR\n (sem tag de fechamento)
  const openRegex = new RegExp(`<${tagName}>([^<\\r\\n]+)`, "i");
  const openMatch = xmlBlock.match(openRegex);
  if (openMatch && openMatch[1]) {
    return openMatch[1].trim();
  }

  return "";
}

/**
 * Parser de arquivos OFX (Extratos bancários brasileiros e internacionais)
 */
export function parseOfxString(ofxRaw: string): OfxParseResult {
  if (!ofxRaw || !ofxRaw.trim()) {
    throw new Error("Arquivo OFX vazio ou ilegível.");
  }

  // Normalizar quebras de linha
  const clean = ofxRaw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Identificar nome do banco
  let bankName = extractTagValue(clean, "ORG");
  const bankId = extractTagValue(clean, "BANKID");
  const accountId = extractTagValue(clean, "ACCTID");

  if (!bankName) {
    if (bankId === "336" || clean.toUpperCase().includes("C6")) {
      bankName = "C6 Bank";
    } else if (bankId === "260" || clean.toUpperCase().includes("NUBANK")) {
      bankName = "Nubank";
    } else if (bankId === "341" || clean.toUpperCase().includes("ITAU")) {
      bankName = "Itaú";
    } else if (bankId === "237" || clean.toUpperCase().includes("BRADESCO")) {
      bankName = "Bradesco";
    } else if (bankId === "077" || clean.toUpperCase().includes("INTER")) {
      bankName = "Banco Inter";
    } else if (bankId === "033" || clean.toUpperCase().includes("SANTANDER")) {
      bankName = "Santander";
    } else if (bankId === "001" || clean.toUpperCase().includes("BRASIL")) {
      bankName = "Banco do Brasil";
    } else {
      bankName = "Extrato Bancário";
    }
  }

  // Extrair período
  const dtStartRaw = extractTagValue(clean, "DTSTART");
  const dtEndRaw = extractTagValue(clean, "DTEND");
  const startDate = dtStartRaw ? parseOfxDate(dtStartRaw).display : undefined;
  const endDate = dtEndRaw ? parseOfxDate(dtEndRaw).display : undefined;

  // Extrair saldo final
  const balAmtRaw = extractTagValue(clean, "BALAMT");
  const balance = balAmtRaw
    ? parseFloat(balAmtRaw.replace(",", "."))
    : undefined;

  // Extrair transações (<STMTTRN>...</STMTTRN> ou blocos <STMTTRN>)
  const transactions: OfxTransaction[] = [];
  const stmtTrnBlocks = clean.split(/<STMTTRN>/i);

  // O primeiro elemento do split é o cabeçalho antes do primeiro STMTTRN
  for (let i = 1; i < stmtTrnBlocks.length; i++) {
    const block = stmtTrnBlocks[i];

    // Se houver tag de fechamento </STMTTRN>, pega apenas o conteúdo interno
    const trnContent = block.split(/<\/STMTTRN>/i)[0];

    const trnTypeRaw = extractTagValue(trnContent, "TRNTYPE").toUpperCase();
    const dtPostedRaw = extractTagValue(trnContent, "DTPOSTED");
    const trnAmtRaw = extractTagValue(trnContent, "TRNAMT");
    const fitid =
      extractTagValue(trnContent, "FITID") || `OFX_${i}_${Date.now()}`;
    const memo =
      extractTagValue(trnContent, "MEMO") ||
      extractTagValue(trnContent, "NAME") ||
      `Movimentação bancária #${i}`;

    const parsedAmount = parseFloat(trnAmtRaw.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount === 0) continue;

    // Determinar se é entrada ou saída
    // No OFX padrão: crédito é positivo (> 0), débito é negativo (< 0)
    let type: "in" | "out" = "out";
    if (trnTypeRaw === "CREDIT" || trnTypeRaw === "DEP" || parsedAmount > 0) {
      type = "in";
    } else {
      type = "out";
    }

    const { iso, display } = parseOfxDate(dtPostedRaw);
    const positiveAmount = Math.abs(parsedAmount);
    const category = suggestCategory(memo, type);

    transactions.push({
      fitid,
      type,
      amount: positiveAmount,
      date: iso,
      displayDate: display,
      memo: memo.trim(),
      category,
      bank: bankName,
      selected: true,
      alreadyImported: false,
    });
  }

  return {
    bankName,
    bankId: bankId || undefined,
    accountId: accountId || undefined,
    startDate,
    endDate,
    balance: isNaN(balance as number) ? undefined : balance,
    transactions,
  };
}
