import React, { useState } from 'react';
import {
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TCheckRecord } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';
import { GeneticScoreModal } from '../extractions/GeneticScoreModal';

export const TCheckSession: React.FC = () => {
  const { tcheckList, setTcheckList, rateGeneticRecord } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [materiaFilter, setMateriaFilter] = useState<string>('TODAS');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TCheckRecord | null>(null);

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

  // Form State
  const [formData, setFormData] = useState<Partial<TCheckRecord>>({
    lote: 126,
    data: new Date().toLocaleDateString('pt-BR'),
    genetica: 'CANDY CARAMEL',
    materiaTestada: 'FLOR SECA / CURADA',
    cbdPorcentagem: 0.2,
    thcPorcentagem: 16.8,
    cbgPorcentagem: 0.8,
    potenciaTotalMgMl: 178.0,
    tipoDispositivo: 'T-Check 2 Spectrophotometer',
    calibracaoData: '2024-05-10 (Bandeja UV calibrada)',
    statusLaudo: 'APROVADO / LAUDO DISPONÍVEL',
    observacoes: 'Leitura rápida UV. Alta predominância de THC.',
  });

  const filteredList = tcheckList.filter((item) => {
    const matchesSearch =
      String(item.lote).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genetica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materiaTestada.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.observacoes && item.observacoes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.statusLaudo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMateria = materiaFilter === 'TODAS' || item.materiaTestada === materiaFilter;
    return matchesSearch && matchesMateria;
  });

  // Export PDF
  const handleExportPdf = () => {
    const headers = [
      'Lote',
      'Data',
      'Genética / Cultivar',
      'Matéria Testada',
      'CBD (%)',
      'THC (%)',
      'CBG (%)',
      'Potência (mg/mL)',
      'Status Laudo',
      'Avaliação Genética',
    ];

    const rows = filteredList.map((item) => [
      item.lote,
      item.data,
      item.genetica,
      item.materiaTestada,
      `${item.cbdPorcentagem}%`,
      `${item.thcPorcentagem}%`,
      `${item.cbgPorcentagem}%`,
      `${item.potenciaTotalMgMl} mg/mL`,
      item.statusLaudo,
      item.geneticRating ? `${item.geneticRating.score}★ (${item.geneticRating.yieldCategory})` : 'Pendente',
    ]);

    exportToPdf({
      title: 'Controle de Testes e Potência T-Check',
      subtitle: 'Espectrofotometria UV de canabinoides (CBD / THC / CBG) - Laboratório ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_TCheck_Potencia_${Date.now()}`,
      orientation: 'landscape',
    });
  };

  // Export XLS
  const handleExportXls = () => {
    const headers = [
      'Lote',
      'Data',
      'Genética',
      'Matéria Testada',
      'CBD Porcentagem (%)',
      'THC Porcentagem (%)',
      'CBG Porcentagem (%)',
      'Potência Total (mg/mL)',
      'Dispositivo Teste',
      'Calibração',
      'Status do Laudo',
      'Observações',
      'Avaliação Genética (Biblioteca)',
    ];

    const rows = filteredList.map((item) => [
      item.lote,
      item.data,
      item.genetica,
      item.materiaTestada,
      item.cbdPorcentagem,
      item.thcPorcentagem,
      item.cbgPorcentagem,
      item.potenciaTotalMgMl,
      item.tipoDispositivo,
      item.calibracaoData,
      item.statusLaudo,
      item.observacoes || '',
      item.geneticRating ? `${item.geneticRating.score}/5 Estrelas (${item.geneticRating.yieldCategory})` : 'Não avaliada',
    ]);

    exportToXls({
      title: 'T-CHECK LAUDOS E POTÊNCIA',
      headers,
      rows,
      fileName: `ASTRAYA_TCheck_Registros_${Date.now()}`,
    });
  };

  const handleOpenAdd = () => {
    const nextLote = tcheckList.length > 0
      ? Math.max(...tcheckList.map((i) => Number(i.lote) || 0)) + 1
      : 126;

    setFormData({
      lote: nextLote,
      data: new Date().toLocaleDateString('pt-BR'),
      genetica: 'CANDY CARAMEL',
      materiaTestada: 'FLOR SECA / CURADA',
      cbdPorcentagem: 0.2,
      thcPorcentagem: 16.8,
      cbgPorcentagem: 0.8,
      potenciaTotalMgMl: 178.0,
      tipoDispositivo: 'T-Check 2 Spectrophotometer',
      calibracaoData: '2024-05-10 (Bandeja UV calibrada)',
      statusLaudo: 'APROVADO / LAUDO DISPONÍVEL',
      observacoes: 'Leitura rápida UV.',
    });
    setEditingRecord(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (record: TCheckRecord) => {
    setEditingRecord(record);
    setFormData({ ...record });
    setIsNewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este laudo T-Check?')) {
      setTcheckList((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      setTcheckList((prev) =>
        prev.map((item) =>
          item.id === editingRecord.id
            ? ({
                ...item,
                ...formData,
              } as TCheckRecord)
            : item
        )
      );
    } else {
      const newRecord: TCheckRecord = {
        id: `tc-${formData.lote || Date.now()}`,
        lote: formData.lote || 'N/A',
        data: formData.data || new Date().toLocaleDateString('pt-BR'),
        genetica: formData.genetica || 'Cultivar ASTRAYA',
        materiaTestada: formData.materiaTestada || 'FLOR SECA',
        cbdPorcentagem: Number(formData.cbdPorcentagem) || 0,
        thcPorcentagem: Number(formData.thcPorcentagem) || 0,
        cbgPorcentagem: Number(formData.cbgPorcentagem) || 0,
        potenciaTotalMgMl: Number(formData.potenciaTotalMgMl) || 0,
        tipoDispositivo: formData.tipoDispositivo || 'T-Check 2',
        calibracaoData: formData.calibracaoData || 'Calibrado',
        statusLaudo: formData.statusLaudo || 'APROVADO / LAUDO DISPONÍVEL',
        observacoes: formData.observacoes,
      };
      setTcheckList((prev) => [newRecord, ...prev]);
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
                Registros e Laudos T-Check
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {filteredList.length} laudos analíticos
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Espectrofotometria UV rápida para quantificação de CBD, THC, CBG e potência total de matérias-primas e óleos
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
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Laudo T-Check</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por lote, cultivar, matéria testada ou laudo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={materiaFilter}
              onChange={(e) => setMateriaFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="TODAS">Todas as Matérias</option>
              <option value="FLOR SECA / CURADA">Flor Seca / Curada</option>
              <option value="TRIM / FOLHAS">Trim / Folhas</option>
              <option value="HASH / RESINA BRUTA">Hash / Resina Bruta</option>
              <option value="ÓLEO FORMULADO EM TCM">Óleo Formulado em TCM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Lote</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Data</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Genética / Cultivar</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Matéria Testada</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-center">CBD (%)</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-center">THC (%)</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-center">CBG (%)</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-center">Potência Total</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Status Laudo</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-center">Avaliação Genética</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-slate-400 text-xs">
                    Nenhum registro T-Check encontrado.
                  </td>
                </tr>
              ) : (
                filteredList.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-mono font-bold text-slate-900 text-[11px]">#{row.lote}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap text-[11px]">{row.data}</td>
                    <td className="px-3 py-2.5 font-semibold text-emerald-700">{row.genetica}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200">
                        {row.materiaTestada}
                      </span>
                    </td>
                    <td className="px-2.5 py-2.5 text-center font-mono font-bold text-teal-700">
                      {row.cbdPorcentagem}%
                    </td>
                    <td className="px-2.5 py-2.5 text-center font-mono font-bold text-amber-700">
                      {row.thcPorcentagem}%
                    </td>
                    <td className="px-2.5 py-2.5 text-center font-mono font-bold text-indigo-700">
                      {row.cbgPorcentagem}%
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-900 whitespace-nowrap">
                      {row.potenciaTotalMgMl} mg/mL
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {row.statusLaudo}
                      </span>
                    </td>
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
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{row.geneticRating.score}★</span>
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
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <Dna className="w-3 h-3 text-slate-500" />
                          <span>Classificar</span>
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(row)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rating Modal */}
      <GeneticScoreModal
        isOpen={ratingModalData.isOpen}
        onClose={() => setRatingModalData((prev) => ({ ...prev, isOpen: false }))}
        cultivarName={ratingModalData.cultivarName}
        extractionType="TCHECK"
        recordId={ratingModalData.recordId}
        initialRating={ratingModalData.initialRating}
        onSave={(rating) => rateGeneticRecord('TCHECK', ratingModalData.recordId, rating)}
      />

      {/* Form Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  {editingRecord ? `Editar Laudo T-Check - Lote #${editingRecord.lote}` : 'Novo Registro de Teste T-Check'}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  Espectrofotometria analítica e determinação de potência
                </p>
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
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LOTE</label>
                  <input
                    type="text"
                    required
                    value={formData.lote || ''}
                    onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">DATA</label>
                  <input
                    type="text"
                    required
                    value={formData.data || ''}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">GENÉTICA / CULTIVAR</label>
                  <input
                    type="text"
                    required
                    value={formData.genetica || ''}
                    onChange={(e) => setFormData({ ...formData, genetica: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">MATÉRIA TESTADA</label>
                  <select
                    value={formData.materiaTestada || 'FLOR SECA / CURADA'}
                    onChange={(e) => setFormData({ ...formData, materiaTestada: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="FLOR SECA / CURADA">FLOR SECA / CURADA</option>
                    <option value="TRIM / FOLHAS">TRIM / FOLHAS</option>
                    <option value="HASH / RESINA BRUTA">HASH / RESINA BRUTA</option>
                    <option value="ÓLEO FORMULADO EM TCM">ÓLEO FORMULADO EM TCM</option>
                    <option value="TINTURA ETÍLICA">TINTURA ETÍLICA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">STATUS DO LAUDO</label>
                  <select
                    value={formData.statusLaudo || 'APROVADO / LAUDO DISPONÍVEL'}
                    onChange={(e) => setFormData({ ...formData, statusLaudo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="APROVADO / LAUDO DISPONÍVEL">APROVADO / LAUDO DISPONÍVEL</option>
                    <option value="EM ANÁLISE / REPETIÇÃO">EM ANÁLISE / REPETIÇÃO</option>
                    <option value="REPROVADO POR DESVIO">REPROVADO POR DESVIO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">CBD (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cbdPorcentagem || 0}
                    onChange={(e) => setFormData({ ...formData, cbdPorcentagem: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">THC (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.thcPorcentagem || 0}
                    onChange={(e) => setFormData({ ...formData, thcPorcentagem: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">CBG (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cbgPorcentagem || 0}
                    onChange={(e) => setFormData({ ...formData, cbgPorcentagem: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">POTÊNCIA (mg/mL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.potenciaTotalMgMl || 0}
                    onChange={(e) => setFormData({ ...formData, potenciaTotalMgMl: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">EQUIPAMENTO UTILIZADO</label>
                  <input
                    type="text"
                    value={formData.tipoDispositivo || ''}
                    onChange={(e) => setFormData({ ...formData, tipoDispositivo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">CALIBRAÇÃO E BANDEJA</label>
                  <input
                    type="text"
                    value={formData.calibracaoData || ''}
                    onChange={(e) => setFormData({ ...formData, calibracaoData: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">OBSERVAÇÕES DO ENSAIO</label>
                <textarea
                  value={formData.observacoes || ''}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-600 uppercase hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingRecord ? 'Salvar Alterações' : 'Salvar Laudo T-Check'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
