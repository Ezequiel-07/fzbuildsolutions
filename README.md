# FZ Build Solutions — FZ OS

Repositório Oficial: [GitHub - Ezequiel-07/fzbuildsolutions](https://github.com/Ezequiel-07/fzbuildsolutions)

Plataforma unificada de gestão físico-financeira, projetos, CRM comercial, squads e governança para a software house **FZ Build Solutions**, desenvolvida com **Next.js 15**, **React 19**, **Tailwind CSS** e **Firebase (Firestore & Auth)**.

---

## 🏛️ Estrutura da Plataforma

A aplicação é dividida em três pilares fundamentais:

1. **Landing Page (`/`)**: Portal institucional voltado para captação de clientes, apresentação do portfólio de soluções e conversão de leads.
2. **FZ OS (`/os`)**: Sistema operacional corporativo interno para governança de projetos, squads, pipeline comercial e gestão orçamentária.
3. **Portal do Cliente (`/portal`)**: Área de acompanhamento transparente para clientes visualizarem marcos e entregas.

---

## 🚀 Módulos do FZ OS (`/os`)

O sistema interno conta com **21 páginas e submódulos** integrados:

- **Operação**:
  - `Cockpit Operacional (/os)`: Dashboard executivo com faturamento consolidado, gráfico de fluxo de caixa, Meu Dia interativo, projetos ativos e feed de atividades.
  - `Gestão de Projetos (/os/projects)`: Visualizações em Kanban e Tabela com filtros de status canônicos e acompanhamento de prazos.
  - `Projeto 360 (/os/projects/[id])`: Visão analítica do projeto com backlog de tarefas reais no Firestore, controle orçamentário apurado e equipe alocada.
  - `Clientes (/os/clients)`: Gestão de clientes corporativos independente de oportunidades comerciais com dados cadastrais e histórico.
  - `Automação & Processos (/os/workflow)`: Visualizador e editor de fluxos e esteiras operacionais.
- **Comercial**:
  - `Funil CRM (/os/crm)`: Pipeline visual com estágios canônicos (Novo, Qualificação, Proposta, Negociação, Ganho, Perdido), métricas financeiras e gatilho do **Radar de Leads IA**.
  - `Oportunidades & Leads (/os/crm/leads)`: Tabela analítica com filtros de etapa, busca rápida, exclusão segura e prospecção com IA.
  - `Comunicação & Gmail (/os/inbox)`: Caixa de entrada integrada com leitura de mensagens, exclusão para a lixeira, respostas, encaminhamentos e disparador de e-mails corporativos.
  - `Radar de Leads IA (Drawer)`: Prospecção autônoma e sob demanda utilizando **Google Gemini AI** com Search Grounding, mapeando empresas com dores de engenharia/obras, orçamentos estimados e pitches de abordagem.
  - `Lead 360 (/os/crm/[id])`: Diagnóstico completo do lead com conversão automática em Cliente e Projeto ativo.
- **Financeiro**:
  - `Painel Financeiro (/os/finance)`: Indicadores de receita, despesas, lucro líquido, margem e comparativos mensais.
  - `Planilha de Transações (/os/finance/transactions)`: Controle contábil interativo com suporte a exportação CSV e exclusão em massa.
  - `Relatórios & DRE (/os/finance/reports)`: DRE consolidado, fluxo de caixa em 6 meses e breakdown de custos por categoria.
  - `Orçamentos (/os/finance/budget)`: Acompanhamento de orçamento de projetos vs despesas reais apuradas.
- **Pessoas**:
  - `Equipe (/os/team)`: Diretório de especialistas, cargos, tags de skills e gestão de status.
  - `Matriz de Alocações (/os/team/schedule)`: Cronograma semanal de dedicação por membro e projeto conectado ao Firestore.
- **Sistema & Governança**:
  - `Notificações (/os/notifications)`: Central de alertas gerados em tempo real a partir de eventos de projetos, leads e finanças.
  - `Infraestrutura (/os/infrastructure)`: Telemetria de latência do Firestore e monitoramento de saúde de servidores em nuvem.
  - `Hub de Administração (/os/admin)`: Visão geral de segurança, acessos e políticas do sistema.
  - `Gestão de Usuários (/os/admin/users)`: Controle de operadores com atribuição de papéis RBAC (_Admin_, _PM_, _Developer_, _Finance_).
  - `Configurações (/os/admin/settings)`: Parâmetros corporativos, autenticação de dois fatores (MFA) e integrações.
  - `Logs de Auditoria (/os/admin/logs)`: Rastreamento imutável de eventos com carimbo de data/hora, operador e IP.

---

## 🛠️ Tecnologias Principais

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Linguagem**: [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Biblioteca de UI**: [React 19](https://react.dev/)
- **Estilização & Design System**: Tailwind CSS 3.4 com tokens semânticos RGB (`--os-*`), garantindo modo Claro como padrão e modo Escuro completo.
- **Componentes Acessíveis**: Base UI (`@base-ui/react`), Lucide React, Sonner (notificações toast).
- **Backend-as-a-Service (BaaS)**: Google Firebase (Firestore Database, Authentication e Cloud Storage).
- **Gerenciamento de Estado de Servidor**: TanStack React Query v5.
- **Visualização de Dados**: Recharts (gráficos de área, barras e pizza).

---

## 💻 Como Iniciar (Desenvolvimento Local)

### 1. Clonar e Instalar Dependências

```bash
git clone https://github.com/Ezequiel-07/fzbuildsolutions.git
cd fzbuildsolutions
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto com as credenciais do seu projeto Firebase:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Google Gemini AI & Automação de Prospecção
GEMINI_API_KEY=sua_chave_do_google_ai_studio # Ou GOOGLE_API_KEY
CRON_SECRET=sua_chave_secreta_para_rotinas_automaticas

# Google OAuth2 & Gmail Integration
GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### 3. Rodar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador. O sistema operacional interno está disponível na rota `/os`.

---

## 🧪 Scripts Disponíveis

| Comando            | Descrição                                                 |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Inicia o servidor local Next.js com Turbopack             |
| `npm run build`    | Compila o projeto e gera o pacote otimizado para produção |
| `npm run start`    | Inicia o servidor em modo produção após o build           |
| `npm run lint`     | Executa o ESLint em todo o código fonte                   |
| `npx tsc --noEmit` | Valida todos os tipos TypeScript sem gerar arquivos       |

---

## 🛡️ Qualidade e Padrões de Código

- **100% Livre de Mocks**: Todos os módulos consomem e persistem dados no Firestore via hooks desacoplados em `src/features/*/api`.
- **Zero Alertas de Tipagem**: O projeto é validado com `tsc --noEmit` garantindo conformidade rigorosa com os esquemas.
- **Diálogos Acessíveis**: Nenhuma chamada ao `window.confirm` nativo — todos os fluxos críticos utilizam o componente [`ConfirmDialog`](file:///f:/EZYX/FZ%20Build/fz-build-solutions/src/components/os/confirm-dialog.tsx).
- **Localização**: Textos da interface do usuário 100% em **Português (PT-BR)**.

---

_Desenvolvido por FZ Build Solutions._
