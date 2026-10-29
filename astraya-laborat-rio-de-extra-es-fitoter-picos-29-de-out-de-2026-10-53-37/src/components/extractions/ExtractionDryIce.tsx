import React, { useState } from 'react';
import {
  Wind,
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
import { ExtractionDryIceRecord, MoleculeType } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';
import { GeneticScoreModal } from './GeneticScoreModal';

export const ExtractionDryIce: React.FC = () => {
  const { dryIceList, setDryIceList, rateGeneticRecord, setActiveSession, setActiveTCheckTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [moleculeFilter, setMoleculeFilter] = useState<string>('TODAS');
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
  const [editingRecord, setEditingRecord] = useState<ExtractionDryIceRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ExtractionDryIceRecord>>({
    dataHora: new Date().toLocaleString('pt-BR').slice(0, 16),
    molecula: 'THC',
    genetica: 'VÁRIOS',
    geneticasMultiplasTexto: 'THA MELON (50%) + CREAM MELON (50%)',
    materiaSecaGramas: '250 g',
    geloSecoKg: '3.0 kg',
    telaMicragem: '120u',
    tempAmbiente: '18°C',
    umidadeAmbiente: '40%',
    rendimentoResinaGramas: '38 g',
    rendimentoPorcentagem: '15.2%',
    statusResina: 'DISPONÍVEL = 20 g',
    observacoes: '',
  });

  // Filtered List
  const filteredList = dryIceList.filter((item) => {
    const matchesSearch =
      item.genetica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.geneticasMultiplasTexto && item.geneticasMultiplasTexto.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.observacoes && item.observacoes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.statusResina.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMolecule = moleculeFilter === 'TODAS' || item.molecula === moleculeFilter;
    return matchesSearch && matchesMolecule;
  });

  // Export PDF
  const handleExportPdf = () => {
    const headers = [
      'Data e Hora',
      'Molécula',
      'Genética / Cultivares',
      'Matéria Seca (g)',
      'Gelo Seco (kg)',
      'Tela Micragem',
      'Temp. Ambiente',
      'Umidade Amb.',
      'Rendimento Resina (g)',
      'Rendimento %',
      'Status Resina',
      'Avaliação Genética (Biblioteca)',
    ];

    const rows = filteredList.map((item) => [
      item.dataHora,
      item.molecula,
      item.genetica === 'VÁRIOS' ? `VÁRIOS: ${item.geneticasMultiplasTexto || ''}` : item.genetica,
      item.materiaSecaGramas,
      item.geloSecoKg,
      item.telaMicragem,
      item.tempAmbiente,
      item.umidadeAmbiente,
      item.rendimentoResinaGramas,
      item.rendimentoPorcentagem,
      item.statusResina,
      item.geneticRating ? `${item.geneticRating.score}★ (${item.geneticRating.yieldCategory})` : 'Pendente',
    ]);

    exportToPdf({
      title: 'Controle de Extração: Dry Ice (Kief a Seco com Gelo Seco)',
      subtitle: 'Separação mecânica de tricomas por sublimação e malha - ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_Extracao_Dry_Ice_${Date.now()}`,
      orientation: 'landscape',
    });
  };

  // Export XLS
  const handleExportXls = () => {
    const headers = [
      'Data e Hora',
      'Molécula',
      'Genética',
      'Detalhamento Várias Cultivares',
      'Matéria Seca (g)',
      'Gelo Seco (kg)',
      'Tela Micragem',
      'Temp. Ambiente',
      'Umidade Ambiente',
      'Rendimento Resina (g)',
      'Rendimento %',
      'Status Resina',
      'Observações',
      'Classificação Genética (Biblioteca)',
    ];

    const rows = filteredList.map((item) => [
      item.dataHora,
      item.molecula,
      item.genetica,
      item.geneticasMultiplasTexto || '',
      item.materiaSecaGramas,
      item.geloSecoKg,
      item.telaMicragem,
      item.tempAmbiente,
      item.umidadeAmbiente,
      item.rendimentoResinaGramas,
      item.rendimentoPorcentagem,
      item.statusResina,
      item.observacoes || '',
      item.geneticRating ? `${item.geneticRating.score}/5 Estrelas (${item.geneticRating.yieldCategory})` : 'Não avaliada',
    ]);

    exportToXls({
      title: 'EXTRAÇÃO DRY ICE (GELO SECO)',
      headers,
      rows,
      fileName: `ASTRAYA_Dry_Ice_${Date.now()}`,
    });
  };

  const handleOpenAdd = () => {
    setFormData({
      dataHora: new Date().toLocaleString('pt-BR').slice(0, 16),
      molecula: 'THC',
      genetica: 'VÁRIOS',
      geneticasMultiplasTexto: '',
      materiaSecaGramas: '250 g',
      geloSecoKg: '3.0 kg',
      telaMicragem: '120u',
      tempAmbiente: '18°C',
      umidadeAmbiente: '40%',
      rendimentoResinaGramas: '35 g',
      rendimentoPorcentagem: '14.0%',
      statusResina: 'DISPONÍVEL',
      observacoes: '',
    });
    setEditingRecord(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (record: ExtractionDryIceRecord) => {
    setEditingRecord(record);
    setFormData({ ...record });
    setIsNewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja excluir este registro de Dry Ice?')) {
      setDryIceList((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      setDryIceList((prev) =>
        prev.map((item) =>
          item.id === editingRecord.id
            ? ({
                ...item,
                ...formData,
              } as ExtractionDryIceRecord)
            : item
        )
      );
    } else {
      const newRecord: ExtractionDryIceRecord = {
        id: `dryice-${Date.now()}`,
        dataHora: formData.dataHora || new Date().toLocaleString('pt-BR'),
        molecula: (formData.molecula as MoleculeType) || 'THC',
        genetica: formData.genetica || 'VÁRIOS',
        geneticasMultiplasTexto: formData.geneticasMultiplasTexto,
        materiaSecaGramas: formData.materiaSecaGramas || '0g',
        geloSecoKg: formData.geloSecoKg || '0kg',
        telaMicragem: formData.telaMicragem || '120u',
        tempAmbiente: formData.tempAmbiente || '18°C',
        umidadeAmbiente: formData.umidadeAmbiente || '40%',
        rendimentoResinaGramas: formData.rendimentoResinaGramas || '0g',
        rendimentoPorcentagem: formData.rendimentoPorcentagem || '0%',
        statusResina: formData.statusResina || 'DISPONÍVEL',
        observacoes: formData.observacoes,
      };
      setDryIceList((prev) => [newRecord, ...prev]);
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
                Extração Dry Ice (Separação a Seco)
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {filteredList.length} lotes
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Rastreabilidade Lab ID: AST-2025-DRY-001 | Congelamento dos tricomas com CO₂ sólido & tamisagem
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

        {/* Filters Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por cultivar, micragem de tela ou status..."
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
              <option value="THC">THC</option>
              <option value="CBD">CBD</option>
              <option value="THC/CBD">THC/CBD</option>
              <option value="CBG">CBG</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Grid Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Data/Hora</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Molécula</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Genética</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Matéria</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Gelo Seco</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Tela (u)</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Temp (°C)</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Umidade</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Massa (g)</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Rend %</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Status</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-center">Pontuação Sync</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-8 text-slate-400 text-xs">
                    Nenhum registro Dry Ice encontrado.
                  </td>
                </tr>
              ) : (
                filteredList.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap text-[11px]">{row.dataHora}</td>
                    <td className="px-2.5 py-2.5">
                      <span className="inline-block px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                        {row.molecula}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {row.genetica === 'VÁRIOS' ? (
                        <div>
                          <span className="px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono font-bold text-[9px]">
                            VÁRIOS
                          </span>
                          <p className="text-xs text-slate-900 font-medium mt-0.5">
                            {row.geneticasMultiplasTexto || 'Cultivares combinadas'}
                          </p>
                        </div>
                      ) : (
                        <span className="font-semibold text-slate-900">{row.genetica}</span>
                      )}
                    </td>
                    <td className="px-2.5 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.materiaSecaGramas}</td>
                    <td className="px-2.5 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.geloSecoKg}</td>
                    <td className="px-2.5 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.telaMicragem}</td>
                    <td className="px-2.5 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.tempAmbiente}</td>
                    <td className="px-2.5 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.umidadeAmbiente}</td>
                    <td className="px-2.5 py-2.5 font-mono font-bold text-slate-900 whitespace-nowrap">{row.rendimentoResinaGramas}</td>
                    <td className="px-2.5 py-2.5 font-mono font-bold text-emerald-700 whitespace-nowrap">{row.rendimentoPorcentagem}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {row.statusResina}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {row.geneticRating ? (
                        <button
                          onClick={() =>
                            setRatingModalData({
                              isOpen: true,
                              recordId: row.id,
                              cultivarName: row.genetica === 'VÁRIOS' ? (row.geneticasMultiplasTexto || 'Cultivares Várias') : row.genetica,
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
                              cultivarName: row.genetica === 'VÁRIOS' ? (row.geneticasMultiplasTexto || 'Cultivares Várias') : row.genetica,
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

      {/* Summary Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
          <h3 className="text-[10px] font-bold uppercase text-emerald-700 mb-1">
            Resumo Separação Dry Ice
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-900 font-mono">15.2%</span>
            <span className="text-xs text-emerald-700 font-medium">Rendimento médio de tricomas puros (Kief)</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-bold uppercase text-blue-700 mb-1">
              Biblioteca de Genéticas Vinculada
            </h3>
            <span className="text-xs text-blue-900 font-medium">
              Consulte linhagens e estabilidade de tricomas
            </span>
          </div>
          <button
            onClick={() => {
              setActiveSession('LABORATORIO');
              setActiveTCheckTab('CALCULADORAS');
            }}
            className="text-xs underline text-blue-700 font-bold cursor-pointer hover:text-blue-900 uppercase tracking-wide"
          >
            Ver Genéticas
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      <GeneticScoreModal
        isOpen={ratingModalData.isOpen}
        onClose={() => setRatingModalData((prev) => ({ ...prev, isOpen: false }))}
        cultivarName={ratingModalData.cultivarName}
        extractionType="DRY_ICE"
        recordId={ratingModalData.recordId}
        initialRating={ratingModalData.initialRating}
        onSave={(rating) => rateGeneticRecord('DRY_ICE', ratingModalData.recordId, rating)}
      />

      {/* Form Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                    {editingRecord ? 'Editar Extração Dry Ice' : 'Novo Registro de Extração Dry Ice'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Parâmetros de gelo seco sólido e tamisagem de tricomas a frio
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">DIA E HORA</label>
                  <input
                    type="text"
                    required
                    value={formData.dataHora || ''}
                    onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">MOLÉCULA</label>
                  <select
                    value={formData.molecula || 'THC'}
                    onChange={(e) => setFormData({ ...formData, molecula: e.target.value as MoleculeType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="THC">THC</option>
                    <option value="CBD">CBD</option>
                    <option value="THC/CBD">THC/CBD</option>
                    <option value="CBG">CBG</option>
                  </select>
                </div>
              </div>

              {/* Genética Menu with VARIOS text input */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">GENÉTICA / CULTIVAR</label>
                  <select
                    value={formData.genetica || 'VÁRIOS'}
                    onChange={(e) => setFormData({ ...formData, genetica: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="VÁRIOS">VÁRIOS (Inserir detalhes de várias cultivares)</option>
                    <option value="THA MELON">THA MELON</option>
                    <option value="CREAM MELON">CREAM MELON</option>
                    <option value="Y GRIEGA 2.0">Y GRIEGA 2.0</option>
                    <option value="DEEP CANDY">DEEP CANDY</option>
                    <option value="STRAMBERRY CAKE">STRAMBERRY CAKE</option>
                    <option value="RENÉ">RENÉ</option>
                    <option value="EBOSHI">EBOSHI</option>
                    <option value="OUTRO">Outra Cultivar Única</option>
                  </select>
                </div>

                {formData.genetica === 'VÁRIOS' && (
                  <div className="pt-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Descreva as Cultivares Combinadas:
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.geneticasMultiplasTexto || ''}
                      onChange={(e) => setFormData({ ...formData, geneticasMultiplasTexto: e.target.value })}
                      placeholder="Ex: THA MELON (50%) + CREAM MELON (50%)"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">MATÉRIA SECA</label>
                  <input
                    type="text"
                    value={formData.materiaSecaGramas || ''}
                    onChange={(e) => setFormData({ ...formData, materiaSecaGramas: e.target.value })}
                    placeholder="Ex: 250 g"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">GELO SECO (KG)</label>
                  <input
                    type="text"
                    value={formData.geloSecoKg || ''}
                    onChange={(e) => setFormData({ ...formData, geloSecoKg: e.target.value })}
                    placeholder="Ex: 3.0 kg"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">TELA MICRAGEM</label>
                  <input
                    type="text"
                    value={formData.telaMicragem || ''}
                    onChange={(e) => setFormData({ ...formData, telaMicragem: e.target.value })}
                    placeholder="Ex: 120u"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">TEMP AMBIENTE</label>
                  <input
                    type="text"
                    value={formData.tempAmbiente || ''}
                    onChange={(e) => setFormData({ ...formData, tempAmbiente: e.target.value })}
                    placeholder="Ex: 18°C"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">UMIDADE</label>
                  <input
                    type="text"
                    value={formData.umidadeAmbiente || ''}
                    onChange={(e) => setFormData({ ...formData, umidadeAmbiente: e.target.value })}
                    placeholder="Ex: 40%"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">MASSA RESINA (g)</label>
                  <input
                    type="text"
                    value={formData.rendimentoResinaGramas || ''}
                    onChange={(e) => setFormData({ ...formData, rendimentoResinaGramas: e.target.value })}
                    placeholder="Ex: 38 g"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">RENDIMENTO %</label>
                  <input
                    type="text"
                    value={formData.rendimentoPorcentagem || ''}
                    onChange={(e) => setFormData({ ...formData, rendimentoPorcentagem: e.target.value })}
                    placeholder="Ex: 15.2%"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">STATUS RESINA</label>
                <input
                  type="text"
                  value={formData.statusResina || ''}
                  onChange={(e) => setFormData({ ...formData, statusResina: e.target.value })}
                  placeholder="Ex: DISPONÍVEL = 20 g"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">OBSERVAÇÕES DO PROCESSO</label>
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
                  <span>{editingRecord ? 'Salvar Alterações' : 'Cadastrar Registro Dry Ice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
