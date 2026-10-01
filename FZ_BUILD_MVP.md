# FZ Build Solutions — FZ OS MVP 2.0

> **Versao:** 2.0.0 | **Data:** Setembro/Outubro 2026 | **Status:** MVP Operacional Construido
> **Conceito:** Sistema Operacional Interno da FZ Build — O cerebro operacional da software house em nuvem.
> **Filosofia:** _Contexto -> Acao -> Informacao -> Decisao -> Execucao._

---

## 1. Principios do Produto

- **Rapido & Fluido:** Keyboard-first, Instant Navigations, zero lentidao.
- **Visual & Moderno:** Densidade correta, hierarquia visual clara, microinteracoes Framer Motion, **SEM video de fundo** (substituido por mesh gradientes e glassmorphism pontual).
- **Inteligente:** Camada contextual nativa da **FZ AI** com sugestoes pro-ativas e analise em tempo real.
- **Operacional Vivo:** FZ Health, feed de atividade em tempo real, My Day checklist com calculo dinamico.
- **Seguro & Auditavel:** Event Engine com trilha de auditoria completa (Audit Logs) e RBAC por papeis.
- **Multi-Tenant Ready:** Estrutura preparada para expansao com organizationId em todos os modulos.

---

## 2. Mapa Completo de Paginas e Status

### Autenticacao & Acesso

| Rota             | Descricao                                       | Status    |
| ---------------- | ----------------------------------------------- | --------- |
| /login           | Autenticacao profissional sem video de fundo    | Concluido |
| /forgot-password | Recuperacao segura de senha com link por e-mail | Concluido |
| /mfa             | Verificacao multifator e seguranca de sessao    | Concluido |

### Sistema Operacional Interno (/os)

| Rota                     | Descricao                                                                                     | Status    |
| ------------------------ | --------------------------------------------------------------------------------------------- | --------- |
| /os                      | Cockpit Operacional: FZ Health, FZ AI Context, My Day, Atividade em Tempo Real, Metricas      | Concluido |
| /os/projects             | Portfolio de Projetos, progresso, prazos e orcamentos                                         | Concluido |
| /os/projects/[id]        | Detalhes do Projeto: Overview, tarefas interativas, financeiro dedicado e equipe              | Concluido |
| /os/finance              | Visao Geral Financeira (Receita, Despesas, Saldo, Distribuicao)                               | Concluido |
| /os/finance/transactions | Planilha Interativa (Excel/Sheets): Grade editavel, formulas, filtros, categorias e CSV       | Concluido |
| /os/finance/budget       | Orcamentos: Planejado vs. Executado por projeto, alertas de teto de gastos                    | Concluido |
| /os/finance/reports      | Relatorios Executivos: DRE, margens, centro de custo e exportacao                             | Concluido |
| /os/crm                  | Pipeline de Vendas: Funil visual (Lead -> Qualificado -> Reuniao -> Proposta -> Ganho)        | Concluido |
| /os/crm/leads            | Tabela de Oportunidades: Estilo planilha com ordenacao e metricas                             | Concluido |
| /os/crm/[id]             | Customer 360: Perfil do Lead/Cliente, Propostas, Historico cronologico e conversao em projeto | Concluido |
| /os/team                 | Gestao de Pessoas, papeis, status de atividade e alocacoes                                    | Concluido |
| /os/team/schedule        | Agenda & Alocacao Semanal: Grid SEG a SEX com capacidade e horas alocadas                     | Concluido |
| /os/workflow             | Editor de Workflows: Automacoes visuais com nos React Flow                                    | Concluido |
| /os/infrastructure       | Monitoramento Cloud: Status dos servidores, clusters, uptime 99.98% e metricas                | Concluido |
| /os/notifications        | Central de Notificacoes: Alertas de projetos, financeiro, leads e sistema                     | Concluido |
| /os/admin                | Dashboard Geral de Administracao e Governanca                                                 | Concluido |
| /os/admin/users          | Gestao de Usuarios e RBAC (Super Admin, Admin, Manager, Member, Viewer)                       | Concluido |
| /os/admin/settings       | Configuracoes Globais do Sistema (MFA, backups, tema, retencao)                               | Concluido |
| /os/admin/logs           | Logs de Auditoria: Rastreabilidade cronologica com filtros por gravidade e ator               | Concluido |

### Portal do Cliente

