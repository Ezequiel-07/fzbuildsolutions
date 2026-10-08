import type { SoftwarePlatform, SoftwareModule, HourBreakdown } from "../types";

export interface EstimatePreset {
  id: string;
  name: string;
  description: string;
  platforms: SoftwarePlatform[];
  architectureSummary: string;
  modules: Omit<SoftwareModule, "id">[];
  hoursBreakdown: HourBreakdown;
  deliveryWeeks: number;
  sprintsCount: number;
  paymentTerms: string;
  warrantyDays: number;
  outOfScope: string;
}

export const ESTIMATE_PRESETS: EstimatePreset[] = [
  {
    id: "web_saas_enterprise",
    name: "SaaS Web Enterprise (Cloud & Multi-tenant)",
    description:
      "Plataforma Web completa com autenticação segura, painel administrativo, dashboards analíticos, relatórios e controle de acesso por níveis.",
    platforms: ["web_saas", "backend_api"],
    architectureSummary:
      "Frontend em Next.js 15 / React 19 com Tailwind CSS, Backend Serverless em Node.js/TypeScript, Banco de Dados Relacional PostgreSQL / Firestore em Cloud, CI/CD automatizado.",
    modules: [
      {
        name: "Autenticação, MFA & Controle de Acesso (RBAC)",
        description:
          "Login social (Google, Email/Senha), recuperação de senha, autenticação em duas etapas e permissões granulares por cargo.",
        screensCount: 4,
        complexity: "medium",
        hoursEstimated: 32,
      },
      {
        name: "Dashboard Executivo & Métricas em Tempo Real",
        description:
          "Visualização de KPIs, gráficos interativos de performance, comparativos de períodos e cards sumarizadores.",
        screensCount: 3,
        complexity: "medium",
        hoursEstimated: 28,
      },
      {
        name: "Módulo Operacional & Gestão de Dados (CRUD Enterprise)",
        description:
          "Listagem com filtros avançados, ordenação, paginação, formulários de cadastro e edição com validações rigorosas.",
        screensCount: 6,
        complexity: "high",
        hoursEstimated: 48,
      },
      {
        name: "Exportação de Relatórios & Central de Notificações",
        description:
          "Exportação de dados em PDF/Excel, histórico de auditoria e notificações em tempo real no app e por e-mail.",
        screensCount: 3,
        complexity: "medium",
        hoursEstimated: 24,
      },
      {
        name: "Configurações da Conta & Gestão de Usuários",
        description:
          "Perfil do usuário, troca de credenciais, convite de membros da equipe e personalização visual da empresa.",
        screensCount: 3,
        complexity: "low",
        hoursEstimated: 16,
      },
    ],
    hoursBreakdown: {
      uiUxDesign: 24,
      frontend: 56,
      backend: 40,
      integrations: 12,
      qaTesting: 16,
      devopsDeploy: 12,
    },
    deliveryWeeks: 6,
    sprintsCount: 3,
    paymentTerms:
      "40% de Entrada na Assinatura + 30% na Entrega da Homologação (Sprint 2) + 30% no Go-Live e Transferência de Acessos",
    warrantyDays: 90,
    outOfScope:
      "Custos diretos de servidores em nuvem (GCP/AWS cobrados direto do cliente), contratação de domínios e campanhas de marketing digital.",
  },
  {
    id: "mobile_app_with_web",
    name: "App Mobile (iOS & Android) + Painel Web",
    description:
      "Aplicativo nativo ou híbrido de alta performance para clientes finais, com sincronização em nuvem e painel web para a equipe administrativa.",
    platforms: ["mobile_ios", "mobile_android", "web_saas", "backend_api"],
    architectureSummary:
      "App em React Native / Expo, Painel Web em Next.js 15, APIs REST de alta disponibilidade, Notificações Push via Firebase Cloud Messaging, infraestrutura em Google Cloud.",
    modules: [
      {
        name: "App Mobile: Onboarding, Autenticação & Perfil",
        description:
          "Telas de boas-vindas, cadastro, biometria (FaceID / Fingerprint) e edição de perfil do usuário.",
        screensCount: 5,
        complexity: "medium",
        hoursEstimated: 36,
      },
      {
        name: "App Mobile: Feed / Catálogo & Interações Principais",
        description:
          "Navegação intuitiva, buscas em tempo real com filtros, detalhes de itens e ações de agendamento/pedido.",
        screensCount: 6,
        complexity: "high",
        hoursEstimated: 52,
      },
      {
        name: "App Mobile: Notificações Push & Histórico",
        description:
          "Recebimento de notificações com deep linking, histórico de mensagens e central de ajuda.",
        screensCount: 3,
        complexity: "medium",
        hoursEstimated: 24,
      },
      {
        name: "Painel Web Administrativo & Gestão de Conteúdo",
        description:
          "Dashboard de métricas, moderação de usuários, disparos de comunicados e monitoramento de atividades.",
        screensCount: 5,
        complexity: "medium",
        hoursEstimated: 44,
      },
    ],
    hoursBreakdown: {
      uiUxDesign: 32,
      frontend: 68,
      backend: 48,
      integrations: 20,
      qaTesting: 24,
      devopsDeploy: 16,
    },
    deliveryWeeks: 8,
    sprintsCount: 4,
    paymentTerms:
      "35% de Entrada + 25% na Sprint 2 (Validação UI/UX e APIs) + 20% na Homologação do App (Sprint 3) + 20% na Publicação nas Lojas (App Store e Google Play)",
    warrantyDays: 90,
    outOfScope:
      "Taxas anuais da conta de desenvolvedor Apple ($99/ano) e Google ($25 taxa única), produção de fotos/vídeos institucionais.",
  },
  {
    id: "system_integrations_automation",
    name: "Automação de Processos & Integrações de APIs",
    description:
      "Desenvolvimento de microsserviços sob medida para integrar ERPs, sistemas bancários, planilhas Google e canais de comunicação.",
    platforms: ["backend_api", "integrations", "web_saas"],
    architectureSummary:
      "Arquitetura baseada em eventos com Webhooks, filas seguras, APIs RESTful, persistência em Firestore e interface gerencial minimalista.",
    modules: [
      {
        name: "Mapeamento & Camada de Conexão com APIs Externas",
        description:
          "Implementação de clientes autenticados (OAuth2 / Token), tratamento de rate-limits, retries exponenciais e logs.",
        screensCount: 2,
        complexity: "high",
        hoursEstimated: 38,
      },
      {
        name: "Motor de Regras de Negócio & Transformação de Dados",
        description:
          "Validação de esquemas, normalização de registros, deduplicação de transações e conciliação contábil.",
        screensCount: 2,
        complexity: "high",
        hoursEstimated: 42,
      },
      {
        name: "Painel de Monitoramento & Logs de Auditoria",
        description:
          "Interface visual para ver status de sincronizações, reprocessamento manual de falhas e exportação de relatórios.",
        screensCount: 3,
        complexity: "medium",
        hoursEstimated: 26,
      },
    ],
    hoursBreakdown: {
      uiUxDesign: 12,
      frontend: 24,
      backend: 48,
      integrations: 36,
      qaTesting: 16,
      devopsDeploy: 12,
    },
    deliveryWeeks: 4,
    sprintsCount: 2,
    paymentTerms:
      "50% de Entrada na Contratação + 50% após Homologação e Entrada em Operação Piloto",
    warrantyDays: 90,
    outOfScope:
      "Custos de assinaturas e planos pagos de APIs de terceiros (ex: Twilio, gateways bancários, OpenAI).",
  },
];
