import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  ExternalLink,
  CheckCircle2,
  FileDown,
  X,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LabCertificate } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';

export const LabCertificates: React.FC = () => {
  const { certificatesList, setCertificatesList } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<LabCertificate>>({
    code: 'COA-2024-004',
    title: 'Laudo de Análise Cromatográfica HPLC',
    type: 'POTENCIA_HPLC',
    issueDate: new Date().toLocaleDateString('pt-BR'),
    laboratory: 'PhytoLab Análises Químicas Ltda',
    cultivarOrLot: 'Lote 140 (Y GRIEGA 2.0)',
    status: 'APROVADO',
    pdfUrl: 'https://drive.google.com/',
    notes: 'Pureza cromatográfica de fitocanabinoides e ausência de contaminantes.',
  });

  const filteredList = certificatesList.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cultivarOrLot.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.laboratory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'TODOS' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleExportPdf = () => {
    const headers = ['Código COA', 'Título do Laudo', 'Tipo', 'Lote / Cultivar', 'Laboratório Emissor', 'Data', 'Status'];
    const rows = filteredList.map((i) => [
      i.code,
      i.title,
      i.type,
      i.cultivarOrLot,
      i.laboratory,
      i.issueDate,
      i.status,
    ]);

    exportToPdf({
      title: 'Certificados de Análise (COA) e Laudos de Controle de Qualidade',
      subtitle: 'Controle analítico de matérias-primas e extratos finais - ASTRAYA',
      headers,
      rows,
      fileName: `ASTRAYA_Laudos_COA_${Date.now()}`,
    });
  };

  const handleExportXls = () => {
    const headers = ['Código COA', 'Título', 'Tipo Análise', 'Lote / Cultivar', 'Laboratório', 'Data Emissão', 'Status', 'Observações'];
    const rows = filteredList.map((i) => [
      i.code,
      i.title,
      i.type,
      i.cultivarOrLot,
      i.laboratory,
      i.issueDate,
      i.status,
      i.notes || '',
    ]);

    exportToXls({
      title: 'CERTIFICADOS E LAUDOS COA',
      headers,
      rows,
      fileName: `ASTRAYA_Certificados_${Date.now()}`,
    });
  };

  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: LabCertificate = {
      id: `coa-${Date.now()}`,
      code: formData.code || `COA-${Date.now()}`,
      title: formData.title || 'Laudo de Análise',
      type: (formData.type as any) || 'POTENCIA_HPLC',
      issueDate: formData.issueDate || new Date().toLocaleDateString('pt-BR'),
      laboratory: formData.laboratory || 'Laboratório Homologado',
      cultivarOrLot: formData.cultivarOrLot || 'Geral',
      status: formData.status || 'APROVADO',
      pdfUrl: formData.pdfUrl || 'https://drive.google.com/',
      notes: formData.notes,
    };
    setCertificatesList((prev) => [newCert, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif italic text-slate-800 font-normal">
                Certificados de Análise (COA) & Laudos
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {filteredList.length} laudos auditados
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Laudos de HPLC de canabinoides e terpenos, ensaios microbiológicos, metais pesados e solventes residuais
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
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Laudo / COA</span>
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por código COA, cultivar, lote ou laboratório..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="TODOS">Todos os Tipos de Ensaio</option>
              <option value="POTENCIA_HPLC">Potência HPLC</option>
              <option value="PERFIL_TERPENICO">Perfil Terpênico</option>
              <option value="MICROBIOLOGICO">Microbiológico</option>
              <option value="METAIS_PESADOS">Metais Pesados</option>
              <option value="SOLVENTES_RESIDUAIS">Solventes Residuais</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredList.map((cert) => (
          <div
            key={cert.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 shadow-xs space-y-3 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {cert.code}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {cert.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-0.5">{cert.title}</h3>
              <p className="text-xs text-emerald-700 font-semibold">{cert.cultivarOrLot}</p>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 mt-2.5 text-xs space-y-1">
                <div className="text-slate-500 text-[11px]">
                  Laboratório: <span className="text-slate-800 font-medium">{cert.laboratory}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Data de Emissão: <span className="text-slate-800 font-medium font-mono">{cert.issueDate}</span>
                </div>
                {cert.notes && (
                  <p className="text-slate-600 text-[11px] pt-1.5 border-t border-slate-200 mt-1">
                    {cert.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100">
              <a
                href={cert.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Visualizar Laudo (PDF)</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Certificate */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Cadastrar Laudo Analítico / COA</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCertificate} className="p-6 overflow-y-auto space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">CÓDIGO DO COA</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">DATA DE EMISSÃO</label>
                  <input
                    type="text"
                    required
                    value={formData.issueDate || ''}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">TÍTULO / DESCRIÇÃO DO LAUDO</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Cromatografia HPLC de Fitocanabinoides"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">TIPO DE ENSAIO</label>
                  <select
                    value={formData.type || 'POTENCIA_HPLC'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="POTENCIA_HPLC">Potência HPLC</option>
                    <option value="PERFIL_TERPENICO">Perfil Terpênico</option>
                    <option value="MICROBIOLOGICO">Microbiológico</option>
                    <option value="METAIS_PESADOS">Metais Pesados</option>
                    <option value="SOLVENTES_RESIDUAIS">Solventes Residuais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LOTE OU CULTIVAR</label>
                  <input
                    type="text"
                    required
                    value={formData.cultivarOrLot || ''}
                    onChange={(e) => setFormData({ ...formData, cultivarOrLot: e.target.value })}
                    placeholder="Ex: Lote 140 (Y GRIEGA)"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LABORATÓRIO EMISSOR</label>
                  <input
                    type="text"
                    value={formData.laboratory || ''}
                    onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                    placeholder="Ex: PhytoLab Análises"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">STATUS</label>
                  <input
                    type="text"
                    value={formData.status || 'APROVADO'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LINK DO ARQUIVO PDF (GOOGLE DRIVE)</label>
                <input
                  type="text"
                  value={formData.pdfUrl || ''}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-600 uppercase hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Laudo COA</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
