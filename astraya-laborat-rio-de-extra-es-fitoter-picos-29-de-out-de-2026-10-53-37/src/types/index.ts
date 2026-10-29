// TypeScript Definitions for ASTRAYA Extraction & Laboratory Management

export type MoleculeType = 'THC' | 'CBD' | 'THC/CBD' | 'CBG' | 'CBN' | 'CBC' | 'Canna+Fito' | 'Fitoterápico' | 'Outro';

export type MatrizFitoterapicaType = 'FITOTERAPICO' | 'CANNABIS' | 'BLEND_SINERGIA' | 'FITOCOSMETICO' | 'OUTRO';

export type ExtractionType = 
  | 'ALCOOL_GELO_SECO' 
  | 'ROSIN' 
  | 'ALCOOL_TINTURA' 
  | 'DRY_ICE' 
  | 'ICEOLATOR'
  | 'TCHECK';

export interface GeneticYieldRating {
  id: string;
  cultivarName: string;
  extractionCategory: 'Dry Ice (Gelo Seco)' | 'Dry Sift' | 'Ice Hash' | 'Gelo Seco + Álcool' | 'Álcool Tintura' | 'Rosin' | 'T-Check Potência' | string;
  score: number; // 1 to 5 stars
  yieldCategory: 'Excepcional (>18%)' | 'Alto (12-18%)' | 'Médio (8-12%)' | 'Baixo (<8%)' | 'Experimental' | string;
  trichomeQuality: 'Excelente' | 'Bom' | 'Regular' | string;
  notes: string;
  ratedAt: string;
  ratedBy: string;
}

// 1. Extração Álcool - Gelo Seco
export interface ExtractionAlcoolGeloSecoRecord {
  id: string;
  lote: string | number;
  dataHora: string;
  molecula: MoleculeType;
  genetica: string;
  materiaSecaGramas: number | string;
  alcoolLitros: number | string;
  geloSecoKg: number | string;
  duracaoAlcoolHoras: number | string;
  tinturaStatus: string;
  rendimentoResinaGramas: number | string;
  rendimentoPorcentagem: number | string;
  diluicaoTCM: string;
  quantidadeEnvases30ml: string;
  statusResina: string;
  observacoes?: string;
  isUsed?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  usedAt?: string;
  geneticRating?: GeneticYieldRating;
}

// 2. Extração Rosin
export interface ExtractionRosinRecord {
  id: string;
  lote: string | number;
  dataHora: string;
  molecula: MoleculeType;
  genetica: string;
  tipoMateriaPrima?: string;
  materiaSecaGramas: number | string;
  micragemBag: string;
  temperaturaPrensa?: string;
  temperaturaPrensagemC?: string;
  pressaoPSI?: string;
  pressaoPsi?: string;
  tempoPrensagem: string;
  rendimentoRosinGramas?: number | string;
  rendimentoResinaGramas?: number | string;
  rendimentoPorcentagem: number | string;
  consistencia?: string;
  diluicaoTCM?: string;
  quantidadeEnvases30ml?: string;
  statusResina: string;
  observacoes?: string;
  isUsed?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  usedAt?: string;
  geneticRating?: GeneticYieldRating;
}

// 3. Extração Álcool Tintura
export interface ExtractionAlcoolTinturaRecord {
  id: string;
  lote: string | number;
  dataHora: string;
  molecula: MoleculeType;
  genetica: string; // Ex: 'Boldo', 'Alecrim', 'Capim-Limão', 'DEEP CANDY'
  matrizTipo?: MatrizFitoterapicaType;
  nomeCientifico?: string; // Ex: 'Peumus boldus', 'Rosmarinus officinalis'
  partePlanta?: string; // Ex: 'Folhas', 'Flores', 'Sumidades Floridas', 'Inflorescências'
  principioAtivo?: string; // Ex: 'Boldina', 'Ácido Rosmarínico', 'Citral', 'Cumarina', 'CBD'
  indicacaoTerapeutica?: string; // Ex: 'Digestivo / Hepatoprotetor', 'Analgésico', 'Calmante'
  materiaSecaGramas: number | string;
  tipoAlcool?: string;
  alcoolLitros?: number | string;
  volumeAlcoolLitros?: number | string;
  graduacaoAlcoolica?: string; // Ex: 'Álcool de Cereais 70%', '96%'
  tempoMaceracaoHoras?: number | string;
  duracaoMaceracaoHoras?: number | string;
  duracaoMaceracao?: string;
  temperaturaExtracao?: string;
  tipoFiltracao?: string;
  tinturaArmazenadaLitros: number | string;
  concentracaoEstimadaMgMl?: number | string;
  proporcaoDrogaSolvente?: string; // Ex: '1:5', '1:10', '1:2'
  diluicaoTCM?: string;
  diluicaoTcmFrascos?: string;
  quantidadeEnvases30ml?: string;
  statusTintura: string;
  observacoes?: string;
  isUsed?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  usedAt?: string;
  geneticRating?: GeneticYieldRating;
}

