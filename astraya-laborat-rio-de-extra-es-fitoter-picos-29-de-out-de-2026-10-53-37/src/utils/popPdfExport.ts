import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export type PopPrintScope = 'FULL' | 'CURRENT';

interface ExportPopPdfParams {
  scope: PopPrintScope;
  activeSectionId: string;
  activeSectionNumber: string;
  activeSectionTitle: string;
}

type CardTone = 'emerald' | 'blue' | 'amber' | 'slate' | 'white';

const TONE_PALETTE: Record<
  CardTone,
  { fill: [number, number, number]; border: [number, number, number]; title: [number, number, number] }
> = {
  emerald: {
    fill: [236, 253, 245],
    border: [167, 243, 208],
    title: [6, 78, 59],
  },
  blue: {
    fill: [239, 246, 255],
    border: [191, 219, 254],
    title: [30, 58, 138],
  },
  amber: {
    fill: [255, 251, 235],
    border: [253, 230, 138],
    title: [120, 53, 15],
  },
  slate: {
    fill: [248, 250, 252],
    border: [226, 232, 240],
    title: [15, 23, 42],
  },
  white: {
    fill: [255, 255, 255],
    border: [226, 232, 240],
    title: [15, 23, 42],
  },
};

export function mapSectionIdToGroupKey(sectionId: string): string {
  if (sectionId === 'sec-01-capa' || sectionId === 'sec-02-conduta') return 'grp-01-02';
  if (sectionId === 'sec-03-objetivo' || sectionId === 'sec-04-responsabilidades') return 'grp-03-04';
  if (sectionId === 'sec-05-higiene') return 'grp-05';
  if (sectionId === 'sec-06-infraestrutura') return 'grp-06';
  if (sectionId === 'sec-07-seguranca' || sectionId === 'sec-08-incendio') return 'grp-07-08';
  if (sectionId === 'sec-09-extracao' || sectionId === 'sec-10-gelo-seco') return 'grp-09-10';
  if (sectionId === 'sec-11-rosin') return 'grp-11';
  if (sectionId === 'sec-12-armazenamento') return 'grp-12';
  if (sectionId === 'sec-13-oleos-orais') return 'grp-13';
  if (sectionId === 'sec-14-dermatologicos') return 'grp-14';
  if (sectionId === 'sec-15-prescritores') return 'grp-15';
  return 'grp-16-18';
}

const FULL_MANUAL_GROUPS: {
  key: string;
  badge: string;
  title: string;
  minFirstBlockMm: number;
  forceNewPage?: boolean;
}[] = [
  {
    key: 'grp-01-02',
    badge: 'Sec. 01 & 02',
    title: 'Capa, Identificação Oficial & Código de Conduta (MBPL-0001)',
    minFirstBlockMm: 30,
  },
  {
    key: 'grp-03-04',
    badge: 'Sec. 03 & 04',
    title: 'Objetivo, Aplicação (Ibiúna-SP), Matriz de Responsabilidades & Glossário',
    minFirstBlockMm: 34,
  },
  {
    key: 'grp-05',
    badge: 'Sec. 05',
    title: 'Organização Pessoal, 5S & Higienização das Mãos',
    minFirstBlockMm: 30,
  },
  {
    key: 'grp-06',
    badge: 'Sec. 06',
    title: 'Infraestrutura Laboratorial & Divisão de Áreas',
    minFirstBlockMm: 35,
  },
  {
    key: 'grp-07-08',
    badge: 'Sec. 07 & 08',
    title: 'Segurança, EPIs (NR-06) & Proteção Contra Incêndios (NR-23)',
    minFirstBlockMm: 48,
  },
  {
    key: 'grp-09-10',
    badge: 'Sec. 09 & 10',
    title: 'Extração de Fitocanabinoides & POP Etanol a Frio com Gelo Seco (-60°C)',
    minFirstBlockMm: 35,
  },
  {
    key: 'grp-11',
    badge: 'Sec. 11',
    title: 'POP Extração Rosin (Calor & Prensa Mecânica 4t)',
    minFirstBlockMm: 35,
  },
  {
    key: 'grp-12',
    badge: 'Sec. 12',
    title: 'Armazenamento, Descarboxilação (95°C) & Controle T-Check / UNICAMP',
    minFirstBlockMm: 36,
  },
  {
    key: 'grp-13',
    badge: 'Sec. 13',
    title: 'Formulações Orais (CBD Ygriega & THC Melon) & Preparo 30 mL',
    minFirstBlockMm: 35,
  },
  {
    key: 'grp-14',
    badge: 'Sec. 14',
    title: 'Formulações Dermatológicas (Óleo, Creme & Pomada)',
    minFirstBlockMm: 70,
    forceNewPage: true,
  },
  {
    key: 'grp-15',
    badge: 'Sec. 15',
    title: 'Tabela de Dosagens para Prescritores Médicos',
    minFirstBlockMm: 35,
  },
  {
    key: 'grp-16-18',
    badge: 'Sec. 16, 17 & 18',
    title: 'Equipamentos, Calibração, Gestão de Resíduos & Referências Oficiais',
    minFirstBlockMm: 85,
    forceNewPage: true,
  },
];

/**
 * Generates and downloads an A4 PDF faithfully reproducing the main layout of the POP Manual,
 * excluding the left navigation menu and adapting font sizes and spacing for print legibility.
 */
