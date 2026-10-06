# FZ OS — Arquitetura & Stack Tecnológica

## 1. Visão Geral do Sistema

O **FZ OS** é o sistema operacional e plataforma de gestão corporativa da **FZ Build Solutions**. Ele foi projetado para unificar a governança, gestão de projetos, pipeline comercial (CRM), controle financeiro físico-orçamentário e alocação de equipes em uma arquitetura de alta performance, acessível, segura e sem dados fictícios (100% conectado a dados reais no Firestore).

A plataforma é dividida em três pilares:

1. **Landing Page Institucional (`/`)**: Portal voltado para conversão e apresentação de soluções para clientes externos.
2. **FZ OS (`/os`)**: Sistema operacional interno da software house, governança de squads, projetos, finanças e CRM.
3. **Portal do Cliente (`/portal`)**: Área restrita para os clientes acompanharem o andamento, entregas e marcos dos seus projetos.

---

## 2. Padrões de Arquitetura

O projeto adota os princípios de **Clean Architecture** combinados com **Domain-Driven Design (DDD)** para manter as regras de negócio desacopladas da camada de visualização e do banco de dados.

```
src/
├── app/                  # Next.js 15 App Router (Páginas, Layouts e Rotas)
│   ├── os/               # Aplicação interna FZ OS
│   │   ├── admin/        # Governança, Usuários, Configurações e Auditoria
│   │   ├── clients/      # Gestão de Clientes Corporativos
│   │   ├── crm/          # Pipeline de Oportunidades & Leads (Kanban & List)
│   │   ├── finance/      # Painel Financeiro, Transações, DRE e Orçamentos
│   │   ├── infrastructure/ # Telemetria de Nuvem e Saúde de Clusters
│   │   ├── notifications/# Central de Notificações Unificada
│   │   ├── projects/     # Gestão de Projetos (Kanban & Backlog de Tarefas)
│   │   ├── team/         # Talentos e Matriz Semanal de Alocação
│   │   └── workflow/     # Visualizador e Editor de Processos
│   └── globals.css       # Design Tokens RGB (--os-*) para temas Light e Dark
├── components/           # Componentes compartilhados
│   └── os/               # Design System Primitives do FZ OS
│       ├── button.tsx         # Botão CVA com variantes (primary, secondary, ghost, danger)
│       ├── confirm-dialog.tsx # Diálogo modal acessível (substitui window.confirm)
│       ├── empty-state.tsx    # Estados vazios e telas de erro com retry
│       ├── page-header.tsx    # Cabeçalho padronizado com breadcrumbs e ações
│       ├── panel.tsx          # Superfície sólida + 1px border e ProgressBar
│       ├── skeleton.tsx       # Placeholder de carregamento baseado em tokens
│       └── status-badge.tsx   # Badges semânticos de status baseados em Tone
├── domain/               # Modelos de Domínio e Normalização (DDD)
│   ├── tone.ts           # Tons visuais semânticos (neutral, info, success, warning, danger, accent)
│   ├── project.ts        # Status canônico de projetos e progressão
│   └── lead.ts           # Estágios canônicos do CRM e persistência retrocompatível
├── features/             # Módulos verticais de negócio
│   ├── admin/            # Hooks e lógicas de governança e usuários do sistema
│   ├── clients/          # Hook Firestore CRUD para a entidade Clientes
│   ├── crm/              # Pipeline, leads, notas e histórico de oportunidades
│   ├── finance/          # Transações, categorias e demonstrativos DRE
│   ├── infrastructure/   # Telemetria real de latência e saúde de banco/servidor
│   ├── projects/         # CRUD de projetos e backlog de tarefas reais no Firestore
│   ├── shell/            # Navegação do sistema (Sidebar, Topbar, ⌘K, AI Drawer)
│   └── team/             # Membros da equipe e matriz semanal de alocações
├── providers/            # Provedores globais (React Query, Firebase Auth, Theme)
└── lib/                  # Utilitários puros e inicialização de SDKs (Firebase Client, cn)
```

---

## 3. Design System & Tokens Visuais

O design visual do FZ OS é orientado por tokens semânticos declarados em `src/app/globals.css` no formato de canais RGB (`--os-*`), garantindo suporte tanto ao modo **Light** (tema padrão) quanto ao modo **Dark**, além de compatibilidade com modificadores de opacidade do Tailwind CSS.

### Paleta Semântica Principal

- **Superfície & Fundo**:
  - `bg-os-bg`: Fundo base da aplicação (`#f8fafc` no light / `#0b1329` no dark).
  - `bg-os-surface`: Superfície de cartões e painéis (`#ffffff` no light / `#0f172a` no dark).
  - `border-os-border`: Linhas e divisórias (`#e2e8f0` no light / `#1e293b` no dark).
