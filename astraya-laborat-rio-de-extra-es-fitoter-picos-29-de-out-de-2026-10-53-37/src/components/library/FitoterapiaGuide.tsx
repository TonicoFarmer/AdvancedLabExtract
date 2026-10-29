import React, { useState } from 'react';
import {
  Leaf,
  Droplet,
  BookOpen,
  FlaskConical,
  Sparkles,
  Layers,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const FitoterapiaGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CANABINOIDES' | 'TERPENOS' | 'CARREADORES' | 'METODOS_REFERENCIAS'>('CANABINOIDES');
  const [terpeneFilter, setTerpeneFilter] = useState<'TODOS' | 'MONOTERPENOS' | 'SESQUITERPENOS' | 'OUTROS'>('TODOS');

  const canabinoides = [
    {
      nome: 'CBD (Canabidiol)',
      formula: 'C₂₁H₃₀O₂',
      propriedades: 'Ansiolítico, anti-inflamatório, neuroprotetor, anticonvulsivante, antioxidante e modulador alostérico negativo do receptor CB1.',
      pontoEbulicao: '160°C - 180°C',
      aplicacao: 'Tratamento de epilepsia refratária, dores crônicas, ansiedade generalizada, doenças neurodegenerativas e inflamações.',
      status: 'Não psicotrópico / Sem potencial de abuso',
    },
    {
      nome: 'THC (Tetrahidrocanabinol)',
      formula: 'C₂₁H₃₀O₂',
      propriedades: 'Agonista parcial dos receptores CB1 e CB2. Analgésico potente, relaxante muscular, estimulante do apetite e antiemético.',
      pontoEbulicao: '157°C',
      aplicacao: 'Dor neuropática, náuseas induzidas por quimioterapia, espasticidade na esclerose múltipla, insônia grave.',
      status: 'Psicoativo / Efeito dose-dependente',
    },
    {
      nome: 'CBG (Canabigerol)',
      formula: 'C₂₁H₃₂O₂',
      propriedades: 'Canabinoide primordial ("célula-tronco"). Antibacteriano potente, neuroprotetor e anti-inflamatório intestinal (IBD).',
      pontoEbulicao: '105°C - 120°C',
      aplicacao: 'Glaucoma (redução da pressão intraocular), colite ulcerativa, inflamações dérmicas e suporte de foco cognitivo.',
      status: 'Não psicotrópico',
    },
    {
      nome: 'CBN (Canabinol)',
      formula: 'C₂₁H₂₆O₂',
      propriedades: 'Produto de degradação e oxidação suave do THC. Sedativo notável, relaxante muscular e modulador do sono.',
      pontoEbulicao: '185°C',
      aplicacao: 'Transtornos do sono, insônia primária, alívio de espasmos musculares e analgesia leve.',
      status: 'Sedativo / Levemente psicoativo em altas doses',
    },
    {
      nome: 'CBC (Canabicromeno)',
      formula: 'C₂₁H₃₀O₂',
      propriedades: 'Agonista dos receptores TRPV1 e TRPA1. Antifúngico, analgésico e promotor de neurogênese.',
      pontoEbulicao: '220°C',
      aplicacao: 'Acne e inflamações cutâneas, dor periférica e depressão.',
      status: 'Não psicotrópico',
    },
  ];

  const terpenos = [
    {
      nome: 'Beta-Mirceno',
      classe: 'MONOTERPENOS',
      isoprenos: 'Monoterpeno Acíclico (10 Carbonos - 2 Isoprenos)',
      formula: 'C₁₀H₁₆',
      aroma: 'Terroso, almiscarado, cravo, manga e lúpulo',
      ebulicao: '166°C - 168°C',
      efeitos: 'Miorrelaxante periférico, sedativo central, analgesia e incremento da permeabilidade da barreira hematoencefálica (BHE) para fitocanabinoides.',
      sinergia: 'Excelente sinergia com THC e CBN para indução de sono profundo e relaxamento muscular noturno.',
      fontes: 'Cannabis sativa, Humulus lupulus (lúpulo), Mangifera indica (manga), Myrcia sphaerocarpa.',
    },
    {
      nome: 'D-Limoneno',
      classe: 'MONOTERPENOS',
      isoprenos: 'Monoterpeno Monocíclico (10 Carbonos - 2 Isoprenos)',
      formula: 'C₁₀H₁₆',
      aroma: 'Cítrico pungente, casca de limão, laranja e toranja',
      ebulicao: '176°C',
      efeitos: 'Elevador de humor, ansiolítico (modulação serotoninérgica 5-HT1A), gastroprotetor, imunoestimulante e solvente natural de lipídeos.',
      sinergia: 'Sinergia potente com CBD para clareza mental, melhora do foco e alívio do estresse diurno sem sedação.',
      fontes: 'Citrus sinensis, Citrus limon, Cannabis sativa, sementes de cominho.',
    },
    {
      nome: 'Alfa e Beta-Pineno',
      classe: 'MONOTERPENOS',
      isoprenos: 'Monoterpeno Bicíclico (10 Carbonos - 2 Isoprenos)',
      formula: 'C₁₀H₁₆',
      aroma: 'Pinho fresco, resinoso, florestal e alecrim',
      ebulicao: '155°C - 165°C',
      efeitos: 'Broncodilatador eficaz em baixas concentrações, anti-inflamatório tópica/sistêmica e potente inibidor da acetilcolinesterase (AChE).',
      sinergia: 'Atenua déficits de memória de curto prazo e sonolência causados pelo THC, promovendo foco e atenção lúcida.',
      fontes: 'Pinus spp., Rosmarinus officinalis (alecrim), Eucalyptus globulus, Cannabis sativa.',
    },
    {
      nome: 'Linalol',
      classe: 'MONOTERPENOS',
      isoprenos: 'Monoterpenol Acíclico (10 Carbonos - 2 Isoprenos)',
      formula: 'C₁₀H₁₈O',
      aroma: 'Floral doce, lavanda francesa, lírio e manjericão',
      ebulicao: '198°C',
      efeitos: 'Sedativo e ansiolítico (modulador GABAérgico), anticonvulsivante, anti-hipertensivo leve e modulador da dor inflamatória.',
      sinergia: 'Potencializa o efeito calmante e espasmolítico do CBD e de extratos botânicos de Passiflora e Matricaria.',
      fontes: 'Lavandula angustifolia (lavanda), Ocimum basilicum (manjericão), Coriandrum sativum, Cannabis sativa.',
    },
    {
      nome: 'Beta-Cariofileno (BCP)',
      classe: 'SESQUITERPENOS',
      isoprenos: 'Sesquiterpeno Bicíclico (15 Carbonos - 3 Isoprenos)',
      formula: 'C₁₅H₂₄',
      aroma: 'Picante, amadeirado, pimenta-preta e cravo',
      ebulicao: '130°C - 139°C',
      efeitos: 'Atua como "fitocanabinoide dietético" funcional ligando-se seletivamente aos receptores CB2; potente anti-inflamatório gástrico, cardioprotetor e analgésico não-psicotrópico.',
      sinergia: 'Reduz mediadores pró-inflamatórios (TNF-α, IL-1β) em sinergia com CBD sem ativação de receptores CB1.',
      fontes: 'Piper nigrum (pimenta-preta), Eugenia caryophyllata (cravo), Copaifera spp. (copaíba), Cannabis sativa.',
    },
    {
      nome: 'Alfa-Humuleno (α-Cariofileno)',
      classe: 'SESQUITERPENOS',
      isoprenos: 'Sesquiterpeno Monocíclico (15 Carbonos - 3 Isoprenos)',
      formula: 'C₁₅H₂₄',
      aroma: 'Lupulado, amadeirado, terroso e balsâmico',
      ebulicao: '106°C - 108°C (a vácuo)',
      efeitos: 'Princípio ativo marcador do fitoterápico brasileiro Acheflan® (Cordia verbenacea); potente inibidor de COX-2 e de prostaglandina E2 (PGE2), com eficácia anti-inflamatória clínica comprovada.',
      sinergia: 'Ação anorexígena leve e pronunciada ação anti-inflamatória tópica e oral associada a canabinoides.',
      fontes: 'Cordia verbenacea (erva-baleeira), Humulus lupulus (lúpulo), Cannabis sativa.',
    },
    {
      nome: 'Alfa-Bisabolol',
      classe: 'SESQUITERPENOS',
      isoprenos: 'Sesquiterpenol Monocíclico (15 Carbonos - 3 Isoprenos)',
      formula: 'C₁₅H₂₆O',
      aroma: 'Floral suave, camomila, doce e amadeirado',
      ebulicao: '153°C',
      efeitos: 'Anti-irritante dérmico de referência, cicatrizante acelerado, antimicrobiano contra patógenos oportunistas e anti-inflamatório da mucosa gástrica.',
      sinergia: 'Aumenta a absorção dérmica de canabinoides em formulações tópicas, pomadas e cremes transdérmicos ASTRAYA.',
      fontes: 'Matricaria recutita (camomila), Vanillosmopsis erythropappa (candeia), Cannabis sativa.',
    },
    {
      nome: 'Betacaroteno & Carotenoides',
      classe: 'OUTROS',
      isoprenos: 'Tetraterpeno (40 Carbonos - 8 Isoprenos)',
      formula: 'C₄₀H₅₆',
      aroma: 'Inodoro / Pigmento lipossolúvel alaranjado intenso',
      ebulicao: 'Degrada acima de 180°C',
      efeitos: 'Precursor vital de Vitamina A (Retinol). Antioxidante extintor de oxigênio singlete, protetor contra estresse oxidativo fotoquímico e modulador imunológico.',
      sinergia: 'Protege os óleos carreadores e fitocanabinoides contra foto-oxidação e peroxidação lipídica em formulações.',
      fontes: 'Daucus carota (cenoura), Elaeis guineensis (óleo de palma), frutos e folhas superiores.',
    },
  ];

  const carreadores = [
    {
      nome: 'TCM (Triglicerídeos de Cadeia Média - Óleo de Coco Fracionado)',
      vantagens: 'Rápida absorção gástrica, alta estabilidade oxidativa, límpido, sem sabor residual e excelente bioequivalência.',
      viscosidade: 'Baixa / Fluida (Fácil gotejamento uniforme)',
      validade: 'Até 24 meses',
      posologia: 'Padrão ouro para óleos orais e sublinguais ASTRAYA.',
    },
    {
      nome: 'Azeite de Oliva Extra Virgem (Prensado a Frio)',
      vantagens: 'Rico em ácidos graxos monoinsaturados (ácido oleico) e polifenóis antioxidantes naturais.',
      viscosidade: 'Média (Sabor característico herbal suave)',
      validade: '12 a 18 meses (armazenar ao abrigo da luz)',
      posologia: 'Excelente para formulações fitoterápicas e pacientes com sensibilidade gástrica.',
    },
    {
      nome: 'Óleo de Semente de Cânhamo (Hemp Seed Oil)',
      vantagens: 'Proporção ideal 3:1 de Ômega-6 para Ômega-3, rico em ácido gama-linolênico (GLA).',
      viscosidade: 'Média / Sabor noz característico',
      validade: '6 a 12 meses (Requer refrigeração pós-abertura)',
      posologia: 'Especialmente indicado para saúde dérmica e efeito comitiva completo da planta.',
    },
  ];

  const referenciasBibliograficas = [
    {
      autor: 'Cechinel Filho, V.; Zanchett, C. C. C.',
      titulo: 'Fitoterapia avançada: uma abordagem química, biológica e nutricional',
      local: 'Porto Alegre: Artmed',
      ano: '2020 (ISBN 978-65-81335-15-1)',
      topico: 'Tratado completo de princípios ativos, flavonoides, alcaloides e terpenos.',
    },
    {
      autor: 'Niero, R.; Malheiros, A.',
      titulo: 'Principais aspectos químicos e biológicos de terpenos',
      local: 'In: Química de produtos naturais, novos fármacos e a moderna farmacognosia. Itajaí: Univali',
      ano: '2016. p. 323-347',
      topico: 'Biossíntese a partir das unidades de isopreno, hidrodestilação e partição com solventes apolares.',
    },
    {
      autor: 'Carvalho, A. M. S.; Heimfarth, L.; Santos, K. A.; et al.',
      titulo: 'Terpenes as possible drugs for the mitigation of arthritic symptoms: a systematic review',
      local: 'Phytomedicine',
      ano: '2019; 57: 137-147',
      topico: 'Ação de monoterpenos e sesquiterpenos no controle de processos inflamatórios e artríticos.',
    },
    {
      autor: 'Silva, E. A. P.; Carvalho, J. S.; Guimarães, A. G.; et al.',
      titulo: 'The use of terpenes and derivatives as a new perspective for cardiovascular disease treatment: a patent review (2008-2018)',
      local: 'Expert Opin Ther Pat',
      ano: '2019; 29(1): 43-53',
      topico: 'Propriedades vasorrelaxantes, cardioprotetoras e antioxidantes de terpenoides naturais.',
    },
    {
      autor: 'Tariq, S.; Wani, S.; Rasool, W.; Shafi, K.; et al.',
      titulo: 'A comprehensive review of the antibacterial, antifungal and antiviral potential of essential oils and their chemical constituents',
      local: 'Microb Pathog',
      ano: '2019; 134: 103580',
      topico: 'Atividade antimicrobiana de constituintes voláteis de óleos essenciais contra patógenos resistentes.',
    },
    {
      autor: 'Russo, E. B.',
      titulo: 'Taming THC: potential cannabis synergy and phytocannabinoid-terpenoid entourage effects',
      local: 'Br J Pharmacol',
      ano: '2011; 163(7): 1344-1364',
      topico: 'Mecanismo farmacológico do Efeito Comitiva (Entourage Effect) entre fitocanabinoides e terpenos.',
    },
  ];

  const filteredTerpenos = terpeneFilter === 'TODOS'
    ? terpenos
    : terpenos.filter((t) => t.classe === terpeneFilter);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif italic text-slate-800 font-normal">
                Fitoterapia & Farmacopeia Brasileira
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Cechinel Filho (Artmed 2020)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Guia fitoquímico e farmacológico de terpenos, fitocanabinoides, carreadores e sinergias botânicas
            </p>
          </div>

          {/* Tab selector - Compact Buttons with mobile scroll */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('CANABINOIDES')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'CANABINOIDES'
                  ? 'bg-white text-emerald-800 shadow-2xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fitocanabinoides
            </button>

            <button
              onClick={() => setActiveTab('TERPENOS')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'TERPENOS'
                  ? 'bg-white text-emerald-800 shadow-2xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Terpenos & Voláteis
            </button>

            <button
              onClick={() => setActiveTab('CARREADORES')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'CARREADORES'
                  ? 'bg-white text-emerald-800 shadow-2xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Veículos Carreadores
            </button>

            <button
              onClick={() => setActiveTab('METODOS_REFERENCIAS')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'METODOS_REFERENCIAS'
                  ? 'bg-white text-emerald-800 shadow-2xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Métodos & Referências
            </button>
          </div>
        </div>
      </div>

      {/* Canabinoides Tab */}
      {activeTab === 'CANABINOIDES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {canabinoides.map((can, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 shadow-xs space-y-2.5 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {can.nome}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">{can.formula}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">
                  Ebulição: {can.pontoEbulicao}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">
                  Propriedades Farmacodinâmicas:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">{can.propriedades}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-700 block mb-0.5">
                  Aplicações Fitoterápicas Principais:
                </span>
                <p className="text-xs text-slate-800">{can.aplicacao}</p>
              </div>

              <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                Status: {can.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Terpenos Tab */}
      {activeTab === 'TERPENOS' && (
        <div className="space-y-3.5">
          {/* Sub-filter bar for Terpenes */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                Classificação Isoprenoide (Manual Cechinel Filho):
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {[
                { id: 'TODOS', label: 'Todos os Terpenos' },
                { id: 'MONOTERPENOS', label: 'Monoterpenos (C10)' },
                { id: 'SESQUITERPENOS', label: 'Sesquiterpenos (C15)' },
                { id: 'OUTROS', label: 'Tetraterpenos (C40)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTerpeneFilter(f.id as any)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer border ${
                    terpeneFilter === f.id
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTerpenos.map((terp, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 shadow-xs space-y-2.5 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {terp.nome}
                    </h3>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-amber-800">{terp.formula}</span>
                      <span>•</span>
                      <span>{terp.isoprenos}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">
                    {terp.ebulicao}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Perfil Aromático: </span>
                  {terp.aroma}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block mb-0.5">
                    Efeitos Terapêuticos & Farmacocinéticos:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{terp.efeitos}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-0.5">
                    Efeito Comitiva (Entourage Sinergia):
                  </span>
                  <p className="text-xs text-slate-800">{terp.sinergia}</p>
                </div>

                <div className="text-[10.5px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">Fontes Naturais: </span>
                  {terp.fontes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carreadores Tab */}
      {activeTab === 'CARREADORES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {carreadores.map((carr, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-7 h-7 rounded bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Droplet className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{carr.nome}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{carr.vantagens}</p>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1">
                  <div>
                    <span className="text-slate-500 font-semibold text-[11px] uppercase">Viscosidade: </span>
                    <span className="text-slate-900 font-medium">{carr.viscosidade}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold text-[11px] uppercase">Validade: </span>
                    <span className="text-amber-800 font-bold font-mono">{carr.validade}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 font-medium pt-2 border-t border-slate-100">
                {carr.posologia}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metodos & Referencias Bibliográficas do Livro */}
      {activeTab === 'METODOS_REFERENCIAS' && (
        <div className="space-y-4">
          {/* Métodos de Obtenção de Terpenos segundo Cechinel Filho 2020 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Métodos Farmacêuticos de Obtenção & Purificação de Terpenos (Capítulo 3)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-emerald-800 block text-[11px] uppercase">1. Arraste a Vapor & Hidrodestilação</span>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Método clássico indicado para monoterpenos (C10) e sesquiterpenos (C15) voláteis de óleos essenciais, além de destilação fracionada a vácuo.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-emerald-800 block text-[11px] uppercase">2. Extração por Fluido Supercrítico</span>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Utiliza CO₂ supercrítico para obtenção seletiva e sem resíduos de solvente térmico, preservando terpenoides termossensíveis e canabinoides.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-emerald-800 block text-[11px] uppercase">3. Partição com Solventes Apolares</span>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Extração líquida direta ou fracionamento com solventes orgânicos apolares (hexano, diclorometano, clorofórmio) para triterpenos e resinas.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-emerald-800 block text-[11px] uppercase">4. Purificação & CLAE / HPLC</span>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Cromatografia em coluna em sílica-gel, cromatografia centrífuga e CLAE para isolamento analítico e determinação de substâncias marcadoras.
                </p>
              </div>
            </div>
          </div>

          {/* Tabela de Referências Bibliográficas do Tratado */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Referências Bibliográficas Fundamentais (Capítulo de Terpenos & Fitoterápicos)
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Fitoterapia Avançada • Artmed
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {referenciasBibliograficas.map((ref, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs text-slate-900">
                      <span className="font-bold text-slate-900">{ref.autor}</span>.{' '}
                      <span className="italic text-slate-800 font-semibold">{ref.titulo}</span>.{' '}
                      <span className="text-slate-600">{ref.local}, {ref.ano}.</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                      Ref #{idx + 1}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    <span className="font-semibold text-slate-700">Contexto: </span>
                    {ref.topico}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