| Rota    | Descricao                                               | Status    |
| ------- | ------------------------------------------------------- | --------- |
| /portal | Visao restrita do cliente para acompanhamento de escopo | Concluido |

---

## 3. Recursos de Destaque do FZ OS

### Command Palette (Ctrl+K / Cmd+K)

- Pressione Ctrl+K ou clique na barra de busca superior para navegacao ultrarrapida.
- Acesso instantaneo a todos os modulos, planilhas, projetos e configuracoes.
- Easter Egg: Digite > status para obter a telemetria em tempo real do sistema.

### FZ AI Contextual Layer

- Drawer lateral inteligente acionado pelo botao AI no topo da tela.
- Fornece respostas imediatas sobre fluxo de caixa, custos por projeto (ex: EZYX), propostas comerciais e status de infraestrutura.
- Sugestoes operacionais de acoes e diagnosticos pro-ativos.

### Planilha Financeira Interativa (/os/finance/transactions)

- Edicao direta nas celulas em tempo real.
- Suporte a multiplas categorias e projetos vinculados.
- Filtros por tipo de transacao (Entrada/Saida), busca textual e exportacao direta para CSV.

### Agenda & Alocacao Semanal (/os/team/schedule)

- Matriz semanal (Segunda a Sexta) com acompanhamento de carga horaria da equipe.
- Calculo de taxa de ocupacao da squad e alocacoes por projeto em tempo real.

---

## 4. Stack Tecnologico

| Camada                | Tecnologia                                                      |
| --------------------- | --------------------------------------------------------------- |
| Framework             | Next.js 15.1.9 (App Router / Turbopack)                         |
| Runtime & UI          | React 19 + Base UI + Radix UI + Lucide Icons                    |
| Estilizacao           | Tailwind CSS com design tokens enterprise                       |
| Animacoes             | Framer Motion (Microinteracoes funcionais)                      |
| Workflows             | React Flow (@xyflow/react)                                      |
| Graficos              | Recharts (Area, Bar, Pie)                                       |
| Tabelas               | TanStack Table                                                  |
| Data Fetching         | TanStack Query (React Query)                                    |
| Validacao             | Zod + React Hook Form                                           |
| Linter & Formatacao   | ESLint 9 (Flat Config) + Prettier + Next Core Web Vitals        |
| Tipagem Estatica      | TypeScript 5 (Strict Mode: no-explicit-any, no-unused-vars)     |
| Banco de Dados & Auth | Firebase Firestore + Firebase Auth (Email/Senha + Google + MFA) |
| Storage & Hosting     | Firebase Storage + Firebase App Hosting                         |
| PWA & Offline         | Serwist (@serwist/next)                                         |

---

## 5. Design System

- FZ Blue: #003D9B
- FZ Cyan: #00E3FD
- FZ Dark Deep: #06111F
- Surface Dark: #0D1C2C & #101F30
- Surface Light: #F6F8FB & #FFFFFF
- Regra dos 80/20: 80% superficies solidas com bordas elegantes de 1px; 20% acentos sutis em glassmorphism e iluminacao neon.

---

## 6. Seguranca e RBAC

- Autenticacao: Firebase Auth com sessao e suporte a MFA.
- RBAC: Controle granular de acessos por papeis (SUPER_ADMIN, ADMIN, MANAGER, MEMBER, VIEWER).
- Audit Trail: Todos os eventos operacionais criticos (project.created, transaction.created, lead.updated, etc.) sao salvos com ator, data/hora e IP.
- Zero Mock em Producao: Dados conectados diretamente com a camada Firestore.

---

## 7. Qualidade, Validacao & CI/CD Local

| Verificacao           | Ferramenta / Comando    | Status Atual        | Detalhes                                               |
| --------------------- | ----------------------- | ------------------- | ------------------------------------------------------ |
| **Linter**            | npm run lint (ESLint 9) | 0 erros, 0 warnings | Regras estritas next/core-web-vitals e next/typescript |
| **Typecheck**         | npx tsc --noEmit        | 0 erros de tipagem  | TypeScript strict em todas as rotas e hooks            |
| **Build de Producao** | npm run build           | Sucesso total       | 28 rotas estaticas e dinamicas geradas sem falhas      |
| **Turbopack Dev**     | npm run dev             | Ativo               | Hot Reload ultrarrapido                                |