export function exportPopManualPdf({
  scope,
  activeSectionId,
  activeSectionNumber,
  activeSectionTitle,
}: ExportPopPdfParams): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const MARGIN_X = 14;
  const CONTENT_W = 182; // 210 - 28
  const TOP_Y = 14;
  const MAX_Y = 276;
  const SECTION_GAP_MM = 12.5; // +2 a 3 linhas extras de respiro entre seções na mesma página
  let y = 12;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > MAX_Y) {
      doc.addPage();
      y = TOP_Y;
    }
  };

  // 1. Official POP Top Banner (matching main POP header layout)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.35);
  doc.roundedRect(MARGIN_X, y, CONTENT_W, 24, 2.5, 2.5, 'FD');

  // Emerald pill badge
  doc.setFillColor(209, 250, 229);
  doc.setDrawColor(110, 231, 183);
  doc.setLineWidth(0.25);
  doc.roundedRect(MARGIN_X + 4, y + 3.2, 34, 5.4, 1.2, 1.2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 78, 59);
  doc.text('MBPL-0001 Rev. 1.0', MARGIN_X + 21, y + 7, { align: 'center' });

  // Blue pill badge
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(MARGIN_X + 40, y + 3.2, 62, 5.4, 1.2, 1.2, 'FD');
  doc.setFontSize(7.8);
  doc.setTextColor(29, 78, 216);
  doc.text('Manual de Boas Práticas Laboratoriais', MARGIN_X + 71, y + 7, { align: 'center' });

  // Title
  doc.setFont('times', 'italic');
  doc.setFontSize(15);
  doc.setTextColor(30, 41, 59);
  doc.text('POP - Procedimento Operacional Padrão', MARGIN_X + 4, y + 15.2);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Associação Astraya • Sede Ibiúna/SP • Lab. Fitoquímico', MARGIN_X + 4, y + 20.8);

  y += 29;

  // Helper: Section Header matching the Right Reader Header (never orphaned from first block)
  const drawSectionHeader = (
    badgeText: string,
    sectionTitle: string,
    isFirst: boolean,
    minFirstBlockMm = 35,
    forceNewPage = false
  ) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    const titleLines: string[] = doc.splitTextToSize(sectionTitle, CONTENT_W);
    const headerHeight = 9 + titleLines.length * 5.2 + 3;

    if (!isFirst) {
      if (forceNewPage && y > TOP_Y + 2) {
        doc.addPage();
        y = TOP_Y;
      } else if (y > TOP_Y + 2) {
        if (y + SECTION_GAP_MM + headerHeight + minFirstBlockMm > MAX_Y) {
          doc.addPage();
          y = TOP_Y;
        } else {
          y += SECTION_GAP_MM;
        }
      }
    } else {
      ensureSpace(headerHeight + minFirstBlockMm);
    }

    // Top metadata badges
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.setLineWidth(0.25);
    const fullBadge = `${badgeText} • ASTRAYA MBPL-0001 Rev. 1.0`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const badgeW = doc.getTextWidth(fullBadge) + 6;
    doc.roundedRect(MARGIN_X, y, badgeW, 5.5, 1.2, 1.2, 'FD');
    doc.setTextColor(6, 95, 70);
    doc.text(fullBadge, MARGIN_X + 3, y + 3.9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Sede: Ibiúna - SP • Lab. Fitoquímico', MARGIN_X + badgeW + 3, y + 3.9);

    // Section Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(15, 23, 42);
    doc.text(titleLines, MARGIN_X, y + 11.2);

    const lineY = y + 7.5 + titleLines.length * 5.2;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(MARGIN_X, lineY, MARGIN_X + CONTENT_W, lineY);

    y = lineY + 4.5;
  };

  // Helper: Full-width callout / info card
  const drawCard = ({
    title,
    paragraphs = [],
    bullets = [],
    tone = 'slate',
    rightBadge,
  }: {
    title: string;
    paragraphs?: string[];
    bullets?: { lead?: string; text: string }[];
    tone?: CardTone;
    rightBadge?: string;
  }) => {
    const palette = TONE_PALETTE[tone];
    const innerW = CONTENT_W - 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.8);
    const titleMaxW = rightBadge ? innerW - 44 : innerW;
    const titleLines: string[] = doc.splitTextToSize(title, titleMaxW);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const paraBlocks = paragraphs.map((p) => doc.splitTextToSize(p, innerW) as string[]);
    const bulletBlocks = bullets.map((b) => {
      const combined = b.lead ? `• ${b.lead} ${b.text}` : `• ${b.text}`;
      return doc.splitTextToSize(combined, innerW - 2) as string[];
    });

    let totalH = 4 + titleLines.length * 4.5 + 1.5;
    paraBlocks.forEach((lines) => {
      totalH += lines.length * 4.3 + 1.5;
    });
    bulletBlocks.forEach((lines) => {
      totalH += lines.length * 4.3 + 1.2;
    });
    totalH += 2.5;

    ensureSpace(totalH);

    doc.setFillColor(...palette.fill);
    doc.setDrawColor(...palette.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN_X, y, CONTENT_W, totalH, 2, 2, 'FD');

    let cy = y + 5.2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.8);
    doc.setTextColor(...palette.title);
    doc.text(titleLines, MARGIN_X + 4, cy);

    if (rightBadge) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      const bw = doc.getTextWidth(rightBadge) + 5;
      doc.setFillColor(209, 250, 229);
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(MARGIN_X + CONTENT_W - bw - 4, y + 2.8, bw, 5, 1, 1, 'FD');
      doc.setTextColor(6, 95, 70);
      doc.text(rightBadge, MARGIN_X + CONTENT_W - bw / 2 - 4, y + 6.3, { align: 'center' });
    }

    cy += titleLines.length * 4.5 + 1.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);

    paraBlocks.forEach((lines) => {
      doc.text(lines, MARGIN_X + 4, cy);
      cy += lines.length * 4.3 + 1.5;
    });

    bulletBlocks.forEach((lines) => {
      doc.text(lines, MARGIN_X + 5, cy);
      cy += lines.length * 4.3 + 1.2;
    });

    y += totalH + 3.5;
  };

  // Helper: 2-column equal-height card row
  const drawTwoColCards = (
    left: { title: string; body: string; tone?: CardTone },
    right: { title: string; body: string; tone?: CardTone }
  ) => {
    const gap = 4;
    const colW = (CONTENT_W - gap) / 2;
    const innerW = colW - 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    const lTitle: string[] = doc.splitTextToSize(left.title, innerW);
    const rTitle: string[] = doc.splitTextToSize(right.title, innerW);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    const lBody: string[] = doc.splitTextToSize(left.body, innerW);
    const rBody: string[] = doc.splitTextToSize(right.body, innerW);

    const lH = 3.8 + lTitle.length * 4.1 + 1.4 + lBody.length * 4.1 + 2.8;
    const rH = 3.8 + rTitle.length * 4.1 + 1.4 + rBody.length * 4.1 + 2.8;
    const boxH = Math.max(lH, rH);

    ensureSpace(boxH);

    [
      { item: left, x: MARGIN_X, tLines: lTitle, bLines: lBody },
      { item: right, x: MARGIN_X + colW + gap, tLines: rTitle, bLines: rBody },
    ].forEach(({ item, x, tLines, bLines }) => {
      const pal = TONE_PALETTE[item.tone || 'slate'];
      doc.setFillColor(...pal.fill);
      doc.setDrawColor(...pal.border);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, colW, boxH, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2);
      doc.setTextColor(...pal.title);
      doc.text(tLines, x + 3.5, y + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.2);
      doc.setTextColor(51, 65, 85);
      doc.text(bLines, x + 3.5, y + 4.8 + tLines.length * 4.1 + 1.4);
    });

    y += boxH + 2.8;
  };

  // Helper: Numbered Step Card (Sec 09/10 & Sec 11)
  const drawStepCard = (
    stepNum: number | string,
    title: string,
    desc: string,
    badgeColor: [number, number, number]
  ) => {
    const textX = MARGIN_X + 12;
    const innerW = CONTENT_W - 16;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.6);
    const tLines: string[] = doc.splitTextToSize(title, innerW);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    const dLines: string[] = doc.splitTextToSize(desc, innerW);

    const cardH = Math.max(13, 3.5 + tLines.length * 4.2 + dLines.length * 4.1 + 3.5);
    ensureSpace(cardH);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.28);
    doc.roundedRect(MARGIN_X, y, CONTENT_W, cardH, 1.8, 1.8, 'FD');

    // Step square badge
    doc.setFillColor(...badgeColor);
    doc.roundedRect(MARGIN_X + 3.5, y + 3.2, 6, 6, 1.2, 1.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(String(stepNum), MARGIN_X + 6.5, y + 7.3, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.6);
    doc.setTextColor(15, 23, 42);
    doc.text(tLines, textX, y + 5.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(71, 85, 105);
    doc.text(dLines, textX, y + 5.2 + tLines.length * 4.2 + 0.8);

    y += cardH + 2.4;
  };

  // Helper: Small uppercase label
  const drawSubLabel = (label: string) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(label.toUpperCase(), MARGIN_X, y + 3.5);
    y += 5.5;
  };

  // Render content for a given group key
  const renderGroup = (groupKey: string) => {
    if (groupKey === 'grp-01-02') {
      drawCard({
        title: 'Documento Oficial de Boas Práticas de Laboratório (MBPL-0001 Rev. 1.0)',
        tone: 'emerald',
        paragraphs: [
          'Manual institucional elaborado para estabelecer as diretrizes de execução das atividades nas dependências e laboratórios da Associação Astraya em Ibiúna - SP, garantindo padronização, eficiência, segurança ocupacional e confiabilidade metrológica nas análises e processos produtivos.',
        ],
      });

      drawCard({
        title: 'CÓDIGO DE CONDUTA, DIREITOS E DEVERES DOS COLABORADORES',
        tone: 'slate',
        bullets: [
          {
            lead: 'Condições Adequadas:',
            text: 'Garantia de infraestrutura, procedimentos validados e instruções de trabalho atualizadas.',
          },
          {
            lead: 'Capacitação Contínua:',
            text: 'Treinamento periódico nas Boas Práticas Laboratoriais e regras estatutárias.',
          },
          {
            lead: 'Integridade dos Dados:',
            text: 'Registro fidedigno e rastreabilidade absoluta de todas as análises químicas, físicas e microbiológicas.',
          },
          {
            lead: 'Dever de Reporte:',
            text: 'Obrigação de notificar prontamente qualquer desvio de qualidade através de RNC (Registro de Não Conformidade).',
          },
        ],
      });
    }

    if (groupKey === 'grp-03-04') {
      drawTwoColCards(
        {
          title: '1. OBJETIVO PRINCIPAL',
          body: 'Estabelecer as diretrizes operacionais para execução de todas as atividades laboratoriais na Associação Astraya, buscando padronização, eficiência e segurança no manuseio de fitoterápicos.',
          tone: 'slate',
        },
        {
          title: '2. CAMPO DE APLICAÇÃO',
          body: 'Aplicável a todos os laboratórios, áreas de cultivo, extração, armazenamento, dispensação, embalagem e escritório na sede da Associação Astraya em Ibiúna - SP.',
          tone: 'slate',
        }
      );

      drawSubLabel('Glossário de Termos e Definições Regulatórias:');
      const glossary = [
        ['Ação Corretiva', 'Ação realizada para corrigir uma não conformidade existente, eliminando a causa raiz.'],
        ['Ação Preventiva', 'Ação para eliminar um risco potencial antes que o problema ocorra.'],
        ['Amostragem', 'Coleta de amostras representativas definidas estatisticamente pelo tamanho do lote.'],
        ['Calibração', 'Relação documentada entre valores indicados por um instrumento e padrões de referência.'],
        ['FISPQ / FDS', 'Ficha com Dados de Segurança de Produtos Químicos de acesso obrigatório aos colaboradores.'],
        ['Garantia da Qualidade', 'Gestão focada em demonstrar que todos os requisitos técnicos foram cumpridos.'],
        ['Método Analítico', 'Descrição dos procedimentos analíticos e ensaios físico-químicos das matrizes.'],
        ['RNC (Relatório Não Conformidade)', 'Registro formal de desvios, ações corretivas, preventivas e notificação à Diretoria.'],
        ['Substância de Referência', 'Material de referência com características uniformes para calibração e ensaios.'],
        ['Validação Metrológica', 'Ato documentado que atesta que processos e equipamentos fornecem resultados consistentes.'],
      ];

      for (let i = 0; i < glossary.length; i += 2) {
        drawTwoColCards(
          { title: glossary[i][0], body: glossary[i][1], tone: 'slate' },
          { title: glossary[i + 1][0], body: glossary[i + 1][1], tone: 'slate' }
        );
      }
    }

    if (groupKey === 'grp-05') {
      drawCard({
        title: 'ORGANIZAÇÃO PESSOAL E METODOLOGIA 5S',
        tone: 'slate',
        paragraphs: [
          'A organização das bancadas e áreas produtivas obedece rigorosamente aos 5 sensos da metodologia 5S (Utilização, Organização, Limpeza, Padronização e Disciplina). Objetos desnecessários devem ser removidos das bancadas para evitar contaminação cruzada e atos inseguros.',
        ],
      });

      drawCard({
        title: 'PROCEDIMENTO PADRÃO DE HIGIENIZAÇÃO DAS MÃOS (DURAÇÃO: 40 A 60 SEGUNDOS)',
        tone: 'emerald',
        rightBadge: 'Obrigatório entrada/saída',
        paragraphs: [
          'Sequência obrigatória em 12 etapas antes da paramentação com luvas e EPIs:',
        ],
      });

      const handSteps = [
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
      ];

      // 3-column grid for clean A4 sizing
      const gap = 3.5;
      const colW = (CONTENT_W - gap * 2) / 3;
      for (let i = 0; i < handSteps.length; i += 3) {
        const rowItems = handSteps.slice(i, i + 3);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        const descBlocks = rowItems.map((it) => doc.splitTextToSize(it.d, colW - 6) as string[]);
        const maxLines = Math.max(...descBlocks.map((b) => b.length));
        const cardH = 10 + maxLines * 3.9 + 2.5;
        ensureSpace(cardH);

        rowItems.forEach((it, idx) => {
          const cx = MARGIN_X + idx * (colW + gap);
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.25);
          doc.roundedRect(cx, y, colW, cardH, 1.8, 1.8, 'FD');

          // Emerald circle badge
          doc.setFillColor(5, 150, 105);
          doc.circle(cx + 5, y + 5, 2.3, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(255, 255, 255);
          doc.text(it.p, cx + 5, y + 5.9, { align: 'center' });

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          doc.text(it.t, cx + 8.8, y + 5.9);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.8);
          doc.setTextColor(71, 85, 105);
          doc.text(descBlocks[idx], cx + 3, y + 10.8);
        });

        y += cardH + 2.8;
      }
      y += 1;
    }

    if (groupKey === 'grp-06') {
      drawCard({
        title: 'DIVISÃO FÍSICA E REQUISITOS ESTRUTURAIS',
        tone: 'slate',
        paragraphs: [
          'As instalações da Associação Astraya são estruturadas em divisões independentes para evitar qualquer risco de contaminação cruzada:',
        ],
      });

      const areas = [
        {
          title: '1. Setor de Secagem',
          color: [6, 95, 70] as [number, number, number],
          desc: 'Ambiente climatizado destinado à conservação do material vegetal após colheita com rígido controle fitossanitário, se utilizando de tendas lacradas com secagem controlada e ajustada para a temperatura de 18 °C e umidade relativa (UR) entre 55% e 60%, através de ar condicionado e desumidificador.',
        },
        {
          title: '2. Lab. Extração & Dispensação',
          color: [30, 64, 175] as [number, number, number],
          desc: 'Área limpa, capela com exaustão, manipuladores com paramentação integral e fluxo de ar.',
        },
        {
          title: '3. Área de Descarte',
          color: [146, 64, 14] as [number, number, number],
          desc: 'Local segregado para resíduos perigosos e biológicos conforme Plano de Gerenciamento.',
        },
      ];

      const gap = 3.5;
      const colW = (CONTENT_W - gap * 2) / 3;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const areaBlocks = areas.map((a) => doc.splitTextToSize(a.desc, colW - 5.5) as string[]);
      const maxH = 9.8 + Math.max(...areaBlocks.map((b) => b.length)) * 3.75 + 2.8;
      ensureSpace(maxH);

      areas.forEach((a, idx) => {
        const cx = MARGIN_X + idx * (colW + gap);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.3);
        doc.roundedRect(cx, y, colW, maxH, 1.8, 1.8, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.2);
        doc.setTextColor(...a.color);
        doc.text(a.title, cx + 2.8, y + 5.4);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(areaBlocks[idx], cx + 2.8, y + 10.2);
      });
      y += maxH + 3.2;

      drawTwoColCards(
        {
          title: 'REVESTIMENTOS & PISOS:',
          body: 'Paredes e pisos de materiais neutros, não porosos, de cor clara e fácil higienização, com o mínimo de rejunte possível para impedir acúmulo de partículas nas reentrâncias.',
          tone: 'slate',
        },
        {
          title: 'VESTIÁRIOS & CONVIVÊNCIA:',
          body: 'Totalmente separados das áreas produtivas e de análise. Proibido transitar com EPIs (jalecos, propés) fora das salas limpas.',
          tone: 'slate',
        }
      );
    }

    if (groupKey === 'grp-07-08') {
      const leftRules = [
        '• Proibido comer, beber ou fumar dentro dos laboratórios.',
        '• FISPQs físicas e eletrônicas disponíveis junto aos reagentes.',
        '• Avental de manga longa sem bolsos e sem tecido inflamável.',
        '• Cabelos presos, calçado fechado e proibição de adornos/joias.',
      ];
      const rightRules = [
        '• Proibido pipetar com a boca (uso estrito de peras de sucção).',
        '• Uso obrigatório de óculos de segurança e luvas nitrílicas.',
        '• Lava-olhos de emergência permanentemente desobstruído.',
        '• Visitantes com touca, propé e autorização da RT.',
      ];

      const colInnerW = (CONTENT_W - 14) / 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const lWrapped = leftRules.map((r) => doc.splitTextToSize(r, colInnerW) as string[]);
      const rWrapped = rightRules.map((r) => doc.splitTextToSize(r, colInnerW) as string[]);
      const lTotalLines = lWrapped.reduce((acc, b) => acc + b.length, 0);
      const rTotalLines = rWrapped.reduce((acc, b) => acc + b.length, 0);
      const rulesCardH =
        10.5 + Math.max(lTotalLines, rTotalLines) * 4.1 + 4 * 1.1 + 2.5;

      ensureSpace(rulesCardH);
      doc.setFillColor(...TONE_PALETTE.slate.fill);
      doc.setDrawColor(...TONE_PALETTE.slate.border);
      doc.setLineWidth(0.3);
      doc.roundedRect(MARGIN_X, y, CONTENT_W, rulesCardH, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.8);
      doc.setTextColor(...TONE_PALETTE.slate.title);
      doc.text(
        'REGRAS FUNDAMENTAIS DE SEGURANÇA LABORATORIAL (NR-06 E NR-23)',
        MARGIN_X + 4,
        y + 5.4
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);

      let ly = y + 11.2;
      lWrapped.forEach((lines) => {
        doc.text(lines, MARGIN_X + 4, ly);
        ly += lines.length * 4.1 + 1.1;
      });

      let ry = y + 11.2;
      const rx = MARGIN_X + 4 + colInnerW + 6;
      rWrapped.forEach((lines) => {
        doc.text(lines, rx, ry);
        ry += lines.length * 4.1 + 1.1;
      });

      y += rulesCardH + 3.5;

      drawSubLabel('Classificação de Incêndios e Extintores Aplicáveis (NR-23):');
      ensureSpace(48);

      autoTable(doc, {
        startY: y,
        margin: { left: MARGIN_X, right: MARGIN_X },
        head: [['CLASSE', 'MATERIAIS COMBUSTÍVEIS', 'AGENTE EXTINTOR RECOMENDADO']],
        body: [
          ['Classe A', 'Sólidos: papel, madeira, tecidos, algodão', 'Água pressurizada / Espuma mecânica'],
          ['Classe B', 'Líquidos inflamáveis, solventes, álcool 96%, ceras', 'Dióxido de Carbono (CO2) / Pó Químico Seco'],
          ['Classe C', 'Equipamentos elétricos energizados, agitadores, prensas', 'CO2 / Pó Químico (Nunca usar água!)'],
          ['Classe D', 'Metais pirofóricos (lítio, magnésio, zircônio)', 'Pó químico especial Classe D'],
          ['Classe K', 'Óleos vegetais, gorduras e fritadeiras', 'Solução de acetato de potássio (Classe K)'],
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 2.8,
          textColor: [51, 65, 85],
          lineColor: [226, 232, 240],
          lineWidth: 0.25,
        },
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: [30, 41, 59],
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [15, 23, 42], cellWidth: 26 },
          1: { cellWidth: 82 },
          2: { fontStyle: 'bold', cellWidth: 74 },
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            const colors: [number, number, number][] = [
              [6, 95, 70],
              [159, 18, 57],
              [30, 64, 175],
              [146, 64, 14],
              [107, 33, 168],
            ];
            if (colors[data.row.index]) {
              data.cell.styles.textColor = colors[data.row.index];
            }
          }
        },
      });

      const lastTable = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable;
      y = (lastTable?.finalY ?? y + 45) + 4;
    }

    if (groupKey === 'grp-09-10') {
      drawCard({
        title: 'MÉTODO 1: EXTRAÇÃO CRIOGÊNICA POR ETANOL A -60°C COM GELO SECO',
        tone: 'blue',
        paragraphs: [
          'Baseado no Método Accura (Ian Guedes & Felipe de Castro) e estudos de Virginia Carvalho (2023). A baixíssima temperatura congela a água intracelular, impedindo o rompimento dos cloroplastos e minimizando ceras, preservando mais de 90% dos monoterpenos e canabinoides.',
        ],
      });

      drawCard({
        title: 'MATERIAIS E EQUIPAMENTOS OBRIGATÓRIOS:',
        tone: 'slate',
        bullets: [
          { text: 'Panela de Inox grau alimentício 13 Litros' },
          { text: '8 Litros de Álcool de Cereais 96% Extra Neutro' },
          { text: 'Gelo Seco (Dióxido de Carbono sólido) em pellets' },
          { text: 'Bags filtradoras de 25 micras e 45 micras' },
          { text: 'Balança de precisão (0,01g) e Luvas térmicas' },
          { text: 'Agitador magnético com evaporação e termômetro infravermelho' },
        ],
      });

      drawSubLabel('Procedimento Operacional Passo a Passo (Manual Astraya, pág. 18):');
      const cryoSteps = [
        [1, 'Pesagem & Acondicionamento da Biomassa', 'Com luvas descartáveis, pesar a biomassa seca curada e acondicionar na bag filtradora com micragem entre 25u e 45u.'],
        [2, 'Resfriamento do Solvente a -60°C', 'Em panela de inox de 13L, adicionar 8 litros de álcool de cereais 96%. Adicionar gelo seco em pequenas doses controladas até atingir -60°C.'],
        [3, 'Imersão da Bag com Biomassa', 'Inserir a bag até afundar completamente no álcool resfriado e cobrir com uma generosa camada de gelo seco por cima.'],
        [4, 'Winterização & Maceração Criogênica (12 a 18 Horas)', 'Manter a bag imersa por 12 a 18 horas contínuas, monitorando a temperatura para manter-se estritamente em torno de -60°C.'],
        [5, 'Filtração Fina com Bag de 25 micras', 'Remover a bag e realizar a filtragem final com tela de 25 micras para separar qualquer partícula sólida restante.'],
        [6, 'Evaporação Completa do Solvente', 'Evaporar o gelo seco e recuperar o solvente alcoólico em temperatura branda, resultando em resina pura rica em canabinoides.'],
      ] as const;

      cryoSteps.forEach(([num, t, d]) => {
        drawStepCard(num, t, d, [4, 120, 87]);
      });
    }

    if (groupKey === 'grp-11') {
      drawCard({
        title: 'MÉTODO 2: EXTRAÇÃO ROSIN POR CALOR E PRESSÃO MECÂNICA',
        tone: 'amber',
        paragraphs: [
          'Método 100% físico (sem solvente químico). A pressão mecânica associada ao aquecimento controlado rompe as cabeças dos tricomas glandulares, expelindo o óleo resinoso diretamente sobre papel antiaderente para altas temperaturas.',
        ],
      });

      drawSubLabel('Etapas do Processo Rosin (Manual Astraya, pág. 19):');
      const rosinSteps = [
        [1, 'Aquecimento e Ajuste da Prensa Térmica', 'Ligar a prensa de no mínimo 4 toneladas e calibrar a temperatura das placas térmicas com termômetro infravermelho.'],
        [2, 'Fracionamento e Envelopamento em Bag 120u', 'Em temperatura ambiente, fragmentar a matéria curada em pedaços homogêneos e envelopar na rede filtradora de 120 micras.'],
        [3, 'Posicionamento com Papel Antiaderente', 'Envolver a bag filtradora entre folhas de papel siliconado próprio para altas temperaturas e posicionar no centro das chapas.'],
        [4, 'Prensagem a 4 Toneladas', 'Acionar a pressão hidráulica até atingir ~4t, mantendo o fluxo contínuo de escoamento da resina dourada.'],
        [5, 'Resfriamento e Sanitização em Agitador Magnético', 'Após o resfriamento da resina, realizar a sanitização com álcool de cereais e evaporação lenta em baixa temperatura.'],
      ] as const;

      rosinSteps.forEach(([num, t, d]) => {
        drawStepCard(num, t, d, [217, 119, 6]);
      });
    }

    if (groupKey === 'grp-12') {
      drawTwoColCards(
        {
          title: 'ARMAZENAMENTO & ESTABILIDADE (RASTELY ET AL.)',
          body: 'Resinas devem ser conservadas entre 5°C e 10°C, sem contato com oxigênio (fechamento a vácuo/gás inerte) e protegidas contra radiação ultravioleta em frascos âmbar para evitar degradação de THC em CBN.',
          tone: 'slate',
        },
        {
          title: 'DESCARBOXILAÇÃO FINAL TÉRMICA',
          body: 'O óleo final homogeneizado é submetido ao forno a 95°C por 35 minutos com papel alumínio, convertendo eficientemente os ácidos canabinoides (CBDA, THCA) em suas formas ativas neutras (CBD, THC).',
          tone: 'amber',
        }
      );

      drawCard({
        title: 'CONTROLE DE QUALIDADE ESPECTROMÉTRICO T-CHECK 3 & UNICAMP',
        tone: 'slate',
        rightBadge: 'Margem de Erro: ± 2%',
        paragraphs: [
          'Cada lote tem sua concentração aferida no espectrofotômetro T-Check com leitura óptica de absorbância. Os dados são confrontados a cada 8 a 12 meses com laudos cromatográficos do CIATOX / UNICAMP, laboratório autorizado pela Anvisa.',
        ],
      });
    }

    if (groupKey === 'grp-13') {
      drawCard({
        title: 'TABELAS DE PESAGEM DE RESINA PARA 30 ML DE ÓLEO TCM ORAL',
        tone: 'emerald',
        paragraphs: [
          'Parâmetros práticos calculados para atingir miligramagens exatas em frasco âmbar de 30 mL com carreador TCM grau farmacêutico.',
        ],
      });

      // Side-by-side formulation tables matching the 2-column grid in UI
      const gap = 4;
      const colW = (CONTENT_W - gap) / 2;
      const boxH = 38;
      ensureSpace(boxH + 4);

      const tables = [
        {
          x: MARGIN_X,
          title: '1) Alto CBD (Cepa Ygriega 2.0)',
          tag: '30 mL TCM',
          headFill: [239, 246, 255] as [number, number, number],
          headBorder: [191, 219, 254] as [number, number, number],
          headText: [30, 58, 138] as [number, number, number],
          weightColor: [6, 95, 70] as [number, number, number],
          rows: [
            ['700 mg', '20 mg/mL', '0,513 g'],
            ['1.500 mg', '50 mg/mL', '1,100 g'],
            ['3.000 mg', '100 mg/mL', '2,230 g'],
          ],
        },
        {
          x: MARGIN_X + colW + gap,
          title: '2) Alto THC (Cepa Tha Melon)',
          tag: '30 mL TCM',
          headFill: [255, 251, 235] as [number, number, number],
          headBorder: [253, 230, 138] as [number, number, number],
          headText: [120, 53, 15] as [number, number, number],
          weightColor: [146, 64, 14] as [number, number, number],
          rows: [
            ['700 mg', '23 mg/mL', '0,493 g'],
            ['1.500 mg', '50 mg/mL', '1,040 g'],
            ['3.000 mg', '100 mg/mL', '2,000 g'],
          ],
        },
      ];

      tables.forEach((tbl) => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.3);
        doc.roundedRect(tbl.x, y, colW, boxH, 2, 2, 'FD');

        // Header strip
        doc.setFillColor(...tbl.headFill);
        doc.setDrawColor(...tbl.headBorder);
        doc.roundedRect(tbl.x, y, colW, 8, 2, 2, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...tbl.headText);
        doc.text(tbl.title, tbl.x + 3, y + 5.3);
        doc.setFontSize(8);
        doc.text(tbl.tag, tbl.x + colW - 3, y + 5.3, { align: 'right' });

        // Column header row
        doc.setFillColor(248, 250, 252);
        doc.rect(tbl.x + 0.2, y + 8, colW - 0.4, 6.2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(100, 116, 139);
        doc.text('DOSE TOTAL', tbl.x + 3, y + 12.2);
        doc.text('CONCENTRAÇÃO', tbl.x + 32, y + 12.2);
        doc.text('PESO RESINA', tbl.x + colW - 3, y + 12.2, { align: 'right' });

        // Data rows
        tbl.rows.forEach((r, rIdx) => {
          const ry = y + 14.2 + rIdx * 7.6;
          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.25);
          doc.line(tbl.x + 1, ry, tbl.x + colW - 1, ry);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          doc.text(r[0], tbl.x + 3, ry + 5);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.text(r[1], tbl.x + 32, ry + 5);

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...tbl.weightColor);
          doc.text(r[2], tbl.x + colW - 3, ry + 5, { align: 'right' });
        });
      });

      y += boxH + 4;

      drawCard({
        title: 'MODO DE PREPARO DE 1 FRASCO DE 30 ML (MANUAL ASTRAYA, PÁG. 22-24):',
        tone: 'slate',
        paragraphs: [
          '1. Esterilização: Limpar tampa de plástico e pipeta com álcool 96%. Levar becker e frasco de vidro ao forno a 110°C por 10 minutos.',
          '2. Pesagem com TARE: Colocar o becker na balança de precisão, tarar e pesar a quantidade exata de resina conforme a dosagem desejada.',
          '3. Medição de TCM: Medir 30 mL de óleo carreador TCM em outro becker graduado.',
          '4. Aquecimento a 45°C: Levar ambos os béqueres (resina e TCM) ao fogão elétrico a 45°C por 5 minutos.',
          '5. Homogeneização Magnética: Despejar o TCM morno sobre a resina no agitador magnético por 10 a 15 minutos até dissolução 100% homogênea.',
          '6. Enfrasque Provisório: Transferir para o frasco esterilizado e fechar com papel alumínio.',
          '7. Identificação Provisória: Anotar na etiqueta provisória o peso de resina, nome do paciente, mg/mL e cepa.',
          '8. Descarboxilação no Forno: Levar o frasco tampado ao forno a 95°C por 35 minutos.',
          '9. Montagem e Verificação: Remover o papel alumínio, inserir cânula/tampa/lacre e inspecionar cor e limpidez visual.',
          '10. Leitura T-Check & Rotulagem: Aferir miligramagem no T-Check e aplicar o rótulo definitivo com validade e lote.',
        ],
      });
    }

    if (groupKey === 'grp-14') {
      const dermCards = [
        {
          code: 'CÓD. 13',
          badgeFill: [209, 250, 229] as [number, number, number],
          badgeText: [6, 95, 70] as [number, number, number],
          title: 'Óleo de Massagem para Dores',
          dose: 'Dose: 40mg THC em 60mL TCM',
          items: [
            '• 390 mL Óleo de Abacate',
            '• 100 mL Óleo de Semente de Uva',
            '• 90 mL Óleo Coco c/ Macassá',
            '• 20 mL Extrato TCM descarb.',
            '• 40 gotas Extrato de Arnica',
            '• 40 gotas Blend Hortelã/Alecrim/Cedro/Laranja',
          ],
          footer: 'Lote padrão: 10 frascos (600 mL)',
        },
        {
          code: 'CÓD. 17',
          badgeFill: [219, 234, 254] as [number, number, number],
          badgeText: [30, 64, 175] as [number, number, number],
          title: 'Creme Hidratante CBDA & Macela',
          dose: 'Dose: 22mg em 50g',
          items: [
            '• 250 g Base Hidratante 1/1',
            '• 50 g Manteiga de Manga líquida',
            '• 50 g Óleo de Coco líquido',
            '• 75 g Óleo de Abacate',
            '• 20 mL Extrato TCM descarb.',
            '• 78 g Tintura Macela + 78 g Tintura CBDA geladas',
            '• 65 gotas Blend Lavanda/LemonGrass/Laranja',
          ],
          footer: 'Lote padrão: 10 potes âmbar (500 g)',
        },
        {
          code: 'CÓD. 18',
          badgeFill: [243, 232, 255] as [number, number, number],
          badgeText: [107, 33, 168] as [number, number, number],
          title: 'Pomada Transdérmica Karité',
          dose: 'Dose: 22mg CBD em 30g',
          items: [
            '• 90 g Cera de Abelha',
            '• 74 g Óleo de Coco',
            '• 35 g Manteiga de Karité',
            '• 35 g Manteiga de Manga',
            '• 18 g Extrato diluído em TCM',
            '• 50 g Óleo Semente de Uva',
            '• 35 gotas Blend Lavanda/Lemon/Laranja',
          ],
          footer: 'Envase a quente: 10 frascos (300 g)',
        },
      ];

      const gap = 3.5;
      const colW = (CONTENT_W - gap * 2) / 3;
      const cardH = 66;
      ensureSpace(cardH + 4);

      dermCards.forEach((c, idx) => {
        const cx = MARGIN_X + idx * (colW + gap);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.3);
        doc.roundedRect(cx, y, colW, cardH, 2, 2, 'FD');

        // Code badge
        doc.setFillColor(...c.badgeFill);
        doc.roundedRect(cx + 3, y + 3, 18, 4.8, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(...c.badgeText);
        doc.text(c.code, cx + 12, y + 6.4, { align: 'center' });

        // Title & Dose
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.2);
        doc.setTextColor(15, 23, 42);
        const tLines: string[] = doc.splitTextToSize(c.title, colW - 6);
        doc.text(tLines, cx + 3, y + 12);

        const doseY = y + 12 + tLines.length * 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(c.dose, cx + 3, doseY);

        let iy = doseY + 4.8;
        doc.setFontSize(8.2);
        doc.setTextColor(51, 65, 85);
        c.items.forEach((line) => {
          const wrapped: string[] = doc.splitTextToSize(line, colW - 6);
          doc.text(wrapped, cx + 3, iy);
          iy += wrapped.length * 3.7 + 0.5;
        });

        doc.setDrawColor(226, 232, 240);
        doc.line(cx + 3, y + cardH - 8, cx + colW - 3, y + cardH - 8);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(c.footer, cx + 3, y + cardH - 3.5);
      });

      y += cardH + 4;
    }

    if (groupKey === 'grp-15') {
      drawCard({
        title: 'TABELA POSOLÓGICA INFORMATIVA PARA MÉDICOS E PRESCRITORES (PÁG. 28)',
        tone: 'slate',
        paragraphs: [
          'Relação de miligramas de fitocanabinoides entregues por fração de mililitro nos frascos de 30 mL.',
        ],
      });

      ensureSpace(56);
      autoTable(doc, {
        startY: y,
        margin: { left: MARGIN_X, right: MARGIN_X },
        head: [['PRODUTO / FORMULAÇÃO', '1,0 mL', '0,75 mL', '0,50 mL', '0,25 mL', '0,10 mL']],
        body: [
          ['Óleo TCM CBD 700 mg', '23,0 mg', '17,25 mg', '11,5 mg', '5,75 mg', '2,3 mg'],
          ['Óleo TCM CBD 1.500 mg', '50,0 mg', '37,50 mg', '25,0 mg', '12,50 mg', '5,0 mg'],
          ['Óleo TCM CBD 3.000 mg', '100,0 mg', '75,00 mg', '50,0 mg', '25,00 mg', '10,0 mg'],
          ['Óleo TCM THC 700 mg', '23,0 mg', '17,25 mg', '11,5 mg', '5,75 mg', '2,3 mg'],
          ['Óleo TCM THC 1.000 mg', '33,0 mg', '24,75 mg', '16,5 mg', '8,25 mg', '3,3 mg'],
          ['Óleo TCM THC 3.000 mg', '100,0 mg', '75,00 mg', '50,0 mg', '25,00 mg', '10,0 mg'],
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 2.8,
          textColor: [51, 65, 85],
          lineColor: [226, 232, 240],
          lineWidth: 0.25,
          halign: 'center',
        },
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: [51, 65, 85],
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        columnStyles: {
          0: { halign: 'left', fontStyle: 'bold', textColor: [15, 23, 42], cellWidth: 62 },
          1: { fontStyle: 'bold', textColor: [15, 23, 42] },
        },
        didParseCell: (data) => {
          if (data.section === 'body') {
            data.cell.styles.fillColor =
              data.row.index < 3 ? [245, 250, 255] : [255, 252, 240];
          }
        },
      });

      const lastTable = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable;
      y = (lastTable?.finalY ?? y + 50) + 4;
    }

    if (groupKey === 'grp-16-18') {
      drawTwoColCards(
        {
          title: 'CALIBRAÇÃO E MANUTENÇÃO RASTREÁVEL (INMETRO / RBC)',
          body: 'Equipamentos críticos (balanças de precisão, T-Check, fornos termostatizados) contam com identificação patrimonial e etiquetas com data de validade de calibração. É terminantemente proibido utilizar instrumentos com calibração vencida.',
          tone: 'slate',
        },
        {
          title: 'TRATAMENTO DE NÃO CONFORMIDADES (RNC)',
          body: 'Qualquer desvio nos parâmetros de temperatura, pesagem ou pureza deve ser formalizado via RNC, registrando contenção imediata, causa-raiz e ação preventiva encaminhada à Diretoria.',
          tone: 'slate',
        }
      );

      drawCard({
        title: 'LEGISLAÇÃO E REFERÊNCIAS TÉCNICAS PERTINENTES (PÁG. 34):',
        tone: 'slate',
        bullets: [
          {
            lead: 'RDC nº 512/2021:',
            text: 'Boas Práticas para Laboratórios de Controle de Qualidade (ANVISA).',
          },
          {
            lead: 'ISO/IEC 17025:',
            text: 'Requisitos Gerais para Competência de Laboratórios de Ensaio e Calibração.',
          },
          {
            lead: 'ABNT NBR 14725:2023:',
            text: 'Sistema Globalmente Harmonizado de Classificação e Rotulagem de Produtos Químicos (GHS).',
          },
          {
            lead: 'Norma Regulamentadora NR-23:',
            text: 'Proteção Contra Incêndios e Prevenção de Sinistros.',
          },
          {
            lead: 'Farmacopeia Brasileira 7ª Edição HT-01:',
            text: 'Inclusão da Cannabis sativa L. (Código: PM150-00) e Farmácia Viva RDC nº 18.',
          },
          {
            lead: 'Booth et al. (Plant Physiology 2020):',
            text: 'Terpene Synthases and Terpene Variation in Cannabis sativa (GC-MS de 48 picos terpênicos).',
          },
          {
            lead: 'Teräsvalli, Heini (2020):',
            text: 'Extraction and purification of cannabidiol (Solid-liquid extraction and winterization).',
          },
        ],
      });

      drawCard({
        title: 'REFERÊNCIAS BIBLIOGRÁFICAS — ESTUDOS UTILIZADOS:',
        tone: 'slate',
        bullets: [
          {
            lead: 'SOUZA, Melina Arruda de.',
            text: 'Avaliação dos processos de produção caseira de extratos de Cannabis sativa L. para fins medicinais. [S.l.]: Universidade Estadual Paulista (Unesp), 14 dez. 2022.',
          },
          {
            lead: 'VARGAS, Bruna Musacchio.',
            text: 'Comparação dos processos de extração dos Canabinoides da cannabis Medicinal-revisão literária. 2021.',
          },
          {
            lead: 'TERÄSVALLI, Heini.',
            text: 'Extraction and purification of cannabidiol. 2020.',
          },
          {
            lead: 'RASTELY, Nedice Borges Cardoso.',
            text: 'Estudo da Estabilidade de Fitocanabinoides em Extratos Medicinais de Cannabis sativa L, em Diferentes Condições de Armazenamento. 2023.',
          },
          {
            lead: 'Judith K. Booth, Macaire M.S. Yuen, Sharon Jancsik, Lufiani L. Madilao, Jonathan E. Page, Jörg Bohlmann,',
            text: 'Terpene Synthases and Terpene Variation in Cannabis sativa, Plant Physiology, Volume 184, Issue 1, September 2020, Pages 130–147, https://doi.org/10.1104/pp.20.00593 (Plant Physiology Magazine, Volume 184, Edição 1, Setembro 2020).',
          },
        ],
      });
    }
  };

  if (scope === 'CURRENT') {
    const groupKey = mapSectionIdToGroupKey(activeSectionId);
    const meta = FULL_MANUAL_GROUPS.find((g) => g.key === groupKey);
    drawSectionHeader(
      `Sec. ${activeSectionNumber}`,
      activeSectionTitle,
      true,
      meta?.minFirstBlockMm ?? 35,
      false
    );
    renderGroup(groupKey);
  } else {
    FULL_MANUAL_GROUPS.forEach((grp, idx) => {
      drawSectionHeader(
        grp.badge,
        grp.title,
        idx === 0,
        grp.minFirstBlockMm,
        Boolean(grp.forceNewPage)
      );
      renderGroup(grp.key);
    });
  }

  // Page footers across all generated pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(MARGIN_X, 284, MARGIN_X + CONTENT_W, 284);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Associação Astraya • Sede Ibiúna/SP — POP / Manual de Boas Práticas Laboratoriais (MBPL-0001 Rev. 1.0)',
      MARGIN_X,
      289
    );
    doc.text(`Página ${p} de ${totalPages}`, MARGIN_X + CONTENT_W, 289, { align: 'right' });
  }

  const fileSuffix =
    scope === 'FULL' ? 'Manual_Completo' : `Sec_${activeSectionNumber}`;
  doc.save(`ASTRAYA_POP_MBPL-0001_${fileSuffix}.pdf`);
}