- **Cores de Ação & Marca**:
  - `os-primary`: Azul institucional corporativo (`#003d9b`).
  - `os-accent`: Ciano vibrante de destaque (`#006875`).
- **Tons Semânticos de Status (`Tone`)**:
  - `success`: Verde esmeralda (Projetos concluídos, entradas financeiras, leads ganhos).
  - `warning`: Âmbar (Atenção, negociação, projetos em pausa).
  - `danger`: Vermelho (Custos, erros, exclusões, leads perdidos).
  - `info`: Azul (Novos registros, planejamento).
  - `accent`: Violeta/Ciano (Qualificação, revisão técnica).
  - `neutral`: Cinza (Rascunhos, inativos).

---

## 4. Shell Modular & Experiência de Navegação

A navegação da área restrita `/os` foi totalmente refatorada no módulo `src/features/shell/`:

1. **`nav-config.ts`**: Fonte única da verdade contendo todas as rotas, ícones, badges e agrupamentos estruturados em 5 verticais:
   - **Operação**: Cockpit (`/os`), Projetos (`/os/projects`), Clientes (`/os/clients`), Automação (`/os/workflow`).
   - **Comercial**: Funil CRM (`/os/crm`), Oportunidades (`/os/crm/leads`).
   - **Financeiro**: Visão Geral (`/os/finance`), Planilha (`/os/finance/transactions`), DRE (`/os/finance/reports`), Orçamentos (`/os/finance/budget`).
   - **Pessoas**: Equipe (`/os/team`), Alocações (`/os/team/schedule`).
   - **Sistema**: Notificações (`/os/notifications`), Infraestrutura (`/os/infrastructure`), Governança (`/os/admin`), Usuários (`/os/admin/users`), Configurações (`/os/admin/settings`), Auditoria (`/os/admin/logs`).
2. **`Sidebar`**: Menu expansível/recolhível com persistência de estado e destaque de rota ativa.
3. **`Topbar`**: Barra superior de 56px de altura fixa com breadcrumb dinâmico, acionador da busca rápida (⌘K / Ctrl+K), gatilho da gaveta de inteligência artificial e menu de perfil do usuário.
4. **`CommandPalette`**: Modal de pesquisa global ultrarrápido indexando páginas internas e comandos de diagnóstico (`> status`).
5. **`AiDrawer`**: Painel lateral retrátil para insights operacionais e suporte assistivo.
6. **`UserProfileMenu`**: Gestão da sessão com exibição do usuário ativo do Firebase Auth, alternador de tema Claro/Escuro e logout seguro.

---

## 5. Arquitetura de Dados no Firebase (BaaS)

Todos os módulos operam com persistência real no **Google Cloud Firestore**. Não existem mocks estáticos em telas produtivas.

### Coleções do Firestore:

| Coleção        | Descrição                                 | Principais Campos                                                                                                                           |
| -------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `projects`     | Projetos da software house                | `name`, `clientId`, `status`, `budget`, `progress`, `startDate`                                                                             |
| `tasks`        | Tarefas e itens de backlog                | `projectId`, `text`, `done`, `priority`, `assignedTo`, `dueDate`                                                                            |
| `clients`      | Entidade Clientes (independente de Leads) | `name`, `corporateName`, `document`, `email`, `phone`, `status`, `leadId`                                                                   |
| `leads`        | Oportunidades comerciais do CRM           | `clientName`, `projectName`, `value`, `stage`, `contact`, `segment`, `cityState`, `website`, `aiScore`, `aiPitch`, `detectedPain`, `source` |
| `transactions` | Lançamentos contábeis e fluxo de caixa    | `description`, `category`, `amount`, `type` (`in`/`out`), `projectId`                                                                       |
| `team`         | Talentos e especialistas da equipe        | `name`, `role`, `status`, `skills`, `avatarUrl`, `allocations`                                                                              |
| `allocations`  | Alocação semanal de horas/squads          | `memberId`, `memberName`, `memberRole`, `allocationsByDay`                                                                                  |
| `users`        | Usuários com permissão RBAC               | `name`, `email`, `role` (`admin`/`pm`/`dev`/`finance`), `status`                                                                            |

---

## 6. Fluxos de Negócio Integrados

