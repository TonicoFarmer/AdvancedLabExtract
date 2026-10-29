/**
 * ============================================================================
 * ASTRAYA LAB - ARQUIVO DE MÓDULOS DE EXTRAÇÃO (MEMÓRIA & PLATAFORMA PARALELA)
 * ============================================================================
 * 
 * Este arquivo e diretório guardam os componentes, tipos e dados das subsessões:
 * 1. ROSIN (Prensagem Mecânica e Térmica / Solventless)
 * 2. DRY ICE (Separação Mecânica a Seco com Gelo Seco / Kief)
 * 3. ICEOLATOR (Separação em Água Gelada e Gelo / Bubble Hash)
 * 
 * Foram retiradas da navegação principal do ASTRAYA LAB para serem migradas
 * e reutilizadas futuramente em uma plataforma paralela especializada.
 */

export { ExtractionRosin } from '../components/extractions/ExtractionRosin';
export { ExtractionDryIce } from '../components/extractions/ExtractionDryIce';
export { ExtractionIceolator } from '../components/extractions/ExtractionIceolator';

export type {
  ExtractionRosinRecord,
  ExtractionDryIceRecord,
  ExtractionIceolatorRecord,
} from '../types';
