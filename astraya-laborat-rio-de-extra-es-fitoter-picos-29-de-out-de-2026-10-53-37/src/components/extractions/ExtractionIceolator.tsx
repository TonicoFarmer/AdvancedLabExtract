import React, { useState } from 'react';
import {
  Waves,
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
  CheckSquare,
  Square,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExtractionIceolatorRecord, MoleculeType } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';
import { GeneticScoreModal } from './GeneticScoreModal';

const ALL_BAGS_MICRAGEM = [
  '220u',
  '190u',
  '160u',
  '150u',
  '120u',
  '107u',
  '102u',
  '90u',
  '70u',
  '45u',
  '40u',
  '37u',
  '25u',
];

export const ExtractionIceolator: React.FC = () => {
  const { iceolatorList, setIceolatorList, rateGeneticRecord, setActiveSession, setActiveTCheckTab } = useApp();

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
  const [editingRecord, setEditingRecord] = useState<ExtractionIceolatorRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ExtractionIceolatorRecord>>({
    dataHora: new Date().toLocaleString('pt-BR').slice(0, 16),
    molecula: 'THC/CBD',
    genetica: 'VÁRIOS',
    geneticasMultiplasTexto: 'Y GRIEGA 2.0 (50%) + DEEP CANDY (50%)',
    materiaSecaGramas: '350 g',
    quantidadeAguaLitros: '20 L',
    quantidadeGeloKg: '12 kg',
    bagsMicragem: ['220u', '160u', '120u', '70u', '45u', '25u'],
    tempAmbiente: '16°C',
    umidadeAmbiente: '45%',
    numeroCiclos: '3 ciclos',
    tempoAproxCiclo: '15 min por ciclo',
    rendimentoResinaGramas: '46 g',
    rendimentoPorcentagem: '13.14%',
    statusResina: 'DISPONÍVEL = 25 g',
    observacoes: '',
  });

  // Filtered List
  const filteredList = iceolatorList.filter((item) => {
    const matchesSearch =
      item.genetica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.geneticasMultiplasTexto && item.geneticasMultiplasTexto.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.observacoes && item.observacoes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.statusResina.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMolecule = moleculeFilter === 'TODAS' || item.molecula === moleculeFilter;
    return matchesSearch && matchesMolecule;
  });

  // Calculate average yield
  const avgYield =
    filteredList.length > 0
      ? (
          filteredList.reduce((acc, curr) => {
            const num = parseFloat(String(curr.rendimentoPorcentagem).replace('%', '').replace(',', '.')) || 0;
            return acc + num;
          }, 0) / filteredList.length
        ).toFixed(1)
      : '13.1';

  // Export PDF
  const handleExportPdf = () => {
    const headers = [
      'Data e Hora',
      'Molécula',
      'Genética / Cultivares',
      'Matéria (g)',
      'Água (L)',
      'Gelo (kg)',
      'Bags Micragem',
      'Ciclos',
      'Tempo Ciclo',
      'Temp. Amb.',
      'Umid. Amb.',
      'Rendimento (g)',
      'Rend %',
      'Status Resina',
      'Avaliação Genética',
    ];

    const rows = filteredList.map((item) => [
      item.dataHora,
      item.molecula,
      item.genetica === 'VÁRIOS' ? `VÁRIOS: ${item.geneticasMultiplasTexto || ''}` : item.genetica,
      item.materiaSecaGramas,
      item.quantidadeAguaLitros,
      item.quantidadeGeloKg,
      (item.bagsMicragem || []).join(', '),
      item.numeroCiclos,
      item.tempoAproxCiclo,
      item.tempAmbiente,
      item.umidadeAmbiente,
      item.rendimentoResinaGramas,
      item.rendimentoPorcentagem,
      item.statusResina,
      item.geneticRating ? `${item.geneticRating.score}★ (${item.geneticRating.yieldCategory})` : 'Pendente',
    ]);

    exportToPdf({
      title: 'Controle de Extração: Iceolator (Water Hash / Ice Hash)',
      subtitle: 'Extração mecânica com água gelada, gelo e malhas de micragem - ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_Extracao_Iceolator_${Date.now()}`,
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
      'Matéria Seca',
      'Quantidade Água (Litros)',
      'Quantidade Gelo (Kg)',
      'Bags Micragem Utilizadas',
      'Número de Ciclos',
      'Tempo Aproximado de Ciclo',
      'Temperatura Ambiente',
      'Umidade Ambiente',
      'Rendimento Resina (g)',
      'Rendimento Porcentagem',
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
      item.quantidadeAguaLitros,
      item.quantidadeGeloKg,
      (item.bagsMicragem || []).join(', '),
      item.numeroCiclos,
      item.tempoAproxCiclo,
      item.tempAmbiente,
      item.umidadeAmbiente,
      item.rendimentoResinaGramas,
      item.rendimentoPorcentagem,
      item.statusResina,
      item.observacoes || '',
      item.geneticRating ? `${item.geneticRating.score}/5 Estrelas (${item.geneticRating.yieldCategory})` : 'Não avaliada',
    ]);

    exportToXls({
      title: 'EXTRAÇÃO ICEOLATOR (ICE HASH)',
      headers,
      rows,
      fileName: `ASTRAYA_Iceolator_${Date.now()}`,
    });
  };

  const handleOpenAdd = () => {
    setFormData({
      dataHora: new Date().toLocaleString('pt-BR').slice(0, 16),
      molecula: 'CBD',
      genetica: 'VÁRIOS',
      geneticasMultiplasTexto: '',
      materiaSecaGramas: '300 gramas',
      quantidadeAguaLitros: '20 litros',
      quantidadeGeloKg: '10 kg',
      bagsMicragem: ['220u', '160u', '120u', '70u', '45u', '25u'],
      tempAmbiente: '17°C',
      umidadeAmbiente: '45%',
      numeroCiclos: '3 ciclos',
      tempoAproxCiclo: '15 min',
      rendimentoResinaGramas: '40 g',
      rendimentoPorcentagem: '13.3%',
      statusResina: 'DISPONÍVEL',
      observacoes: '',
    });
    setEditingRecord(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (record: ExtractionIceolatorRecord) => {
    setEditingRecord(record);
    setFormData({ ...record });
    setIsNewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja excluir este registro de Iceolator?')) {
      setIceolatorList((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const toggleBag = (bag: string) => {
    const current = formData.bagsMicragem || [];
    if (current.includes(bag)) {
      setFormData({ ...formData, bagsMicragem: current.filter((b) => b !== bag) });
    } else {
      setFormData({ ...formData, bagsMicragem: [...current, bag] });
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      setIceolatorList((prev) =>
        prev.map((item) =>
          item.id === editingRecord.id
            ? ({
                ...item,
                ...formData,
              } as ExtractionIceolatorRecord)
            : item
        )
      );
    } else {
      const newRecord: ExtractionIceolatorRecord = {
        id: `ice-${Date.now()}`,
        dataHora: formData.dataHora || new Date().toLocaleString('pt-BR'),
        molecula: (formData.molecula as MoleculeType) || 'THC/CBD',
        genetica: formData.genetica || 'VÁRIOS',
        geneticasMultiplasTexto: formData.geneticasMultiplasTexto,
        materiaSecaGramas: formData.materiaSecaGramas || '0g',
        quantidadeAguaLitros: formData.quantidadeAguaLitros || '0L',
        quantidadeGeloKg: formData.quantidadeGeloKg || '0kg',
        bagsMicragem: formData.bagsMicragem || ['220u', '120u', '70u', '25u'],
        tempAmbiente: formData.tempAmbiente || '18°C',
        umidadeAmbiente: formData.umidadeAmbiente || '50%',
        numeroCiclos: formData.numeroCiclos || '3 ciclos',
        tempoAproxCiclo: formData.tempoAproxCiclo || '15 min',
        rendimentoResinaGramas: formData.rendimentoResinaGramas || '0g',
        rendimentoPorcentagem: formData.rendimentoPorcentagem || '0%',
        statusResina: formData.statusResina || 'DISPONÍVEL',
        observacoes: formData.observacoes,
      };
      setIceolatorList((prev) => [newRecord, ...prev]);
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
                Registro Histórico de Extrações — Iceolator
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {filteredList.length} lotes
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Rastreabilidade Lab ID: AST-2025-ICE-001 | Separação hidrodinâmica água + gelo
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

        {/* Search and Filters */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por cultivar, bags, micragem ou status..."
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

      {/* Technical Data Grid Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Data/Hora</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Molécula</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Genética</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Matéria</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Água (L)</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Gelo (kg)</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase text-slate-500">Bags Utilizadas</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Ciclos</th>
                <th className="px-2.5 py-2.5 text-[10px] font-bold uppercase text-slate-500">Tempo</th>
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
                  <td colSpan={14} className="text-center py-8 text-slate-400 text-xs">
                    Nenhum registro Iceolator encontrado com os filtros aplicados.
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
                    <td className="px-2.5 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.quantidadeAguaLitros}</td>
                    <td className="px-2.5 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.quantidadeGeloKg}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {(row.bagsMicragem || []).map((bag) => (
                          <span
                            key={bag}
                            className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono border border-slate-200"
                          >
                            {bag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2.5 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.numeroCiclos}</td>
                    <td className="px-2.5 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.tempoAproxCiclo}</td>
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

      {/* Summary Metric Callouts from Theme Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
          <h3 className="text-[10px] font-bold uppercase text-emerald-700 mb-1">
            Resumo de Rendimento (Gelo Seco + Ice)
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-900 font-mono">{avgYield}%</span>
            <span className="text-xs text-emerald-700 font-medium">Eficiência média calculada no laboratório</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-bold uppercase text-blue-700 mb-1">
              Calculadora Rápida & Rastreabilidade T-Check
            </h3>
            <span className="text-xs text-blue-900 font-medium">
              Calcule diluições em TCM e potência mg/gota
            </span>
          </div>
          <button
            onClick={() => {
              setActiveSession('TCHECK_CALC');
              setActiveTCheckTab('CALCULADORAS');
            }}
            className="text-xs underline text-blue-700 font-bold cursor-pointer hover:text-blue-900 uppercase tracking-wide"
          >
            Abrir Calculadora
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      <GeneticScoreModal
        isOpen={ratingModalData.isOpen}
        onClose={() => setRatingModalData((prev) => ({ ...prev, isOpen: false }))}
        cultivarName={ratingModalData.cultivarName}
        extractionType="ICEOLATOR"
        recordId={ratingModalData.recordId}
        initialRating={ratingModalData.initialRating}
        onSave={(rating) => rateGeneticRecord('ICEOLATOR', ratingModalData.recordId, rating)}
      />

      {/* Form Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                    {editingRecord ? 'Editar Extração Iceolator' : 'Nova Extração Iceolator'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Parâmetros hidrodinâmicos de malha de micragem e ciclos de agitação
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
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Dia e Hora</label>
                  <input
                    type="text"
                    required
                    value={formData.dataHora || ''}
                    onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Molécula</label>
                  <select
                    value={formData.molecula || 'THC/CBD'}
                    onChange={(e) => setFormData({ ...formData, molecula: e.target.value as MoleculeType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="THC/CBD">THC/CBD</option>
                    <option value="THC">THC</option>
                    <option value="CBD">CBD</option>
                    <option value="CBG">CBG</option>
                    <option value="CBN">CBN</option>
                  </select>
                </div>
              </div>

              {/* Genética Menu with VARIOS text input */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Genética / Cultivar</label>
                  <select
                    value={formData.genetica || 'VÁRIOS'}
                    onChange={(e) => setFormData({ ...formData, genetica: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="VÁRIOS">VÁRIOS (Inserir detalhes de várias cultivares)</option>
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

                {formData.genetica === 'VÁRIOS' && (
                  <div className="pt-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Descreva os Cultivares Combinados:
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.geneticasMultiplasTexto || ''}
                      onChange={(e) => setFormData({ ...formData, geneticasMultiplasTexto: e.target.value })}
                      placeholder="Ex: Y GRIEGA 2.0 (50%) + DEEP CANDY (50%)"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Multiple selection BAGS MICRAGEM */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">
                  Bags / Micragem (Selecionar malhas utilizadas):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {ALL_BAGS_MICRAGEM.map((bag) => {
                    const isSelected = (formData.bagsMicragem || []).includes(bag);
                    return (
                      <button
                        type="button"
                        key={bag}
                        onClick={() => toggleBag(bag)}
                        className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded border text-[11px] font-mono transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-3 h-3 text-white" /> : <Square className="w-3 h-3 text-slate-400" />}
                        <span>{bag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Matéria Seca</label>
                  <input
                    type="text"
                    value={formData.materiaSecaGramas || ''}
                    onChange={(e) => setFormData({ ...formData, materiaSecaGramas: e.target.value })}
                    placeholder="Ex: 350 g"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Qtd. Água (L)</label>
                  <input
                    type="text"
                    value={formData.quantidadeAguaLitros || ''}
                    onChange={(e) => setFormData({ ...formData, quantidadeAguaLitros: e.target.value })}
                    placeholder="Ex: 20 L"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Qtd. Gelo (Kg)</label>
                  <input
                    type="text"
                    value={formData.quantidadeGeloKg || ''}
                    onChange={(e) => setFormData({ ...formData, quantidadeGeloKg: e.target.value })}
                    placeholder="Ex: 12 kg"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Ciclos</label>
                  <input
                    type="text"
                    value={formData.numeroCiclos || ''}
                    onChange={(e) => setFormData({ ...formData, numeroCiclos: e.target.value })}
                    placeholder="Ex: 3 ciclos"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tempo Ciclo</label>
                  <input
                    type="text"
                    value={formData.tempoAproxCiclo || ''}
                    onChange={(e) => setFormData({ ...formData, tempoAproxCiclo: e.target.value })}
                    placeholder="Ex: 15 min"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Temp. Ambiente</label>
                  <input
                    type="text"
                    value={formData.tempAmbiente || ''}
                    onChange={(e) => setFormData({ ...formData, tempAmbiente: e.target.value })}
                    placeholder="Ex: 16°C"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Umidade</label>
                  <input
                    type="text"
                    value={formData.umidadeAmbiente || ''}
                    onChange={(e) => setFormData({ ...formData, umidadeAmbiente: e.target.value })}
                    placeholder="Ex: 45%"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Massa Final (g)</label>
                  <input
                    type="text"
                    value={formData.rendimentoResinaGramas || ''}
                    onChange={(e) => setFormData({ ...formData, rendimentoResinaGramas: e.target.value })}
                    placeholder="Ex: 46 g"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Rendimento %</label>
                  <input
                    type="text"
                    value={formData.rendimentoPorcentagem || ''}
                    onChange={(e) => setFormData({ ...formData, rendimentoPorcentagem: e.target.value })}
                    placeholder="Ex: 13.14%"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Status Resina</label>
                  <input
                    type="text"
                    value={formData.statusResina || ''}
                    onChange={(e) => setFormData({ ...formData, statusResina: e.target.value })}
                    placeholder="Ex: DISPONÍVEL = 25 g"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Observações do Processo</label>
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
                  <span>{editingRecord ? 'Salvar Alterações' : 'Salvar e Sincronizar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
