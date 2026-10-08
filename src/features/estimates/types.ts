export type EstimateStatus =
  "draft" | "in_review" | "sent" | "approved" | "rejected";

export type ComplexityLevel = "low" | "medium" | "high" | "critical";

export type SoftwarePlatform =
  | "web_saas"
  | "mobile_ios"
  | "mobile_android"
  | "backend_api"
  | "desktop"
  | "landing_page"
  | "integrations";

export interface SoftwareModule {
  id: string;
  name: string;
  description: string;
  screensCount: number;
  complexity: ComplexityLevel;
  hoursEstimated: number;
}

export interface HourBreakdown {
  uiUxDesign: number;
  frontend: number;
  backend: number;
  integrations: number;
  qaTesting: number;
  devopsDeploy: number;
}

export interface SoftwareEstimate {
  id: string;
  proposalNumber: string;
  title: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientId?: string;
  projectId?: string;
  status: EstimateStatus;
  platforms: SoftwarePlatform[];
  architectureSummary?: string;
  modules: SoftwareModule[];
  hoursBreakdown: HourBreakdown;
  totalHours: number;
  hourlyRate: number;
  internalHourlyCost: number;
  contingencyPercent: number;
  cloudInfrastructureMonthly?: number;
  discount: number;
  totalPrice: number;
  totalInternalCost: number;
  projectedProfit: number;
  projectedMarginPercent: number;
  deliveryWeeks: number;
  sprintsCount: number;
  methodology: "scrum_agile" | "kanban_continuous" | "turnkey_milestones";
  paymentTerms: string;
  warrantyDays: number;
  outOfScope?: string;
  notes?: string;
  validUntil: string;
  createdAt?: { seconds: number; nanoseconds: number } | string;
  updatedAt?: { seconds: number; nanoseconds: number } | string;
}

export type CreateEstimateInput = Omit<
  SoftwareEstimate,
  "id" | "createdAt" | "updatedAt"
>;

export const ESTIMATE_STATUS_META: Record<
  EstimateStatus,
  { label: string; tone: "neutral" | "warning" | "info" | "success" | "danger" }
> = {
  draft: { label: "Rascunho", tone: "neutral" },
  in_review: { label: "Em Revisão Interna", tone: "warning" },
  sent: { label: "Enviado ao Cliente", tone: "info" },
  approved: { label: "Aprovado", tone: "success" },
  rejected: { label: "Recusado", tone: "danger" },
};

export const PLATFORM_LABELS: Record<SoftwarePlatform, string> = {
  web_saas: "Web / SaaS Enterprise",
  mobile_ios: "Mobile iOS",
  mobile_android: "Mobile Android",
  backend_api: "Backend & APIs REST/GraphQL",
  desktop: "Desktop Electron/Windows",
  landing_page: "Landing Page de Alta Conversão",
  integrations: "Integrações & Webhooks",
};

export const COMPLEXITY_LABELS: Record<ComplexityLevel, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};