// 4. Extração Dry Ice (Gelo Seco)
export interface ExtractionDryIceRecord {
  id: string;
  lote?: string | number;
  dataHora: string;
  molecula: MoleculeType;
  genetica: string;
  geneticasMultiplasTexto?: string;
  materiaSecaGramas: number | string;
  geloSecoKg: number | string;
  telaMicragem: string;
  tempAmbiente: string;
  umidadeAmbiente: string;
  rendimentoResinaGramas: number | string;
  rendimentoPorcentagem: number | string;
  statusResina: string;
  observacoes?: string;
  isUsed?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  usedAt?: string;
  geneticRating?: GeneticYieldRating;
}

// 5. Extração Iceolator (Water Hash / Ice Hash)
export interface ExtractionIceolatorRecord {
  id: string;
  lote?: string | number;
  dataHora: string;
  molecula: MoleculeType;
  genetica: string;
  geneticasMultiplasTexto?: string;
  materiaSecaGramas: number | string;
  quantidadeAguaLitros: number | string;
  quantidadeGeloKg: number | string;
  bagsMicragem: string[];
  tempAmbiente: string;
  umidadeAmbiente: string;
  numeroCiclos: number | string;
  tempoAproxCiclo: string;
  rendimentoResinaGramas: number | string;
  rendimentoPorcentagem: number | string;
  statusResina: string;
  observacoes?: string;
  isUsed?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  usedAt?: string;
  geneticRating?: GeneticYieldRating;
}

// 6. Diluição e Envase
export interface DiluicaoEnvaseRecord {
  id: string;
  lote?: string | number;
  loteEnvase?: string;
  dataHora?: string;
  dataDiluicao?: string;
  loteExtratoOrigem?: string;
  tipoProduto?: string;
  categoriaProduto?: 'FITOTERAPICO' | 'OLEO_CANABINOIDE' | 'BLEND_SINERGIA' | 'FITOCOSMETICO' | string;
  matrizTipo?: MatrizFitoterapicaType;
  cultivarGenetica?: string; // Nome da Planta ou Genética
  nomeCientifico?: string;
  principioAtivo?: string;
  indicacaoTerapeutica?: string;
  posologiaSugerida?: string;
  molecula?: MoleculeType;
  veiculoCarreador: string;
  concentracaoAlvo?: string;
  concentracaoAlvoMgMl?: number | string;
  volumeTotalPreparadoMl?: number | string;
  volumePorFrascoMl?: number | string;
  volumeVeiculoMl?: number | string;
  tamanhoFrascoMl?: string;
  quantidadeFrascos?: number | string;
  quantidadeFrascosEnvazados?: number | string;
  canabinoidesMgPorMl?: string;
  tcheckerMgMl?: number | string;
  concentracaoPorGotaMg?: number | string;
  finalidadeDestino?: string;
  farmaceuticoResponsavel?: string;
  dataValidade?: string;
  statusLote: string;
  massaResinaUtilizadaG?: number | string;
  observacoes?: string;
  isUsed?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  usedAt?: string;
}

