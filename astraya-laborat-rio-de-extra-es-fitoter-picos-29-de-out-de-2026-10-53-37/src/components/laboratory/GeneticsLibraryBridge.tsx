import React, { useState } from 'react';
import {
  Star,
  Search,
  Filter,
  Plus,
  FileDown,
  X,
  Save,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CultivarGenetics, MoleculeType } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';

export const GeneticsLibraryBridge: React.FC = () => {
  const { geneticsLibrary, setGeneticsLibrary } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [moleculeFilter, setMoleculeFilter] = useState<string>('TODAS');
  const [selectedCultivar, setSelectedCultivar] = useState<CultivarGenetics | null>(null);
  const [isNewCultivarModalOpen, setIsNewCultivarModalOpen] = useState(false);

  const [newCultivarData, setNewCultivarData] = useState<Partial<CultivarGenetics>>({
    name: '',
    breeder: 'ASTRAYA Bank',
    type: 'HYBRID',
    primaryMolecule: 'CBD',
    averageScore: 4.5,
    averageYieldPercent: 15.0,
    terpeneProfile: ['Mirceno', 'Limoneno'],
    notes: 'Cultivar selecionado para extração e formulação farmacêutica.',
  });

  const filteredList = geneticsLibrary.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.breeder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.terpeneProfile.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMolecule = moleculeFilter === 'TODAS' || item.primaryMolecule === moleculeFilter;
    return matchesSearch && matchesMolecule;
  });

  const handleExportPdf = () => {
    const headers = ['Genética / Cultivar', 'Breeder / Origem', 'Molécula', 'Tipo', 'Nota Média', 'Rendimento Médio', 'Histórico Lotes', 'Perfil Terpênico'];
    const rows = filteredList.map((c) => [
      c.name,
      c.breeder,
      c.primaryMolecule,
      c.type,
      `${c.averageScore.toFixed(1)} ★`,
      `${c.averageYieldPercent}%`,
      `${c.extractionHistoryCount} lotes`,
      c.terpeneProfile.join(', '),
    ]);

    exportToPdf({
      title: 'Biblioteca de Genéticas de Cannabis & Índices de Extração',
      subtitle: 'Sincronização de cultivares, notas fitoquímicas e rendimentos médios - ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_Biblioteca_Genetica_${Date.now()}`,
    });
  };

  const handleExportXls = () => {
    const headers = ['Nome Cultivar', 'Breeder', 'Molécula Primária', 'Tipo Genético', 'Nota Média Extração (1-5)', 'Rendimento Médio (%)', 'Lotes Extraídos', 'Terpenos'];
    const rows = filteredList.map((c) => [
      c.name,
      c.breeder,
      c.primaryMolecule,
      c.type,
      c.averageScore,
      c.averageYieldPercent,
      c.extractionHistoryCount,
      c.terpeneProfile.join(', '),
    ]);

    exportToXls({
      title: 'BIBLIOTECA DE GENETICAS',
      headers,
      rows,
      fileName: `ASTRAYA_Genetica_${Date.now()}`,
    });
  };

  const handleSaveCultivar = (e: React.FormEvent) => {
    e.preventDefault();
    const terpenes = typeof newCultivarData.terpeneProfile === 'string'
      ? (newCultivarData.terpeneProfile as string).split(',').map((t) => t.trim())
      : newCultivarData.terpeneProfile || ['Mirceno'];

    const newGen: CultivarGenetics = {
      id: `gen-${Date.now()}`,
      name: newCultivarData.name || 'Nova Genética',
      breeder: newCultivarData.breeder || 'ASTRAYA Bank',
      type: (newCultivarData.type as any) || 'HYBRID',
      primaryMolecule: (newCultivarData.primaryMolecule as MoleculeType) || 'CBD',
      averageScore: Number(newCultivarData.averageScore) || 4.0,
      averageYieldPercent: Number(newCultivarData.averageYieldPercent) || 12.0,
      terpeneProfile: terpenes,
      extractionHistoryCount: 1,
      notes: newCultivarData.notes,
    };

    setGeneticsLibrary((prev) => [newGen, ...prev]);
    setIsNewCultivarModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif italic text-slate-800 font-normal">
                Biblioteca de Genéticas de Cannabis
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Interligação de Rendimento
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Hub de dados fitoquímicos onde cada cultivar acumula as avaliações e rendimentos de todos os métodos de extração ASTRAYA
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              onClick={() => {
                setNewCultivarData({
                  name: '',
                  breeder: 'ASTRAYA Bank',
                  type: 'HYBRID',
                  primaryMolecule: 'CBD',
                  averageScore: 4.5,
                  averageYieldPercent: 15.0,
                  terpeneProfile: ['Mirceno', 'Limoneno'],
                  notes: 'Cultivar selecionado para extração e formulação farmacêutica.',
                });
                setIsNewCultivarModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Cultivar</span>
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por cultivar, breeder ou perfil terpênico..."
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
              <option value="THC/CBD">THC/CBD</option>
              <option value="CBG">CBG</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cultivars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredList.map((cultivar) => (
          <div
            key={cultivar.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 shadow-xs space-y-3 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {cultivar.primaryMolecule} • {cultivar.type}
                </span>

                <div className="flex items-center gap-1 text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-xs font-bold font-mono">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{cultivar.averageScore.toFixed(1)}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-0.5">{cultivar.name}</h3>
              <p className="text-xs text-slate-500 italic">{cultivar.breeder}</p>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 mt-2.5 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Rendimento Médio</span>
                  <span className="text-sm font-bold text-emerald-700 font-mono">{cultivar.averageYieldPercent}%</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Lotes Extraídos</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">{cultivar.extractionHistoryCount} lotes</span>
                </div>
              </div>

              {/* Terpenes */}
              <div className="mt-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Terpenos:
                </span>
                <div className="flex flex-wrap gap-1">
                  {cultivar.terpeneProfile.map((terp, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-slate-50 text-[10px] text-slate-600 border border-slate-200"
                    >
                      {terp}
                    </span>
                  ))}
                </div>
              </div>

              {cultivar.notes && (
                <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                  {cultivar.notes}
                </p>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-100">
              <button
                onClick={() => setSelectedCultivar(cultivar)}
                className="w-full flex items-center justify-center gap-1 py-1.5 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                <span>Ficha Fitoquímica</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCultivar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedCultivar.name}</h3>
                <p className="text-xs text-slate-500">{selectedCultivar.breeder} • {selectedCultivar.type}</p>
              </div>
              <button
                onClick={() => setSelectedCultivar(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Nota Geral</span>
                  <span className="text-base font-bold text-amber-800 font-mono">{selectedCultivar.averageScore.toFixed(1)} ★</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Rendimento Médio</span>
                  <span className="text-base font-bold text-emerald-700 font-mono">{selectedCultivar.averageYieldPercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Lotes Extraídos</span>
                  <span className="text-base font-bold text-slate-800 font-mono">{selectedCultivar.extractionHistoryCount}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-500 block mb-1">Perfil Terpênico & Quimiotipo:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedCultivar.terpeneProfile.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-500 block mb-1">Anotações Farmacotécnicas ASTRAYA:</span>
                <p className="text-slate-800 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {selectedCultivar.notes || 'Sem observações adicionais.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCultivar(null)}
                  className="px-3.5 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-600 uppercase hover:bg-slate-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Cultivar Modal */}
      {isNewCultivarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Cadastrar Nova Genética na Biblioteca</h3>
              <button onClick={() => setIsNewCultivarModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCultivar} className="p-6 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">NOME DO CULTIVAR / GENÉTICA</label>
                <input
                  type="text"
                  required
                  value={newCultivarData.name || ''}
                  onChange={(e) => setNewCultivarData({ ...newCultivarData, name: e.target.value })}
                  placeholder="Ex: TANGIE DREAM"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">BREEDER / BANCO</label>
                  <input
                    type="text"
                    required
                    value={newCultivarData.breeder || ''}
                    onChange={(e) => setNewCultivarData({ ...newCultivarData, breeder: e.target.value })}
                    placeholder="Ex: ASTRAYA Bank"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">MOLÉCULA PRIMÁRIA</label>
                  <select
                    value={newCultivarData.primaryMolecule || 'CBD'}
                    onChange={(e) => setNewCultivarData({ ...newCultivarData, primaryMolecule: e.target.value as MoleculeType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="CBD">CBD</option>
                    <option value="THC">THC</option>
                    <option value="THC/CBD">THC/CBD</option>
                    <option value="CBG">CBG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">TIPO GENÉTICO</label>
                  <select
                    value={newCultivarData.type || 'HYBRID'}
                    onChange={(e) => setNewCultivarData({ ...newCultivarData, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="HYBRID">Híbrida</option>
                    <option value="INDICA">Indica Dominante</option>
                    <option value="SATIVA">Sativa Dominante</option>
                    <option value="RUDERALIS">Ruderalis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">RENDIMENTO MÉDIO (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCultivarData.averageYieldPercent || 15}
                    onChange={(e) => setNewCultivarData({ ...newCultivarData, averageYieldPercent: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">PERFIL TERPÊNICO (SEPARADOS POR VÍRGULA)</label>
                <input
                  type="text"
                  value={Array.isArray(newCultivarData.terpeneProfile) ? newCultivarData.terpeneProfile.join(', ') : (newCultivarData.terpeneProfile || '')}
                  onChange={(e) => setNewCultivarData({ ...newCultivarData, terpeneProfile: e.target.value.split(',').map((t) => t.trim()) })}
                  placeholder="Mirceno, Limoneno, Cariofileno, Linalol..."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">ANOTAÇÕES FARMACÊUTICAS</label>
                <textarea
                  value={newCultivarData.notes || ''}
                  onChange={(e) => setNewCultivarData({ ...newCultivarData, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewCultivarModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-600 uppercase hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Cultivar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
