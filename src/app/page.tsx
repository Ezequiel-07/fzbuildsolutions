import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] font-sans overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="bg-[#f8f9fb]/80 backdrop-blur-xl docked full-width top-0 z-50 sticky border-b border-[#737685]/10 shadow-sm flex justify-between items-center px-5 md:px-20 py-4 w-full max-w-full">
        <div className="flex items-center gap-2">
          <img
            src="/fzbuildsemfundo.png"
            alt="FZ Build Solutions"
            className="h-10 w-auto"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 font-semibold">
          <Link
            href="#quem-somos"
            className="text-[#191c1e] hover:text-[#003d9b] transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="#solucoes"
            className="text-[#191c1e] hover:text-[#003d9b] transition-colors"
          >
            Soluções
          </Link>
          <Link
            href="#produtos"
            className="text-[#191c1e] hover:text-[#003d9b] transition-colors"
          >
            Produtos
          </Link>
          <Link
            href="#metodologia"
            className="text-[#191c1e] hover:text-[#003d9b] transition-colors"
          >
            Metodologia
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="bg-[#003d9b] text-white font-mono text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-full hover:bg-[#0052cc] transition-all shadow-md active:scale-95 text-center"
          >
            Acessar Plataforma
          </Link>
        </div>
      </nav>

      <main className="relative w-full">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center px-5 md:px-20 py-12 md:py-20 overflow-hidden bg-white">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#9cf0ff]/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10 w-full">
            <div className="max-w-2xl flex flex-col items-start gap-6">
              <span className="font-mono text-xs font-semibold text-[#003d9b] tracking-widest uppercase">
                Tecnologia de Alta Performance
              </span>

              <h1 className="font-heading text-4xl md:text-[64px] text-[#191c1e] leading-tight md:leading-[1.1] font-extrabold tracking-tight">
                Transformamos processos complexos em{" "}
                <span className="text-[#003d9b]">software inteligente</span>.
              </h1>

              <p className="font-sans text-lg md:text-[18px] text-[#434654] max-w-xl leading-relaxed md:leading-[1.6]">
                A FZ Build Solutions desenvolve plataformas SaaS, Inteligência
                Artificial, automação de processos e soluções sob medida para
                empresas que precisam eliminar retrabalho e tomar decisões com
                dados confiáveis.
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <Link
                  href="mailto:contato@fzbuild.solutions"
                  className="bg-[#003d9b] text-white font-mono text-xs font-semibold tracking-wider uppercase px-8 py-4 rounded-full hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Solicitar Diagnóstico
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  href="#solucoes"
                  className="bg-transparent border border-[#737685] text-[#191c1e] font-mono text-xs font-semibold tracking-wider uppercase px-8 py-4 rounded-full hover:bg-[#edeef0] transition-all"
                >
                  Conheça nossas soluções
                </Link>
              </div>

              {/* Quick Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 w-full">
                <div className="flex items-center gap-2 text-[#434654] text-sm font-medium">
                  <span className="material-symbols-outlined text-[#003d9b] text-xl">
                    psychology
                  </span>{" "}
                  IA aplicada
                </div>
                <div className="flex items-center gap-2 text-[#434654] text-sm font-medium">
                  <span className="material-symbols-outlined text-[#003d9b] text-xl">
                    cloud_done
                  </span>{" "}
                  Desenvolvimento SaaS
                </div>
                <div className="flex items-center gap-2 text-[#434654] text-sm font-medium">
                  <span className="material-symbols-outlined text-[#003d9b] text-xl">
                    sync_alt
                  </span>{" "}
                  Integração
                </div>
                <div className="flex items-center gap-2 text-[#434654] text-sm font-medium">
                  <span className="material-symbols-outlined text-[#003d9b] text-xl">
                    robot
                  </span>{" "}
                  Automação
                </div>
                <div className="flex items-center gap-2 text-[#434654] text-sm font-medium">
                  <span className="material-symbols-outlined text-[#003d9b] text-xl">
                    bar_chart
                  </span>{" "}
                  Dashboards e BI
                </div>
                <div className="flex items-center gap-2 text-[#434654] text-sm font-medium">
                  <span className="material-symbols-outlined text-[#003d9b] text-xl">
                    security
                  </span>{" "}
                  Escalabilidade
                </div>
              </div>
            </div>

            <div className="relative h-[400px] md:h-[600px] [perspective:1000px] hidden lg:block">
              <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateY(12deg)_rotateX(5deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] transition-transform duration-700 ease-out">
                <img
                  alt="Visualização 3D dos painéis flutuantes"
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANnjJuVwBWwf3tBi0M4Fe1ZU7O6N7xP8JUfDr7b7f64f0H32D_9Cd8nDpLSIxo_1JiugygIc7-xnkdGN2t8UEdC98ueu8lKTQSFgGGKlFaCCZYcbwlc3vXqARkRK5xaLpAXP7ebqu5XOAFK62Ftn_3T_LqeLRonxwpTM5RdG4M-bnT84iBiPo4b9DaY-i9TwlL2qijrlMfUO72Hf1LZUYZDXmEFTnK4D56txpWgHkk0FOYDLB1Gx90"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quem Somos Section */}
        <section
          className="relative px-5 md:px-20 py-[120px] bg-[#f8f9fb] overflow-hidden"
          id="quem-somos"
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <span className="font-mono text-xs font-semibold text-[#003d9b] tracking-widest uppercase">
              QUEM SOMOS
            </span>
            <h2 className="font-heading text-3xl md:text-[48px] text-[#191c1e] font-bold tracking-tight leading-tight md:leading-[1.2]">
              Construindo o futuro dos negócios através da tecnologia.
            </h2>
            <h3 className="font-heading text-xl md:text-[32px] text-[#0052cc] font-semibold -mt-2">
              Não desenvolvemos apenas software.
            </h3>
            <p className="font-sans text-lg md:text-[18px] text-[#434654] leading-relaxed md:leading-[1.6]">
              Analisamos processos, identificamos gargalos e construímos
              ecossistemas tecnológicos completos que unem pessoas, sistemas,
              inteligência artificial e dados. Nosso objetivo é simples: reduzir
              custos, eliminar desperdícios e acelerar o crescimento dos nossos
              clientes.
            </p>
          </div>
        </section>

        {/* Nosso Diferencial Section */}
        <section className="relative px-5 md:px-20 py-[120px] bg-[#f3f4f6]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="font-mono text-xs font-semibold text-[#003d9b] tracking-widest uppercase">
                  NOSSO DIFERENCIAL
                </span>
                <h2 className="font-heading text-3xl md:text-[48px] text-[#191c1e] font-bold tracking-tight leading-tight md:leading-[1.2]">
                  Antes de programar, entendemos seu negócio.
                </h2>
                <p className="font-sans text-lg md:text-[18px] text-[#434654] leading-relaxed md:leading-[1.6]">
                  A maioria das empresas cria sistemas. Nós primeiro fazemos um
                  diagnóstico completo da operação. Depois projetamos uma
                  solução que realmente resolve o problema.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-[#737685]/5">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    search_check
                  </span>
                  <span className="font-semibold text-[#191c1e]">
                    Diagnóstico preciso
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-[#737685]/5">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    architecture
                  </span>
                  <span className="font-semibold text-[#191c1e]">
                    Arquitetura robusta
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-[#737685]/5">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    code
                  </span>
                  <span className="font-semibold text-[#191c1e]">
                    Desenvolvimento ágil
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-[#737685]/5">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    hub
                  </span>
                  <span className="font-semibold text-[#191c1e]">
                    Integração nativa
                  </span>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] flex items-center justify-center">
              {/* Abstract Cutoff Form style */}
              <div className="absolute right-0 w-full md:w-[120%] h-[400px] bg-[#003d9b] rounded-l-3xl shadow-2xl p-12 overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                <h4 className="text-white font-heading text-2xl font-bold mb-6 relative z-10">
                  Nosso Processo
                </h4>
                <ul className="space-y-4 relative z-10 text-white">
                  <li className="flex items-center gap-4 text-white/90">
                    <span className="w-8 h-8 rounded-full bg-[#00e3fd] text-[#001f24] flex items-center justify-center font-bold">
                      1
                    </span>
                    Diagnóstico
                  </li>
                  <li className="flex items-center gap-4 text-white/90">
                    <span className="w-8 h-8 rounded-full bg-[#00e3fd]/50 text-white flex items-center justify-center font-bold">
                      2
                    </span>
                    Arquitetura
                  </li>
                  <li className="flex items-center gap-4 text-white/90">
                    <span className="w-8 h-8 rounded-full bg-[#00e3fd]/50 text-white flex items-center justify-center font-bold">
                      3
                    </span>
                    Desenvolvimento
                  </li>
                  <li className="flex items-center gap-4 text-white/90">
                    <span className="w-8 h-8 rounded-full bg-[#00e3fd]/50 text-white flex items-center justify-center font-bold">
                      4
                    </span>
                    Implantação e Evolução
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Áreas de Atuação Section */}
        <section
          className="relative px-5 md:px-20 py-[120px] bg-[#f8f9fb]"
          id="solucoes"
        >
          <div className="text-center mb-16">
            <span className="font-mono text-xs font-semibold text-[#003d9b] tracking-widest uppercase">
              ÁREAS DE ATUAÇÃO
            </span>
            <h2 className="font-heading text-3xl md:text-[48px] text-[#191c1e] font-bold mt-2 tracking-tight">
              Soluções que desenvolvemos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* IA */}
            <div className="bg-white/80 backdrop-blur-md border border-cyan-400/20 shadow-[0_20px_40px_rgba(0,82,204,0.08)] p-8 rounded-2xl flex flex-col gap-4 border-b-4 border-b-[#003d9b] hover:-translate-y-2 transition-all">
              <span className="material-symbols-outlined text-[#003d9b] text-4xl">
                psychology
              </span>
              <h3 className="font-heading text-xl font-bold text-[#191c1e]">
                Inteligência Artificial
              </h3>
              <p className="font-sans text-sm text-[#434654] leading-relaxed">
                Agentes inteligentes, assistentes corporativos, automação com IA
                e análise inteligente de dados.
              </p>
            </div>

            {/* SaaS */}
            <div className="bg-white/80 backdrop-blur-md border border-cyan-400/20 shadow-[0_20px_40px_rgba(0,82,204,0.08)] p-8 rounded-2xl flex flex-col gap-4 border-b-4 border-b-[#003d9b] hover:-translate-y-2 transition-all">
              <span className="material-symbols-outlined text-[#003d9b] text-4xl">
                cloud
              </span>
              <h3 className="font-heading text-xl font-bold text-[#191c1e]">
                Sistemas SaaS
              </h3>
              <p className="font-sans text-sm text-[#434654] leading-relaxed">
                Construção de plataformas modernas utilizando tecnologias de
                última geração.
              </p>
            </div>

            {/* Automação */}
            <div className="bg-white/80 backdrop-blur-md border border-cyan-400/20 shadow-[0_20px_40px_rgba(0,82,204,0.08)] p-8 rounded-2xl flex flex-col gap-4 border-b-4 border-b-[#003d9b] hover:-translate-y-2 transition-all">
              <span className="material-symbols-outlined text-[#003d9b] text-4xl">
                settings_suggest
              </span>
              <h3 className="font-heading text-xl font-bold text-[#191c1e]">
                Automação de Processos
              </h3>
              <p className="font-sans text-sm text-[#434654] leading-relaxed">
                Elimine tarefas repetitivas e aumente a produtividade da sua
                equipe.
              </p>
            </div>

            {/* Integração */}
            <div className="bg-white/80 backdrop-blur-md border border-cyan-400/20 shadow-[0_20px_40px_rgba(0,82,204,0.08)] p-8 rounded-2xl flex flex-col gap-4 border-b-4 border-b-[#003d9b] hover:-translate-y-2 transition-all">
              <span className="material-symbols-outlined text-[#003d9b] text-4xl">
                api
              </span>
              <h3 className="font-heading text-xl font-bold text-[#191c1e]">
                Integração de Sistemas
              </h3>
              <p className="font-sans text-sm text-[#434654] leading-relaxed">
                Conectamos ERPs, APIs, laboratórios, CRMs e qualquer sistema
                necessário.
              </p>
            </div>

            {/* BI */}
            <div className="bg-white/80 backdrop-blur-md border border-cyan-400/20 shadow-[0_20px_40px_rgba(0,82,204,0.08)] p-8 rounded-2xl flex flex-col gap-4 border-b-4 border-b-[#003d9b] hover:-translate-y-2 transition-all">
              <span className="material-symbols-outlined text-[#003d9b] text-4xl">
                insights
              </span>
              <h3 className="font-heading text-xl font-bold text-[#191c1e]">
                Dashboards e BI
              </h3>
              <p className="font-sans text-sm text-[#434654] leading-relaxed">
                Dados confiáveis transformados em visualizações para decisões
                rápidas.
              </p>
            </div>

            {/* Sob Medida */}
            <div className="bg-white/80 backdrop-blur-md border border-cyan-400/20 shadow-[0_20px_40px_rgba(0,82,204,0.08)] p-8 rounded-2xl flex flex-col gap-4 border-b-4 border-b-[#003d9b] hover:-translate-y-2 transition-all">
              <span className="material-symbols-outlined text-[#003d9b] text-4xl">
                straighten
              </span>
              <h3 className="font-heading text-xl font-bold text-[#191c1e]">
                Desenvolvimento Sob Medida
              </h3>
              <p className="font-sans text-sm text-[#434654] leading-relaxed">
                Cada empresa possui necessidades diferentes. Criamos o que o seu
                cenário exige.
              </p>
            </div>
          </div>
        </section>

        {/* Produtos Section */}
        <section
          className="relative px-5 md:px-20 py-[120px] bg-white"
          id="produtos"
        >
          <div className="text-center mb-16">
            <span className="font-mono text-xs font-semibold text-[#003d9b] tracking-widest uppercase">
              PRODUTOS
            </span>
            <h2 className="font-heading text-3xl md:text-[48px] text-[#191c1e] font-bold mt-2 tracking-tight">
              Plataformas desenvolvidas pela FZ
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* DP Core Card */}
            <div className="bg-[#003d9b] rounded-3xl p-8 md:p-12 text-white flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#00e3fd]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00e3fd]/30 transition-all"></div>
              <div className="flex items-center justify-between">
                <span className="bg-[#00e3fd] text-[#001f24] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Destaque
                </span>
                <span className="material-symbols-outlined text-[#00e3fd] text-4xl">
                  science
                </span>
              </div>
              <div>
                <h3 className="font-heading text-3xl font-bold mb-2">
                  DP Core
                </h3>
                <p className="text-white/80 font-sans text-lg">
                  Management of clinical labs & Diagnostic Centers.
                </p>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Requisição online
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Automação de codificação
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Integrações nativas
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Painéis gerenciais
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  IA para apoio operacional
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Auditoria de processos
                </li>
              </ul>
            </div>

            {/* FZ OS Card */}
            <div className="bg-white/80 backdrop-blur-md border border-[#737685]/10 shadow-[0_20px_40px_rgba(0,82,204,0.08)] rounded-3xl p-8 md:p-12 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-8">
                <span className="bg-[#e1e2e4] text-[#434654] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-mono">
                  Em Desenvolvimento
                </span>
                <span className="material-symbols-outlined text-[#003d9b] text-4xl">
                  terminal
                </span>
              </div>
              <div>
                <h3 className="font-heading text-3xl font-bold mb-4 text-[#191c1e]">
                  FZ OS
                </h3>
                <p className="text-[#434654] font-sans text-lg mb-8">
                  Sistema operacional corporativo baseado em agentes
                  inteligentes para orquestração de tarefas complexas.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-[#f3f4f6] border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  CRM Inteligente
                </span>
                <span className="px-4 py-2 bg-[#f3f4f6] border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  Automação Total
                </span>
                <span className="px-4 py-2 bg-[#f3f4f6] border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  Analytics
                </span>
                <span className="px-4 py-2 bg-[#f3f4f6] border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  Portal do Cliente
                </span>
              </div>
            </div>

            {/* EZYX Card */}
            <div className="bg-[#003d9b] rounded-3xl p-8 md:p-12 text-white flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#00e3fd]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00e3fd]/30 transition-all"></div>
              <div className="flex items-center justify-between">
                <span className="bg-[#00e3fd] text-[#001f24] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Logística
                </span>
                <span className="material-symbols-outlined text-[#00e3fd] text-4xl">
                  local_shipping
                </span>
              </div>
              <div>
                <h3 className="font-heading text-3xl font-bold mb-2">EZYX</h3>
                <p className="text-white/90 font-medium mb-2">
                  Plataforma de Gerenciamento Logístico.
                </p>
                <p className="text-white/80 text-sm font-sans leading-relaxed">
                  Gestão completa de frotas, rotas otimizadas e controle total
                  da logística em tempo real.
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Rastreamento em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Otimização de rotas e custos
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Gestão de ordens de serviço
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Aplicativo para motoristas
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Dashboards e BI
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                    check_circle
                  </span>{" "}
                  Integração financeira e fiscal
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Metodologia Section */}
        <section
          className="relative px-5 md:px-20 py-[120px] bg-[#f8f9fb] overflow-hidden"
          id="metodologia"
        >
          <div className="text-center mb-20">
            <span className="font-mono text-xs font-semibold text-[#003d9b] tracking-widest uppercase">
              COMO TRABALHAMOS
            </span>
            <h2 className="font-heading text-3xl md:text-[48px] text-[#191c1e] font-bold mt-2 tracking-tight">
              Nossa Metodologia
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#737685]/10 -translate-y-1/2 hidden md:block"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-[#edeef0] flex items-center justify-center border border-[#737685]/10 shadow-sm group-hover:bg-[#003d9b] group-hover:text-white transition-all duration-300">
                  <span className="font-bold text-xl text-[#191c1e] group-hover:text-white">
                    1
                  </span>
                </div>
                <h4 className="font-bold text-lg text-[#191c1e]">
                  Diagnóstico
                </h4>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-[#edeef0] flex items-center justify-center border border-[#737685]/10 shadow-sm group-hover:bg-[#003d9b] group-hover:text-white transition-all duration-300">
                  <span className="font-bold text-xl text-[#191c1e] group-hover:text-white">
                    2
                  </span>
                </div>
                <h4 className="font-bold text-lg text-[#191c1e]">
                  Arquitetura
                </h4>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-[#edeef0] flex items-center justify-center border border-[#737685]/10 shadow-sm group-hover:bg-[#003d9b] group-hover:text-white transition-all duration-300">
                  <span className="font-bold text-xl text-[#191c1e] group-hover:text-white">
                    3
                  </span>
                </div>
                <h4 className="font-bold text-lg text-[#191c1e]">
                  Desenvolvimento
                </h4>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-[#edeef0] flex items-center justify-center border border-[#737685]/10 shadow-sm group-hover:bg-[#003d9b] group-hover:text-white transition-all duration-300">
                  <span className="font-bold text-xl text-[#191c1e] group-hover:text-white">
                    4
                  </span>
                </div>
                <h4 className="font-bold text-lg text-[#191c1e]">
                  Implantação
                </h4>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-[#edeef0] flex items-center justify-center border border-[#737685]/10 shadow-sm group-hover:bg-[#003d9b] group-hover:text-white transition-all duration-300">
                  <span className="font-bold text-xl text-[#191c1e] group-hover:text-white">
                    5
                  </span>
                </div>
                <h4 className="font-bold text-lg text-[#191c1e]">Evolução</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Technologies & Results Section */}
        <section className="relative px-5 md:px-20 py-[120px] bg-[#f3f4f6]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="font-heading text-2xl font-bold mb-8 text-[#191c1e]">
                Tecnologias que dominamos
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  Next.js
                </span>
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  React
                </span>
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  TypeScript
                </span>
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  Node.js
                </span>
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  PostgreSQL
                </span>
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  Docker
                </span>
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  IA Generativa
                </span>
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  APIs REST
                </span>
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  Azure / AWS
                </span>
                <span className="px-4 py-2 bg-white border border-[#737685]/10 rounded-full text-sm font-medium text-[#434654] hover:bg-[#0052cc]/10 hover:text-[#003d9b] transition-all cursor-default">
                  CI/CD
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl font-bold mb-8 text-[#191c1e]">
                Resultados garantidos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-[#434654] font-semibold">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    trending_up
                  </span>
                  Mais produtividade
                </div>
                <div className="flex items-center gap-3 text-[#434654] font-semibold">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    replay
                  </span>
                  Menos retrabalho
                </div>
                <div className="flex items-center gap-3 text-[#434654] font-semibold">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    verified
                  </span>
                  Dados confiáveis
                </div>
                <div className="flex items-center gap-3 text-[#434654] font-semibold">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    auto_mode
                  </span>
                  Processos automatizados
                </div>
                <div className="flex items-center gap-3 text-[#434654] font-semibold">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    savings
                  </span>
                  Redução de custos
                </div>
                <div className="flex items-center gap-3 text-[#434654] font-semibold">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    rocket_launch
                  </span>
                  Crescimento sustentável
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why FZ Section (Checklist) */}
        <section className="relative px-5 md:px-20 py-[120px] bg-[#f8f9fb]">
          <div className="bg-white/80 backdrop-blur-md border border-[#003d9b]/10 shadow-[0_20px_40px_rgba(0,82,204,0.08)] p-8 md:p-16 rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h2 className="font-heading text-3xl font-bold text-[#191c1e] mb-6">
                  Por que escolher a FZ?
                </h2>
                <p className="text-[#434654] font-sans">
                  Unimos visão estratégica de negócios com excelência técnica
                  para entregar resultados reais.
                </p>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[#191c1e]">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    done_all
                  </span>
                  <p className="font-semibold">
                    Diagnóstico antes do desenvolvimento
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    done_all
                  </span>
                  <p className="font-semibold">
                    Produtos próprios consolidados
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    done_all
                  </span>
                  <p className="font-semibold">IA integrada desde o início</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    done_all
                  </span>
                  <p className="font-semibold">
                    Arquitetura escalável e segura
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    done_all
                  </span>
                  <p className="font-semibold">Foco absoluto em resultados</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#003d9b]">
                    done_all
                  </span>
                  <p className="font-semibold">Suporte contínuo e evolução</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative px-5 md:px-20 py-[120px] bg-[#003d9b] text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#00e3fd]/20 via-transparent to-transparent"></div>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 relative z-10">
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight">
              Vamos construir a próxima solução da sua empresa?
            </h2>
            <p className="font-sans text-lg md:text-[18px] text-white/80 max-w-2xl leading-relaxed">
              Cada empresa possui desafios únicos. Agende uma reunião e descubra
              como a tecnologia pode transformar sua operação e acelerar seus
              resultados.
            </p>
            <Link
              href="mailto:contato@fzbuild.solutions"
              className="bg-[#00e3fd] text-[#001f24] font-bold text-lg px-12 py-5 rounded-full hover:scale-105 transition-all shadow-xl shadow-black/20 text-center"
            >
              Agendar Diagnóstico
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#e1e2e4] w-full px-5 md:px-20 py-12 flex flex-col gap-12 border-t mt-auto text-[#434654]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <img
                src="/fzbuildsemfundo.png"
                alt="FZ Build Solutions"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm max-w-xs font-sans">
              Building Future Ecosystems through Intelligent Software.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col gap-4 font-semibold text-sm">
              <h4 className="font-bold text-[#191c1e] uppercase text-xs tracking-widest font-mono">
                Navegação
              </h4>
              <Link
                href="#quem-somos"
                className="hover:text-[#003d9b] transition-colors"
              >
                Sobre
              </Link>
              <Link
                href="#solucoes"
                className="hover:text-[#003d9b] transition-colors"
              >
                Soluções
              </Link>
              <Link
                href="#produtos"
                className="hover:text-[#003d9b] transition-colors"
              >
                Produtos
              </Link>
            </div>

            <div className="flex flex-col gap-4 font-semibold text-sm">
              <h4 className="font-bold text-[#191c1e] uppercase text-xs tracking-widest font-mono">
                Institucional
              </h4>
              <Link
                href="#metodologia"
                className="hover:text-[#003d9b] transition-colors"
              >
                Metodologia
              </Link>
              <Link
                href="mailto:contato@fzbuild.solutions"
                className="hover:text-[#003d9b] transition-colors"
              >
                Contato
              </Link>
              <Link href="#" className="hover:text-[#003d9b] transition-colors">
                Privacidade
              </Link>
            </div>

            <div className="flex flex-col gap-4 font-semibold text-sm">
              <h4 className="font-bold text-[#191c1e] uppercase text-xs tracking-widest font-mono">
                Social
              </h4>
              <Link
                href="https://linkedin.com"
                className="hover:text-[#003d9b] transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href="https://github.com/Ezequiel-07/fzbuildsolutions"
                className="hover:text-[#003d9b] transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#737685]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
          <div>
            © {new Date().getFullYear()} FZ Build Solutions. Todos os direitos
            reservados.
          </div>
          <div className="flex gap-4 items-center">
            <span>Brasil</span>
            <span className="w-1 h-1 bg-[#737685]/30 rounded-full"></span>
            <span>Intelligent Ecosystems</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
