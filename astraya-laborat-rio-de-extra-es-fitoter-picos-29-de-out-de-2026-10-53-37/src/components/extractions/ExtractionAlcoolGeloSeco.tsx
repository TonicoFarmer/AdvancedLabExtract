import React, { useState } from 'react';
import {
  Snowflake,
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExtractionAlcoolGeloSecoRecord, MoleculeType } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';
import { GeneticScoreModal } from './GeneticScoreModal';

type TabViewMode = 'ATIVAS' | 'USADAS' | 'TODAS';

export const ExtractionAlcoolGeloSeco: React.FC = () => {
  const {
    alcoolGeloSecoList,
    setAlcoolGeloSecoList,
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
  const [editingRecord, setEditingRecord] = useState<ExtractionAlcoolGeloSecoRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ExtractionAlcoolGeloSecoRecord>>({
    dataHora: new Date().toLocaleString('pt-BR').slice(0, 16),
    molecula: 'CBD',
    genetica: 'Y GRIEGA 2.0',
    materiaSecaGramas: '150 g',
    alcoolLitros: '10 L',
    geloSecoKg: '10 kg',
    duracaoAlcoolHoras: '14 horas',
    tinturaStatus: 'EVAPORADA',
    rendimentoResinaGramas: '15 g',
    rendimentoPorcentagem: '10.0%',
    diluicaoTCM: 'Diluição dividida em partes',
    quantidadeEnvases30ml: '15 frascos 30mL',
    lote: 141,
    statusResina: 'DISPONÍVEL',
    isUsed: false,
    isArchived: false,
    observacoes: '',
  });

  // Helper to test if a record is considered used/completed
  const isRecordUsed = (item: ExtractionAlcoolGeloSecoRecord) => {
    if (item.isUsed !== undefined) return item.isUsed;
    const status = (item.statusResina || '').toUpperCase();
    return status.includes('FINALIZADA') || status.includes('USADA') || status.includes('CONSUMIDA');
  };

  // Helper to test if a record is archived
  const isRecordArchived = (item: ExtractionAlcoolGeloSecoRecord) => {
    return !!item.isArchived;
  };

  // Counts for tab badges
  const totalCount = alcoolGeloSecoList.length;
  const activeCount = alcoolGeloSecoList.filter((i) => !isRecordUsed(i)).length;
  const usedCount = alcoolGeloSecoList.filter((i) => isRecordUsed(i)).length;

  // Filtered list based on viewMode, molecule, and search
  const filteredList = alcoolGeloSecoList.filter((item) => {
    const isUsed = isRecordUsed(item);

    // View Mode Filter
    if (viewMode === 'ATIVAS' && isUsed) return false;
    if (viewMode === 'USADAS' && !isUsed) return false;

    // Search filter
    const matchesSearch =
      String(item.lote).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genetica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.observacoes && item.observacoes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.statusResina && item.statusResina.toLowerCase().includes(searchTerm.toLowerCase()));

    // Molecule filter
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

  // Toggle used status for a single record
  const handleToggleUsed = (id: string) => {
    setAlcoolGeloSecoList((prev) =>
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

  // Bulk actions
  const handleBulkMarkUsed = (usedState: boolean) => {
    setAlcoolGeloSecoList((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            isUsed: usedState,
            statusResina: usedState ? 'USADA / FINALIZADA' : 'DISPONÍVEL',
            usedAt: usedState ? new Date().toLocaleDateString('pt-BR') : undefined,
          };
        }
        return item;
      })
    );
    setSelectedIds([]);
  };

  // Export to PDF
  const handleExportPdf = () => {
    const headers = [
      'Lote',
      'Data e Hora',
      'Molécula',
      'Genética',
      'Matéria (g)',
      'Álcool',
      'Gelo Seco',
      'Duração',
      'Tintura Status',
      'Rend. Resina (g)',
      'Rend %',
      'Diluição TCM',
      'Envases 30mL',
      'Status Resina',
      'Situação',
      'Avaliação Genética',
    ];

    const rows = filteredList.map((item) => [
      item.lote,
      item.dataHora,
      item.molecula,
      item.genetica,
      item.materiaSecaGramas,
      item.alcoolLitros,
      item.geloSecoKg,
      item.duracaoAlcoolHoras,
      item.tinturaStatus,
      item.rendimentoResinaGramas,
      item.rendimentoPorcentagem,
      item.diluicaoTCM,
      item.quantidadeEnvases30ml,
      item.statusResina,
      isRecordArchived(item)
        ? 'Arquivada'
        : isRecordUsed(item)
        ? 'Feita & Usada'
        : 'Ativa / Disponível',
      item.geneticRating
        ? `${item.geneticRating.score}★ - ${item.geneticRating.yieldCategory}`
        : 'Pendente',
    ]);

    exportToPdf({
      title: 'Controle de Extração: Álcool - Gelo Seco',
      subtitle: `Registros laboratoriais de extração com solvente a frio e gelo seco - ASTRAYA (${viewMode})`,
      headers,
      rows,
      fileName: `ASTRAYA_Extracao_Alcool_Gelo_Seco_${Date.now()}`,
      orientation: 'landscape',
    });
  };

  // Export to XLS
  const handleExportXls = () => {
    const headers = [
      'Lote',
      'Data e Hora',
      'Molécula',
      'Genética',
      'Matéria Seca (g)',
      'Álcool Utilizado',
      'Gelo Seco (kg)',
      'Duração no Álcool',
      'Status da Tintura',
      'Rend. Resina (g)',
      'Rendimento %',
      'Diluição em TCM',
      'Quantidade Envases 30ml',
      'Status da Resina',
      'Uso / Arquivo',
      'Observações',
      'Classificação Genética (Biblioteca)',
    ];

    const rows = filteredList.map((item) => [
      item.lote,
      item.dataHora,
      item.molecula,
      item.genetica,
      item.materiaSecaGramas,
      item.alcoolLitros,
      item.geloSecoKg,
      item.duracaoAlcoolHoras,
      item.tinturaStatus,
      item.rendimentoResinaGramas,
      item.rendimentoPorcentagem,
      item.diluicaoTCM,
      item.quantidadeEnvases30ml,
      item.statusResina,
      isRecordArchived(item)
        ? 'Arquivada'
        : isRecordUsed(item)
        ? 'Feita & Usada'
        : 'Ativa / Disponível',
      item.observacoes || '',
      item.geneticRating
        ? `${item.geneticRating.score}/5 Estrelas (${item.geneticRating.yieldCategory})`
        : 'Não avaliada',
    ]);

    exportToXls({
      title: 'EXTRAÇÃO ÁLCOOL - GELO SECO',
      headers,
      rows,
      fileName: `ASTRAYA_Alcool_Gelo_Seco_${Date.now()}`,
    });
  };

  const handleOpenAdd = () => {
    const nextLote =
      alcoolGeloSecoList.length > 0
        ? Math.max(
            ...alcoolGeloSecoList.map((i) =>
              typeof i.lote === 'number' ? i.lote : Number(i.lote) || 0
            )
          ) + 1
        : 141;

    setFormData({
      lote: nextLote,
      dataHora: new Date().toLocaleString('pt-BR').slice(0, 16),
      molecula: 'CBD',
      genetica: 'Y GRIEGA 2.0',
      materiaSecaGramas: '150 g',
      alcoolLitros: '10 L',
      geloSecoKg: '10 kg',
      duracaoAlcoolHoras: '14 horas',
      tinturaStatus: 'EVAPORADA',
      rendimentoResinaGramas: '15 g',
      rendimentoPorcentagem: '10.0%',
      diluicaoTCM: 'Em preparação',
      quantidadeEnvases30ml: '15 frascos 30mL',
      statusResina: 'DISPONÍVEL',
      isUsed: false,
      isArchived: false,
      observacoes: '',
    });
    setEditingRecord(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (record: ExtractionAlcoolGeloSecoRecord) => {
    setEditingRecord(record);
    setFormData({
      ...record,
      isUsed: isRecordUsed(record),
      isArchived: isRecordArchived(record),
    });
    setIsNewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente este registro de extração?')) {
      setAlcoolGeloSecoList((prev) => prev.filter((r) => r.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const used = !!formData.isUsed;
    const archived = !!formData.isArchived;

    if (editingRecord) {
      setAlcoolGeloSecoList((prev) =>
        prev.map((item) =>
          item.id === editingRecord.id
            ? ({
                ...item,
                ...formData,
                isUsed: used,
                isArchived: archived,
                statusResina:
                  formData.statusResina || (used ? 'USADA / FINALIZADA' : 'DISPONÍVEL'),
              } as ExtractionAlcoolGeloSecoRecord)
            : item
        )
      );
    } else {
      const newRecord: ExtractionAlcoolGeloSecoRecord = {
        id: `lote-${formData.lote || Date.now()}`,
        lote: formData.lote || 'N/A',
        dataHora: formData.dataHora || new Date().toLocaleString('pt-BR'),
        molecula: (formData.molecula as MoleculeType) || 'CBD',
        genetica: formData.genetica || 'Cultivar ASTRAYA',
        materiaSecaGramas: formData.materiaSecaGramas || '0g',
        alcoolLitros: formData.alcoolLitros || '0L',
        geloSecoKg: formData.geloSecoKg || '0kg',
        duracaoAlcoolHoras: formData.duracaoAlcoolHoras || '0h',
        tinturaStatus: formData.tinturaStatus || 'EVAPORADA',
        rendimentoResinaGramas: formData.rendimentoResinaGramas || '0g',
        rendimentoPorcentagem: formData.rendimentoPorcentagem || '0%',
        diluicaoTCM: formData.diluicaoTCM || 'N/A',
        quantidadeEnvases30ml: formData.quantidadeEnvases30ml || 'N/A',
        statusResina:
          formData.statusResina || (used ? 'USADA / FINALIZADA' : 'DISPONÍVEL'),
        isUsed: used,
        isArchived: archived,
        observacoes: formData.observacoes,
      };
      setAlcoolGeloSecoList((prev) => [newRecord, ...prev]);
    }
    setIsNewModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif italic text-slate-800 font-normal">
                Extração Álcool - Gelo Seco
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                {filteredList.length} registros exibidos
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">
              Rastreabilidade Lab ID: AST-2025-ALC-001 | Solvente etílico criogênico a frio & evaporação
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-white border border-slate-200 rounded-full px-3 py-1 text-[10px] font-bold text-emerald-600 shadow-2xs">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              Sincronizado com Biblioteca
            </div>

            <button
              onClick={handleExportPdf}
              className="px-3 py-1.5 border border-slate-200 rounded text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-700 uppercase flex items-center gap-1 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-500" />
              <span>Exportar PDF</span>
            </button>

            <button
              onClick={handleExportXls}
              className="px-3 py-1.5 border border-slate-200 rounded text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-700 uppercase flex items-center gap-1 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exportar XLS</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Registro</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs (Ativas / Usadas / Arquivadas / Todas) */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('ATIVAS')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'ATIVAS'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ativas / Disponíveis</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px]">
                {activeCount}
              </span>
            </button>

            <button
              onClick={() => setViewMode('USADAS')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'USADAS'
                  ? 'bg-white text-slate-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Feitas & Usadas</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px]">
                {usedCount}
              </span>
            </button>

            <button
              onClick={() => setViewMode('TODAS')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'TODAS'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Todas</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px]">
                {totalCount}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Legenda: Extrações usadas são exibidas com estilo opaco.
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por lote, cultivar genética, status ou observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={moleculeFilter}
              onChange={(e) => setMoleculeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="TODAS">Todas as Moléculas</option>
              <option value="CBD">CBD</option>
              <option value="THC">THC</option>
              <option value="THC/CBD">THC/CBD (1:1)</option>
              <option value="CBG">CBG</option>
              <option value="CBN">CBN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-medium">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>{selectedIds.length}</strong> extraç{selectedIds.length === 1 ? 'ão selecionada' : 'ões selecionadas'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkMarkUsed(true)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Marcar como Usadas</span>
            </button>

            <button
              onClick={() => handleBulkMarkUsed(false)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Marcar como Disponíveis</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white cursor-pointer ml-1"
            >
              Desmarcar
            </button>
          </div>
        </div>
      )}

      {/* Main Data Grid Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="w-8 px-3 py-2.5 text-center">
                  <button
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer flex items-center justify-center"
                    title="Selecionar todas"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredList.length ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Lote</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Data/Hora</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Molécula</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Genética</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Matéria (g)</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Álcool</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Gelo Seco</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Duração</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Status Tintura</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-700 bg-slate-100/80">
                  Rend. Resina (g)
                </th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Rend %</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Diluição TCM</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Frascos 30mL</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Status / Uso</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-center">Pontuação Sync</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={17} className="text-center py-12 text-slate-400 text-xs">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <AlertCircle className="w-5 h-5 text-slate-300" />
                      <span>Nenhum registro encontrado para os filtros selecionados.</span>
                      {viewMode === 'ARQUIVADAS' && (
                        <span className="text-[11px] text-slate-400">
                          Nenhuma extração arquivada no momento.
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((row) => {
                  const isUsed = isRecordUsed(row);
                  const isArchived = isRecordArchived(row);
                  const isSelected = selectedIds.includes(row.id);

                  return (
                    <tr
                      key={row.id}
                      className={`transition-all ${
                        isArchived
                          ? 'bg-amber-50/40 text-slate-600 hover:bg-amber-50/70'
                          : isUsed
                          ? 'opacity-65 bg-slate-100/70 text-slate-600 hover:opacity-95 hover:bg-slate-100'
                          : 'hover:bg-slate-50/90 text-slate-900'
                      } ${isSelected ? 'bg-emerald-50/60' : ''}`}
                    >
                      {/* Select Checkbox */}
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => handleToggleSelect(row.id)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer flex items-center justify-center"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>
                      </td>

                      {/* Lote */}
                      <td className="px-3 py-2.5 font-mono font-bold text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className={isUsed ? 'text-slate-500' : 'text-slate-900'}>
                            #{row.lote}
                          </span>
                          {isArchived && (
                            <span className="px-1 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                              ARQUIVADO
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Data/Hora */}
                      <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                        {row.dataHora || '-'}
                      </td>

                      {/* Molécula */}
                      <td className="px-2.5 py-2.5">
                        <span className="inline-block px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                          {row.molecula}
                        </span>
                      </td>

                      {/* Genética */}
                      <td className="px-3 py-2.5 font-semibold">
                        <span className={isUsed ? 'text-slate-700' : 'text-slate-900'}>
                          {row.genetica}
                        </span>
                      </td>

                      {/* Materia Seca */}
                      <td className="px-2.5 py-2.5 font-mono whitespace-nowrap text-slate-600">
                        {row.materiaSecaGramas || '-'}
                      </td>

                      {/* Alcool */}
                      <td className="px-2.5 py-2.5 font-mono whitespace-nowrap text-slate-600">
                        {row.alcoolLitros || '-'}
                      </td>

                      {/* Gelo Seco */}
                      <td className="px-2.5 py-2.5 font-mono whitespace-nowrap text-slate-600">
                        {row.geloSecoKg || '-'}
                      </td>

                      {/* Duracao */}
                      <td className="px-2.5 py-2.5 font-mono whitespace-nowrap text-slate-600">
                        {row.duracaoAlcoolHoras || '-'}
                      </td>

                      {/* Tintura Status */}
                      <td className="px-3 py-2.5">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {row.tinturaStatus}
                        </span>
                      </td>

                      {/* RENDIMENTO RESINA (G) */}
                      <td className="px-2.5 py-2.5 font-mono font-bold whitespace-nowrap bg-slate-50/50">
                        <span className={isUsed ? 'text-slate-700' : 'text-slate-900'}>
                          {row.rendimentoResinaGramas || '-'}
                        </span>
                      </td>

                      {/* Rend % */}
                      <td className="px-2.5 py-2.5 font-mono font-bold whitespace-nowrap">
                        <span className={isUsed ? 'text-slate-600' : 'text-emerald-700'}>
                          {row.rendimentoPorcentagem || '-'}
                        </span>
                      </td>

                      {/* Diluicao TCM */}
                      <td className="px-3 py-2.5 text-slate-600 max-w-[140px] truncate" title={row.diluicaoTCM}>
                        {row.diluicaoTCM || '-'}
                      </td>

                      {/* Envases 30ml */}
                      <td className="px-2.5 py-2.5 font-mono whitespace-nowrap text-slate-600">
                        {row.quantidadeEnvases30ml || '-'}
                      </td>

                      {/* Status / Uso Button */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleUsed(row.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            isUsed
                              ? 'bg-slate-200/80 text-slate-700 border-slate-300 hover:bg-slate-300'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title="Clique para alternar entre Feita/Usada e Disponível"
                        >
                          {isUsed ? (
                            <>
                              <PackageCheck className="w-3 h-3 text-slate-500" />
                              <span>FEITA & USADA</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>DISPONÍVEL</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Pontuação Sync */}
                      <td className="px-3 py-2.5 text-center">
                        {row.geneticRating ? (
                          <button
                            onClick={() =>
                              setRatingModalData({
                                isOpen: true,
                                recordId: row.id,
                                cultivarName: row.genetica,
                                initialRating: row.geneticRating,
                              })
                            }
                            className="inline-flex items-center gap-1 text-emerald-600 font-bold font-mono text-xs hover:underline cursor-pointer"
                          >
                            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                            <span>{row.geneticRating.score}★</span>
                            <span className="text-[10px] text-slate-500 font-normal hidden xl:inline">
                              ({row.geneticRating.yieldCategory.split(' ')[0]})
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setRatingModalData({
                                isOpen: true,
                                recordId: row.id,
                                cultivarName: row.genetica,
                              })
                            }
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-600 text-[11px] font-medium transition-colors cursor-pointer"
                            title="Classificar rendimento na Biblioteca"
                          >
                            <Dna className="w-3 h-3" />
                            <span>- - -</span>
                          </button>
                        )}
                      </td>

                      {/* Ações (Editar, Excluir) */}
                      <td className="px-3 py-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar dados da extração"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Excluir"
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

      {/* Summary Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
          <h3 className="text-[10px] font-bold uppercase text-emerald-700 mb-1">
            Resumo Extração Etílica a Frio
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-900 font-mono">10.0%</span>
            <span className="text-xs text-emerald-700 font-medium">
              Média de resina recuperada pós-evaporação ({activeCount} lotes disponíveis)
            </span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-bold uppercase text-blue-700 mb-1">
              Diluição & Envase de Frascos
            </h3>
            <span className="text-xs text-blue-900 font-medium">
              Vincular resina ao módulo de envase e cálculo em TCM
            </span>
          </div>
          <button
            onClick={() => {
              setActiveSession('EXTRACOES');
              setActiveTCheckTab('CALCULADORAS');
            }}
            className="text-xs underline text-blue-700 font-bold cursor-pointer hover:text-blue-900 uppercase tracking-wide"
          >
            Abrir Módulo
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      <GeneticScoreModal
        isOpen={ratingModalData.isOpen}
        onClose={() => setRatingModalData((prev) => ({ ...prev, isOpen: false }))}
        cultivarName={ratingModalData.cultivarName}
        extractionType="ALCOOL_GELO_SECO"
        recordId={ratingModalData.recordId}
        initialRating={ratingModalData.initialRating}
        onSave={(rating) =>
          rateGeneticRecord('ALCOOL_GELO_SECO', ratingModalData.recordId, rating)
        }
      />

      {/* Form Modal (Add / Edit) */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700">
                  <Snowflake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                    {editingRecord
                      ? `Editar Extração - Lote #${editingRecord.lote}`
                      : 'Novo Registro de Extração Álcool - Gelo Seco'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Solvente etílico a baixíssimas temperaturas (-78°C criogênico)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    LOTE (NÚMERO)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lote || ''}
                    onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    DIA E HORA
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dataHora || ''}
                    onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    MOLÉCULA
                  </label>
                  <select
                    value={formData.molecula || 'CBD'}
                    onChange={(e) =>
                      setFormData({ ...formData, molecula: e.target.value as MoleculeType })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="CBD">CBD</option>
                    <option value="THC">THC</option>
                    <option value="THC/CBD">THC/CBD</option>
                    <option value="CBG">CBG</option>
                    <option value="CBN">CBN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  GENÉTICA / CULTIVAR
                </label>
                <select
                  value={formData.genetica || 'Y GRIEGA 2.0'}
                  onChange={(e) => setFormData({ ...formData, genetica: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  <option value="Y GRIEGA 2.0">Y GRIEGA 2.0</option>
                  <option value="THA MELON">THA MELON</option>
                  <option value="DEEP CANDY">DEEP CANDY</option>
                  <option value="CREAM MELON">CREAM MELON</option>
                  <option value="STRAMBERRY CAKE">STRAMBERRY CAKE</option>
                  <option value="RENÉ">RENÉ</option>
                  <option value="EBOSHI">EBOSHI</option>
                  <option value="OUTRO">Outra Cultivar Única</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    MATÉRIA SECA (gramas)
                  </label>
                  <input
                    type="text"
                    value={formData.materiaSecaGramas || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, materiaSecaGramas: e.target.value })
                    }
                    placeholder="Ex: 150 g"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    ÁLCOOL UTILIZADO
                  </label>
                  <input
                    type="text"
                    value={formData.alcoolLitros || ''}
                    onChange={(e) => setFormData({ ...formData, alcoolLitros: e.target.value })}
                    placeholder="Ex: 10 L"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    GELO SECO (KG)
                  </label>
                  <input
                    type="text"
                    value={formData.geloSecoKg || ''}
                    onChange={(e) => setFormData({ ...formData, geloSecoKg: e.target.value })}
                    placeholder="Ex: 10 kg"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    DURAÇÃO NO ÁLCOOL
                  </label>
                  <input
                    type="text"
                    value={formData.duracaoAlcoolHoras || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, duracaoAlcoolHoras: e.target.value })
                    }
                    placeholder="Ex: 14 horas"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    TINTURA STATUS
                  </label>
                  <input
                    type="text"
                    value={formData.tinturaStatus || ''}
                    onChange={(e) => setFormData({ ...formData, tinturaStatus: e.target.value })}
                    placeholder="Ex: EVAPORADA"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    STATUS RESINA
                  </label>
                  <input
                    type="text"
                    value={formData.statusResina || ''}
                    onChange={(e) => setFormData({ ...formData, statusResina: e.target.value })}
                    placeholder="Ex: DISPONÍVEL ou USADA"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1 font-mono">
                    RENDIMENTO RESINA (g)
                  </label>
                  <input
                    type="text"
                    value={formData.rendimentoResinaGramas || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, rendimentoResinaGramas: e.target.value })
                    }
                    placeholder="Ex: 15 g"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    RENDIMENTO %
                  </label>
                  <input
                    type="text"
                    value={formData.rendimentoPorcentagem || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, rendimentoPorcentagem: e.target.value })
                    }
                    placeholder="Ex: 10.0%"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    DILUIÇÃO EM TCM
                  </label>
                  <input
                    type="text"
                    value={formData.diluicaoTCM || ''}
                    onChange={(e) => setFormData({ ...formData, diluicaoTCM: e.target.value })}
                    placeholder="Ex: Diluição dividida em partes"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    QUANTIDADE ENVASES 30ML
                  </label>
                  <input
                    type="text"
                    value={formData.quantidadeEnvases30ml || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, quantidadeEnvases30ml: e.target.value })
                    }
                    placeholder="Ex: 15 frascos 30mL"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Checkbox Controls for Used and Archived */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modal-is-used"
                    checked={!!formData.isUsed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isUsed: e.target.checked,
                        statusResina: e.target.checked
                          ? 'USADA / FINALIZADA'
                          : 'DISPONÍVEL',
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="modal-is-used" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Marcar como Extração Feita & Usada (Resina já consumida / manipulada)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modal-is-archived"
                    checked={!!formData.isArchived}
                    onChange={(e) =>
                      setFormData({ ...formData, isArchived: e.target.checked })
                    }
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="modal-is-archived" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Arquivar Lote (Guardar nas informações antigas de prontidão)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  OBSERVAÇÕES DO LOTE
                </label>
                <textarea
                  value={formData.observacoes || ''}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none placeholder-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 uppercase transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingRecord ? 'Salvar Alterações' : 'Cadastrar Lote'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
