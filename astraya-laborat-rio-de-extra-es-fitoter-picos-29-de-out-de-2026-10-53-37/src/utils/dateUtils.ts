/**
 * Utilitários de Data, Classificação e Ordenação Temporal
 * Laboratório Farmacêutico ASTRAYA
 */

/**
 * Converte diferentes formatos de data e hora para objeto Date do JavaScript
 * Suporta formatos:
 * - DD/MM/YYYY HH:mm:ss
 * - DD/MM/YYYY HH:mm
 * - DD/MM/YYYY
 * - YYYY-MM-DDTHH:mm:ss
 * - YYYY-MM-DD
 */
export function parseRecordDate(dateStr?: string | null): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // 1. Formato Brasileiro: DD/MM/YYYY ou DD/MM/YYYY HH:mm[:ss]
  const brMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (brMatch) {
    const day = parseInt(brMatch[1], 10);
    const month = parseInt(brMatch[2], 10) - 1; // Mês 0-indexado
    const year = parseInt(brMatch[3], 10);
    const hour = brMatch[4] ? parseInt(brMatch[4], 10) : 0;
    const min = brMatch[5] ? parseInt(brMatch[5], 10) : 0;
    const sec = brMatch[6] ? parseInt(brMatch[6], 10) : 0;
    const d = new Date(year, month, day, hour, min, sec);
    return isNaN(d.getTime()) ? null : d;
  }

  // 2. Formato ISO: YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    const hour = isoMatch[4] ? parseInt(isoMatch[4], 10) : 0;
    const min = isoMatch[5] ? parseInt(isoMatch[5], 10) : 0;
    const sec = isoMatch[6] ? parseInt(isoMatch[6], 10) : 0;
    const d = new Date(year, month, day, hour, min, sec);
    return isNaN(d.getTime()) ? null : d;
  }

  // 3. Fallback padrão
  const timestamp = Date.parse(trimmed);
  if (!isNaN(timestamp)) {
    return new Date(timestamp);
  }

  return null;
}

/**
 * Retorna true se a data for estritamente ANTERIOR a Maio de 2026 (ou seja, antes de 01/05/2026 00:00:00).
 * Registros de 2024, 2025, e Jan-Abr 2026 retornam true -> Devem ir para "Entregues e Finalizadas".
 * Registros de Maio/2026 em diante retornam false -> Ficam em "Ativas / Prontas".
 */
export function isBeforeMay2026(dateStr?: string | null): boolean {
  const d = parseRecordDate(dateStr);
  if (!d) {
    // Verificação textual de segurança
    if (typeof dateStr === 'string') {
      const lower = dateStr.toLowerCase();
      if (lower.includes('2024') || lower.includes('2025') || lower.includes('2023') || lower.includes('2022')) {
        return true;
      }
      if (
        dateStr.includes('/01/2026') ||
        dateStr.includes('/02/2026') ||
        dateStr.includes('/03/2026') ||
        dateStr.includes('/04/2026')
      ) {
        return true;
      }
    }
    return false;
  }

  // Marco de corte: 01 de Maio de 2026 às 00:00:00 (mês 4 no JS)
  const cutoff = new Date(2026, 4, 1, 0, 0, 0, 0);
  return d.getTime() < cutoff.getTime();
}

/**
 * Comparador para ordenação decrescente de datas (da mais recente para a mais antiga).
 */
export function compareDatesDesc(dateStrA?: string | null, dateStrB?: string | null): number {
  const dA = parseRecordDate(dateStrA);
  const dB = parseRecordDate(dateStrB);

  if (dA && dB) {
    return dB.getTime() - dA.getTime();
  }
  if (dA && !dB) return -1;
  if (!dA && dB) return 1;
  return 0;
}
