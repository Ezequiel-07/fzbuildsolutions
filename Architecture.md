# FZ OS - Architecture & Tech Stack

## Visão Geral

FZ OS é a plataforma corporativa e SaaS principal da FZ Build Solutions. Desenvolvido para atender a requisitos estritos de segurança, performance, multi-tenancy e extensibilidade futura através de uma arquitetura BaaS (Backend-as-a-Service).

## Padrões de Arquitetura

Este projeto segue rigorosamente a **Clean Architecture** em conjunto com **Domain Driven Design (DDD)** onde aplicável.

### Estrutura de Pastas (src/)

- **`app/`**: Rotas da aplicação (Next.js App Router). Camada de apresentação e redirecionamentos.
- **`components/`**: Componentes React de UI (shadcn/ui e genéricos).
- **`features/`**: Módulos de negócio isolados (e.g., `crm`, `finance`, `projects`). Cada feature encapsula seus próprios componentes específicos, lógicas e integrações.
- **`providers/`**: Provedores globais (React Query, Firebase Auth, Theme).
- **`hooks/`**: React Hooks customizados e lógicas de UI reutilizáveis.
- **`schemas/`**: Definições de validação de dados usando Zod.
- **`types/`**: Definições estáticas do TypeScript e interfaces globais.
- **`lib/`**: Utilitários e configurações de bibliotecas de terceiros (Firebase Client, Logger, etc).
- **`utils/`**: Funções auxiliares, formatadores e validadores puros.
- **`config/`**: Variáveis de ambiente e constantes do sistema.

## Tech Stack & Design System

- **Framework**: Next.js 15 (App Router, React 19)
- **Linguagem**: TypeScript
- **Design System (Kinetic Horizon)**:
  - **Aparência**: Estética corporativa moderna mesclada com Glassmorphism e perspectiva espacial.
  - **Cores**: Tons de azul e cinza-gelo baseados na paleta do Kinetic Horizon (Primário: `#003d9b`, Secundário: `#006875`, Neutro/Fundo: `#f8f9fb`, Cartões: `#ffffff`).
  - **Tipografia**: Fontes carregadas dinamicamente:
    - _Hanken Grotesk_ para títulos corporativos expressivos.
    - _Inter_ para o corpo de texto legível.
    - _Geist_ para termos técnicos, códigos e menus.
- **Backend & Banco de Dados (BaaS)**: Firebase (Firestore como banco de dados NoSQL e Cloud Storage para arquivos).
- **Autenticação**: Firebase Authentication com o `AuthProvider` cliente interceptando rotas não autorizadas e impedindo vazamento visual (flicker).
- **Data Fetching**: TanStack Query (React Query)
- **Tabelas**: TanStack Table
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Qualidade de Código**: ESLint, Prettier, Husky (pre-commit rodando typecheck e lint-staged).
- **Logs**: Logger nativo leve e compatível com SSR/Turbopack, emulando assinaturas do Pino.

## Multi-Tenancy & Segurança

O ecossistema Firebase isola logicamente os dados usando a estrutura de documentos no Firestore. A aplicação restringe o acesso através do Middleware do Next.js e do cliente de contexto `AuthProvider` nas rotas `/os` e `/portal`.

_Este documento evolui iterativamente junto com a criação de novos módulos do projeto._
