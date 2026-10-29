import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Printer,
  ChevronRight,
  ShieldCheck,
  Flame,
  Droplets,
  BookOpen,
  Scale,
  Thermometer,
  Award,
  Check,
  Copy,
  FileDown,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalculadoraDosagemPesagemAstraya } from '../calculators/CalculadoraDosagemPesagemAstraya';
import {
  exportPopManualPdf,
  mapSectionIdToGroupKey,
  PopPrintScope,
} from '../../utils/popPdfExport';

// Tipagem das seções do Manual POP Astraya
interface PopSection {
  id: string;
  number: string;
  title: string;
  category: 'GERAL' | 'SEGURANCA' | 'EXTRACAO' | 'FORMULACAO' | 'METROLOGIA' | 'QUALIDADE';
  summary: string;
}

interface PrintGroupMeta {
  key: string;
  badge: string;
  title: string;
  forcePageBreak?: boolean;
}

const PRINT_MANUAL_GROUPS: PrintGroupMeta[] = [
  {
    key: 'grp-01-02',
    badge: 'Sec. 01 & 02',
    title: 'Capa, Identificação Oficial & Código de Conduta (MBPL-0001)',
  },
  {
    key: 'grp-03-04',
    badge: 'Sec. 03 & 04',
    title: 'Objetivo, Aplicação (Ibiúna-SP), Matriz de Responsabilidades & Glossário',
  },
  {
    key: 'grp-05',
    badge: 'Sec. 05',
    title: 'Organização Pessoal, 5S & Higienização',
  },
  {
    key: 'grp-06',
    badge: 'Sec. 06',
    title: 'Infraestrutura Laboratorial & Áreas',
  },
  {
    key: 'grp-07-08',
    badge: 'Sec. 07 & 08',
    title: 'Segurança, EPIs (NR-06) & Proteção Contra Incêndios (NR-23)',
  },
  {
    key: 'grp-09-10',
    badge: 'Sec. 09 & 10',
    title: 'Extração de Fitocanabinoides & POP Etanol a Frio com Gelo Seco (-60°C)',
  },
  {
    key: 'grp-11',
    badge: 'Sec. 11',
    title: 'POP Extração Rosin (Calor & Prensa 4t)',
  },
  {
    key: 'grp-12',
    badge: 'Sec. 12',
    title: 'Armazenamento, Descarboxilação (95°C) & TCM',
  },
  {
    key: 'grp-13',
    badge: 'Sec. 13',
    title: 'Formulações Orais (CBD Ygriega & THC Melon)',
  },
  {
    key: 'grp-14',
    badge: 'Sec. 14',
    title: 'Formulações Dermatológicas (Óleo, Creme & Pomada)',
    forcePageBreak: true,
  },
  {
    key: 'grp-15',
    badge: 'Sec. 15',
    title: 'Tabela de Dosagens para Prescritores Médicos',
  },
  {
    key: 'grp-16-18',
    badge: 'Sec. 16, 17 & 18',
    title: 'Equipamentos, Calibração, Gestão de Resíduos & Referências Oficiais',
    forcePageBreak: true,
  },
];

interface PopSectionContentProps {
  groupKey: string;
  isPrintMode?: boolean;
}

