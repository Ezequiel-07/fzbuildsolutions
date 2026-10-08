import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Shield,
  Code2,
  Scale,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Laptop,
  AlertTriangle,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso & Condições de Serviço | FZ Build Solutions",
  description:
    "Termos de uso, condições de prestação de serviços de software e licenciamento de produtos digitais da FZ Build Solutions LTDA.",
};

const SECTIONS = [
  { id: "aceite", label: "1. Aceite dos Termos e Objeto" },
  { id: "servicos", label: "2. Serviços de Software e Apps" },
  { id: "contas", label: "3. Acesso à Plataforma e Contas" },
  { id: "propriedade", label: "4. Propriedade Intelectual" },
  { id: "sla", label: "5. Disponibilidade e SLA de Nuvem" },
  { id: "conduta", label: "6. Condutas Proibidas" },
  { id: "responsabilidade", label: "7. Limitação de Responsabilidade" },
  { id: "confidencialidade", label: "8. Confidencialidade e NDA" },
  { id: "rescisao", label: "9. Suspensão e Encerramento" },
  { id: "foro", label: "10. Legislação e Foro Aplicável" },
];

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-[#1e6bff]/30 selection:text-white relative overflow-hidden font-sans">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(0,102,255,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute top-[600px] -right-48 w-96 h-96 bg-[#1e6bff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[1200px] -left-48 w-96 h-96 bg-[#0066ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#030712]/80 border-b border-white/10 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-[1.01]"
          >
            <Image
              src="/fzbuildsemfundo.png"
              alt="FZ Build Solutions"
              width={40}
              height={40}
              className="h-9 w-auto brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100"
            />
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white text-sm">
                FZ BUILD SOLUTIONS
              </span>
              <span className="text-[10px] text-[#1e6bff] font-mono tracking-wider uppercase font-semibold">
                Casa de Software
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066ff]/10 border border-[#0066ff]/30 text-[#60a5fa] text-xs font-medium mb-4">
          <Scale className="w-3.5 h-3.5 text-[#60a5fa]" />
          <span>Contrato de Licenciamento & Prestação de Serviços</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
          Termos de Uso & Condições de Serviço
        </h1>

        <p className="mt-4 text-base md:text-lg text-slate-400 max-w-3xl leading-relaxed">
          Estes Termos de Uso estabelecem as regras, obrigações e diretrizes
          legais para o acesso ao website da{" "}
          <strong>FZ Build Solutions LTDA</strong>, contratação de nossos
          serviços de desenvolvimento de software sob medida e utilização de
          nossas plataformas em nuvem e aplicativos.
        </p>

        <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#60a5fa]" />
            Última atualização: Outubro de 2026
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#60a5fa]" />
            Versão 2.1 · Vigente
          </span>
          <span>CNPJ: 67.700.723/0001-74</span>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sticky Table of Contents (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
              <FileText className="w-3.5 h-3.5 text-[#0066ff]" />
              <span>Índice dos Termos</span>
            </div>
            <nav className="flex flex-col space-y-1">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="text-xs text-slate-400 hover:text-white hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition-colors block"
                >
                  {sec.label}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-xl bg-[#0066ff]/10 border border-[#0066ff]/20 space-y-2">
                <span className="text-xs font-semibold text-white block">
                  Contratos Corporativos
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Para contratos de desenvolvimento customizado com SLA
                  específico ou NDA mútuo, consulte nosso setor jurídico.
                </p>
                <a
                  href="mailto:fzbuild.solutions@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#60a5fa] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>fzbuild.solutions@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Legal Text Content */}
        <div className="lg:col-span-8 space-y-12 text-slate-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section id="aceite" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">1.</span> Aceite dos Termos e
              Objeto
            </h2>
            <p>
              Ao navegar em nosso website, solicitar propostas ou utilizar os
              produtos e serviços fornecidos pela{" "}
              <strong>FZ Build Solutions LTDA</strong> (CNPJ nº{" "}
              <strong>67.700.723/0001-74</strong>), você declara ter lido,
              compreendido e concordado integralmente com as disposições destes
              Termos de Uso. Caso não concorde com qualquer cláusula aqui
              estipulada, solicitamos que não utilize nossos serviços.
            </p>
            <p>
              Estes Termos aplicam-se a todos os visitantes, clientes, usuários
              e empresas que interagem com o ecossistema tecnológico da FZ Build
              Solutions.
            </p>
          </section>

          {/* Section 2 */}
          <section id="servicos" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">2.</span> Escopo dos Serviços de
              Software e Tecnologia
            </h2>
            <p>
              A FZ Build Solutions opera como Casa de Software (Software House),
              fornecendo soluções tecnológicas de alta performance, incluindo:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Laptop className="w-4 h-4 text-[#1e6bff]" />
                  <span>Softwares & Sistemas em Nuvem</span>
                </div>
                <p className="text-xs text-slate-400">
                  Desenvolvimento de sistemas corporativos sob medida, portais
                  B2B, CRMs e plataformas SaaS de alta escalabilidade.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Code2 className="w-4 h-4 text-[#1e6bff]" />
                  <span>Aplicativos Mobile (iOS e Android)</span>
                </div>
                <p className="text-xs text-slate-400">
                  Criação de aplicativos nativos ou híbridos com publicação em
                  App Store e Google Play Store e sincronização em tempo real.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Sparkles className="w-4 h-4 text-[#1e6bff]" />
                  <span>Websites & Portais de Alta Conversão</span>
                </div>
                <p className="text-xs text-slate-400">
                  Desenvolvimento web com Next.js, carregamento ultrarrápido,
                  SEO técnico e interfaces responsivas modernas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Shield className="w-4 h-4 text-[#1e6bff]" />
                  <span>Automações, APIs & Inteligência Artificial</span>
                </div>
                <p className="text-xs text-slate-400">
                  Integrações de serviços bancários, emissão fiscal, WhatsApp,
                  e-mail corporativo e modelos de IA para inteligência de dados.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Cada projeto contratado é detalhado em sua respectiva{" "}
              <strong>Proposta Técnica Comercial</strong> e{" "}
              <strong>Contrato de Prestação de Serviços de TI</strong>, cujas
              condições particulares prevalecem sobre estes Termos gerais em
              caso de conflito específico.
            </p>
          </section>

          {/* Section 3 */}
          <section id="contas" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">3.</span> Acesso à Plataforma e
              Contas Corporativas
            </h2>
            <p>
              Ao utilizar os sistemas desenvolvidos pela FZ Build Solutions
              (como o FZ OS e portais de clientes):
            </p>
            <ul className="space-y-2 pt-1 text-xs">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0 mt-0.5" />
                <span>
                  O usuário é exclusivamente responsável por manter a
                  confidencialidade de suas credenciais de login e senhas;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0 mt-0.5" />
                <span>
                  Qualquer atividade realizada através da sua conta é de sua
                  inteira responsabilidade civil e jurídica;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0 mt-0.5" />
                <span>
                  A FZ Build Solutions deve ser notificada imediatamente sobre
                  qualquer suspeita de violação de segurança ou acesso indevido.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="propriedade" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">4.</span> Propriedade Intelectual
              e Licenciamento
            </h2>
            <p>
              Todos os direitos de propriedade intelectual referentes às marcas,
              logotipos, arquitetura interna de software, frameworks
              proprietários (como DP Core e FZ OS), componentes de design e
              conteúdos deste site pertencem exclusivamente à{" "}
              <strong>FZ Build Solutions LTDA</strong> ou a seus licenciadores.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
              <strong className="text-white block">
                Regra para Softwares Desenvolvidos sob Demanda:
              </strong>
              <p className="text-slate-300">
                A cessão de direitos autorais ou o licenciamento do código-fonte
                criado sob encomenda para clientes será disciplinado de forma
                expressa no respectivo contrato firmado entre as partes. Na
                ausência de estipulação em contrário, os módulos base
                proprietários e bibliotecas utilitárias permanecem como
                patrimônio intelectual da Casa de Software.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="sla" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">5.</span> Disponibilidade, SLA e
              Manutenção de Nuvem
            </h2>
            <p>
              Nossas soluções hospedadas em nuvem empregam infraestrutura de
              alta disponibilidade de provedores tier-1 (Google Cloud, Firebase,
              AWS). Empreendemos os melhores esforços comerciais para manter
              disponibilidade de 99,5% (uptime) anual.
            </p>
            <p className="text-xs text-slate-400">
              Interrupções programadas para melhorias e manutenções preventivas
              serão notificadas aos clientes com antecedência razoável. A FZ
              Build Solutions não se responsabiliza por indisponibilidades
              decorrentes de falhas de conectividade de operadoras terceiras,
              ataques DDoS de escala catastrófica ou casos fortuitos e de força
              maior.
            </p>
          </section>

          {/* Section 6 */}
          <section id="conduta" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">6.</span> Condutas Proibidas
            </h2>
            <p>É estritamente vedado ao usuário ou cliente:</p>
            <div className="space-y-2 text-xs">
              {[
                "Praticar engenharia reversa, descompilação ou desmontagem dos códigos proprietários fornecidos;",
                "Utilizar os sistemas ou APIs desenvolvidas para disseminação de malwares, spam ou fraudes financeiras;",
                "Testar vulnerabilidades ou executar testes de carga/estresse sem autorização prévia por escrito;",
                "Violar direitos de privacidade de terceiros ou infringir dispositivos da Lei Geral de Proteção de Dados (LGPD);",
                "Sublocar, revender ou transferir acessos à plataforma sem autorização contratual explícita.",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-200/90"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7 */}
          <section id="responsabilidade" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">7.</span> Limitação de
              Responsabilidade
            </h2>
            <p>
              Em nenhuma circunstância a FZ Build Solutions será responsável por
              danos indiretos, lucros cessantes, perda de receita ou perda de
              dados de clientes resultantes do uso indevido das ferramentas, má
              gestão de senhas corporativas pelo contratante ou integrações com
              serviços de terceiros descontinuados pelos respectivos
              fabricantes.
            </p>
            <p className="text-xs text-slate-400">
              A responsabilidade financeira total da FZ Build Solutions frente a
              qualquer reivindicação contratual ficará limitada ao valor
              efetivamente pago pelo cliente nos últimos 6 (seis) meses de
              prestação de serviços vinculados ao projeto específico.
            </p>
          </section>

          {/* Section 8 */}
          <section id="confidencialidade" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">8.</span> Confidencialidade e
              Proteção de Segredos de Negócio (NDA)
            </h2>
            <p>
              Reconhecemos que projetos de software frequentemente envolvem
              regras de negócio críticas, ideias de startups e segredos
              comerciais. A FZ Build Solutions compromete-se a manter sob sigilo
              rigoroso todas as informações confidenciais recebidas para a
              elaboração de escopos e desenvolvimento de produtos digitais,
              podendo formalizar acordos mútuos de confidencialidade (NDA) antes
              do início de qualquer especificação.
            </p>
          </section>

          {/* Section 9 */}
          <section id="rescisao" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">9.</span> Suspensão e
              Encerramento de Acesso
            </h2>
            <p>
              A FZ Build Solutions reserva-se o direito de suspender ou encerrar
              o acesso a seus sistemas, com ou sem aviso prévio, caso seja
              identificada violação grave destes Termos, inadimplência
              financeira conforme estipulado em contrato, ou solicitação
              expressa de autoridade judiciária competente.
            </p>
          </section>

          {/* Section 10 */}
          <section id="foro" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">10.</span> Legislação Aplicável e
              Foro de Eleição
            </h2>
            <p>
              Estes Termos de Uso são regidos e interpretados segundo as leis da
              República Federativa do Brasil, em especial o Marco Civil da
              Internet (Lei nº 12.965/2014) e a Lei Geral de Proteção de Dados
              (Lei nº 13.709/2018).
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-slate-300">
              Fica eleito o Foro da Comarca de Tubarão, Estado de Santa
              Catarina, ou alternativamente o Foro da Comarca da Capital de São
              Paulo/SP, para dirimir quaisquer litígios ou controvérsias
              decorrentes destes Termos, renunciando as partes a qualquer outro,
              por mais privilegiado que seja.
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#02050e] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <Image
              src="/fzbuildsemfundo.png"
              alt="FZ Build Solutions"
              width={24}
              height={24}
              className="h-6 w-auto brightness-0 invert opacity-80"
            />
            <span>
              © 2026 FZ Build Solutions LTDA. Todos os direitos reservados.
            </span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Início</span>
            </Link>
            <Link
              href="/privacidade"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Privacidade de Dados</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>
            <a
              href="mailto:fzbuild.solutions@gmail.com"
              className="hover:text-white transition-colors"
            >
              Suporte & Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