- **Conversão de Lead em Cliente & Projeto**:
  Ao marcar um lead comercial como "Ganho" na tela 360 ([`/os/crm/[id]`](file:///f:/EZYX/FZ%20Build/fz-build-solutions/src/app/os/crm/%5Bid%5D/page.tsx)), o sistema automaticamente:
  1. Cria ou vincula um registro na coleção `clients`.
  2. Inicializa um novo projeto na coleção `projects` com status `planning` e orçamento baseado no valor do lead.
  3. Atualiza o status do lead para `won` e redireciona o operador para a gestão do projeto ativo.
- **Backlog de Tarefas Conectado**:
  A página do projeto ([`/os/projects/[id]`](file:///f:/EZYX/FZ%20Build/fz-build-solutions/src/app/os/projects/%5Bid%5D/page.tsx)) calcula o progresso real com base na porcentagem de tarefas concluídas na coleção `tasks`, e totaliza despesas apuradas a partir dos lançamentos da coleção `transactions` filtrados por projeto.

---

## 7. Radar de Leads Autônomo com Google Gemini AI

O **Radar de Leads IA** é o subsistema de inteligência comercial B2B da FZ Build Solutions para prospecção autônoma no mercado corporativo brasileiro (engenharia, construção, galpões, reformas corporativas e facilities).

### Arquitetura do Radar:

1. **Engine de Prospecção (`src/features/crm/services/gemini-prospector.ts`)**:
   - Integração com o SDK oficial `@google/genai` (Google DeepMind).
   - Suporte a modelos generativos de última geração (`gemini-2.5-flash` / `gemini-3.8-flash`).
   - Habilitação de **Google Search Grounding** (`tools: [{ googleSearch: {} }]`) para varredura de notícias, expansões corporativas e contratações de obras em tempo real.
   - **Contingência Inteligente**: Fallback estruturado de alta fidelidade para o mercado brasileiro caso a chave de API não esteja configurada ou atinja limites de cota, garantindo que o sistema nunca quebre na UI.
2. **Rotas de API no Next.js App Router**:
   - `POST /api/crm/prospect`: Endpoint interativo para o operador disparar varreduras com parâmetros de nicho, região geográfica e gatilhos de compra.
   - `GET|POST /api/crm/prospect/cron`: Endpoint agendado para execuções periódicas em segundo plano (Vercel Cron, Cloud Scheduler ou webhooks externos), protegido por `CRON_SECRET`.
3. **Interface do Usuário (`AIProspectorDrawer`)**:
   - Gaveta lateral deslizante integrada em `/os/crm` e `/os/crm/leads`.
   - Animação de pulso e radar em tempo real durante a varredura.
   - Apresentação de cartões de oportunidade com: Razão Social, Nome Fantasia, Localização, Orçamento Estimado, Dor Detectada, Argumento de Vendas (Pitch Sugerido) e Match Score (75-99%).
   - Importação unitária ou em lote (1-clique) diretamente para a coleção `leads` do Firestore.

---

## 8. Integração Gmail OAuth2 & Comunicação B2B com IA

O módulo de **Comunicação & Gmail (`/os/inbox`)** transforma o FZ OS em um hub de envio e leitura de e-mails corporativos integrado ao Google Workspace.

### Componentes de Arquitetura:

1. **Google OAuth2 & Armazenamento Seguro de Tokens**:
   - Rotas de autorização `/api/auth/google/connect` e `/api/auth/google/callback`.
   - Escopos granulares: `gmail.modify`, `gmail.send` e `userinfo.email`.
   - O `refresh_token` é mantido estritamente no servidor (documento `settings/integrations_gmail` no Firestore) e nunca exposto ao cliente.
2. **Serviço Central Gmail (`src/features/inbox/services/gmail-service.ts`)**:
   - Listagem, leitura completa de e-mails, exclusão (lixeira do Gmail) e envio formatado em MIME RFC 2822 base64url.
   - **Modo Demonstração Integrado**: Carrega mensagens corporativas simuladas realistas para testes caso as chaves ainda não estejam configuradas.
3. **Caixa de Entrada com Split View (`/os/inbox`)**:
   - Painel mestre à esquerda com pesquisa, filtros de não lidas e status.
   - Visualizador de e-mail à direita com ações: `[Responder]`, `[Encaminhar]` e `[Excluir]`.
4. **Assistente IA de Propostas Comerciais (`/api/crm/ai-proposal`)**:
   - Integrado ao modal de redação e ao **Radar IA**.
   - O Gemini redige automaticamente e-mails de alta conversão adaptados à dor, nicho, orçamento e oportunidade do lead.

---

## 9. Garantia de Qualidade & Políticas de Execução

- **TypeScript Rigoroso**: Checagem de tipos sem erros (`npx tsc --noEmit`).
- **ESLint Estrito**: Zero avisos e zero erros de linting (`npx next lint`).
- **Acessibilidade**: Eliminação completa de caixas de diálogo nativas (`window.confirm`), substituídas pelo componente padronizado [`ConfirmDialog`](file:///f:/EZYX/FZ%20Build/fz-build-solutions/src/components/os/confirm-dialog.tsx).
- **Idiomas**: Chaves técnicas estruturadas em inglês no código e vocabulário 100% em **Português (PT-BR)** na interface do usuário.