const PopSectionContent: React.FC<PopSectionContentProps> = ({
  groupKey,
  isPrintMode = false,
}) => {
  const bodyText = isPrintMode
    ? 'text-[13.5px] leading-relaxed'
    : 'text-xs leading-relaxed print:text-[13.5px]';
  const smallText = isPrintMode
    ? 'text-[12.5px] leading-relaxed'
    : 'text-[11px] print:text-[12.5px]';
  const labelText = isPrintMode
    ? 'text-xs'
    : 'text-[10px] print:text-xs';
  const cardHeading = isPrintMode
    ? 'text-sm'
    : 'text-xs print:text-sm';
  const cardPad = isPrintMode ? 'p-4' : 'p-3.5 print:p-4';

  return (
    <div className={`space-y-4 text-slate-800 ${bodyText}`}>
      {/* SEC 01 & 02: CAPA E CÓDIGO DE CONDUTA */}
      {groupKey === 'grp-01-02' && (
        <>
          <div className={`bg-emerald-50/50 ${cardPad} rounded-lg border border-emerald-200 pop-print-avoid-break`}>
            <div className={`flex items-center gap-2 text-emerald-900 font-bold mb-1.5 ${isPrintMode ? 'text-base' : 'text-sm print:text-base'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Documento Oficial de Boas Práticas de Laboratório (MBPL-0001 Rev. 1.0)</span>
            </div>
            <p className="text-slate-700">
              Manual institucional elaborado para estabelecer as diretrizes de execução das atividades nas dependências e laboratórios da <strong>Associação Astraya</strong> em Ibiúna - SP, garantindo padronização, eficiência, segurança ocupacional e confiabilidade metrológica nas análises e processos produtivos.
            </p>
          </div>

          <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 space-y-2.5 pop-print-avoid-break`}>
            <h4 className={`font-bold text-slate-900 uppercase tracking-wider ${cardHeading}`}>
              Código de Conduta, Direitos e Deveres dos Colaboradores
            </h4>
            <ul className="space-y-2 list-disc pl-5 text-slate-700">
              <li><strong>Condições Adequadas:</strong> Garantia de infraestrutura, procedimentos validados e instruções de trabalho atualizadas.</li>
              <li><strong>Capacitação Contínua:</strong> Treinamento periódico nas Boas Práticas Laboratoriais e regras estatutárias.</li>
              <li><strong>Integridade dos Dados:</strong> Registro fidedigno e rastreabilidade absoluta de todas as análises químicas, físicas e microbiológicas.</li>
              <li><strong>Dever de Reporte:</strong> Obrigação de notificar prontamente qualquer desvio de qualidade através de RNC (Registro de Não Conformidade).</li>
            </ul>
          </div>
        </>
      )}

      {/* SEC 03 & 04: OBJETIVO, APLICAÇÃO & GLOSSÁRIO */}
      {groupKey === 'grp-03-04' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3.5">
            <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 pop-print-avoid-break`}>
              <span className={`${labelText} uppercase font-bold text-emerald-800 block mb-1.5`}>
                1. Objetivo Principal
              </span>
              <p className="text-slate-700">
                Estabelecer as diretrizes operacionais para execução de todas as atividades laboratoriais na Associação Astraya, buscando padronização, eficiência e segurança no manuseio de fitoterápicos.
              </p>
            </div>
            <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 pop-print-avoid-break`}>
              <span className={`${labelText} uppercase font-bold text-emerald-800 block mb-1.5`}>
                2. Campo de Aplicação
              </span>
              <p className="text-slate-700">
                Aplicável a todos os laboratórios, áreas de cultivo, extração, armazenamento, dispensação, embalagem e escritório na sede da <strong>Associação Astraya em Ibiúna - SP</strong>.
              </p>
            </div>
          </div>

          <div>
            <span className={`${labelText} uppercase font-bold text-slate-500 block mb-2`}>
              Glossário de Termos e Definições Regulatórias:
            </span>
            <div className={`grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2.5 ${smallText}`}>
              {[
                { termo: 'Ação Corretiva', desc: 'Ação realizada para corrigir uma não conformidade existente, eliminando a causa raiz.' },
                { termo: 'Ação Preventiva', desc: 'Ação para eliminar um risco potencial antes que o problema ocorra.' },
                { termo: 'Amostragem', desc: 'Coleta de amostras representativas definidas estatisticamente pelo tamanho do lote.' },
                { termo: 'Calibração', desc: 'Relação documentada entre valores indicados por um instrumento e padrões de referência.' },
                { termo: 'FISPQ / FDS', desc: 'Ficha com Dados de Segurança de Produtos Químicos de acesso obrigatório aos colaboradores.' },
                { termo: 'Garantia da Qualidade', desc: 'Gestão focada em demonstrar que todos os requisitos técnicos foram cumpridos.' },
                { termo: 'Método Analítico', desc: 'Descrição dos procedimentos analíticos e ensaios físico-químicos das matrizes.' },
                { termo: 'RNC (Relatório Não Conformidade)', desc: 'Registro formal de desvios, ações corretivas, preventivas e notificação à Diretoria.' },
                { termo: 'Substância de Referência', desc: 'Material de referência com características uniformes para calibração e ensaios.' },
                { termo: 'Validação Metrológica', desc: 'Ato documentado que atesta que processos e equipamentos fornecem resultados consistentes.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded border border-slate-200 pop-print-avoid-break">
                  <span className="font-bold text-slate-900">{item.termo}: </span>
                  <span className="text-slate-600">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* SEC 05: HIGIENE PESSOAL & GUIA 5S */}
      {groupKey === 'grp-05' && (
        <>
          <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 pop-print-avoid-break`}>
            <h4 className={`font-bold text-slate-900 uppercase mb-1.5 ${cardHeading}`}>
              Organização Pessoal e Metodologia 5S
            </h4>
            <p className="text-slate-700">
              A organização das bancadas e áreas produtivas obedece rigorosamente aos 5 sensos da metodologia 5S (Utilização, Organização, Limpeza, Padronização e Disciplina). Objetos desnecessários devem ser removidos das bancadas para evitar contaminação cruzada e atos inseguros.
            </p>
          </div>

          <div className={`border border-emerald-200 bg-emerald-50/40 ${cardPad} rounded-lg space-y-3`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-700 shrink-0" />
                <h4 className={`font-bold text-emerald-950 uppercase ${cardHeading}`}>
                  Procedimento Padrão de Higienização das Mãos (Duração: 40 a 60 segundos)
                </h4>
              </div>
              <span className={`${labelText} font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded`}>
                Obrigatório na entrada/saída do laboratório
              </span>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-3 ${isPrintMode ? 'md:grid-cols-3' : 'md:grid-cols-4 print:grid-cols-3'} gap-2.5`}>
              {[
                { p: '0', t: 'Umedecer', d: 'Molhar as mãos com água corrente limpa.' },
                { p: '1', t: 'Sabão', d: 'Aplicar sabão líquido suficiente para cobrir toda a superfície.' },
                { p: '2', t: 'Palmas', d: 'Friccionar as palmas das mãos entre si com firmeza.' },
                { p: '3', t: 'Dorso e Dedos', d: 'Friccionar a palma direita sobre o dorso da esquerda entrelaçando os dedos e vice-versa.' },
                { p: '4', t: 'Entrelaçado', d: 'Friccionar palma contra palma com dedos entrelaçados.' },
                { p: '5', t: 'Dorso dos Dedos', d: 'Friccionar o dorso dos dedos na palma oposta segurando os dedos.' },
                { p: '6', t: 'Polegares', d: 'Friccionar o polegar com movimento circular na palma da outra mão.' },
                { p: '7', t: 'Pontas e Unhas', d: 'Friccionar as pontas dos dedos e unhas em círculos na palma oposta.' },
                { p: '8', t: 'Enxaguar', d: 'Enxaguar abundantemente com água corrente eliminando o sabão.' },
                { p: '9', t: 'Secar', d: 'Secar as mãos com papel toalha descartável de uso único.' },
                { p: '10', t: 'Torneira', d: 'Utilizar o mesmo papel toalha para fechar a torneira.' },
                { p: '11', t: 'Mãos Seguras', d: 'Mãos higienizadas e prontas para colocação de luvas e EPIs.' },
              ].map((step) => (
                <div key={step.p} className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs pop-print-avoid-break">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`${isPrintMode ? 'w-5 h-5 text-[11px]' : 'w-4 h-4 text-[9px] print:w-5 print:h-5 print:text-[11px]'} rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center shrink-0`}>
                      {step.p}
                    </span>
                    <span className={`font-bold text-slate-800 ${isPrintMode ? 'text-xs' : 'text-[10.5px] print:text-xs'}`}>
                      {step.t}
                    </span>
                  </div>
                  <p className={`text-slate-600 leading-snug ${isPrintMode ? 'text-xs' : 'text-[10px] print:text-xs'}`}>
                    {step.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* SEC 06: INFRAESTRUTURA */}
      {groupKey === 'grp-06' && (
        <>
          <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 space-y-2.5 pop-print-avoid-break`}>
            <h4 className={`font-bold text-slate-900 uppercase tracking-wider ${cardHeading}`}>
              Divisão Física e Requisitos Estruturais
            </h4>
            <p className="text-slate-700">
              As instalações da Associação Astraya são estruturadas em divisões independentes para evitar qualquer risco de contaminação cruzada:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3.5 rounded border border-slate-200 pop-print-avoid-break">
                <span className={`font-bold text-emerald-800 block mb-1 ${cardHeading}`}>1. Setor de Secagem</span>
                <p className={`${smallText} text-slate-600`}>Ambiente climatizado destinado à conservação do material vegetal após colheita com rígido controle fitossanitário, se utilizando de tendas lacradas com secagem controlada e ajustada para a temperatura de 18 °C e umidade relativa (UR) entre 55% e 60%, através de ar condicionado e desumidificador.</p>
              </div>
              <div className="bg-white p-3.5 rounded border border-slate-200 pop-print-avoid-break">
                <span className={`font-bold text-blue-800 block mb-1 ${cardHeading}`}>2. Lab. Extração &amp; Dispensação</span>
                <p className={`${smallText} text-slate-600`}>Área limpa, capela com exaustão, manipuladores com paramentação integral e fluxo de ar.</p>
              </div>
              <div className="bg-white p-3.5 rounded border border-slate-200 pop-print-avoid-break">
                <span className={`font-bold text-amber-800 block mb-1 ${cardHeading}`}>3. Área de Descarte</span>
                <p className={`${smallText} text-slate-600`}>Local segregado para resíduos perigosos e biológicos conforme Plano de Gerenciamento.</p>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3.5 ${smallText}`}>
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1 pop-print-avoid-break">
              <span className={`font-bold text-slate-900 uppercase block ${labelText}`}>Revestimentos &amp; Pisos:</span>
              <p className="text-slate-700">Paredes e pisos de materiais neutros, não porosos, de cor clara e fácil higienização, com o mínimo de rejunte possível para impedir acúmulo de partículas nas reentrâncias.</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1 pop-print-avoid-break">
              <span className={`font-bold text-slate-900 uppercase block ${labelText}`}>Vestiários &amp; Convivência:</span>
              <p className="text-slate-700">Totalmente separados das áreas produtivas e de análise. Proibido transitar com EPIs (jalecos, propés) fora das salas limpas.</p>
            </div>
          </div>
        </>
      )}

      {/* SEC 07 & 08: SEGURANÇA, EPIS & INCÊNDIOS */}
      {groupKey === 'grp-07-08' && (
        <>
          <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 space-y-2.5 pop-print-avoid-break`}>
            <h4 className={`font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 ${cardHeading}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Regras Fundamentais de Segurança Laboratorial (NR-06 e NR-23)</span>
            </h4>
            <div className={`grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2.5 ${smallText}`}>
              <div className="space-y-1.5 text-slate-700">
                <p>• Proibido comer, beber ou fumar dentro dos laboratórios.</p>
                <p>• FISPQs físicas e eletrônicas disponíveis junto aos reagentes.</p>
                <p>• Avental de manga longa sem bolsos e sem tecido inflamável.</p>
                <p>• Cabelos presos, calçado fechado e proibição de adornos/joias.</p>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <p>• Proibido pipetar com a boca (uso estrito de peras de sucção).</p>
                <p>• Uso obrigatório de óculos de segurança e luvas nitrílicas.</p>
                <p>• Lava-olhos de emergência permanentemente desobstruído.</p>
                <p>• Visitantes com touca, propé e autorização da RT.</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden pop-print-avoid-break">
            <div className={`bg-slate-100 p-3 font-bold text-slate-800 uppercase flex items-center gap-1.5 ${cardHeading}`}>
              <Flame className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Classificação de Incêndios e Extintores Aplicáveis (NR-23)</span>
            </div>
            <div className="overflow-x-auto">
              <table className={`w-full text-left text-slate-700 ${smallText}`}>
                <thead className={`bg-slate-50 font-bold text-slate-500 uppercase border-b border-slate-200 ${labelText}`}>
                  <tr>
                    <th className="p-3">Classe</th>
                    <th className="p-3">Materiais Combustíveis</th>
                    <th className="p-3">Agente Extintor Recomendado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Classe A</td>
                    <td className="p-3">Sólidos: papel, madeira, tecidos, algodão</td>
                    <td className="p-3 font-semibold text-emerald-800">Água pressurizada / Espuma mecânica</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Classe B</td>
                    <td className="p-3">Líquidos inflamáveis, solventes, álcool 96%, ceras</td>
                    <td className="p-3 font-semibold text-rose-800">Dióxido de Carbono (CO2) / Pó Químico Seco</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Classe C</td>
                    <td className="p-3">Equipamentos elétricos energizados, agitadores, prensas</td>
                    <td className="p-3 font-semibold text-blue-800">CO2 / Pó Químico (Nunca usar água!)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Classe D</td>
                    <td className="p-3">Metais pirofóricos (lítio, magnésio, zircônio)</td>
                    <td className="p-3 text-amber-800 font-medium">Pó químico especial Classe D</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Classe K</td>
                    <td className="p-3">Óleos vegetais, gorduras e fritadeiras</td>
                    <td className="p-3 text-purple-800 font-medium">Solução de acetato de potássio (Classe K)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* SEC 09 & 10: POP EXTRAÇÃO ETANOL A FRIO & GELO SECO */}
      {groupKey === 'grp-09-10' && (
        <>
          <div className={`bg-blue-50/60 ${cardPad} rounded-lg border border-blue-200 pop-print-avoid-break`}>
            <div className={`flex items-center gap-2 text-blue-950 font-bold uppercase mb-1.5 ${cardHeading}`}>
              <Thermometer className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Método 1: Extração Criogênica por Etanol a -60°C com Gelo Seco</span>
            </div>
            <p className="text-slate-700">
              Baseado no <em>Método Accura</em> (Ian Guedes &amp; Felipe de Castro) e estudos de Virginia Carvalho (2023). A baixíssima temperatura congela a água intracelular, impedindo o rompimento dos cloroplastos e minimizando ceras, preservando mais de 90% dos monoterpenos e canabinoides.
            </p>
          </div>

          <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 pop-print-avoid-break`}>
            <span className={`${labelText} uppercase font-bold text-slate-700 block mb-2`}>
              Materiais e Equipamentos Obrigatórios:
            </span>
            <div className={`grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2 text-slate-700 ${smallText}`}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>Panela de Inox grau alimentício 13 Litros</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>8 Litros de Álcool de Cereais 96% Extra Neutro</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>Gelo Seco (Dióxido de Carbono sólido) em pellets</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>Bags filtradoras de 25 micras e 45 micras</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>Balança de precisão (0,01g) e Luvas térmicas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>Agitador magnético com evaporação e termômetro infravermelho</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className={`${labelText} uppercase font-bold text-slate-700 block`}>
              Procedimento Operacional Passo a Passo (Manual Astraya, pág. 18):
            </span>

            {[
              {
                step: 1,
                title: 'Pesagem & Acondicionamento da Biomassa',
                desc: 'Com luvas descartáveis, pesar a biomassa seca curada e acondicionar na bag filtradora com micragem entre 25u e 45u.',
              },
              {
                step: 2,
                title: 'Resfriamento do Solvente a -60°C',
                desc: 'Em panela de inox de 13L, adicionar 8 litros de álcool de cereais 96%. Adicionar gelo seco em pequenas doses controladas até atingir -60°C.',
              },
              {
                step: 3,
                title: 'Imersão da Bag com Biomassa',
                desc: 'Inserir a bag até afundar completamente no álcool resfriado e cobrir com uma generosa camada de gelo seco por cima.',
              },
              {
                step: 4,
                title: 'Winterização & Maceração Criogênica (12 a 18 Horas)',
                desc: 'Manter a bag imersa por 12 a 18 horas contínuas, monitorando a temperatura para manter-se estritamente em torno de -60°C.',
              },
              {
                step: 5,
                title: 'Filtração Fina com Bag de 25 micras',
                desc: 'Remover a bag e realizar a filtragem final com tela de 25 micras para separar qualquer partícula sólida restante.',
              },
              {
                step: 6,
                title: 'Evaporação Completa do Solvente',
                desc: 'Evaporar o gelo seco e recuperar o solvente alcoólico em temperatura branda, resultando em resina pura rica em canabinoides.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex gap-3 items-start pop-print-avoid-break">
                <div className={`${isPrintMode ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px] print:w-6 print:h-6 print:text-xs'} rounded bg-emerald-700 text-white font-mono font-bold flex items-center justify-center shrink-0 mt-0.5`}>
                  {item.step}
                </div>
                <div>
                  <h4 className={`font-bold text-slate-900 ${cardHeading}`}>{item.title}</h4>
                  <p className={`text-slate-600 mt-0.5 ${smallText}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SEC 11: POP EXTRAÇÃO ROSIN POR PRESSÃO & CALOR */}
      {groupKey === 'grp-11' && (
        <>
          <div className={`bg-amber-50/60 ${cardPad} rounded-lg border border-amber-200 pop-print-avoid-break`}>
            <div className={`flex items-center gap-2 text-amber-950 font-bold uppercase mb-1.5 ${cardHeading}`}>
              <Flame className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Método 2: Extração Rosin por Calor e Pressão Mecânica</span>
            </div>
            <p className="text-slate-700">
              Método 100% físico (sem solvente químico). A pressão mecânica associada ao aquecimento controlado rompe as cabeças dos tricomas glandulares, expelindo o óleo resinoso diretamente sobre papel antiaderente para altas temperaturas.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className={`${labelText} uppercase font-bold text-slate-700 block`}>
              Etapas do Processo Rosin (Manual Astraya, pág. 19):
            </span>

            {[
              {
                step: 1,
                title: 'Aquecimento e Ajuste da Prensa Térmica',
                desc: 'Ligar a prensa de no mínimo 4 toneladas e calibrar a temperatura das placas térmicas com termômetro infravermelho.',
              },
              {
                step: 2,
                title: 'Fracionamento e Envelopamento em Bag 120u',
                desc: 'Em temperatura ambiente, fragmentar a matéria curada em pedaços homogêneos e envelopar na rede filtradora de 120 micras.',
              },
              {
                step: 3,
                title: 'Posicionamento com Papel Antiaderente',
                desc: 'Envolver a bag filtradora entre folhas de papel siliconado próprio para altas temperaturas e posicionar no centro das chapas.',
              },
              {
                step: 4,
                title: 'Prensagem a 4 Toneladas',
                desc: 'Acionar a pressão hidráulica até atingir ~4t, mantendo o fluxo contínuo de escoamento da resina dourada.',
              },
              {
                step: 5,
                title: 'Resfriamento e Sanitização em Agitador Magnético',
                desc: 'Após o resfriamento da resina, realizar a sanitização com álcool de cereais e evaporação lenta em baixa temperatura.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex gap-3 items-start pop-print-avoid-break">
                <div className={`${isPrintMode ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px] print:w-6 print:h-6 print:text-xs'} rounded bg-amber-600 text-white font-mono font-bold flex items-center justify-center shrink-0 mt-0.5`}>
                  {item.step}
                </div>
                <div>
                  <h4 className={`font-bold text-slate-900 ${cardHeading}`}>{item.title}</h4>
                  <p className={`text-slate-600 mt-0.5 ${smallText}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SEC 12: ARMAZENAMENTO & DESCARBOXILAÇÃO (95°C / 35min) */}
      {groupKey === 'grp-12' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3.5">
            <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 space-y-1.5 pop-print-avoid-break`}>
              <div className={`flex items-center gap-1.5 text-slate-900 font-bold uppercase ${cardHeading}`}>
                <Thermometer className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Armazenamento &amp; Estabilidade (Rastely et al.)</span>
              </div>
              <p className={`${smallText} text-slate-700`}>
                Resinas devem ser conservadas entre <strong>5°C e 10°C</strong>, sem contato com oxigênio (fechamento a vácuo/gás inerte) e protegidas contra radiação ultravioleta em frascos âmbar para evitar degradação de THC em CBN.
              </p>
            </div>

            <div className={`bg-amber-50/70 ${cardPad} rounded-lg border border-amber-200 space-y-1.5 pop-print-avoid-break`}>
              <div className={`flex items-center gap-1.5 text-amber-950 font-bold uppercase ${cardHeading}`}>
                <Flame className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Descarboxilação Final Térmica</span>
              </div>
              <p className={`${smallText} text-slate-700`}>
                O óleo final homogeneizado é submetido ao forno a <strong>95°C por 35 minutos</strong> com papel alumínio, convertendo eficientemente os ácidos canabinoides (CBDA, THCA) em suas formas ativas neutras (CBD, THC).
              </p>
            </div>
          </div>

          <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 space-y-2 pop-print-avoid-break`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`font-bold text-slate-900 uppercase ${cardHeading}`}>
                Controle de Qualidade Espectrométrico T-Check 3 &amp; UNICAMP
              </span>
              <span className={`${labelText} font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-bold`}>
                Margem de Erro: ± 2%
              </span>
            </div>
            <p className={`${smallText} text-slate-700`}>
              Cada lote tem sua concentração aferida no espectrofotômetro T-Check com leitura óptica de absorbância. Os dados são confrontados a cada 8 a 12 meses com laudos cromatográficos do <strong>CIATOX / UNICAMP</strong>, laboratório autorizado pela Anvisa.
            </p>
          </div>
        </>
      )}

      {/* SEC 13: FORMULAÇÕES ORAIS & PREPARO DE 1 FRASCO DE 30ML */}
      {groupKey === 'grp-13' && (
        <>
          <div className={`bg-emerald-50/50 ${cardPad} rounded-lg border border-emerald-200 pop-print-avoid-break`}>
            <h4 className={`font-bold text-emerald-950 uppercase mb-1 ${cardHeading}`}>
              Tabelas de Pesagem de Resina para 30 mL de Óleo TCM Oral
            </h4>
            <p className={`text-slate-600 ${smallText}`}>
              Parâmetros práticos calculados para atingir miligramagens exatas em frasco âmbar de 30 mL com carreador TCM grau farmacêutico.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3.5 ${smallText}`}>
            <div className="border border-slate-200 rounded-lg overflow-hidden pop-print-avoid-break">
              <div className="bg-blue-50 p-2.5 font-bold text-blue-900 border-b border-blue-200 flex justify-between items-center">
                <span>1) Alto CBD (Cepa Ygriega 2.0)</span>
                <span className={`${labelText} font-mono`}>30 mL TCM</span>
              </div>
              <table className="w-full text-left">
                <thead className={`bg-slate-50 text-slate-500 uppercase border-b border-slate-100 ${labelText}`}>
                  <tr>
                    <th className="p-2.5">Dose Total</th>
                    <th className="p-2.5">Concentração</th>
                    <th className="p-2.5 text-right">Peso Resina</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-medium">700 mg</td>
                    <td className="p-2.5">20 mg/mL</td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-800">0,513 g</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">1.500 mg</td>
                    <td className="p-2.5">50 mg/mL</td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-800">1,100 g</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">3.000 mg</td>
                    <td className="p-2.5">100 mg/mL</td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-800">2,230 g</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden pop-print-avoid-break">
              <div className="bg-amber-50 p-2.5 font-bold text-amber-900 border-b border-amber-200 flex justify-between items-center">
                <span>2) Alto THC (Cepa Tha Melon)</span>
                <span className={`${labelText} font-mono`}>30 mL TCM</span>
              </div>
              <table className="w-full text-left">
                <thead className={`bg-slate-50 text-slate-500 uppercase border-b border-slate-100 ${labelText}`}>
                  <tr>
                    <th className="p-2.5">Dose Total</th>
                    <th className="p-2.5">Concentração</th>
                    <th className="p-2.5 text-right">Peso Resina</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-medium">700 mg</td>
                    <td className="p-2.5">23 mg/mL</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-800">0,493 g</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">1.500 mg</td>
                    <td className="p-2.5">50 mg/mL</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-800">1,040 g</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">3.000 mg</td>
                    <td className="p-2.5">100 mg/mL</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-800">2,000 g</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 space-y-2 pop-print-avoid-break`}>
            <span className={`${labelText} uppercase font-bold text-slate-700 block`}>
              Modo de Preparo de 1 Frasco de 30 mL (Manual Astraya, pág. 22-24):
            </span>
            <div className={`space-y-1.5 text-slate-700 ${smallText}`}>
              <p><strong>1. Esterilização:</strong> Limpar tampa de plástico e pipeta com álcool 96%. Levar becker e frasco de vidro ao forno a 110°C por 10 minutos.</p>
              <p><strong>2. Pesagem com TARE:</strong> Colocar o becker na balança de precisão, tarar e pesar a quantidade exata de resina conforme a dosagem desejada.</p>
              <p><strong>3. Medição de TCM:</strong> Medir 30 mL de óleo carreador TCM em outro becker graduado.</p>
              <p><strong>4. Aquecimento a 45°C:</strong> Levar ambos os béqueres (resina e TCM) ao fogão elétrico a 45°C por 5 minutos.</p>
              <p><strong>5. Homogeneização Magnética:</strong> Despejar o TCM morno sobre a resina no agitador magnético por 10 a 15 minutos até dissolução 100% homogênea.</p>
              <p><strong>6. Enfrasque Provisório:</strong> Transferir para o frasco esterilizado e fechar com papel alumínio.</p>
              <p><strong>7. Identificação Provisória:</strong> Anotar na etiqueta provisória o peso de resina, nome do paciente, mg/mL e cepa.</p>
              <p><strong>8. Descarboxilação no Forno:</strong> Levar o frasco tampado ao forno a 95°C por 35 minutos.</p>
              <p><strong>9. Montagem e Verificação:</strong> Remover o papel alumínio, inserir cânula/tampa/lacre e inspecionar cor e limpidez visual.</p>
              <p><strong>10. Leitura T-Check &amp; Rotulagem:</strong> Aferir miligramagem no T-Check e aplicar o rótulo definitivo com validade e lote.</p>
            </div>
          </div>
        </>
      )}

      {/* SEC 14: FORMULAÇÕES DERMATOLÓGICAS (CÓD. 13, 17 e 18) */}
      {groupKey === 'grp-14' && (
        <div className={`grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-3.5 ${smallText}`}>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between pop-print-avoid-break">
            <div>
              <span className={`${labelText} font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono`}>
                CÓD. 13
              </span>
              <h4 className={`font-bold text-slate-900 mt-1.5 ${cardHeading}`}>Óleo de Massagem para Dores</h4>
              <p className={`text-slate-500 mt-0.5 ${labelText}`}>Dose: 40mg THC em 60mL TCM</p>
              <ul className="mt-2.5 space-y-1 text-slate-600">
                <li>• 390 mL Óleo de Abacate</li>
                <li>• 100 mL Óleo de Semente de Uva</li>
                <li>• 90 mL Óleo Coco c/ Macassá</li>
                <li>• 20 mL Extrato TCM descarb.</li>
                <li>• 40 gotas Extrato de Arnica</li>
                <li>• 40 gotas Blend Hortelã/Alecrim/Cedro/Laranja</li>
              </ul>
            </div>
            <span className={`${labelText} text-slate-500 block pt-2.5 border-t border-slate-200 mt-3`}>
              Lote padrão: 10 frascos (600 mL)
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between pop-print-avoid-break">
            <div>
              <span className={`${labelText} font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono`}>
                CÓD. 17
              </span>
              <h4 className={`font-bold text-slate-900 mt-1.5 ${cardHeading}`}>Creme Hidratante CBDA &amp; Macela</h4>
              <p className={`text-slate-500 mt-0.5 ${labelText}`}>Dose: 22mg em 50g</p>
              <ul className="mt-2.5 space-y-1 text-slate-600">
                <li>• 250 g Base Hidratante 1/1</li>
                <li>• 50 g Manteiga de Manga líquida</li>
                <li>• 50 g Óleo de Coco líquido</li>
                <li>• 75 g Óleo de Abacate</li>
                <li>• 20 mL Extrato TCM descarb.</li>
                <li>• 78 g Tintura Macela + 78 g Tintura CBDA geladas</li>
                <li>• 65 gotas Blend Lavanda/LemonGrass/Laranja</li>
              </ul>
            </div>
            <span className={`${labelText} text-slate-500 block pt-2.5 border-t border-slate-200 mt-3`}>
              Lote padrão: 10 potes âmbar (500 g)
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between pop-print-avoid-break">
            <div>
              <span className={`${labelText} font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono`}>
                CÓD. 18
              </span>
              <h4 className={`font-bold text-slate-900 mt-1.5 ${cardHeading}`}>Pomada Transdérmica Karité</h4>
              <p className={`text-slate-500 mt-0.5 ${labelText}`}>Dose: 22mg CBD em 30g</p>
              <ul className="mt-2.5 space-y-1 text-slate-600">
                <li>• 90 g Cera de Abelha</li>
                <li>• 74 g Óleo de Coco</li>
                <li>• 35 g Manteiga de Karité</li>
                <li>• 35 g Manteiga de Manga</li>
                <li>• 18 g Extrato diluído em TCM</li>
                <li>• 50 g Óleo Semente de Uva</li>
                <li>• 35 gotas Blend Lavanda/Lemon/Laranja</li>
              </ul>
            </div>
            <span className={`${labelText} text-slate-500 block pt-2.5 border-t border-slate-200 mt-3`}>
              Envase a quente: 10 frascos (300 g)
            </span>
          </div>
        </div>
      )}

      {/* SEC 15: TABELAS DE DOSAGEM PARA PRESCRITORES */}
      {groupKey === 'grp-15' && (
        <>
          <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 pop-print-avoid-break`}>
            <h4 className={`font-bold text-slate-900 uppercase mb-0.5 ${cardHeading}`}>
              Tabela Posológica Informativa para Médicos e Prescritores (pág. 28)
            </h4>
            <p className={`text-slate-600 ${smallText}`}>
              Relação de miligramas de fitocanabinoides entregues por fração de mililitro nos frascos de 30 mL.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden pop-print-avoid-break">
            <table className={`w-full text-left text-slate-700 ${smallText}`}>
              <thead className={`bg-slate-100 font-bold text-slate-600 uppercase border-b border-slate-200 ${labelText}`}>
                <tr>
                  <th className="p-3">Produto / Formulação</th>
                  <th className="p-3 text-center">1,0 mL</th>
                  <th className="p-3 text-center">0,75 mL</th>
                  <th className="p-3 text-center">0,50 mL</th>
                  <th className="p-3 text-center">0,25 mL</th>
                  <th className="p-3 text-center">0,10 mL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="bg-blue-50/30">
                  <td className="p-2.5 font-sans font-bold text-slate-900">Óleo TCM CBD 700 mg</td>
                  <td className="p-2.5 text-center font-bold text-slate-900">23,0 mg</td>
                  <td className="p-2.5 text-center text-slate-700">17,25 mg</td>
                  <td className="p-2.5 text-center text-slate-700">11,5 mg</td>
                  <td className="p-2.5 text-center text-slate-700">5,75 mg</td>
                  <td className="p-2.5 text-center text-slate-700">2,3 mg</td>
                </tr>
                <tr className="bg-blue-50/30">
                  <td className="p-2.5 font-sans font-bold text-slate-900">Óleo TCM CBD 1.500 mg</td>
                  <td className="p-2.5 text-center font-bold text-slate-900">50,0 mg</td>
                  <td className="p-2.5 text-center text-slate-700">37,50 mg</td>
                  <td className="p-2.5 text-center text-slate-700">25,0 mg</td>
                  <td className="p-2.5 text-center text-slate-700">12,50 mg</td>
                  <td className="p-2.5 text-center text-slate-700">5,0 mg</td>
                </tr>
                <tr className="bg-blue-50/30">
                  <td className="p-2.5 font-sans font-bold text-slate-900">Óleo TCM CBD 3.000 mg</td>
                  <td className="p-2.5 text-center font-bold text-slate-900">100,0 mg</td>
                  <td className="p-2.5 text-center text-slate-700">75,00 mg</td>
                  <td className="p-2.5 text-center text-slate-700">50,0 mg</td>
                  <td className="p-2.5 text-center text-slate-700">25,00 mg</td>
                  <td className="p-2.5 text-center text-slate-700">10,0 mg</td>
                </tr>
                <tr className="bg-amber-50/30">
                  <td className="p-2.5 font-sans font-bold text-slate-900">Óleo TCM THC 700 mg</td>
                  <td className="p-2.5 text-center font-bold text-slate-900">23,0 mg</td>
                  <td className="p-2.5 text-center text-slate-700">17,25 mg</td>
                  <td className="p-2.5 text-center text-slate-700">11,5 mg</td>
                  <td className="p-2.5 text-center text-slate-700">5,75 mg</td>
                  <td className="p-2.5 text-center text-slate-700">2,3 mg</td>
                </tr>
                <tr className="bg-amber-50/30">
                  <td className="p-2.5 font-sans font-bold text-slate-900">Óleo TCM THC 1.000 mg</td>
                  <td className="p-2.5 text-center font-bold text-slate-900">33,0 mg</td>
                  <td className="p-2.5 text-center text-slate-700">24,75 mg</td>
                  <td className="p-2.5 text-center text-slate-700">16,5 mg</td>
                  <td className="p-2.5 text-center text-slate-700">8,25 mg</td>
                  <td className="p-2.5 text-center text-slate-700">3,3 mg</td>
                </tr>
                <tr className="bg-amber-50/30">
                  <td className="p-2.5 font-sans font-bold text-slate-900">Óleo TCM THC 3.000 mg</td>
                  <td className="p-2.5 text-center font-bold text-slate-900">100,0 mg</td>
                  <td className="p-2.5 text-center text-slate-700">75,00 mg</td>
                  <td className="p-2.5 text-center text-slate-700">50,0 mg</td>
                  <td className="p-2.5 text-center text-slate-700">25,00 mg</td>
                  <td className="p-2.5 text-center text-slate-700">10,0 mg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* SEC 16, 17 & 18: METROLOGIA, RNC & REFERÊNCIAS */}
      {groupKey === 'grp-16-18' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3.5">
            <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 space-y-1.5 pop-print-avoid-break`}>
              <span className={`${labelText} uppercase font-bold text-slate-700 block`}>
                Calibração e Manutenção Rastreável (INMETRO / RBC)
              </span>
              <p className={`text-slate-600 ${smallText}`}>
                Equipamentos críticos (balanças de precisão, T-Check, fornos termostatizados) contam com identificação patrimonial e etiquetas com data de validade de calibração. É terminantemente proibido utilizar instrumentos com calibração vencida.
              </p>
            </div>

            <div className={`bg-slate-50 ${cardPad} rounded-lg border border-slate-200 space-y-1.5 pop-print-avoid-break`}>
              <span className={`${labelText} uppercase font-bold text-slate-700 block`}>
                Tratamento de Não Conformidades (RNC)
              </span>
              <p className={`text-slate-600 ${smallText}`}>
                Qualquer desvio nos parâmetros de temperatura, pesagem ou pureza deve ser formalizado via RNC, registrando contenção imediata, causa-raiz e ação preventiva encaminhada à Diretoria.
              </p>
            </div>
          </div>

          <div className={`border border-slate-200 rounded-lg ${cardPad} bg-slate-50 space-y-2 pop-print-avoid-break`}>
            <span className={`${labelText} uppercase font-bold text-slate-700 block`}>
              Legislação e Referências Técnicas Pertinentes (pág. 34):
            </span>
            <ul className={`space-y-1.5 text-slate-700 list-disc pl-5 ${smallText}`}>
              <li><strong>RDC nº 512/2021:</strong> Boas Práticas para Laboratórios de Controle de Qualidade (ANVISA).</li>
              <li><strong>ISO/IEC 17025:</strong> Requisitos Gerais para Competência de Laboratórios de Ensaio e Calibração.</li>
              <li><strong>ABNT NBR 14725:2023:</strong> Sistema Globalmente Harmonizado de Classificação e Rotulagem de Produtos Químicos (GHS).</li>
              <li><strong>Norma Regulamentadora NR-23:</strong> Proteção Contra Incêndios e Prevenção de Sinistros.</li>
              <li><strong>Farmacopeia Brasileira 7ª Edição HT-01:</strong> Inclusão da <em>Cannabis sativa L.</em> (Código: PM150-00) e Farmácia Viva RDC nº 18.</li>
              <li><strong>Booth et al. (Plant Physiology 2020):</strong> <em>Terpene Synthases and Terpene Variation in Cannabis sativa</em> (GC-MS de 48 picos terpênicos).</li>
              <li><strong>Teräsvalli, Heini (2020):</strong> <em>Extraction and purification of cannabidiol</em> (Solid-liquid extraction and winterization).</li>
            </ul>
          </div>

          <div className={`border border-slate-200 rounded-lg ${cardPad} bg-slate-50 space-y-2 pop-print-avoid-break`}>
            <span className={`${labelText} uppercase font-bold text-slate-700 block`}>
              Referências Bibliográficas — Estudos Utilizados:
            </span>
            <ul className={`space-y-2 text-slate-700 list-disc pl-5 ${smallText}`}>
              <li>
                <strong>SOUZA, Melina Arruda de.</strong> Avaliação dos processos de produção caseira de extratos de <em>Cannabis sativa</em> L. para fins medicinais. [S.l.]: Universidade Estadual Paulista (Unesp), 14 dez. 2022.
              </li>
              <li>
                <strong>VARGAS, Bruna Musacchio.</strong> Comparação dos processos de extração dos Canabinoides da cannabis Medicinal-revisão literária. 2021.
              </li>
              <li>
                <strong>TERÄSVALLI, Heini.</strong> <em>Extraction and purification of cannabidiol</em>. 2020.
              </li>
              <li>
                <strong>RASTELY, Nedice Borges Cardoso.</strong> Estudo da Estabilidade de Fitocanabinoides em Extratos Medicinais de <em>Cannabis sativa</em> L, em Diferentes Condições de Armazenamento. 2023.
              </li>
              <li>
                <strong>Judith K. Booth, Macaire M.S. Yuen, Sharon Jancsik, Lufiani L. Madilao, Jonathan E. Page, Jörg Bohlmann,</strong> <em>Terpene Synthases and Terpene Variation in Cannabis sativa</em>, Plant Physiology, Volume 184, Issue 1, September 2020, Pages 130–147, https://doi.org/10.1104/pp.20.00593 (Plant Physiology Magazine, Volume 184, Edição 1, Setembro 2020).
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export const PopViewer: React.FC = () => {
  const { setNotificationMessage } = useApp();

  const [activeSectionId, setActiveSectionId] = useState<string>('sec-09-extracao');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCalculadoraOpen, setIsCalculadoraOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'INDEX' | 'READER'>('READER');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [printScope, setPrintScope] = useState<PopPrintScope>('FULL');

  // Lista completa de seções correspondentes às 34 páginas do documento oficial
  const sections: PopSection[] = [
    { id: 'sec-01-capa', number: '01', title: 'Capa, Identificação Oficial & Sumário', category: 'GERAL', summary: 'Identificação institucional, diretrizes gerais de boas práticas e estrutura do manual.' },
    { id: 'sec-02-conduta', number: '02', title: 'Código de Conduta & Direitos (MBPL-0001)', category: 'GERAL', summary: 'Diretrizes de capacitação, integridade de dados e deveres dos colaboradores.' },
    { id: 'sec-03-objetivo', number: '03', title: 'Objetivo, Aplicação (Ibiúna-SP) & Glossário', category: 'GERAL', summary: 'Definições regulatórias: Calibração, Amostragem, RNC, SGQ e Farmacopeia.' },
    { id: 'sec-04-responsabilidades', number: '04', title: 'Matriz de Responsabilidades & Diretoria', category: 'QUALIDADE', summary: 'Atribuições da diretoria, responsabilidade técnica e conduta de visitantes.' },
    { id: 'sec-05-higiene', number: '05', title: 'Organização Pessoal, 5S & Higienização', category: 'SEGURANCA', summary: 'Metodologia 5S e procedimento padrão de lavagem das mãos em 11 etapas (40-60s).' },
    { id: 'sec-06-infraestrutura', number: '06', title: 'Infraestrutura Laboratorial & Áreas', category: 'GERAL', summary: 'Divisão de áreas: Setor de Secagem, Extração/Dispensação e Área de Descarte.' },
    { id: 'sec-07-seguranca', number: '07', title: 'Segurança, EPIs (NR-06) & Lava-Olhos', category: 'SEGURANCA', summary: 'Jalecos sem bolsos, luvas nitrílicas/criogênicas, protetores faciais e lava-olhos.' },
    { id: 'sec-08-incendio', number: '08', title: 'Proteção Contra Incêndios (NR-23) & Classes', category: 'SEGURANCA', summary: 'Guia de extintores (Água, CO2, Pó Químico, Espuma) e classes de fogo A, B, C, D e K.' },
    { id: 'sec-09-extracao', number: '09', title: 'Processo de Extração de Fitocanabinoides', category: 'EXTRACAO', summary: 'Farmacopeia 7ª Ed., Espectrofotometria T-Check 3 e isolamento de tricomas.' },
    { id: 'sec-10-gelo-seco', number: '10', title: 'POP Extração Etanol a Frio & Gelo Seco (-60°C)', category: 'EXTRACAO', summary: 'Panela inox 13L, 8L álcool 96%, bags 25-45u e winterização de 12-18h.' },
    { id: 'sec-11-rosin', number: '11', title: 'POP Extração Rosin (Calor & Prensa 4t)', category: 'EXTRACAO', summary: 'Prensagem mecânica a 4 toneladas, bags 120u e sanitização em agitador magnético.' },
    { id: 'sec-12-armazenamento', number: '12', title: 'Armazenamento, Descarboxilação (95°C) & TCM', category: 'EXTRACAO', summary: 'Estabilidade em 5-10°C, proteção UV e indução térmica a 95°C por 35 min.' },
    { id: 'sec-13-oleos-orais', number: '13', title: 'Formulações Orais (CBD Ygriega & THC Melon)', category: 'FORMULACAO', summary: 'Tabelas de diluição: 700mg, 1500mg, 3000mg e preparo de 1 frasco de 30mL.' },
    { id: 'sec-14-dermatologicos', number: '14', title: 'Formulações Dermatológicas (Óleo, Creme & Pomada)', category: 'FORMULACAO', summary: 'Óleo de massagem (Cód. 13), Creme CBDA/Macela (Cód. 17) e Pomada Karité (Cód. 18).' },
    { id: 'sec-15-prescritores', number: '15', title: 'Tabela de Dosagens para Prescritores Médicos', category: 'FORMULACAO', summary: 'Concentrações em 1mL, 0.75mL, 0.5mL, 0.25mL e 0.1mL para Óleos e Tinturas.' },
    { id: 'sec-16-equipamentos', number: '16', title: 'Equipamentos, Calibração & Metrologia', category: 'METROLOGIA', summary: 'Calibração rastreável INMETRO/RBC, balanças analíticas e laudos arquivados.' },
    { id: 'sec-17-gestao-residuos', number: '17', title: 'Controle de Registros, RNC, Químicos & Resíduos', category: 'QUALIDADE', summary: 'Relatórios de Não Conformidade (RNC), armários corta-fogo e descarte ambiental.' },
    { id: 'sec-18-referencias', number: '18', title: 'Referências Técnicas & Bibliografia Oficial', category: 'QUALIDADE', summary: 'RDC 512/2021, ISO 17025, NBR 14725, Booth et al. e Carvalho et al.' },
  ];

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSectionId) ?? sections[0],
    [activeSectionId]
  );

  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      return (
        !searchTerm ||
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.number.includes(searchTerm)
      );
    });
  }, [searchTerm]);

  const showToast = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`Copiado para área de transferência: ${label}`);
    setTimeout(() => {
      setCopiedText(null);
    }, 2500);
  };

  const handleDownloadPdf = (scopeOverride?: PopPrintScope) => {
    const targetScope = scopeOverride ?? printScope;
    exportPopManualPdf({
      scope: targetScope,
      activeSectionId: activeSection.id,
      activeSectionNumber: activeSection.number,
      activeSectionTitle: activeSection.title,
    });
    showToast(
      targetScope === 'FULL'
        ? 'PDF do Manual POP Completo gerado com sucesso!'
        : `PDF da Seção ${activeSection.number} gerado com sucesso!`
    );
  };

  const executePrintOrFallbackPdf = (scopeOverride?: PopPrintScope) => {
    const targetScope = scopeOverride ?? printScope;
    let printOpened = false;
    const handleBeforePrint = () => {
      printOpened = true;
    };

    window.addEventListener('beforeprint', handleBeforePrint, { once: true });
    try {
      window.print();
    } catch {
      printOpened = false;
    }
    window.removeEventListener('beforeprint', handleBeforePrint);

    if (!printOpened) {
      // Fallback automático quando executado em ambiente iframe sem permissão de modal de impressão
      handleDownloadPdf(targetScope);
    }
  };

  const handleOpenPrintAndPdf = () => {
    setIsCalculadoraOpen(false);
    setIsPrintViewOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      executePrintOrFallbackPdf(printScope);
    }, 150);
  };

  // MODO DE IMPRESSÃO / EXPORTAÇÃO PDF (Layout principal limpo, sem menu lateral esquerdo e fontes readequadas)
  if (isPrintViewOpen) {
    return (
      <div className="space-y-4 print:space-y-0">
        {/* Barra Superior de Controles de Impressão / PDF (Oculta na impressão física) */}
        <div className="bg-slate-900 text-white rounded-lg p-3.5 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3 sticky top-[96px] z-20 print:hidden">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsPrintViewOpen(false)}
              className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Manual</span>
            </button>

            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-md border border-slate-700">
              <button
                onClick={() => setPrintScope('FULL')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  printScope === 'FULL'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Manual Completo (Todas as Seções)</span>
              </button>
              <button
                onClick={() => setPrintScope('CURRENT')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  printScope === 'CURRENT'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Apenas Sec. {activeSection.number}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleDownloadPdf()}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileDown className="w-4 h-4" />
              <span>Baixar PDF</span>
            </button>

            <button
              onClick={() => executePrintOrFallbackPdf()}
              className="px-3.5 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Folha Principal A4 de Impressão (Sem menu lateral à esquerda e com fontes/tamanhos readequados) */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-sm space-y-6 text-slate-900 print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none print:p-0">
          {/* Cabeçalho Institucional Principal do POP */}
          <div className="border border-slate-200 rounded-lg p-4 sm:p-5 bg-white pop-print-avoid-break">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                MBPL-0001 Rev. 1.0
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Manual de Boas Práticas Laboratoriais
              </span>
            </div>
            <h1 className="text-2xl font-serif italic text-slate-800 font-normal mt-2">
              POP - Procedimento Operacional Padrão
            </h1>
            <p className="text-sm text-slate-600 font-mono mt-1">
              Associação Astraya • Sede Ibiúna/SP • Lab. Fitoquímico
            </p>
          </div>

          {/* Conteúdo: Manual Completo ou Apenas Seção Atual */}
          {printScope === 'CURRENT' ? (
            <section className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Sec. {activeSection.number} • ASTRAYA MBPL-0001 Rev. 1.0
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Sede: Ibiúna - SP • Lab. Fitoquímico
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {activeSection.title}
                </h2>
              </div>

              <PopSectionContent
                groupKey={mapSectionIdToGroupKey(activeSection.id)}
                isPrintMode
              />
            </section>
          ) : (
            <div className="space-y-12 print:space-y-12">
              {PRINT_MANUAL_GROUPS.map((grp, idx) => (
                <section
                  key={grp.key}
                  className={`space-y-4 ${
                    idx > 0 ? 'pt-9 print:pt-9 border-t border-slate-200' : ''
                  } ${grp.forcePageBreak ? 'pop-print-section-break print:border-t-0 print:pt-0' : ''}`}
                >
                  <div className="border-b border-slate-100 pb-2.5 pop-print-avoid-break pop-print-keep-with-next">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {grp.badge} • ASTRAYA MBPL-0001 Rev. 1.0
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Sede: Ibiúna - SP • Lab. Fitoquímico
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-1.5">
                      {grp.title}
                    </h2>
                  </div>

                  <PopSectionContent groupKey={grp.key} isPrintMode />
                </section>
              ))}
            </div>
          )}

          {/* Rodapé Institucional */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span>Associação Astraya • Sede Ibiúna/SP — Documento Institucional MBPL-0001 Rev. 1.0</span>
            <span>Aprovado pela Diretoria Executiva e Responsabilidade Técnica</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Banner de Identificação Oficial do Laboratório */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs print:border-slate-300 print:shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] print:text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                MBPL-0001 Rev. 1.0
              </span>
              <h1 className="text-xl print:text-2xl font-serif italic text-slate-800 font-normal">
                POP - Procedimento Operacional Padrão
              </h1>
              <span className="text-[10px] print:text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Manual de Boas Práticas Laboratoriais
              </span>
            </div>
            <p className="text-xs print:text-sm text-slate-600 font-mono mt-1">
              Associação Astraya • Sede Ibiúna/SP
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 print:hidden">
            <button
              onClick={() => setIsCalculadoraOpen(!isCalculadoraOpen)}
              className={`px-2.5 py-1 rounded border text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCalculadoraOpen
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Calculadora de Dosagem &amp; Pesagem</span>
            </button>

            <button
              onClick={handleOpenPrintAndPdf}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Visualizar versão para impressão e baixar PDF oficial"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 print:hidden">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar no manual POP por título, termo ou palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Mobile View Toggle Buttons (Hidden on LG screens and Print) */}
        <div className="flex lg:hidden print:hidden items-center mt-3 pt-2 border-t border-slate-100 gap-2">
          <button
            onClick={() => setMobileView('INDEX')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileView === 'INDEX'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sumário ({filteredSections.length})</span>
          </button>
          <button
            onClick={() => setMobileView('READER')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileView === 'READER'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ver Seção Aberta</span>
          </button>
        </div>
      </div>

      {/* Pop Formula Quick Calculator Modal / Drawer */}
      {isCalculadoraOpen && (
        <div className="print:hidden">
          <CalculadoraDosagemPesagemAstraya
            isClosable
            onClose={() => setIsCalculadoraOpen(false)}
          />
        </div>
      )}

      {/* Main Container: Index Sidebar (excluded on print) + Document Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 print:block gap-4 items-start">
        {/* Left Interactive Index (Excluído na impressão) */}
        <div className={`${mobileView === 'INDEX' ? 'block' : 'hidden'} lg:block print:hidden lg:col-span-4 bg-white border border-slate-200 rounded-lg p-3 shadow-xs space-y-2`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sumário do Manual</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {filteredSections.length} itens
            </span>
          </div>

          <div className="space-y-1 max-h-[620px] overflow-y-auto pr-1">
            {filteredSections.map((sec) => {
              const isSelected = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    setMobileView('READER');
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Sec. {sec.number}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {sec.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                      {sec.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {sec.summary}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-2 ${
                      isSelected ? 'text-emerald-700' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Legal Badge Box */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[10.5px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-700 uppercase">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>Validação Documental</span>
            </div>
            <p className="leading-tight">
              Aprovado pela Diretoria Executiva e Responsabilidade Técnica da Associação Astraya.
            </p>
          </div>
        </div>

        {/* Right Dynamic Section Content View (Expands to full width on print) */}
        <div className={`${mobileView === 'READER' ? 'block' : 'hidden'} lg:block print:block lg:col-span-8 print:w-full bg-white border border-slate-200 print:border-none rounded-lg p-3 sm:p-5 print:p-0 shadow-xs print:shadow-none space-y-5 text-slate-900 min-h-[500px] print:min-h-0`}>
          {/* Header of Active Section */}
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ASTRAYA • MBPL-0001 Rev. 1.0
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Sede: Ibiúna - SP • Lab. Fitoquímico
                </span>
              </div>
              <h2 className="text-lg print:text-xl font-bold text-slate-900 mt-1.5">
                {activeSection.title}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 print:hidden">
              <button
                onClick={() =>
                  handleCopyText(
                    `Associação Astraya - Procedimento Operacional Padrão e Manual de Boas Práticas Laboratoriais (MBPL-0001 Rev. 1.0). Ibiúna - SP.`,
                    'Citação do Documento'
                  )
                }
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Copiar referência do documento"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>Copiar Ref.</span>
              </button>
            </div>
          </div>

          <PopSectionContent
            groupKey={mapSectionIdToGroupKey(activeSection.id)}
            isPrintMode={false}
          />
        </div>
      </div>
    </div>
  );
};
