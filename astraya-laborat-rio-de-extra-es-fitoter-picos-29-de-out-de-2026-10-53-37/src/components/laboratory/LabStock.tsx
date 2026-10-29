import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  Save,
  FileDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LabStockItem } from '../../types';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';

export const LabStock: React.FC = () => {
  const { stockList, setStockList } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LabStockItem | null>(null);

  const [formData, setFormData] = useState<Partial<LabStockItem>>({
    name: '',
    category: 'REAGENTE',
    quantity: 1,
    unit: 'Litros',
    minQuantity: 2,
    location: 'Armário A1',
    status: 'NORMAL',
    supplier: 'Synth Reagentes',
    lastRestockDate: new Date().toLocaleDateString('pt-BR'),
  });

  const categories = ['MATERIA_PRIMA', 'SOLVENTE', 'REAGENTE', 'EMBALAGEM', 'CONSUMIVEL'];

  const filteredList = stockList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = categoryFilter === 'TODAS' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleExportPdf = () => {
    const headers = ['Item', 'Categoria', 'Qtd Atual', 'Qtd Mínima', 'Localização', 'Status', 'Fornecedor', 'Última Reposição'];
    const rows = filteredList.map((i) => [
      i.name,
      i.category,
      `${i.quantity} ${i.unit}`,
      `${i.minQuantity} ${i.unit}`,
      i.location,
      i.status,
      i.supplier || 'N/A',
      i.lastRestockDate,
    ]);

    exportToPdf({
      title: 'Controle de Estoque e Insumos do Laboratório ASTRAYA',
      subtitle: 'Matérias-primas, solventes, reagentes, frascos âmbar e consumíveis farmacêuticos',
      headers,
      rows,
      fileName: `ASTRAYA_Estoque_${Date.now()}`,
    });
  };

  const handleExportXls = () => {
    const headers = ['Item', 'Categoria', 'Quantidade', 'Unidade', 'Estoque Mínimo', 'Localização', 'Status', 'Fornecedor', 'Última Reposição'];
    const rows = filteredList.map((i) => [
      i.name,
      i.category,
      i.quantity,
      i.unit,
      i.minQuantity,
      i.location,
      i.status,
      i.supplier || '',
      i.lastRestockDate,
    ]);

    exportToXls({
      title: 'ESTOQUE DO LABORATÓRIO',
      headers,
      rows,
      fileName: `ASTRAYA_Estoque_${Date.now()}`,
    });
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'REAGENTE',
      quantity: 10,
      unit: 'Litros',
      minQuantity: 5,
      location: 'Prateleira Central',
      status: 'NORMAL',
      supplier: 'Fornecedor ASTRAYA',
      lastRestockDate: new Date().toLocaleDateString('pt-BR'),
    });
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LabStockItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja excluir este item do estoque?')) {
      setStockList((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(formData.quantity) || 0;
    const min = Number(formData.minQuantity) || 0;
    let autoStatus: 'OK' | 'LOW' | 'CRITICAL' = 'OK';
    if (qty <= 0) autoStatus = 'CRITICAL';
    else if (qty <= min) autoStatus = 'LOW';

    if (editingItem) {
      setStockList((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? ({
                ...item,
                ...formData,
                quantity: qty,
                minQuantity: min,
                status: autoStatus,
              } as LabStockItem)
            : item
        )
      );
    } else {
      const newItem: LabStockItem = {
        id: `stk-${Date.now()}`,
        name: formData.name || 'Novo Item',
        category: (formData.category as any) || 'REAGENTE',
        quantity: qty,
        unit: formData.unit || 'un',
        minQuantity: min,
        location: formData.location || 'Laboratório',
        status: autoStatus,
        supplier: formData.supplier,
        lastRestockDate: formData.lastRestockDate || new Date().toLocaleDateString('pt-BR'),
      };
      setStockList((prev) => [newItem, ...prev]);
    }
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
                Controle de Estoque & Insumos
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {filteredList.length} itens cadastrados
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Gestão de biomassa vegetal seca, solventes grau PA, carreador TCM, frascos âmbar 30mL e bolsas
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
              <span>Adicionar Insumo</span>
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por nome, localização ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="TODAS">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredList.map((item) => {
          const isLow = item.quantity <= item.minQuantity;
          const isCritical = item.quantity === 0;

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 shadow-xs space-y-3 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {item.category}
                  </span>

                  {isCritical ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      ESGOTADO
                    </span>
                  ) : isLow ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      REPOR ESTOQUE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      REGULAR
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">{item.name}</h3>

                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-2xl font-bold text-slate-900 font-mono">{item.quantity}</span>
                  <span className="text-xs text-slate-500 font-mono">{item.unit}</span>
                  <span className="text-[10px] text-slate-400 font-mono ml-auto">Mín: {item.minQuantity} {item.unit}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 mt-2.5 text-xs space-y-1">
                  <div className="text-slate-500 text-[11px]">
                    Local: <span className="text-slate-800 font-medium">{item.location}</span>
                  </div>
                  {item.supplier && (
                    <div className="text-slate-500 text-[11px]">
                      Fornecedor: <span className="text-slate-800 font-medium">{item.supplier}</span>
                    </div>
                  )}
                  <div className="text-slate-400 text-[10px] font-mono">
                    Última reposição: {item.lastRestockDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-slate-400" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                {editingItem ? 'Editar Insumo de Estoque' : 'Cadastrar Novo Insumo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">NOME DO ITEM / INSUMO</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Álcool de Cereais 96% Grau Farmacêutico"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">CATEGORIA</label>
                  <select
                    value={formData.category || 'REAGENTE'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">UNIDADE DE MEDIDA</label>
                  <input
                    type="text"
                    required
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Litros, Gramas, Frascos, Unidades"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">QUANTIDADE ATUAL</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.quantity || 0}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">ESTOQUE MÍNIMO DE ALERTA</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.minQuantity || 0}
                    onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LOCALIZAÇÃO NO LAB</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Armário de Solventes B2"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">FORNECEDOR</label>
                  <input
                    type="text"
                    value={formData.supplier || ''}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Nome da empresa fornecedora"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
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
                  <span>Salvar Insumo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
