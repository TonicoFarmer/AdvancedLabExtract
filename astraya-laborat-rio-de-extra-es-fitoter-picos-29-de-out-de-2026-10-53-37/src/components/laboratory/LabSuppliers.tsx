import React, { useState } from 'react';
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  Save,
  FileDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LabSupplier } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';

export const LabSuppliers: React.FC = () => {
  const { suppliersList, setSuppliersList } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<LabSupplier | null>(null);

  const [formData, setFormData] = useState<Partial<LabSupplier>>({
    name: '',
    category: 'Solventes e Reagentes PA',
    contactPerson: '',
    phone: '',
    email: '',
    website: '',
    address: 'São Paulo - SP',
    productsSupplied: [],
  });

  const filteredList = suppliersList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.productsSupplied.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportPdf = () => {
    const headers = ['Fornecedor', 'Categoria', 'Contato', 'Telefone', 'E-mail', 'Produtos Fornecidos'];
    const rows = filteredList.map((s) => [
      s.name,
      s.category,
      s.contactPerson || 'N/A',
      s.phone || 'N/A',
      s.email || 'N/A',
      s.productsSupplied.join(', '),
    ]);

    exportToPdf({
      title: 'Fornecedores Homologados do Laboratório ASTRAYA',
      subtitle: 'Controle de parceiros para insumos, reagentes, embalagens e vidrarias',
      headers,
      rows,
      fileName: `ASTRAYA_Fornecedores_${Date.now()}`,
    });
  };

  const handleExportXls = () => {
    const headers = ['Nome Fornecedor', 'Categoria', 'Contato', 'Telefone', 'E-mail', 'Site', 'Endereço', 'Produtos'];
    const rows = filteredList.map((s) => [
      s.name,
      s.category,
      s.contactPerson || '',
      s.phone || '',
      s.email || '',
      s.website || '',
      s.address || '',
      s.productsSupplied.join(', '),
    ]);

    exportToXls({
      title: 'FORNECEDORES HOMOLOGADOS',
      headers,
      rows,
      fileName: `ASTRAYA_Fornecedores_${Date.now()}`,
    });
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const products = typeof formData.productsSupplied === 'string'
      ? (formData.productsSupplied as string).split(',').map((p) => p.trim())
      : formData.productsSupplied || [];

    if (editingSupplier) {
      setSuppliersList((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id
            ? ({
                ...s,
                ...formData,
                productsSupplied: products,
              } as LabSupplier)
            : s
        )
      );
    } else {
      const newSup: LabSupplier = {
        id: `sup-${Date.now()}`,
        name: formData.name || 'Novo Fornecedor',
        category: formData.category || 'Geral',
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        address: formData.address,
        productsSupplied: products,
      };
      setSuppliersList((prev) => [newSup, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja remover este fornecedor?')) {
      setSuppliersList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif italic text-slate-800 font-normal">
                Fornecedores Homologados
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {filteredList.length} parceiros
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Cadastro de empresas qualificadas para compra de insumos, frascos conta-gotas 30mL, álcool de cereais e vidrarias
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
                setFormData({
                  name: '',
                  category: 'Solventes e Reagentes PA',
                  contactPerson: '',
                  phone: '',
                  email: '',
                  website: '',
                  address: 'São Paulo - SP',
                  productsSupplied: [],
                });
                setEditingSupplier(null);
                setIsModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Fornecedor</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por fornecedor, categoria de insumo ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredList.map((sup) => (
          <div
            key={sup.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 shadow-xs space-y-3 flex flex-col justify-between transition-colors"
          >
            <div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 mb-1.5 inline-block">
                {sup.category}
              </span>

              <h3 className="text-sm font-bold text-slate-900 mb-0.5">{sup.name}</h3>

              <div className="space-y-1 text-xs text-slate-600 mt-2">
                {sup.contactPerson && (
                  <div className="text-slate-500 text-[11px]">
                    Contato: <span className="text-slate-800 font-medium">{sup.contactPerson}</span>
                  </div>
                )}
                {sup.phone && (
                  <div className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{sup.phone}</span>
                  </div>
                )}
                {sup.email && (
                  <div className="flex items-center gap-1.5 text-slate-700 text-[11px] truncate">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{sup.email}</span>
                  </div>
                )}
                {sup.address && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{sup.address}</span>
                  </div>
                )}
              </div>

              {/* Products list */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Insumos & Produtos:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sup.productsSupplied.map((prod, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-slate-50 text-[10px] text-slate-700 border border-slate-200"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
              {sup.website ? (
                <a
                  href={sup.website.startsWith('http') ? sup.website : `https://${sup.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline font-semibold"
                >
                  <span>Site / Catálogo</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
              ) : (
                <span></span>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingSupplier(sup);
                    setFormData({ ...sup });
                    setIsModalOpen(true);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(sup.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                {editingSupplier ? 'Editar Fornecedor' : 'Cadastrar Fornecedor Homologado'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-6 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">NOME DA EMPRESA / FORNECEDOR</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Synth Reagentes Analíticos"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">CATEGORIA PRINCIPAL</label>
                  <input
                    type="text"
                    required
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Solventes / Embalagens / Vidrarias"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">NOME DO CONTATO</label>
                  <input
                    type="text"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">TELEFONE / WHATSAPP</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">E-MAIL COMERCIAL</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vendas@fornecedor.com.br"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">SITE / CATÁLOGO</label>
                  <input
                    type="text"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="www.fornecedor.com.br"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">ENDEREÇO / CIDADE</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="São Paulo - SP"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">PRODUTOS FORNECIDOS (SEPARADOS POR VÍRGULA)</label>
                <input
                  type="text"
                  value={Array.isArray(formData.productsSupplied) ? formData.productsSupplied.join(', ') : (formData.productsSupplied || '')}
                  onChange={(e) => setFormData({ ...formData, productsSupplied: e.target.value.split(',').map((p) => p.trim()) })}
                  placeholder="Álcool 96%, Galões 5L, Filtros, Beéqueres..."
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
                  <span>Salvar Fornecedor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
