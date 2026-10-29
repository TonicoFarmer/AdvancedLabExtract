import React, { useState } from 'react';
import {
  Flame,
  FileDown,
  Plus,
  Search,
  Filter,
  Star,
  Edit2,
  Trash2,
  Dna,
  X,
  Save,
  Archive,
  ArchiveRestore,
  CheckCircle2,
  Clock,
  CheckSquare,
  Square,
  AlertCircle,
  PackageCheck,
  RotateCcw,
  Sparkles,
  Gauge,
  Thermometer,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExtractionRosinRecord, MoleculeType } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';
import { GeneticScoreModal } from './GeneticScoreModal';

type TabViewMode = 'ATIVAS' | 'USADAS' | 'ARQUIVADAS' | 'TODAS';

export const ExtractionRosin: React.FC = () => {
  const {
    rosinList,
    setRosinList,
    rateGeneticRecord,
    setActiveSession,
    setActiveTCheckTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [moleculeFilter, setMoleculeFilter] = useState<string>('TODAS');
  const [viewMode, setViewMode] = useState<TabViewMode>('ATIVAS');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [ratingModalData, setRatingModalData] = useState<{
    isOpen: boolean;
    recordId: string;
    cultivarName: string;
    initialRating?: any;
  }>({
    isOpen: false,
    recordId: '',
    cultivarName: '',
  });

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExtractionRosinRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ExtractionRosinRecord>>({
    dataHora: new Date().toLocaleString('pt-BR').slice(0, 16),
    molecula: 'THC',
    genetica: 'GORILLA GLUE #4',
    tipoMateriaPrima: 'Flor Seca Curada',
    materiaSecaGramas: '20 g',
    micragemBag: '90u',
    temperaturaPrensa: '85°C',
    pressaoPsi: '1200 PSI',
    tempoPrensagem: '180s',
    rendimentoRosinGramas: '4.2 g',
    rendimentoPorcentagem: '21.0%',
    consistencia: 'Cold Cure Badder',
    lote: 201,
    statusResina: 'DISPONÍVEL',
    isUsed: false,
    isArchived: false,
    observacoes: '',
  });

  // Helper to test if a record is used
  const isRecordUsed = (item: ExtractionRosinRecord) => {
    if (item.isUsed !== undefined) return item.isUsed;
    const status = (item.statusResina || '').toUpperCase();
    return status.includes('FINALIZADA') || status.includes('USADA') || status.includes('CONSUMIDA');
  };

  // Helper to test if a record is archived
  const isRecordArchived = (item: ExtractionRosinRecord) => {
    return !!item.isArchived;
  };

  // Tab counts
  const totalCount = rosinList.length;
  const activeCount = rosinList.filter((i) => !isRecordArchived(i) && !isRecordUsed(i)).length;
  const usedCount = rosinList.filter((i) => !isRecordArchived(i) && isRecordUsed(i)).length;
  const archivedCount = rosinList.filter((i) => isRecordArchived(i)).length;

  // Filtered list
  const filteredList = rosinList.filter((item) => {
    const isArchived = isRecordArchived(item);
    const isUsed = isRecordUsed(item);

    if (viewMode === 'ATIVAS' && (isArchived || isUsed)) return false;
    if (viewMode === 'USADAS' && (isArchived || !isUsed)) return false;
    if (viewMode === 'ARQUIVADAS' && !isArchived) return false;

    const matchesSearch =
      String(item.lote).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genetica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tipoMateriaPrima && item.tipoMateriaPrima.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.consistencia && item.consistencia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.observacoes && item.observacoes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.statusResina && item.statusResina.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMolecule = moleculeFilter === 'TODAS' || item.molecula === moleculeFilter;

    return matchesSearch && matchesMolecule;
  });

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((i) => i.id));
    }
  };

  // Toggle used status
  const handleToggleUsed = (id: string) => {
    setRosinList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentUsed = isRecordUsed(item);
          const newUsed = !currentUsed;
          return {
            ...item,
            isUsed: newUsed,
            statusResina: newUsed ? 'USADA / FINALIZADA' : 'DISPONÍVEL',
            usedAt: newUsed ? new Date().toLocaleDateString('pt-BR') : undefined,
          };
        }
        return item;
      })
    );
  };

  // Archive single record
  const handleToggleArchive = (id: string) => {
    setRosinList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentArchived = isRecordArchived(item);
          return {
            ...item,
            isArchived: !currentArchived,
            archivedAt: !currentArchived ? new Date().toLocaleDateString('pt-BR') : undefined,
          };
        }
        return item;
      })
    );
  };

  // Bulk actions
  const handleBulkMarkUsed = (markAsUsed: boolean) => {
    if (selectedIds.length === 0) return;
    setRosinList((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            isUsed: markAsUsed,
            statusResina: markAsUsed ? 'USADA / FINALIZADA' : 'DISPONÍVEL',
            usedAt: markAsUsed ? new Date().toLocaleDateString('pt-BR') : undefined,
          };
        }
        return item;
      })
    );
    setSelectedIds([]);
  };

  const handleBulkArchive = (archive: boolean) => {
    if (selectedIds.length === 0) return;
    setRosinList((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            isArchived: archive,
            archivedAt: archive ? new Date().toLocaleDateString('pt-BR') : undefined,
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

    const newRecord: ExtractionRosinRecord = {
      id: `rosin-${Date.now()}`,
      lote: Number(formData.lote),
      dataHora: formData.dataHora || new Date().toLocaleString('pt-BR').slice(0, 16),
      molecula: (formData.molecula as MoleculeType) || 'THC',
      genetica: formData.genetica || 'Genética Padrão',
      tipoMateriaPrima: formData.tipoMateriaPrima || 'Flor Seca Curada',
      materiaSecaGramas: formData.materiaSecaGramas || '20 g',
      micragemBag: formData.micragemBag || '90u',
      temperaturaPrensa: formData.temperaturaPrensa || '85°C',
      pressaoPsi: formData.pressaoPsi || '1200 PSI',
      tempoPrensagem: formData.tempoPrensagem || '180s',
      rendimentoRosinGramas: formData.rendimentoRosinGramas || '4.0 g',
      rendimentoPorcentagem: formData.rendimentoPorcentagem || '20.0%',
      consistencia: formData.consistencia || 'Cold Cure Badder',
      statusResina: formData.statusResina || 'DISPONÍVEL',
      observacoes: formData.observacoes || '',
      isUsed: false,
      isArchived: false,
    };

    setRosinList([newRecord, ...rosinList]);
    setIsNewModalOpen(false);
  };

  // Save edit record
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    setRosinList((prev) =>
      prev.map((item) => (item.id === editingRecord.id ? editingRecord : item))
    );
    setEditingRecord(null);
  };

  // Delete record
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente esta extração de Rosin?')) {
      setRosinList((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Export PDF
  const handleExportPdf = () => {
    const headers = [
      'Lote',
      'Data/Hora',
      'Molécula',
      'Genética',
      'Matéria-Prima',
      'Massa (g)',
      'Bag (u)',
      'Temp / Pressão',
      'Rend. Rosin (g)',
      'Rend. (%)',
      'Consistência',
      'Status',
    ];

    const rows = filteredList.map((item) => [
      `Lote ${item.lote}`,
      item.dataHora || '-',
      item.molecula || '-',
      item.genetica || '-',
      item.tipoMateriaPrima || '-',
      item.materiaSecaGramas || '-',
      item.micragemBag || '-',
      `${item.temperaturaPrensa || '-'} / ${item.pressaoPsi || '-'}`,
      item.rendimentoRosinGramas || '-',
      item.rendimentoPorcentagem || '-',
      item.consistencia || '-',
      item.statusResina || '-',
    ]);

    exportToPdf({
      title: 'Controle de Extração Rosin Solventless',
      subtitle: 'Prensagem mecânica de resina sem solventes - ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_Extracao_Rosin_${Date.now()}`,
      orientation: 'landscape',
    });
  };

  // Export XLS
  const handleExportXls = () => {
    const headers = [
      'Lote',
      'Data e Hora',
      'Molécula',
      'Genética',
      'Tipo Matéria-Prima',
      'Massa Seca (g)',
      'Micragem Bag',
      'Temperatura Prensa',
      'Pressão PSI',
      'Tempo Prensagem',
      'Rendimento Rosin (g)',
      'Rendimento (%)',
      'Consistência',
      'Status Resina',
      'Observações',
    ];

    const rows = filteredList.map((item) => [
      item.lote,
      item.dataHora,
      item.molecula,
      item.genetica,
      item.tipoMateriaPrima,
      item.materiaSecaGramas,
      item.micragemBag,
      item.temperaturaPrensa,
      item.pressaoPsi,
      item.tempoPrensagem,
      item.rendimentoRosinGramas,
      item.rendimentoPorcentagem,
      item.consistencia,
      item.statusResina,
      item.observacoes || '',
    ]);

    exportToXls({
      title: 'Extracao_Rosin_ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_Extracao_Rosin_${Date.now()}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-100/80 text-amber-800 rounded-lg">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  Extração Rosin (Solventless)
                </h1>
                <p className="text-xs text-slate-500">
                  Prensagem térmica sob pressão, extração 100% livre de solventes químicos e pura fração terpênica
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveSession('TCHECK_CALC');
                setActiveTCheckTab('CALCULADORAS');
              }}
              className="px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Calculadora de Prensagem</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF</span>
            </button>

            <button
              onClick={handleExportXls}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>XLS</span>
            </button>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Prensagem</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
            <span className="text-[11px] font-medium text-slate-500 block">Total de Prensagens</span>
            <span className="text-lg font-bold text-slate-900">{totalCount} lotes</span>
          </div>
          <div className="bg-amber-50/60 rounded-lg p-2.5 border border-amber-200/70">
            <span className="text-[11px] font-medium text-amber-800 block">Rosin Disponível</span>
            <span className="text-lg font-bold text-amber-900">{activeCount} lotes</span>
          </div>
          <div className="bg-emerald-50/60 rounded-lg p-2.5 border border-emerald-200/70">
            <span className="text-[11px] font-medium text-emerald-800 block">Pureza e Método</span>
            <span className="text-xs font-bold text-emerald-900 mt-1 block">100% Solventless</span>
          </div>
          <div className="bg-slate-100/70 rounded-lg p-2.5 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-600 block">Feitas & Usadas</span>
            <span className="text-lg font-bold text-slate-800">{usedCount} lotes</span>
          </div>
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
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Ativas / Disponíveis</span>
              <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px]">
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
              <span>Feitas & Usadas</span>
              <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">
                {usedCount}
              </span>
            </button>

            <button
              onClick={() => setViewMode('ARQUIVADAS')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'ARQUIVADAS'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-amber-600" />
              <span>Arquivadas</span>
              <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px]">
                {archivedCount}
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
                placeholder="Buscar lote, genética, consistência..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                <option value="TODAS">Canabinoide: Todos</option>
                <option value="CBD">CBD</option>
                <option value="THC">THC</option>
                <option value="THC/CBD">THC/CBD (1:1)</option>
                <option value="CBG">CBG</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900">
                {selectedIds.length} {selectedIds.length === 1 ? 'extração selecionada' : 'extrações selecionadas'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {viewMode !== 'USADAS' && (
                <button
                  onClick={() => handleBulkMarkUsed(true)}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>Marcar como Usadas</span>
                </button>
              )}

              {viewMode === 'USADAS' && (
                <button
                  onClick={() => handleBulkMarkUsed(false)}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3 h-3 text-cyan-600" />
                  <span>Reativar Selecionadas</span>
                </button>
              )}

              {viewMode !== 'ARQUIVADAS' ? (
                <button
                  onClick={() => handleBulkArchive(true)}
                  className="px-2.5 py-1 text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Archive className="w-3 h-3" />
                  <span>Arquivar Extrações</span>
                </button>
              ) : (
                <button
                  onClick={() => handleBulkArchive(false)}
                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <ArchiveRestore className="w-3 h-3" />
                  <span>Desarquivar Extrações</span>
                </button>
              )}

              <button
                onClick={() => setSelectedIds([])}
                className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-800"
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
                    title="Selecionar Todos"
                  >
                    {filteredList.length > 0 && selectedIds.length === filteredList.length ? (
                      <CheckSquare className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">Lote</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Data / Hora</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Molécula</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Genética / Cultivar</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Matéria-Prima</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Massa Seca</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Bag / Temp / PSI</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Rendimento Rosin</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Rend. (%)</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Consistência</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-500 bg-slate-50/50">
                    <Flame className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-700">Nenhuma extração de Rosin encontrada</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {searchTerm || moleculeFilter !== 'TODAS'
                        ? 'Tente ajustar seus filtros de busca.'
                        : 'Clique em "Nova Prensagem" para registrar seu primeiro lote de Rosin.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isUsed = isRecordUsed(item);
                  const isArchived = isRecordArchived(item);
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isUsed ? 'bg-slate-100/60 opacity-70' : 'bg-white'
                      } ${isSelected ? 'bg-amber-50/40 ring-1 ring-amber-500/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleSelect(item.id)}
                          className="cursor-pointer text-slate-400 hover:text-slate-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-amber-600" />
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

                      {/* Data / Hora */}
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {item.dataHora || '-'}
                      </td>

                      {/* Molécula */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.molecula === 'CBD'
                              ? 'bg-blue-100 text-blue-800'
                              : item.molecula === 'THC'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.molecula === 'THC/CBD'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.molecula}
                        </span>
                      </td>

                      {/* Genética / Cultivar + Rating Bridge */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800">{item.genetica}</span>
                          <button
                            onClick={() =>
                              setRatingModalData({
                                isOpen: true,
                                recordId: item.id,
                                cultivarName: item.genetica,
                                initialRating: item.geneticRating,
                              })
                            }
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              item.geneticRating?.overallScore
                                ? 'text-amber-500 hover:bg-amber-50'
                                : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
                            }`}
                            title={
                              item.geneticRating?.overallScore
                                ? `Score Genético: ${item.geneticRating.overallScore}/5 ⭐`
                                : 'Avaliar Genética & Rastreabilidade'
                            }
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                item.geneticRating?.overallScore ? 'fill-amber-400' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Matéria-Prima */}
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        {item.tipoMateriaPrima || '-'}
                      </td>

                      {/* Massa Seca */}
                      <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap font-medium">
                        {item.materiaSecaGramas || '-'}
                      </td>

                      {/* Bag / Temp / PSI */}
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        <span className="font-mono text-[11px]">
                          {item.micragemBag || '90u'} | {item.temperaturaPrensa || '85°C'} | {item.pressaoPsi || '1200 PSI'}
                        </span>
                      </td>

                      {/* Rendimento Rosin */}
                      <td className="py-2.5 px-3 font-bold text-amber-800 font-mono whitespace-nowrap">
                        {item.rendimentoRosinGramas || '-'}
                      </td>

                      {/* Rendimento (%) */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 font-bold rounded text-[11px]">
                          {item.rendimentoPorcentagem || '-'}
                        </span>
                      </td>

                      {/* Consistência */}
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-medium">
                          {item.consistencia || 'Badder'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleUsed(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            isUsed
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200'
                          }`}
                          title="Clique para alternar entre Disponível e Usada/Finalizada"
                        >
                          {isUsed ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-slate-500" />
                              <span>USADA</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>DISPONÍVEL</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleArchive(item.id)}
                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                            title={isArchived ? 'Desarquivar Lote' : 'Arquivar Lote'}
                          >
                            {isArchived ? (
                              <ArchiveRestore className="w-3.5 h-3.5 text-amber-600" />
                            ) : (
                              <Archive className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => setEditingRecord(item)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Editar Prensagem de Rosin"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Excluir Registro"
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
      </div>

      {/* Modal: Nova Prensagem */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                  <Flame className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Novo Registro de Extração Rosin</h3>
                  <p className="text-xs text-slate-500">Prensagem de flores ou hash solventless</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
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
                    type="number"
                    required
                    value={formData.lote || ''}
                    onChange={(e) => setFormData({ ...formData, lote: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-bold"
                    placeholder="Ex: 201"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Data e Hora
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dataHora || ''}
                    onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Molécula
                  </label>
                  <select
                    value={formData.molecula || 'THC'}
                    onChange={(e) => setFormData({ ...formData, molecula: e.target.value as MoleculeType })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="THC">THC</option>
                    <option value="CBD">CBD</option>
                    <option value="THC/CBD">THC/CBD (1:1)</option>
                    <option value="CBG">CBG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Genética / Cultivar
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genetica || ''}
                    onChange={(e) => setFormData({ ...formData, genetica: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Ex: GORILLA GLUE #4"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tipo de Matéria-Prima
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tipoMateriaPrima || ''}
                    onChange={(e) => setFormData({ ...formData, tipoMateriaPrima: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Flor Seca Curada / Bubble Hash"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Massa Seca (g)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.materiaSecaGramas || ''}
                    onChange={(e) => setFormData({ ...formData, materiaSecaGramas: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-mono"
                    placeholder="Ex: 20 g"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Micragem Bag
                  </label>
                  <input
                    type="text"
                    value={formData.micragemBag || ''}
                    onChange={(e) => setFormData({ ...formData, micragemBag: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Ex: 90u ou 37u"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Temp. Prensa (°C)
                  </label>
                  <input
                    type="text"
                    value={formData.temperaturaPrensa || ''}
                    onChange={(e) => setFormData({ ...formData, temperaturaPrensa: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-mono"
                    placeholder="Ex: 85°C"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Pressão PSI
                  </label>
                  <input
                    type="text"
                    value={formData.pressaoPsi || ''}
                    onChange={(e) => setFormData({ ...formData, pressaoPsi: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-mono"
                    placeholder="Ex: 1200 PSI"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Rendimento Rosin (g)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rendimentoRosinGramas || ''}
                    onChange={(e) => setFormData({ ...formData, rendimentoRosinGramas: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                    placeholder="Ex: 4.2 g"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Rendimento (%)
                  </label>
                  <input
                    type="text"
                    value={formData.rendimentoPorcentagem || ''}
                    onChange={(e) => setFormData({ ...formData, rendimentoPorcentagem: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                    placeholder="Ex: 21.0%"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Consistência
                  </label>
                  <input
                    type="text"
                    value={formData.consistencia || ''}
                    onChange={(e) => setFormData({ ...formData, consistencia: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Ex: Cold Cure Badder / Fresh Press / Jam"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Status da Resina
                  </label>
                  <select
                    value={formData.statusResina || 'DISPONÍVEL'}
                    onChange={(e) => setFormData({ ...formData, statusResina: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="DISPONÍVEL">DISPONÍVEL</option>
                    <option value="USADA / FINALIZADA">USADA / FINALIZADA</option>
                    <option value="CURANDO">EM CURA (COLD CURE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Observações
                </label>
                <textarea
                  rows={2}
                  value={formData.observacoes || ''}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  placeholder="Perfil de terpenos, cura em geladeira, detalhes da prensagem..."
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
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Prensagem</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Prensagem */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Edit2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Editar Extração Rosin</h3>
                  <p className="text-xs text-slate-500">Lote {editingRecord.lote} - {editingRecord.genetica}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
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
                    type="number"
                    required
                    value={editingRecord.lote || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, lote: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Data e Hora
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.dataHora || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, dataHora: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Molécula
                  </label>
                  <select
                    value={editingRecord.molecula || 'THC'}
                    onChange={(e) => setEditingRecord({ ...editingRecord, molecula: e.target.value as MoleculeType })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="THC">THC</option>
                    <option value="CBD">CBD</option>
                    <option value="THC/CBD">THC/CBD (1:1)</option>
                    <option value="CBG">CBG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Genética / Cultivar
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.genetica || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, genetica: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tipo de Matéria-Prima
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.tipoMateriaPrima || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, tipoMateriaPrima: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Massa Seca (g)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.materiaSecaGramas || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, materiaSecaGramas: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Rendimento Rosin (g)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.rendimentoRosinGramas || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, rendimentoRosinGramas: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Rendimento (%)
                  </label>
                  <input
                    type="text"
                    value={editingRecord.rendimentoPorcentagem || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, rendimentoPorcentagem: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Consistência
                  </label>
                  <input
                    type="text"
                    value={editingRecord.consistencia || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, consistencia: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Status da Resina
                  </label>
                  <select
                    value={editingRecord.statusResina || 'DISPONÍVEL'}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      const isUsed = newStatus.includes('FINALIZAD') || newStatus.includes('USADA');
                      setEditingRecord({
                        ...editingRecord,
                        statusResina: newStatus,
                        isUsed,
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="DISPONÍVEL">DISPONÍVEL</option>
                    <option value="USADA / FINALIZADA">USADA / FINALIZADA</option>
                    <option value="CURANDO">EM CURA (COLD CURE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Observações
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

      {/* Genetic Score Rating Modal */}
      {ratingModalData.isOpen && (
        <GeneticScoreModal
          isOpen={ratingModalData.isOpen}
          onClose={() => setRatingModalData({ isOpen: false, recordId: '', cultivarName: '' })}
          cultivarName={ratingModalData.cultivarName}
          initialRating={ratingModalData.initialRating}
          onSaveRating={(rating) => {
            rateGeneticRecord(
              'ROSIN',
              ratingModalData.recordId,
              ratingModalData.cultivarName,
              rating
            );
            setRatingModalData({ isOpen: false, recordId: '', cultivarName: '' });
          }}
        />
      )}
    </div>
  );
};