// T-Check Record
export interface TCheckRecord {
  id: string;
  lote?: string | number;
  loteRelacionado?: string | number;
  amostraIdentificacao?: string;
  data?: string;
  dataHora?: string;
  genetica?: string;
  molecula?: MoleculeType;
  materiaTestada?: string;
  cbdPorcentagem?: number;
  thcPorcentagem?: number;
  cbgPorcentagem?: number;
  cbnPorcentagem?: number;
  thcMgMl?: number;
  cbdMgMl?: number;
  cbgMgMl?: number;
  cbnMgMl?: number;
  potenciaTotalMgMl?: number;
  tipoDispositivo?: string;
  calibracaoData?: string;
  statusLaudo?: string;
  veiculoUtilizado?: string;
  temperaturaLeitura?: string;
  fatorDiluicaoTCheck?: string;
  farmaceutico?: string;
  observacoes?: string;
  geneticRating?: GeneticYieldRating;
}

export type StudyCategory = 
  | 'Canabinoides e Farmacologia'
  | 'Terpenos e Efeito Comitiva'
  | 'Extração e Processamento'
  | 'Sistema Endocanabinoide'
  | 'Fitoterapia e Interações'
  | 'Ensaios Clínicos e Dosagem'
  | string;

// Estudo Científico
export interface ScientificStudy {
  id: string;
  title?: string;
  titulo?: string;
  authors?: string;
  autores?: string;
  year?: number | string;
  ano?: number | string;
  journal?: string;
  revista?: string;
  category?: StudyCategory | string;
  categoria?: string;
  tags: string[];
  abstract?: string;
  resumo?: string;
  keyFindings?: string[];
  doiUrl?: string;
  doi?: string;
  pdfDriveUrl?: string;
  pdfUrl?: string;
  driveFileId?: string;
  destaque?: boolean;
}

// POP (Procedimento Operacional Padrão)
export interface StandardOperatingProcedure {
  id: string;
  code?: string;
  codigo?: string;
  title?: string;
  titulo?: string;
  revision?: string;
  versao?: string;
  effectiveDate?: string;
  dataRevisao?: string;
  approvedBy?: string;
  responsavelTecnico?: string;
  objective?: string;
  objetivo?: string;
  responsibility?: string;
  campoAplicacao?: string;
  materials?: string[];
  equipamentos?: string[];
  materiais?: string[];
  category?: string;
  steps?: { stepNumber: number; title: string; description: string }[];
  passoAPasso?: { passo: number; descricao: string; atencao?: string }[];
  criticalPoints?: string[];
  cuidadosSeguranca?: string[];
  registroRastreabilidade?: string;
}

// Estoque do Lab
export interface LabStockItem {
  id: string;
  name: string;
  category: 'MATERIA_PRIMA' | 'SOLVENTE' | 'REAGENTE' | 'EMBALAGEM' | 'CONSUMIVEL' | string;
  quantity: number;
  unit: string;
  minQuantity: number;
  location: string;
  status: 'OK' | 'LOW' | 'CRITICAL' | 'NORMAL' | string;
  supplier?: string;
  lastRestockDate: string;
}

// Certificado / COA
export interface LabCertificate {
  id: string;
  code: string;
  title: string;
  type: 'POTENCIA_HPLC' | 'PERFIL_TERPENICO' | 'MICROBIOLOGICO' | 'METAIS_PESADOS' | 'SOLVENTES_RESIDUAIS' | string;
  issueDate: string;
  laboratory: string;
  cultivarOrLot: string;
  status: string;
  pdfUrl: string;
  notes?: string;
}

export type CertificadoLaboratorio = {
  id: string;
  titulo: string;
  emissor: string;
  numeroRegistro: string;
  dataEmissao: string;
  dataValidade: string;
  status: string;
  categoria: string;
  arquivoUrl?: string;
};

// Fornecedor
export interface LabSupplier {
  id: string;
  name: string;
  category: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  productsSupplied: string[];
}

export type FornecedorInsumo = {
  id: string;
  nomeEmpresa: string;
  cnpj?: string;
  categoriaInsumo: string;
  contatoNome: string;
  telefone: string;
  email: string;
  cidadeEstado: string;
  laudoQualidadeDisponivel: boolean;
  statusFornecedor: string;
  observacoes?: string;
};

// Genética na Biblioteca
export interface CultivarGenetics {
  id: string;
  name: string;
  breeder: string;
  type: 'HYBRID' | 'INDICA' | 'SATIVA' | 'RUDERALIS' | string;
  primaryMolecule: MoleculeType;
  averageScore: number;
  averageYieldPercent: number;
  terpeneProfile: string[];
  extractionHistoryCount: number;
  notes?: string;
}
