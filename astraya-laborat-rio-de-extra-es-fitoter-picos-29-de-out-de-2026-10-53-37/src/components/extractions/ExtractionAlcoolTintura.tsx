import React, { useState, useMemo } from 'react';
import {
  Droplet,
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
  CheckCircle2,
  Clock,
  CheckSquare,
  Square,
  AlertCircle,
  PackageCheck,
  RotateCcw,
  FlaskConical,
  Beaker,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExtractionAlcoolTinturaRecord, MoleculeType } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';
import { GeneticScoreModal } from './GeneticScoreModal';
import { isBeforeMay2026, compareDatesDesc } from '../../utils/dateUtils';

type TabViewMode = 'ATIVAS' | 'USADAS' | 'TODAS';

export const ExtractionAlcoolTintura: React.FC = () => {
  const {
    alcoolTinturaList,
    setAlcoolTinturaList,
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
  const [editingRecord, setEditingRecord] = useState<ExtractionAlcoolTinturaRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ExtractionAlcoolTinturaRecord>>({
    dataHora: new Date().toLocaleString('pt-BR').slice(0, 16),
    molecula: 'CBD',
    genetica: 'CANNATONIC',
    materiaSecaGramas: '200 g',
    tipoAlcool: 'Álcool Etílico Neutro 96%',
    volumeAlcoolLitros: '4.0 L',
    duracaoMaceracao: '72 horas',
    temperaturaExtracao: '-20°C',
    tipoFiltracao: 'Funil de Buchner + Filtro Celite',
    tinturaArmazenadaLitros: '3.6 L',
    concentracaoEstimadaMgMl: '12.5 mg/mL',
    diluicaoTcmFrascos: 'Uso direto / Tintura concentrada',
    lote: 301,
    statusTintura: 'DISPONÍVEL',
    isUsed: false,
    isArchived: false,
    observacoes: '',
  });

  // Helper to test if a record is used/delivered (dates prior to May 2026 or marked completed)
  const isRecordUsed = (item: ExtractionAlcoolTinturaRecord) => {
    if (item.isUsed !== undefined) return item.isUsed;
    if (isBeforeMay2026(item.dataHora)) {
      return true;
    }
    const status = (item.statusTintura || '').toUpperCase();
    return status.includes('FINALIZADA') || status.includes('USADA') || status.includes('CONSUMIDA') || status.includes('ENTREGUE');
  };

  // Helper to test if a record is archived
  const isRecordArchived = (item: ExtractionAlcoolTinturaRecord) => {
    return !!item.isArchived;
  };

  // Tab counts (dividing records between Ativas and Entregues by May 2026 date rule)
  const totalCount = alcoolTinturaList.length;
  const activeCount = alcoolTinturaList.filter((i) => !isRecordUsed(i)).length;
  const usedCount = alcoolTinturaList.filter((i) => isRecordUsed(i)).length;

  // Filtered and Sorted list (ordered from newest to oldest date)
  const filteredList = useMemo(() => {
    const list = alcoolTinturaList.filter((item) => {
      const isUsed = isRecordUsed(item);

      if (viewMode === 'ATIVAS' && isUsed) return false;
      if (viewMode === 'USADAS' && !isUsed) return false;

      const matchesSearch =
        String(item.lote).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genetica.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tipoAlcool && item.tipoAlcool.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.tipoFiltracao && item.tipoFiltracao.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.observacoes && item.observacoes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.statusTintura && item.statusTintura.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesMolecule = moleculeFilter === 'TODAS' || item.molecula === moleculeFilter;

      return matchesSearch && matchesMolecule;
    });

    // Ordenar da data mais recente para a mais antiga
    return list.sort((a, b) => {
      const dateDiff = compareDatesDesc(a.dataHora, b.dataHora);
      if (dateDiff !== 0) return dateDiff;
      return String(b.lote).localeCompare(String(a.lote), undefined, { numeric: true });
    });
  }, [alcoolTinturaList, viewMode, searchTerm, moleculeFilter]);

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
    setAlcoolTinturaList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentUsed = isRecordUsed(item);
          const newUsed = !currentUsed;
          return {
            ...item,
            isUsed: newUsed,
            statusTintura: newUsed ? 'USADA / FINALIZADA' : 'DISPONÍVEL',
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
    setAlcoolTinturaList((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            isUsed: markAsUsed,
            statusTintura: markAsUsed ? 'USADA / FINALIZADA' : 'DISPONÍVEL',
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

    const newRecord: ExtractionAlcoolTinturaRecord = {
      id: `tintura-${Date.now()}`,
      lote: Number(formData.lote),
      dataHora: formData.dataHora || new Date().toLocaleString('pt-BR').slice(0, 16),
      molecula: (formData.molecula as MoleculeType) || 'CBD',
      genetica: formData.genetica || 'Genética Padrão',
      materiaSecaGramas: formData.materiaSecaGramas || '200 g',
      tipoAlcool: formData.tipoAlcool || 'Álcool Etílico Neutro 96%',
      volumeAlcoolLitros: formData.volumeAlcoolLitros || '4.0 L',
      duracaoMaceracao: formData.duracaoMaceracao || '72 horas',
      temperaturaExtracao: formData.temperaturaExtracao || '-20°C',
      tipoFiltracao: formData.tipoFiltracao || 'Funil de Buchner + Celite',
      tinturaArmazenadaLitros: formData.tinturaArmazenadaLitros || '3.6 L',
      concentracaoEstimadaMgMl: formData.concentracaoEstimadaMgMl || '12.5 mg/mL',
      diluicaoTcmFrascos: formData.diluicaoTcmFrascos || 'Tintura concentrada',
      statusTintura: formData.statusTintura || 'DISPONÍVEL',
      observacoes: formData.observacoes || '',
      isUsed: false,
      isArchived: false,
    };

    setAlcoolTinturaList([newRecord, ...alcoolTinturaList]);
    setIsNewModalOpen(false);
  };

  // Save edit record
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    setAlcoolTinturaList((prev) =>
      prev.map((item) => (item.id === editingRecord.id ? editingRecord : item))
    );
    setEditingRecord(null);
  };

  // Delete record
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente esta extração de Tintura?')) {
      setAlcoolTinturaList((prev) => prev.filter((item) => item.id !== id));
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
      'Massa (g)',
      'Álcool Utilizado',
      'Maceração',
      'Temperatura',
      'Filtração',
      'Tintura Obtida',
      'Concentração',
      'Status',
    ];

    const rows = filteredList.map((item) => [
      `Lote ${item.lote}`,
      item.dataHora || '-',
      item.molecula || '-',
      item.genetica || '-',
      item.materiaSecaGramas || '-',
      `${item.tipoAlcool || '-'} (${item.volumeAlcoolLitros || '-'})`,
      item.duracaoMaceracao || '-',
      item.temperaturaExtracao || '-',
      item.tipoFiltracao || '-',
      item.tinturaArmazenadaLitros || '-',
      item.concentracaoEstimadaMgMl || '-',
      item.statusTintura || '-',
    ]);

    exportToPdf({
      title: 'Controle de Extração Alcoólica para Tintura Medicinal',
      subtitle: 'Maceração e tintura fitofarmacêutica estocada em galão âmbar - ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_Extracao_Tintura_${Date.now()}`,
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
      'Massa Seca (g)',
      'Tipo de Álcool',
      'Volume Álcool (L)',
      'Duração Maceração',
      'Temperatura Extração',
      'Tipo de Filtração',
      'Tintura Armazenada (L)',
      'Concentração Estimada (mg/mL)',
      'Destino / Frascos',
      'Status Tintura',
      'Observações',
    ];

    const rows = filteredList.map((item) => [
      item.lote,
      item.dataHora,
      item.molecula,
      item.genetica,
      item.materiaSecaGramas,
      item.tipoAlcool,
      item.volumeAlcoolLitros,
      item.duracaoMaceracao,
      item.temperaturaExtracao,
      item.tipoFiltracao,
      item.tinturaArmazenadaLitros,
      item.concentracaoEstimadaMgMl,
      item.diluicaoTcmFrascos,
      item.statusTintura,
      item.observacoes || '',
    ]);

    exportToXls({
      title: 'Extracao_Tintura_ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_Extracao_Tintura_${Date.now()}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-100/80 text-teal-800 rounded-lg">
                <Droplet className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  Extração Álcool Tintura
                </h1>
                <p className="text-xs text-slate-500">
                  Maceração a frio de matéria vegetal em álcool etílico neutro farmacêutico para estoque de tinturas
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
              className="px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Calculadora de Diluição</span>
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
              className="px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Tintura</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
            <span className="text-[11px] font-medium text-slate-500 block">Total de Macerações</span>
            <span className="text-lg font-bold text-slate-900">{totalCount} lotes</span>
          </div>
          <div className="bg-teal-50/60 rounded-lg p-2.5 border border-teal-200/70">
            <span className="text-[11px] font-medium text-teal-800 block">Tinturas Prontas / Em Estoque</span>
            <span className="text-lg font-bold text-teal-900">{activeCount} lotes</span>
          </div>
          <div className="bg-cyan-50/60 rounded-lg p-2.5 border border-cyan-200/70">
            <span className="text-[11px] font-medium text-cyan-800 block">Armazenamento</span>
            <span className="text-xs font-bold text-cyan-900 mt-1 block">Galões Vidro Âmbar</span>
          </div>
          <div className="bg-slate-100/70 rounded-lg p-2.5 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-600 block">Entregues e Finalizadas</span>
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
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Ativas / Prontas</span>
              <span className="ml-1 px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-full text-[10px]">
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
                placeholder="Buscar lote, genética, filtração..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition-all"
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
          <div className="bg-teal-50/90 border border-teal-200 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-900">
                {selectedIds.length} {selectedIds.length === 1 ? 'tintura selecionada' : 'tinturas selecionadas'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {viewMode !== 'USADAS' && (
                <button
                  onClick={() => handleBulkMarkUsed(true)}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-teal-400" />
                  <span>Marcar como Entregues / Finalizadas</span>
                </button>
              )}

              {viewMode === 'USADAS' && (
                <button
                  onClick={() => handleBulkMarkUsed(false)}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-teal-300 text-teal-800 hover:bg-teal-50 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs font-bold"
                >
                  <RotateCcw className="w-3 h-3 text-teal-600" />
                  <span>Reativar Selecionadas</span>
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
                      <CheckSquare className="w-4 h-4 text-teal-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">Lote</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Data / Hora</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Molécula</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Genética / Cultivar</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Massa Seca</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Álcool & Volume</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Maceração & Temp.</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Filtração</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Tintura Obtida</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Concentração Estimada</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-500 bg-slate-50/50">
                    <Droplet className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-700">Nenhuma extração de tintura encontrada</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {searchTerm || moleculeFilter !== 'TODAS'
                        ? 'Tente ajustar seus filtros de busca.'
                        : 'Clique em "Nova Tintura" para cadastrar seu primeiro lote de tintura alcoólica.'}
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
                      } ${isSelected ? 'bg-teal-50/40 ring-1 ring-teal-500/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleSelect(item.id)}
                          className="cursor-pointer text-slate-400 hover:text-slate-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-teal-600" />
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

                      {/* Molécula / Matriz */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block w-fit ${
                              item.molecula === 'CBD'
                                ? 'bg-blue-100 text-blue-800'
                                : item.molecula === 'THC'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.molecula === 'THC/CBD'
                                ? 'bg-purple-100 text-purple-800'
                                : item.molecula === 'Fitoterápico'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.molecula === 'Fitoterápico' ? '🌿 Fitoterápico' : item.molecula}
                          </span>
                          {item.matrizTipo === 'FITOTERAPICO' && (
                            <span className="text-[9px] text-emerald-700 font-semibold">
                              Droga Vegetal Pura
                            </span>
                          )}
                          {item.matrizTipo === 'BLEND_SINERGIA' && (
                            <span className="text-[9px] text-purple-700 font-semibold">
                              Sinergia Integrativa
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Genética / Planta + Detalhes Botânicos + Rating Bridge */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{item.genetica}</span>
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
                          {item.nomeCientifico && (
                            <span className="text-[10px] italic text-slate-500">
                              {item.nomeCientifico}
                            </span>
                          )}
                          {item.indicacaoTerapeutica && (
                            <span className="text-[10px] text-teal-700 font-medium truncate max-w-[200px]" title={item.indicacaoTerapeutica}>
                              🩺 {item.indicacaoTerapeutica}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Massa Seca */}
                      <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap font-medium">
                        {item.materiaSecaGramas || '-'}
                      </td>

                      {/* Álcool & Volume */}
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.volumeAlcoolLitros || '-'}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={item.tipoAlcool}>
                            {item.tipoAlcool || '-'}
                          </span>
                        </div>
                      </td>

                      {/* Maceração & Temp */}
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap font-mono text-[11px]">
                        {item.duracaoMaceracao || '-'} ({item.temperaturaExtracao || '-20°C'})
                      </td>

                      {/* Filtração */}
                      <td className="py-2.5 px-3 text-slate-600 max-w-[140px] truncate" title={item.tipoFiltracao}>
                        {item.tipoFiltracao || '-'}
                      </td>

                      {/* Tintura Obtida */}
                      <td className="py-2.5 px-3 font-bold text-teal-800 font-mono whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-teal-50 border border-teal-200 rounded">
                          {item.tinturaArmazenadaLitros || '-'}
                        </span>
                      </td>

                      {/* Concentração Estimada */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono font-medium text-slate-800">
                        {item.concentracaoEstimadaMgMl || '-'}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleUsed(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            isUsed
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : 'bg-teal-100 text-teal-800 hover:bg-teal-200 border border-teal-200'
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
                              <Clock className="w-3 h-3 text-teal-600" />
                              <span>DISPONÍVEL</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingRecord(item)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Editar Extração Tintura"
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

      {/* Modal: Nova Tintura */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                  <Droplet className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Novo Registro de Tintura Alcoólica</h3>
                  <p className="text-xs text-slate-500">Maceração a frio em álcool etílico neutro farmacêutico</p>
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
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 font-bold"
                    placeholder="Ex: 301"
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
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Molécula
                  </label>
                  <select
                    value={formData.molecula || 'CBD'}
                    onChange={(e) => setFormData({ ...formData, molecula: e.target.value as MoleculeType })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="CBD">CBD</option>
                    <option value="THC">THC</option>
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
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                    placeholder="Ex: CANNATONIC"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Massa Seca (g)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.materiaSecaGramas || ''}
                    onChange={(e) => setFormData({ ...formData, materiaSecaGramas: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 font-mono"
                    placeholder="Ex: 200 g"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tipo de Álcool
                  </label>
                  <input
                    type="text"
                    value={formData.tipoAlcool || ''}
                    onChange={(e) => setFormData({ ...formData, tipoAlcool: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                    placeholder="Álcool de Cereais 96%"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Volume Álcool (L)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.volumeAlcoolLitros || ''}
                    onChange={(e) => setFormData({ ...formData, volumeAlcoolLitros: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 font-mono"
                    placeholder="Ex: 4.0 L"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Duração Maceração
                  </label>
                  <input
                    type="text"
                    value={formData.duracaoMaceracao || ''}
                    onChange={(e) => setFormData({ ...formData, duracaoMaceracao: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                    placeholder="Ex: 72 horas"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Temp. Extração
                  </label>
                  <input
                    type="text"
                    value={formData.temperaturaExtracao || ''}
                    onChange={(e) => setFormData({ ...formData, temperaturaExtracao: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 font-mono"
                    placeholder="Ex: -20°C"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tintura Obtida (L)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tinturaArmazenadaLitros || ''}
                    onChange={(e) => setFormData({ ...formData, tinturaArmazenadaLitros: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 font-mono font-bold"
                    placeholder="Ex: 3.6 L"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Concentração Estimada
                  </label>
                  <input
                    type="text"
                    value={formData.concentracaoEstimadaMgMl || ''}
                    onChange={(e) => setFormData({ ...formData, concentracaoEstimadaMgMl: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 font-mono"
                    placeholder="Ex: 12.5 mg/mL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tipo de Filtração
                  </label>
                  <input
                    type="text"
                    value={formData.tipoFiltracao || ''}
                    onChange={(e) => setFormData({ ...formData, tipoFiltracao: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                    placeholder="Ex: Funil de Buchner + Celite"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Status da Tintura
                  </label>
                  <select
                    value={formData.statusTintura || 'DISPONÍVEL'}
                    onChange={(e) => setFormData({ ...formData, statusTintura: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="DISPONÍVEL">DISPONÍVEL</option>
                    <option value="USADA / FINALIZADA">USADA / FINALIZADA</option>
                    <option value="EM MACERAÇÃO">EM MACERAÇÃO</option>
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
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                  placeholder="Armazenamento em freezer, galão âmbar, lote de origem..."
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
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Tintura</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Tintura */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Edit2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Editar Extração Tintura</h3>
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
                    value={editingRecord.molecula || 'CBD'}
                    onChange={(e) => setEditingRecord({ ...editingRecord, molecula: e.target.value as MoleculeType })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="CBD">CBD</option>
                    <option value="THC">THC</option>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Volume Álcool (L)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.volumeAlcoolLitros || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, volumeAlcoolLitros: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tintura Obtida (L)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecord.tinturaArmazenadaLitros || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, tinturaArmazenadaLitros: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Concentração Estimada
                  </label>
                  <input
                    type="text"
                    value={editingRecord.concentracaoEstimadaMgMl || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, concentracaoEstimadaMgMl: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tipo de Filtração
                  </label>
                  <input
                    type="text"
                    value={editingRecord.tipoFiltracao || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, tipoFiltracao: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Status da Tintura
                  </label>
                  <select
                    value={editingRecord.statusTintura || 'DISPONÍVEL'}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      const isUsed = newStatus.includes('FINALIZAD') || newStatus.includes('USADA');
                      setEditingRecord({
                        ...editingRecord,
                        statusTintura: newStatus,
                        isUsed,
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="DISPONÍVEL">DISPONÍVEL</option>
                    <option value="USADA / FINALIZADA">USADA / FINALIZADA</option>
                    <option value="EM MACERAÇÃO">EM MACERAÇÃO</option>
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
              'ALCOOL_TINTURA',
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
