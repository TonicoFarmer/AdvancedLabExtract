import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export table data to a beautifully formatted PDF report with ASTRAYA headers
 */
export function exportToPdf({
  title,
  subtitle,
  headers,
  rows,
  fileName,
  orientation = 'landscape',
}: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number | undefined | null)[][];
  fileName: string;
  orientation?: 'portrait' | 'landscape';
}) {
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date().toLocaleString('pt-BR');

  // Header background bar
  doc.setFillColor(13, 92, 58); // ASTRAYA Emerald Green
  doc.rect(0, 0, pageWidth, 22, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ASTRAYA - ASSOCIAÇÃO DE DESENVOLVIMENTO E PESQUISA EM CANNABIS', 14, 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Plataforma Laboratorial de Extrações, Fitoterápicos & Controle de Rastreabilidade', 14, 17);

  // Document metadata
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, 30);

  if (subtitle) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 14, 36);
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(`Data de Emissão: ${now} | Responsável: Farmacêutico ASTRAYA`, pageWidth - 14, 30, { align: 'right' });

  // Sanitize rows
  const cleanRows = rows.map((row) =>
    row.map((cell) => (cell === undefined || cell === null ? '-' : String(cell)))
  );

  // Table
  autoTable(doc, {
    head: [headers],
    body: cleanRows,
    startY: subtitle ? 40 : 34,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      font: 'helvetica',
      textColor: [33, 37, 41],
      lineColor: [220, 225, 230],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [13, 92, 58],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 249],
    },
    margin: { top: 30, right: 10, bottom: 15, left: 10 },
    didDrawPage: (data) => {
      // Footer page number
      const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : 1;
      const currentPage = data.pageNumber;
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${currentPage} de ${pageCount} - Documento Oficial de Rastreabilidade Farmacotécnica ASTRAYA`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 7,
        { align: 'center' }
      );
    },
  });

  doc.save(`${fileName}.pdf`);
}

/**
 * Export table data to Excel-compatible UTF-8 CSV / XLS format
 */
export function exportToXls({
  title,
  headers,
  rows,
  fileName,
}: {
  title: string;
  headers: string[];
  rows: (string | number | undefined | null)[][];
  fileName: string;
}) {
  // Format CSV with semicolons and quote escaping, with BOM for full Excel UTF-8 accent support
  const bom = '\uFEFF';
  const csvRows: string[] = [];

  // Title header row
  csvRows.push(`"ASTRAYA - ${title.replace(/"/g, '""')}"`);
  csvRows.push(`"Gerado em: ${new Date().toLocaleString('pt-BR')}"`);
  csvRows.push(''); // Blank line

  // Column headers
  const headerLine = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(';');
  csvRows.push(headerLine);

  // Data rows
  rows.forEach((row) => {
    const line = row
      .map((cell) => {
        if (cell === undefined || cell === null) return '""';
        const val = String(cell).replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(';');
    csvRows.push(line);
  });

  const csvContent = bom + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
