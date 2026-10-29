import React, { useState, useMemo } from 'react';
import {
  PackageCheck,
  FileDown,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  Clock,
  CheckSquare,
  Square,
  AlertCircle,
  FlaskConical,
  Droplets,
  Calculator,
  ShieldCheck,
  RotateCcw,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Leaf,
  HeartPulse,
  Sparkle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DiluicaoEnvaseRecord, MoleculeType } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';
import { initialDiluicaoEnvase } from '../../data/initialData';
import { isBeforeMay2026, compareDatesDesc } from '../../utils/dateUtils';

type TabViewMode = 'ATIVAS' | 'USADAS' | 'TODAS';
type CategoryFilterMode = 'TODAS' | 'OLEOS' | 'FITOTERAPICOS' | 'BLENDS' | 'FITOCOSMETICOS';

export const DiluicaoEnvase: React.FC = () => {
  const {
    diluicaoEnvaseList,
    setDiluicaoEnvaseList,
    setActiveSession,
    setActiveTCheckTab,
  } = useApp();

  // Automatic safeguard: if the local list has fewer than 199 records (e.g. from previous cache), update to the full 199 list
  React.useEffect(() => {
    if (diluicaoEnvaseList.length < 199) {
      setDiluicaoEnvaseList(initialDiluicaoEnvase);
    }
  }, [diluicaoEnvaseList.length, setDiluicaoEnvaseList]);

  const [searchTerm, setSearchTerm] = useState('');
  const [moleculeFilter, setMoleculeFilter] = useState<string>('TODAS');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterMode>('TODAS');
  const [viewMode, setViewMode] = useState<TabViewMode>('ATIVAS');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DiluicaoEnvaseRecord | null>(null);
  const [inspectingRecord, setInspectingRecord] = useState<DiluicaoEnvaseRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<DiluicaoEnvaseRecord>>({
    lote: 141,
    dataDiluicao: new Date().toLocaleDateString('pt-BR'),
    cultivarGenetica: 'Y GRIEGA 2.0',
    categoriaProduto: 'OLEO_CANABINOIDE',
    molecula: 'CBD',
    massaResinaUtilizadaG: '3.0 g',
    veiculoCarreador: 'TCM (Triglicerídeos de Cadeia Média)',
    volumeVeiculoMl: '450 mL',
    tcheckerMgMl: 10.0,
    concentracaoAlvoMgMl: 10.0,
    tamanhoFrascoMl: '30mL',
    quantidadeFrascosEnvazados: 15,
    concentracaoPorGotaMg: '0.50 mg/gota',
    finalidadeDestino: 'Acolhimento de Pacientes ASTRAYA',
    statusLote: 'DISPONÍVEL / ATIVO',
    farmaceuticoResponsavel: 'Farmacêutico Responsável ASTRAYA - CRF/SP',
    observacoes: 'Homogeneização a 45°C por 30 minutos em agitador magnético.',
    isUsed: false,
    isArchived: false,
  });

  // Helper to determine if record is completed/used/delivered (dates prior to May 2026 or marked completed)
  const isRecordUsed = (item: DiluicaoEnvaseRecord) => {
    if (item.isUsed !== undefined) return item.isUsed;
    const dateVal = item.dataDiluicao || item.dataHora;
    if (isBeforeMay2026(dateVal)) {
      return true;
    }
    const status = (item.statusLote || '').toUpperCase();
    return status.includes('FINALIZAD') || status.includes('ENTREGUE') || status.includes('CONSUMID');
  };

  // Helper to test if a record is archived
  const isRecordArchived = (item: DiluicaoEnvaseRecord) => {
    return !!item.isArchived;
  };

  // Helper to identify blends of Cannabinoids with phytotherapics (e.g. CBD + Cúrcuma + Gengibre)
  const isCannaFitoBlendRecord = (item: DiluicaoEnvaseRecord) => {
    if (item.molecula === 'Canna+Fito' || item.molecula === ('CANNA_FITO' as any) || item.molecula === ('Canna + Fito' as any)) {
      return true;
    }
    if (item.categoriaProduto === 'BLEND_SINERGIA' || item.matrizTipo === 'BLEND_SINERGIA' || String(item.lote).startsWith('B-')) {
      return true;
    }
    const text = `${item.cultivarGenetica || ''} ${item.principioAtivo || ''} ${item.observacoes || ''}`.toUpperCase();
    const hasCannabinoid = text.includes('CBD') || text.includes('THC') || text.includes('CBG') || text.includes('CBN') || text.includes('CANAB');
    const hasFito = text.includes('CÚRCUMA') || text.includes('CURCUMA') || text.includes('GENGIBRE') || text.includes('ALECRIM') || text.includes('CAMOMILA') || text.includes('MULUNGU') || text.includes('PASSIFLORA') || text.includes('ERVA-BALEEIRA') || text.includes('CALÊNDULA') || text.includes('CALENDULA') || text.includes('ARNICA') || text.includes('COPAÍBA') || text.includes('COPAIBA') || text.includes('VALERIANA') || text.includes('MELISSA') || text.includes('CAPIM-LIMÃO') || text.includes('CAPIM LIMAO') || text.includes('LAVANDA') || text.includes('MENTA') || text.includes('BLEND') || text.includes('SINERGIA');
    return hasCannabinoid && hasFito;
  };

  // Tab counts (dividing records between Ativas and Entregues by date rule)
  const totalCount = diluicaoEnvaseList.length;
  const activeCount = diluicaoEnvaseList.filter((i) => !isRecordUsed(i)).length;
  const usedCount = diluicaoEnvaseList.filter((i) => isRecordUsed(i)).length;

  // Category counts
  const oleosCount = diluicaoEnvaseList.filter(
    (i) => !i.categoriaProduto || i.categoriaProduto === 'OLEO_CANABINOIDE' || typeof i.lote === 'number'
  ).length;
  const fitoCount = diluicaoEnvaseList.filter(
    (i) => i.categoriaProduto === 'FITOTERAPICO' || String(i.lote).startsWith('T-')
  ).length;
  const blendsCount = diluicaoEnvaseList.filter(
    (i) => i.categoriaProduto === 'BLEND_SINERGIA' || (String(i.lote).startsWith('B-') && i.categoriaProduto !== 'FITOCOSMETICO')
  ).length;
  const fitocosmeticosCount = diluicaoEnvaseList.filter(
    (i) => i.categoriaProduto === 'FITOCOSMETICO'
  ).length;

  // Filtered and Sorted List (ordered from newest date to oldest date)
  const filteredList = useMemo(() => {
    const list = diluicaoEnvaseList.filter((item) => {
      const isUsed = isRecordUsed(item);

      // Status Filter
      if (viewMode === 'ATIVAS' && isUsed) return false;
      if (viewMode === 'USADAS' && !isUsed) return false;

      // Category Filter
      if (categoryFilter === 'OLEOS') {
        const isOleo = !item.categoriaProduto || item.categoriaProduto === 'OLEO_CANABINOIDE' || typeof item.lote === 'number';
        if (!isOleo) return false;
      } else if (categoryFilter === 'FITOTERAPICOS') {
        const isFito = item.categoriaProduto === 'FITOTERAPICO' || String(item.lote).startsWith('T-');
        if (!isFito) return false;
      } else if (categoryFilter === 'BLENDS') {
        const isBlend = item.categoriaProduto === 'BLEND_SINERGIA' || (String(item.lote).startsWith('B-') && item.categoriaProduto !== 'FITOCOSMETICO');
        if (!isBlend) return false;
      } else if (categoryFilter === 'FITOCOSMETICOS') {
        const isCosm = item.categoriaProduto === 'FITOCOSMETICO';
        if (!isCosm) return false;
      }

      // Molecule Filter
      if (moleculeFilter !== 'TODAS') {
        if (moleculeFilter === 'Canna+Fito') {
          if (!isCannaFitoBlendRecord(item)) return false;
        } else if (moleculeFilter === 'Fitoterápico') {
          const isFitoPure = (item.molecula === 'Fitoterápico' || item.categoriaProduto === 'FITOTERAPICO' || String(item.lote).startsWith('T-')) && !isCannaFitoBlendRecord(item);
          if (!isFitoPure && item.molecula !== 'Fitoterápico') return false;
        } else {
          if (item.molecula !== moleculeFilter) return false;
        }
      }

      // Search Term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          String(item.lote || '').toLowerCase().includes(term) ||
          (item.cultivarGenetica || '').toLowerCase().includes(term) ||
          (item.nomeCientifico || '').toLowerCase().includes(term) ||
          (item.principioAtivo || '').toLowerCase().includes(term) ||
          (item.indicacaoTerapeutica || '').toLowerCase().includes(term) ||
          (item.finalidadeDestino || '').toLowerCase().includes(term) ||
          (item.statusLote || '').toLowerCase().includes(term) ||
          (item.observacoes || '').toLowerCase().includes(term);

        if (!matchesSearch) return false;
      }

      return true;
    });

    // Ordenar da mais recente para a mais antiga (e lote como critério de desempate)
    return list.sort((a, b) => {
      const dateA = a.dataDiluicao || a.dataHora;
      const dateB = b.dataDiluicao || b.dataHora;
      const dateDiff = compareDatesDesc(dateA, dateB);
      if (dateDiff !== 0) return dateDiff;
      return String(b.lote).localeCompare(String(a.lote), undefined, { numeric: true });
    });
  }, [diluicaoEnvaseList, viewMode, categoryFilter, moleculeFilter, searchTerm]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, moleculeFilter, categoryFilter, viewMode]);

  // Paginated records
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    if (pageSize >= 200) return filteredList;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedList.map((i) => i.id));
    }
  };

  // Toggle single status
  const handleToggleUsed = (id: string) => {
    setDiluicaoEnvaseList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentUsed = isRecordUsed(item);
          const newUsed = !currentUsed;
          return {
            ...item,
            isUsed: newUsed,
            statusLote: newUsed ? 'LIBERADO / FINALIZADO' : 'DISPONÍVEL / ATIVO',
            usedAt: newUsed ? new Date().toLocaleDateString('pt-BR') : undefined,
          };
        }
        return item;
      })
    );
  };

  // Bulk actions
  const handleBulkMarkUsed = (markAsUsed: boolean) => {
    if (selectedIds.length === 0) return;
    setDiluicaoEnvaseList((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            isUsed: markAsUsed,
            statusLote: markAsUsed ? 'LIBERADO / FINALIZADO' : 'DISPONÍVEL / ATIVO',
            usedAt: markAsUsed ? new Date().toLocaleDateString('pt-BR') : undefined,
          };
        }
        return item;
      })
    );
    setSelectedIds([]);
  };

  // Save new record
  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lote) return;

    const newRecord: DiluicaoEnvaseRecord = {
      id: `dil-${Date.now()}`,
      lote: formData.lote,
      dataDiluicao: formData.dataDiluicao || new Date().toLocaleDateString('pt-BR'),
      cultivarGenetica: formData.cultivarGenetica || 'Genética Padrão',
      categoriaProduto: formData.categoriaProduto || 'OLEO_CANABINOIDE',
      molecula: (formData.molecula as MoleculeType) || 'CBD',
      massaResinaUtilizadaG: formData.massaResinaUtilizadaG || '3.0 g',
      veiculoCarreador: formData.veiculoCarreador || 'TCM (Triglicerídeos de Cadeia Média)',
      volumeVeiculoMl: formData.volumeVeiculoMl || '450 mL',
      tcheckerMgMl: formData.tcheckerMgMl || 10.0,
      concentracaoAlvoMgMl: formData.concentracaoAlvoMgMl || 10.0,
      tamanhoFrascoMl: formData.tamanhoFrascoMl || '30mL',
      quantidadeFrascosEnvazados: formData.quantidadeFrascosEnvazados || 15,
      concentracaoPorGotaMg: formData.concentracaoPorGotaMg || '0.50 mg/gota',
      finalidadeDestino: formData.finalidadeDestino || 'Acolhimento de Pacientes ASTRAYA',
      statusLote: formData.statusLote || 'DISPONÍVEL / ATIVO',
      farmaceuticoResponsavel: formData.farmaceuticoResponsavel || 'Farmacêutico Responsável ASTRAYA - CRF/SP',
      observacoes: formData.observacoes || '',
      isUsed: false,
      isArchived: false,
    };

    setDiluicaoEnvaseList([newRecord, ...diluicaoEnvaseList]);
    setIsNewModalOpen(false);
  };

  // Save edit record
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    setDiluicaoEnvaseList((prev) =>
      prev.map((item) => (item.id === editingRecord.id ? editingRecord : item))
    );
    setEditingRecord(null);
  };

  // Delete record
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente este lote de diluição/envase?')) {
      setDiluicaoEnvaseList((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Export PDF
  const handleExportPdf = () => {
    const headers = [
      'Lote',
      'Data Diluição',
      'Categoria',
      'Molécula',
      'Cultivar / Genética',
      'Massa Extrato / Resina',
      'Veículo & Volume',
      'Potência T-Check',
      'Frascos / Embalagens',
      'Mg/Gota / Posologia',
      'Finalidade / Destino',
      'Status Lote',
    ];

    const rows = filteredList.map((item) => [
      `Lote ${item.lote}`,
      item.dataDiluicao || '-',
      item.categoriaProduto || 'Óleo Canabinoide',
      item.molecula || '-',
      item.cultivarGenetica || '-',
      item.massaResinaUtilizadaG || '-',
      item.volumeVeiculoMl || '-',
      item.tcheckerMgMl ? `${item.tcheckerMgMl} mg/mL` : '-',
      `${item.quantidadeFrascosEnvazados || '-'} un (${item.tamanhoFrascoMl || '30mL'})`,
      item.concentracaoPorGotaMg || '-',
      item.finalidadeDestino || '-',
      item.statusLote || '-',
    ]);

    exportToPdf({
      title: 'Controle Geral de Diluição em TCM e Envase - ASTRAYA',
      subtitle: 'Registro Farmacotécnico Completo de Fracionamento e Dispensação Terapêutica (199 Registros)',
      headers,
      rows,
      fileName: `ASTRAYA_Diluicao_Envase_${Date.now()}`,
      orientation: 'landscape',
    });
  };

  // Export XLS
  const handleExportXls = () => {
    const headers = [
      'Lote',
      'Data Diluição',
      'Categoria Produto',
      'Molécula',
      'Cultivar / Genética',
      'Nome Científico',
      'Princípio Ativo',
      'Indicação Terapêutica',
      'Posologia Sugerida',
      'Massa Resina / Extrato',
      'Veículo Carreador',
      'Volume Veículo',
      'Potência T-Check (mg/mL)',
      'Concentração Alvo (mg/mL)',
      'Tamanho Frasco',
      'Frascos Envazados',
      'Concentração por Gota',
      'Finalidade / Destino',
      'Status Lote',
      'Farmacêutico Responsável',
      'Observações',
    ];

    const rows = filteredList.map((item) => [
      item.lote,
      item.dataDiluicao,
      item.categoriaProduto || 'OLEO_CANABINOIDE',
      item.molecula,
      item.cultivarGenetica,
      item.nomeCientifico || '',
      item.principioAtivo || '',
      item.indicacaoTerapeutica || '',
      item.posologiaSugerida || '',
      item.massaResinaUtilizadaG,
      item.veiculoCarreador,
      item.volumeVeiculoMl,
      item.tcheckerMgMl,
      item.concentracaoAlvoMgMl,
      item.tamanhoFrascoMl,
      item.quantidadeFrascosEnvazados,
      item.concentracaoPorGotaMg,
      item.finalidadeDestino,
      item.statusLote,
      item.farmaceuticoResponsavel,
      item.observacoes || '',
    ]);

    exportToXls({
      title: 'Diluicao_Envase_Completo_ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_Diluicao_Envase_199_Lotes_${Date.now()}`,
    });
  };

  // Metrics summary
  const totalFrascos = filteredList.reduce((acc, curr) => acc + (Number(curr.quantidadeFrascosEnvazados) || 0), 0);
  const totalLotes = filteredList.length;

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100/80 text-emerald-800 rounded-lg">
                <PackageCheck className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  Controle de Diluição em TCM e Envase
                </h1>
                <p className="text-xs text-slate-500">
                  Fracionamento em frascos conta-gotas 30mL, homogeneização em TCM grau farmacêutico, tinturas tradicionais e rastreabilidade total (199 lotes cadastrados)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setDiluicaoEnvaseList(initialDiluicaoEnvase);
              }}
              className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="Recarregar base oficial com os 199 lotes farmacotécnicos"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Base Oficial (199 Lotes)</span>
            </button>

            <button
              onClick={() => {
                setActiveSession('TCHECK_CALC');
                setActiveTCheckTab('CALCULADORAS');
              }}
              className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculadora Farmacotécnica</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="Exportar dados filtrados para PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF ({filteredList.length})</span>
            </button>

            <button
              onClick={handleExportXls}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="Exportar planilha Excel completa"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>XLS ({filteredList.length})</span>
            </button>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Envase</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
            <span className="text-[11px] font-medium text-slate-500 block">Lotes Cadastrados</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-slate-900">{totalLotes}</span>
              <span className="text-[10px] text-slate-400">de {totalCount} total</span>
            </div>
          </div>
          <div className="bg-emerald-50/60 rounded-lg p-2.5 border border-emerald-200/70">
            <span className="text-[11px] font-medium text-emerald-700 block">Frascos / Unidades Produzidas</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-emerald-900">{totalFrascos}</span>
              <span className="text-xs font-semibold text-emerald-700">frascos</span>
            </div>
          </div>
          <div className="bg-cyan-50/60 rounded-lg p-2.5 border border-cyan-200/70">
            <span className="text-[11px] font-medium text-cyan-800 block">Veículos Carreadores</span>
            <span className="text-xs font-bold text-cyan-900 mt-1 block">TCM C8/C10 & Solução 70%</span>
          </div>
          <div className="bg-amber-50/60 rounded-lg p-2.5 border border-amber-200/70">
            <span className="text-[11px] font-medium text-amber-800 block">Lotes Ativos & Prontos</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-amber-900">{activeCount}</span>
              <span className="text-[10px] text-amber-700 font-medium">({usedCount} finalizados)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setCategoryFilter('TODAS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'TODAS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todas as Categorias</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              categoryFilter === 'TODAS' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setCategoryFilter('OLEOS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'OLEOS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-emerald-400" />
            <span>Óleos Canabinoides (TCM)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              categoryFilter === 'OLEOS' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {oleosCount}
            </span>
          </button>

          <button
            onClick={() => setCategoryFilter('FITOTERAPICOS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'FITOTERAPICOS'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-800'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-teal-300" />
            <span>Fitoterápicos & Tinturas</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              categoryFilter === 'FITOTERAPICOS' ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {fitoCount}
            </span>
          </button>

          <button
            onClick={() => setCategoryFilter('BLENDS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'BLENDS'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Blends & Sinergia</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              categoryFilter === 'BLENDS' ? 'bg-purple-700 text-purple-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {blendsCount}
            </span>
          </button>

          <button
            onClick={() => setCategoryFilter('FITOCOSMETICOS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'FITOCOSMETICOS'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-800'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-pink-300" />
            <span>Fitocosméticos & Tópicos</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              categoryFilter === 'FITOCOSMETICOS' ? 'bg-pink-700 text-pink-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {fitocosmeticosCount}
            </span>
          </button>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
            <button
              onClick={() => setViewMode('ATIVAS')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'ATIVAS'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ativas / Prontas</span>
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
                {activeCount}
              </span>
            </button>

            <button
              onClick={() => setViewMode('USADAS')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'USADAS'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Entregues e Finalizadas</span>
              <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">
                {usedCount}
              </span>
            </button>

            <button
              onClick={() => setViewMode('TODAS')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'TODAS'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Todas</span>
              <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">
                {totalCount}
              </span>
            </button>
          </div>

          {/* Search & Molecule Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar lote, planta, indicação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={moleculeFilter}
                onChange={(e) => setMoleculeFilter(e.target.value)}
                className="text-xs bg-transparent border-0 font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="TODAS">Molécula: Todas</option>
                <option value="Canna+Fito">Canna+Fito (Canabinoides + Fitoterápicos)</option>
                <option value="CBD">CBD</option>
                <option value="THC">THC</option>
                <option value="THC/CBD">THC/CBD (1:1)</option>
                <option value="CBG">CBG</option>
                <option value="CBN">CBN</option>
                <option value="Fitoterápico">Fitoterápico Puro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-900">
                {selectedIds.length} {selectedIds.length === 1 ? 'lote selecionado' : 'lotes selecionados'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {viewMode !== 'USADAS' && (
                <button
                  onClick={() => handleBulkMarkUsed(true)}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Marcar como Entregue/Finalizado</span>
                </button>
              )}

              {viewMode === 'USADAS' && (
                <button
                  onClick={() => handleBulkMarkUsed(false)}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs font-bold"
                >
                  <RotateCcw className="w-3 h-3 text-emerald-600" />
                  <span>Reativar Selecionados</span>
                </button>
              )}

              <button
                onClick={() => setSelectedIds([])}
                className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 w-8 text-center">
                  <button
                    onClick={handleSelectAll}
                    className="cursor-pointer text-slate-500 hover:text-slate-800"
                    title="Selecionar Todos da Página"
                  >
                    {paginatedList.length > 0 && selectedIds.length === paginatedList.length ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">Lote</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Data Diluição</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Molécula</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Cultivar / Matriz</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Massa Resina / Extrato</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Veículo & Volume</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Potência T-Check</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Frascos Envazados</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Concentração / Gota</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Destino / Finalidade</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status Lote</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-500 bg-slate-50/50">
                    <PackageCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-700">Nenhum registro de diluição e envase encontrado</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {searchTerm || moleculeFilter !== 'TODAS' || categoryFilter !== 'TODAS'
                        ? 'Tente ajustar seus termos de busca ou filtros de categoria.'
                        : 'Clique em "Novo Envase" para adicionar um novo registro.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => {
                  const isUsed = isRecordUsed(item);
                  const isArchived = isRecordArchived(item);
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isUsed ? 'bg-slate-100/60 opacity-75' : 'bg-white'
                      } ${isSelected ? 'bg-emerald-50/40 ring-1 ring-emerald-500/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleSelect(item.id)}
                          className="cursor-pointer text-slate-400 hover:text-slate-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Lote */}
                      <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-200/80 text-slate-800 rounded font-mono text-[11px]">
                          Lote {item.lote}
                        </span>
                        {isArchived && (
                          <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                            ARQUIVADO
                          </span>
                        )}
                      </td>

                      {/* Data Diluição */}
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        {item.dataDiluicao || '-'}
                      </td>

                      {/* Molécula */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.molecula === 'Canna+Fito' || (isCannaFitoBlendRecord(item) && moleculeFilter === 'Canna+Fito')
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : item.molecula === 'CBD'
                              ? 'bg-blue-100 text-blue-800'
                              : item.molecula === 'THC'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.molecula === 'THC/CBD'
                              ? 'bg-purple-100 text-purple-800'
                              : item.molecula === 'CBG'
                              ? 'bg-amber-100 text-amber-800'
                              : item.molecula === 'CBN'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {item.molecula === 'Canna+Fito' ? 'Canna+Fito' : item.molecula}
                        </span>
                      </td>

                      {/* Cultivar / Genética / Matriz */}
                      <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{item.cultivarGenetica || '-'}</span>
                          {item.nomeCientifico && (
                            <span className="text-[10px] italic text-slate-400">{item.nomeCientifico}</span>
                          )}
                        </div>
                      </td>

                      {/* Massa de Resina / Extrato */}
                      <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap font-medium">
                        {item.massaResinaUtilizadaG || '-'}
                      </td>

                      {/* Veículo & Volume TCM */}
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-medium">
                          <Droplets className="w-3 h-3 text-teal-600" />
                          <span>{item.volumeVeiculoMl || '-'}</span>
                        </div>
                      </td>

                      {/* Potência T-Check & Alvo */}
                      <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-emerald-700">
                            {item.tcheckerMgMl ? `${item.tcheckerMgMl} mg/mL` : '-'}
                          </span>
                          {item.concentracaoAlvoMgMl && (
                            <span className="text-[10px] text-slate-400">
                              Alvo: {item.concentracaoAlvoMgMl} mg/mL
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Frascos Envazados */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-900">
                        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded">
                          {item.quantidadeFrascosEnvazados || '-'} {item.categoriaProduto === 'FITOCOSMETICO' ? 'un' : 'frascos'}
                        </span>
                      </td>

                      {/* Concentração por Gota */}
                      <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                        {item.concentracaoPorGotaMg || '-'}
                      </td>

                      {/* Destino / Finalidade */}
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={item.finalidadeDestino}>
                        {item.finalidadeDestino || '-'}
                      </td>

                      {/* Status Lote */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleUsed(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            isUsed
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                          }`}
                          title="Clique para alternar entre Ativo e Entregue/Finalizado"
                        >
                          {isUsed ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-slate-500" />
                              <span>FINALIZADO</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-emerald-600" />
                              <span>LIBERADO / ATIVO</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setInspectingRecord(item)}
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="Visualizar Ficha Farmacotécnica Completa"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setEditingRecord(item)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Editar Lote de Envase"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Excluir Lote"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Exibindo</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value={20}>20 lotes/pág</option>
              <option value={25}>25 lotes/pág</option>
              <option value={50}>50 lotes/pág</option>
              <option value={100}>100 lotes/pág</option>
              <option value={200}>Todos ({filteredList.length})</option>
            </select>
            <span>
              de <strong>{filteredList.length}</strong> lotes encontrados (Total base: <strong>{totalCount}</strong>)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-xs border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Primeira
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-800">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-xs border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Última
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Ficha Farmacotécnica Completa (Inspect / Print) */}
      {inspectingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Ficha Farmacotécnica do Lote {inspectingRecord.lote}
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      ASTRAYA LAB
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Controle de fracionamento, perfil metrológico e conformidade
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* Header Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Lote de Envase</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">Lote {inspectingRecord.lote}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Data Manipulação</span>
                  <span className="text-xs font-semibold text-slate-800">{inspectingRecord.dataDiluicao || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Molécula Principal</span>
                  <span className="text-xs font-bold text-emerald-800">{inspectingRecord.molecula}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Status do Lote</span>
                  <span className="text-xs font-bold text-slate-800">{inspectingRecord.statusLote}</span>
                </div>
              </div>

              {/* Composition and Extraction Matrix */}
              <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-3">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                  <FlaskConical className="w-4 h-4 text-emerald-700" />
                  <span>Composição Farmacotécnica & Solvente Carreador</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-emerald-800/80 block">Cultivar / Matriz:</span>
                    <strong className="text-slate-900 text-xs">{inspectingRecord.cultivarGenetica}</strong>
                    {inspectingRecord.nomeCientifico && (
                      <span className="text-[10px] italic text-slate-500 block">{inspectingRecord.nomeCientifico}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-800/80 block">Massa de Extrato / Resina:</span>
                    <strong className="text-slate-900 text-xs font-mono">{inspectingRecord.massaResinaUtilizadaG}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-800/80 block">Veículo Carreador:</span>
                    <strong className="text-slate-900 text-xs">{inspectingRecord.veiculoCarreador} ({inspectingRecord.volumeVeiculoMl})</strong>
                  </div>
                </div>
              </div>

              {/* Potency & Dosage Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs">Parâmetros de Potência & Fracionamento</h4>
                  <ul className="space-y-1.5 text-[11px]">
                    <li className="flex justify-between">
                      <span className="text-slate-500">Leitura T-Check:</span>
                      <strong className="text-emerald-700">{inspectingRecord.tcheckerMgMl ? `${inspectingRecord.tcheckerMgMl} mg/mL` : 'Conforme Farmacopeia'}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">Concentração Alvo:</span>
                      <strong>{inspectingRecord.concentracaoAlvoMgMl ? `${inspectingRecord.concentracaoAlvoMgMl} mg/mL` : '-'}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">Frascos Produzidos:</span>
                      <strong>{inspectingRecord.quantidadeFrascosEnvazados} frascos ({inspectingRecord.tamanhoFrascoMl || '30mL'})</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">Concentração por Gota:</span>
                      <strong className="font-mono text-slate-900">{inspectingRecord.concentracaoPorGotaMg}</strong>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs">Destinação Terapêutica & Posologia</h4>
                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Finalidade Clínica:</span>
                      <strong className="text-slate-900">{inspectingRecord.finalidadeDestino}</strong>
                    </div>
                    {inspectingRecord.indicacaoTerapeutica && (
                      <div>
                        <span className="text-slate-500 block">Indicação Farmacológica:</span>
                        <strong className="text-teal-800">{inspectingRecord.indicacaoTerapeutica}</strong>
                      </div>
                    )}
                    {inspectingRecord.posologiaSugerida && (
                      <div>
                        <span className="text-slate-500 block">Posologia Padrão:</span>
                        <span className="text-slate-700">{inspectingRecord.posologiaSugerida}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pharmacist & Observations */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Observações e Validação Técnica
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {inspectingRecord.observacoes || 'Lote inspecionado e conforme padrões de qualidade da Farmacopeia e ASTRAYA.'}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Responsável Técnico: <strong>{inspectingRecord.farmaceuticoResponsavel}</strong></span>
                  <span>Rastreabilidade: <strong>Lote {inspectingRecord.lote} / Astraya Lab</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectingRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Ficha</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Envase */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <PackageCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Novo Lote de Diluição & Envase</h3>
                  <p className="text-xs text-slate-500">Registro farmacotécnico de fracionamento em frascos 30mL</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Número do Lote
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lote || ''}
                    onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-bold"
                    placeholder="Ex: 141 ou T-136"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Data da Diluição
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dataDiluicao || ''}
                    onChange={(e) => setFormData({ ...formData, dataDiluicao: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    placeholder="DD/MM/AAAA"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Molécula
                  </label>
                  <select
                    value={formData.molecula || 'CBD'}
                    onChange={(e) => setFormData({ ...formData, molecula: e.target.value as MoleculeType })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="CBD">CBD</option>
                    <option value="THC">THC</option>
                    <option value="THC/CBD">THC/CBD (1:1)</option>
                    <option value="CBG">CBG</option>
                    <option value="CBN">CBN</option>
                    <option value="Canna+Fito">Canna+Fito (Canabinoides + Fitoterápicos)</option>
                    <option value="Fitoterápico">Fitoterápico Puro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Cultivar / Genética / Matriz
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cultivarGenetica || ''}
                    onChange={(e) => setFormData({ ...formData, cultivarGenetica: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    placeholder="Ex: Y GRIEGA 2.0 ou BOLDO"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Massa de Resina / Extrato (g)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.massaResinaUtilizadaG || ''}
                    onChange={(e) => setFormData({ ...formData, massaResinaUtilizadaG: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                    placeholder="Ex: 3.0 g"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Volume Veículo (mL)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.volumeVeiculoMl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = parseFloat(val);
                      const frascosCalc = !isNaN(num) ? Math.floor(num / 30) : formData.quantidadeFrascosEnvazados;
                      setFormData({
                        ...formData,
                        volumeVeiculoMl: val,
                        quantidadeFrascosEnvazados: frascosCalc,
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                    placeholder="Ex: 450 mL"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Potência T-Check (mg/mL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.tcheckerMgMl || ''}
                    onChange={(e) => {
                      const conc = Number(e.target.value);
                      const mgGota = (conc / 20).toFixed(2);
                      setFormData({
                        ...formData,
                        tcheckerMgMl: conc,
                        concentracaoPorGotaMg: `${mgGota} mg/gota`,
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                    placeholder="Ex: 10.0"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Frascos 30mL Envazados
                  </label>
                  <input
                    type="number"
                    value={formData.quantidadeFrascosEnvazados || ''}
                    onChange={(e) => setFormData({ ...formData, quantidadeFrascosEnvazados: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-bold"
                    placeholder="Ex: 15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Concentração por Gota
                  </label>
                  <input
                    type="text"
                    value={formData.concentracaoPorGotaMg || ''}
                    onChange={(e) => setFormData({ ...formData, concentracaoPorGotaMg: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                    placeholder="Ex: 0.50 mg/gota"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Finalidade / Destino
                  </label>
                  <input
                    type="text"
                    value={formData.finalidadeDestino || ''}
                    onChange={(e) => setFormData({ ...formData, finalidadeDestino: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    placeholder="Ex: Acolhimento de Pacientes ASTRAYA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Observações Farmacêuticas
                </label>
                <textarea
                  rows={2}
                  value={formData.observacoes || ''}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  placeholder="Informações adicionais de formulação, homogeneização ou laudo..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Lote</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Envase */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Edit2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Editar Lote de Diluição & Envase</h3>
                  <p className="text-xs text-slate-500">Lote {editingRecord.lote} - {editingRecord.cultivarGenetica}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Número do Lote
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.lote || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, lote: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Data da Diluição
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.dataDiluicao || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, dataDiluicao: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Molécula
                  </label>
                  <select
                    value={editingRecord.molecula || 'CBD'}
                    onChange={(e) => setEditingRecord({ ...editingRecord, molecula: e.target.value as MoleculeType })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="CBD">CBD</option>
                    <option value="THC">THC</option>
                    <option value="THC/CBD">THC/CBD (1:1)</option>
                    <option value="CBG">CBG</option>
                    <option value="CBN">CBN</option>
                    <option value="Canna+Fito">Canna+Fito (Canabinoides + Fitoterápicos)</option>
                    <option value="Fitoterápico">Fitoterápico Puro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Cultivar / Genética / Matriz
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.cultivarGenetica || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, cultivarGenetica: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Massa de Resina / Extrato (g)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.massaResinaUtilizadaG || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, massaResinaUtilizadaG: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Volume Veículo (mL)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.volumeVeiculoMl || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, volumeVeiculoMl: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Potência T-Check (mg/mL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRecord.tcheckerMgMl || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, tcheckerMgMl: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Frascos 30mL Envazados
                  </label>
                  <input
                    type="number"
                    value={editingRecord.quantidadeFrascosEnvazados || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, quantidadeFrascosEnvazados: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Concentração por Gota
                  </label>
                  <input
                    type="text"
                    value={editingRecord.concentracaoPorGotaMg || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, concentracaoPorGotaMg: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Status do Lote
                  </label>
                  <select
                    value={editingRecord.statusLote || 'DISPONÍVEL / ATIVO'}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      const isUsed = newStatus.includes('FINALIZAD') || newStatus.includes('ENTREGUE');
                      setEditingRecord({
                        ...editingRecord,
                        statusLote: newStatus,
                        isUsed,
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="DISPONÍVEL / ATIVO">DISPONÍVEL / ATIVO</option>
                    <option value="LIBERADO / FINALIZADO">LIBERADO / FINALIZADO</option>
                    <option value="EM QUARENTENA">EM QUARENTENA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Observações Farmacêuticas
                </label>
                <textarea
                  rows={2}
                  value={editingRecord.observacoes || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, observacoes: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
