import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Database,
  UserCheck,
  Server,
  Mail,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade & Proteção de Dados | FZ Build Solutions",
  description:
    "Diretrizes de privacidade, segurança da informação e conformidade com a LGPD (Lei 13.709/2018) da FZ Build Solutions LTDA.",
};

const SECTIONS = [
  { id: "controlador", label: "1. Controlador de Dados" },
  { id: "coleta", label: "2. Dados que Coletamos" },
  { id: "finalidade", label: "3. Finalidades do Tratamento" },
  { id: "bases-legais", label: "4. Bases Legais (LGPD)" },
  { id: "seguranca", label: "5. Segurança e Armazenamento" },
  { id: "compartilhamento", label: "6. Compartilhamento de Dados" },
  { id: "direitos", label: "7. Seus Direitos (Titular)" },
  { id: "cookies", label: "8. Cookies e Monitoramento" },
  { id: "dpo", label: "9. Contato do Encarregado (DPO)" },
  { id: "alteracoes", label: "10. Atualizações da Política" },
];

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-[#1e6bff]/30 selection:text-white relative overflow-hidden font-sans">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(30,107,255,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute top-[600px] -left-48 w-96 h-96 bg-[#0066ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[1200px] -right-48 w-96 h-96 bg-[#1e6bff]/10 rounded-full blur-3xl pointer-events-none" />

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e6bff]/10 border border-[#1e6bff]/30 text-[#60a5fa] text-xs font-medium mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#60a5fa]" />
          <span>LGPD Compliant · Lei nº 13.709/2018</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
          Política de Privacidade & Proteção de Dados
        </h1>

        <p className="mt-4 text-base md:text-lg text-slate-400 max-w-3xl leading-relaxed">
          Esta Política descreve como a <strong>FZ Build Solutions LTDA</strong>{" "}
          coleta, utiliza, armazena, processa e protege os dados pessoais de
          clientes, parceiros, usuários de sistemas e visitantes, em
          conformidade rigorosa com a Lei Geral de Proteção de Dados (LGPD) e as
          melhores práticas globais de segurança da informação.
        </p>

        <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#60a5fa]" />
            Última atualização: Outubro de 2026
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#60a5fa]" />
            Versão 2.1 · Em vigor
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
              <FileText className="w-3.5 h-3.5 text-[#1e6bff]" />
              <span>Sumário do Documento</span>
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
              <div className="p-3.5 rounded-xl bg-[#1e6bff]/10 border border-[#1e6bff]/20 space-y-2">
                <span className="text-xs font-semibold text-white block">
                  Dúvidas sobre seus dados?
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Nosso Encarregado de Dados (DPO) responde solicitações em até
                  15 dias úteis.
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
          <section id="controlador" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">1.</span> Controlador dos Dados
            </h2>
            <p>
              A <strong>FZ Build Solutions LTDA</strong>, pessoa jurídica de
              direito privado, inscrita no CNPJ sob o nº{" "}
              <strong>67.700.723/0001-74</strong>, com sede em Tubarão/SC e
              operações em São Paulo/SP, atua como{" "}
              <strong>Controladora de Dados Pessoais</strong> em relação às
              informações coletadas através de seus websites, canais de
              atendimento, prospecção comercial e plataformas proprietárias
              (incluindo FZ OS, EZYX e DP Core).
            </p>
            <p>
              Como Casa de Software, desenvolvemos softwares em nuvem sob
              medida, aplicativos móveis (iOS e Android), sistemas empresariais
              e websites de alta performance. Quando desenvolvemos softwares sob
              encomenda para clientes corporativos, podemos atuar na qualidade
              de <strong>Operadora de Dados</strong>, tratando dados
              estritamente sob as instruções do cliente contratante.
            </p>
          </section>

          {/* Section 2 */}
          <section id="coleta" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">2.</span> Dados Pessoais que
              Coletamos
            </h2>
            <p>
              Coletamos apenas os dados estritamente necessários para a execução
              dos serviços e o relacionamento corporativo:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <UserCheck className="w-4 h-4 text-[#1e6bff]" />
                  <span>Dados de Identificação e Contato</span>
                </div>
                <p className="text-xs text-slate-400">
                  Nome completo, cargo corporativo, empresa, e-mail comercial,
                  telefone/WhatsApp profissional e links de redes corporativas
                  (LinkedIn).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Database className="w-4 h-4 text-[#1e6bff]" />
                  <span>Dados Técnicos e de Navegação</span>
                </div>
                <p className="text-xs text-slate-400">
                  Endereço IP, registros de data/hora de acesso (logs), tipo de
                  navegador, resolução de tela e identificadores únicos de
                  sessão.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Lock className="w-4 h-4 text-[#1e6bff]" />
                  <span>Credenciais de Plataforma</span>
                </div>
                <p className="text-xs text-slate-400">
                  Identificador de usuário (UID), e-mail de autenticação e logs
                  criptografados de login para clientes acessando nossos
                  sistemas operacionais.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Server className="w-4 h-4 text-[#1e6bff]" />
                  <span>Demandas de Projetos de Software</span>
                </div>
                <p className="text-xs text-slate-400">
                  Informações fornecidas sobre requisitos técnicos, escopo de
                  aplicativos, APIs desejadas e arquiteturas para elaboração de
                  propostas comerciais.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="finalidade" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">3.</span> Finalidades do
              Tratamento
            </h2>
            <p>
              Utilizamos os dados coletados para finalidades legítimas e
              transparentes:
            </p>
            <ul className="space-y-2 pt-1">
              {[
                "Elaboração de propostas comerciais sob medida, orçamentos e contratos de engenharia de software;",
                "Desenvolvimento, manutenção e sustentação de sistemas em nuvem, aplicativos móveis e APIs contratadas;",
                "Comunicação direta com o cliente via e-mail, telefone corporativo ou WhatsApp sobre o andamento dos projetos;",
                "Gestão de acessos, segurança cibernética e prevenção a fraudes em nossos ambientes computacionais;",
                "Cumprimento de obrigações legais, regulatórias e fiscais brasileiras (como emissão de notas fiscais de serviços de TI).",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section id="bases-legais" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">4.</span> Bases Legais
              Autorizadoras (Art. 7º da LGPD)
            </h2>
            <p>
              Todo tratamento realizado pela FZ Build Solutions fundamenta-se em
              uma base legal expressa na Lei Geral de Proteção de Dados:
            </p>
            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                <strong className="text-white">
                  Execução de Contrato (Art. 7º, V):
                </strong>{" "}
                Para prestar os serviços de desenvolvimento de software,
                entregar sistemas e honrar termos contratuais acordados.
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                <strong className="text-white">
                  Legítimo Interesse (Art. 7º, IX):
                </strong>{" "}
                Para prospecção comercial ética B2B, aprimoramento de produtos e
                segurança dos sistemas corporativos, sempre respeitando os
                direitos e expectativas do titular.
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                <strong className="text-white">
                  Cumprimento de Obrigação Legal (Art. 7º, II):
                </strong>{" "}
                Para retenção de registros de acesso a aplicações (Marco Civil
                da Internet) e emissão de notas fiscais de tecnologia.
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                <strong className="text-white">
                  Consentimento (Art. 7º, I):
                </strong>{" "}
                Quando aplicável, mediante manifestação livre, informada e
                inequívoca do usuário para finalidades específicas.
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="seguranca" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">5.</span> Segurança da Informação
              e Armazenamento
            </h2>
            <p>
              Adotamos padrões de segurança de nível corporativo para resguardar
              seus dados contra acessos não autorizados, perda, vazamento ou
              destruição:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-1">
                <Lock className="w-5 h-5 text-[#60a5fa] mx-auto mb-1" />
                <span className="font-semibold text-white text-xs block">
                  Criptografia Forte
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Trânsito protegido via TLS/HTTPS e dados em repouso
                  criptografados (AES-256).
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-1">
                <Server className="w-5 h-5 text-[#60a5fa] mx-auto mb-1" />
                <span className="font-semibold text-white text-xs block">
                  Nuvem com Certificação
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Data centers Google Cloud e Firebase com certificações ISO
                  27001 e SOC 2.
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#60a5fa] mx-auto mb-1" />
                <span className="font-semibold text-white text-xs block">
                  Acesso Restrito
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Princípio do menor privilégio, senhas protegidas com hash e
                  múltiplos fatores (MFA).
                </span>
              </div>
            </div>
            <p className="pt-2 text-xs text-slate-400">
              Os dados são armazenados pelo período necessário para atingir as
              finalidades descritas, ou pelo tempo exigido por lei (por exemplo,
              6 meses para registros de IP conforme o Marco Civil da Internet e
              5 anos para documentos contábeis).
            </p>
          </section>

          {/* Section 6 */}
          <section id="compartilhamento" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">6.</span> Compartilhamento e
              Transferência Internacional
            </h2>
            <p>
              A{" "}
              <strong>
                FZ Build Solutions não comercializa nem compartilha dados
                pessoais com terceiros
              </strong>{" "}
              para fins publicitários. O compartilhamento ocorre exclusivamente
              com parceiros tecnológicos essenciais:
            </p>
            <ul className="space-y-2 pt-1 text-xs">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#1e6bff] mt-1.5 shrink-0" />
                <span>
                  <strong>Provedores de Infraestrutura em Nuvem:</strong> Google
                  Cloud Platform e Firebase (bancos de dados e hospedagem
                  resiliente);
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#1e6bff] mt-1.5 shrink-0" />
                <span>
                  <strong>Comunicação e Mensageria:</strong> Provedores
                  corporativos de e-mail e APIs seguras para disparos
                  operacionais;
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#1e6bff] mt-1.5 shrink-0" />
                <span>
                  <strong>Autoridades Públicas:</strong> Quando requisitado
                  formalmente por ordem judicial ou disposição legal expressa.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="direitos" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">7.</span> Direitos do Titular de
              Dados (Art. 18 da LGPD)
            </h2>
            <p>
              A qualquer momento e gratuitamente, você pode exercer seus
              direitos garantidos pela legislação brasileira:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              {[
                {
                  title: "Confirmação e Acesso",
                  desc: "Saber se tratamos seus dados e solicitar uma cópia dos mesmos.",
                },
                {
                  title: "Correção de Dados",
                  desc: "Atualizar ou retificar dados incompletos, inexatos ou desatualizados.",
                },
                {
                  title: "Anonimização ou Bloqueio",
                  desc: "Para dados desnecessários, excessivos ou tratados em desconformidade.",
                },
                {
                  title: "Eliminação e Exclusão",
                  desc: "Solicitar a deleção de dados tratados com seu consentimento.",
                },
                {
                  title: "Portabilidade de Dados",
                  desc: "Receber seus dados em formato estruturado para migração.",
                },
                {
                  title: "Revogação do Consentimento",
                  desc: "Retirar o consentimento previamente fornecido com efeito imediato.",
                },
              ].map((r, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1"
                >
                  <span className="font-semibold text-white block">
                    {r.title}
                  </span>
                  <span className="text-slate-400 block">{r.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Para exercer qualquer direito, envie um e-mail para{" "}
              <a
                href="mailto:fzbuild.solutions@gmail.com"
                className="text-[#60a5fa] underline hover:text-white"
              >
                fzbuild.solutions@gmail.com
              </a>{" "}
              com o assunto <em>&quot;Requisição LGPD&quot;</em>.
            </p>
          </section>

          {/* Section 8 */}
          <section id="cookies" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">8.</span> Cookies e Tecnologias
              de Monitoramento
            </h2>
            <p>
              Utilizamos cookies essenciais para o funcionamento do site e da
              aplicação (autenticação de sessão, preferência de tema e
              segurança). Não utilizamos cookies invasivos de rastreamento entre
              sites de terceiros sem seu conhecimento. Você pode desativar os
              cookies nas configurações do seu navegador, mas certas
              funcionalidades da plataforma poderão sofrer limitações.
            </p>
          </section>

          {/* Section 9 */}
          <section id="dpo" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">9.</span> Encarregado de Proteção
              de Dados (DPO)
            </h2>
            <p>
              Para esclarecer dúvidas, apresentar solicitações ou registrar
              reclamações sobre o tratamento de dados pessoais pela FZ Build
              Solutions, entre em contato com nosso canal de privacidade:
            </p>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Mail className="w-4 h-4 text-[#1e6bff]" />
                <span>Canal Oficial de Privacidade & DPO</span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Empresa:</strong> FZ Build Solutions LTDA (CNPJ:
                67.700.723/0001-74)
              </p>
              <p className="text-xs text-slate-300">
                <strong>E-mail:</strong>{" "}
                <a
                  href="mailto:fzbuild.solutions@gmail.com"
                  className="text-[#60a5fa] hover:underline"
                >
                  fzbuild.solutions@gmail.com
                </a>
              </p>
              <p className="text-xs text-slate-300">
                <strong>Endereço Comercial:</strong> Rua Porto Alegre, 520, Vila
                Moema, Tubarão – SC, CEP 88705-882
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="alteracoes" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#60a5fa]">10.</span> Atualizações desta
              Política
            </h2>
            <p>
              Esta Política de Privacidade poderá ser atualizada periodicamente
              para refletir novos aprimoramentos técnicos, novas leis ou novos
              produtos e serviços desenvolvidos pela Casa de Software. Qualquer
              alteração relevante será destacada em nossos canais oficiais com a
              data de revisão devidamente atualizada.
            </p>
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
              href="/termos"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Termos de Uso</span>
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
