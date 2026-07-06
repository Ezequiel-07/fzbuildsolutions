# FZ Build Solutions

Repositório Oficial: [GitHub - Ezequiel-07/fzbuildsolutions](https://github.com/Ezequiel-07/fzbuildsolutions)

Plataforma inteligente de gestão físico-financeira integrada ao Firebase para construtoras e incorporadoras. Desenvolvido com **Next.js 15** e o design system **Kinetic Horizon**.

---

## 🛠️ Tecnologias Principais

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS, Framer Motion, shadcn/ui.
- **Backend-as-a-Service (BaaS)**: Firebase Authentication, Firestore Database e Cloud Storage.
- **Qualidade & Git Hooks**: Husky, lint-staged, ESLint e TypeScript compiler checks.
- **Data Querying**: TanStack React Query v5.

---

## 🚀 Como Iniciar (Desenvolvimento Local)

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo para criar seu arquivo local:

```bash
cp .env.example .env.local
```

Abra o `.env.local` e preencha as variáveis com as credenciais do seu console do **Firebase**:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
...
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Rodar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🛡️ Git Hooks e Regras de Commit

O projeto possui validações pré-commit automatizadas com **Husky** para garantir a integridade do código antes de subir alterações para o repositório remoto.

Toda vez que você rodar `git commit`:

1. O compilador TypeScript irá verificar o código (`npm run typecheck`).
2. O **ESLint** rodará checagens de sintaxe apenas nos arquivos modificados (`lint-staged`).
   Se houver qualquer erro impeditivo, o commit será abortado automaticamente até que as pendências sejam resolvidas.

---

## 📦 Build de Produção

Para validar a integridade dos tipos e preparar o pacote de deploy otimizado:

```bash
npm run build
```

O build de produção está otimizado para o ambiente de execução **Node 22** e preparado para deploy direto via **Firebase App Hosting**.

---

_Desenvolvido por FZ Build Solutions._
