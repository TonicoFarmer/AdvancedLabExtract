import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  ExternalLink,
  Plus,
  CheckCircle2,
  X,
  Save,
  FolderOpen,
  BookOpen,
  Copy,
  Check,
  LayoutGrid,
  List,
  Layers,
  Sparkles,
  Tag,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScientificStudy, StudyCategory } from '../../types';

export const DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/11vRXOSvIU5lmq5ZoVfQ7WVFyX1Tx6hGe?usp=sharing';

export const StudiesCannabisDrive: React.FC = () => {
  const { studiesList, setStudiesList, setNotificationMessage } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('TODAS');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeStudyDetail, setActiveStudyDetail] = useState<ScientificStudy | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ScientificStudy>>({
    title: '',
    authors: '',
    year: 2024,
    journal: 'Frontiers in Pharmacology / SciELO Brasil',
    doiUrl: '',
    category: 'Farmacologia & Canabinoides',
    tags: ['Fitoterapia', 'Cannabis Medicinal', 'Farmacologia'],
    abstract: '',
    keyFindings: [''],
    pdfDriveUrl: DRIVE_FOLDER_URL,
  });

  const divisions: { id: string; label: string; icon: string; countBadgeColor: string }[] = [
    { id: 'TODAS', label: 'Todas as Divisões', icon: '📚', countBadgeColor: 'bg-slate-100 text-slate-700' },
    { id: 'Farmacologia & Canabinoides', label: 'Farmacologia & Canabinoides', icon: '🌿', countBadgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'Fitoterapia Geral & Farmacognosia', label: 'Fitoterapia Geral & Farmacognosia', icon: '🧪', countBadgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'Terpenos & Efeito Comitiva', label: 'Terpenos & Efeito Comitiva', icon: '🍇', countBadgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'Extração & Farmacotécnica', label: 'Extração & Farmacotécnica', icon: '🔬', countBadgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'Aplicações Clínicas & Dosagem', label: 'Aplicações Clínicas & Dosagem', icon: '🩺', countBadgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'Controle de Qualidade & Farmacopeia', label: 'Controle de Qualidade & Farmacopeia', icon: '📋', countBadgeColor: 'bg-rose-100 text-rose-800' },
  ];

  // Helper to normalize category matching
  const getNormalizedCategory = (study: ScientificStudy): string => {
    const cat = (study.category || study.categoria || '').trim();
    if (cat.includes('Farmacologia') || cat.includes('Canabinoides')) return 'Farmacologia & Canabinoides';
    if (cat.includes('Fitoterapia') || cat.includes('Plantas') || cat.includes('Farmacognosia')) return 'Fitoterapia Geral & Farmacognosia';
    if (cat.includes('Terpenos') || cat.includes('Comitiva')) return 'Terpenos & Efeito Comitiva';
    if (cat.includes('Extração') || cat.includes('Processamento') || cat.includes('Solvente')) return 'Extração & Farmacotécnica';
    if (cat.includes('Clínicos') || cat.includes('Clínicas') || cat.includes('Dosagem') || cat.includes('Terapêuticas')) return 'Aplicações Clínicas & Dosagem';
    if (cat.includes('Qualidade') || cat.includes('Farmacopeia') || cat.includes('Estabilidade') || cat.includes('Cromatografia')) return 'Controle de Qualidade & Farmacopeia';
    return cat || 'Farmacologia & Canabinoides';
  };

  const getDivisionBadgeStyle = (category: string) => {
    switch (category) {
      case 'Farmacologia & Canabinoides':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Fitoterapia Geral & Farmacognosia':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Terpenos & Efeito Comitiva':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Extração & Farmacotécnica':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Aplicações Clínicas & Dosagem':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Controle de Qualidade & Farmacopeia':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Collect all unique tags
  const allTags = Array.from(
    new Set(
      studiesList.flatMap((s) => s.tags || [])
    )
  ).slice(0, 14);

  const filteredList = studiesList.filter((item) => {
    const studyTitle = (item.title || item.titulo || '').toLowerCase();
    const studyAuthors = (item.authors || item.autores || '').toLowerCase();
    const studyAbstract = (item.abstract || item.resumo || '').toLowerCase();
    const studyJournal = (item.journal || item.revista || '').toLowerCase();
    const studyTags = (item.tags || []).map((t) => t.toLowerCase());
    const studyFindings = (item.keyFindings || []).map((f) => f.toLowerCase()).join(' ');

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      studyTitle.includes(term) ||
      studyAuthors.includes(term) ||
      studyAbstract.includes(term) ||
      studyJournal.includes(term) ||
      studyFindings.includes(term) ||
      studyTags.some((t) => t.includes(term));

    const itemNormCat = getNormalizedCategory(item);
    const matchesDivision =
      selectedDivision === 'TODAS' ||
      itemNormCat === selectedDivision ||
      (item.category && item.category === selectedDivision) ||
      (item.categoria && item.categoria === selectedDivision);

    const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));

    return matchesSearch && matchesDivision && matchesTag;
  });

  const handleCopyCitation = (study: ScientificStudy) => {
    const authors = study.authors || study.autores || 'ASTRAYA';
    const title = study.title || study.titulo || 'Estudo Científico';
    const journal = study.journal || study.revista || 'Acervo Científico ASTRAYA';
    const year = study.year || study.ano || 2024;
    const doi = study.doiUrl || study.doi || DRIVE_FOLDER_URL;

    const citationText = `${authors}. ${title}. ${journal}, ${year}. Disponível em: ${doi}`;

    navigator.clipboard.writeText(citationText);
    setCopiedId(study.id);
    setNotificationMessage('Citação ABNT copiada para a área de transferência!');
    setTimeout(() => {
      setCopiedId(null);
      setNotificationMessage(null);
    }, 3000);
  };

  const handleSaveStudy = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudy: ScientificStudy = {
      id: `study-${Date.now()}`,
      title: formData.title || 'Estudo sem título',
      titulo: formData.title || 'Estudo sem título',
      authors: formData.authors || 'Pesquisadores ASTRAYA',
      autores: formData.authors || 'Pesquisadores ASTRAYA',
      year: Number(formData.year) || 2024,
      ano: Number(formData.year) || 2024,
      journal: formData.journal || 'Acervo Científico ASTRAYA / Drive',
      revista: formData.journal || 'Acervo Científico ASTRAYA / Drive',
      doiUrl: formData.doiUrl || DRIVE_FOLDER_URL,
      doi: formData.doiUrl || DRIVE_FOLDER_URL,
      category: (formData.category as StudyCategory) || 'Farmacologia & Canabinoides',
      categoria: (formData.category as StudyCategory) || 'Farmacologia & Canabinoides',
      tags:
        typeof formData.tags === 'string'
          ? (formData.tags as string).split(',').map((t) => t.trim())
          : formData.tags || ['Cannabis', 'Fitoterapia'],
      abstract: formData.abstract || 'Documento indexado no Google Drive ASTRAYA.',
      resumo: formData.abstract || 'Documento indexado no Google Drive ASTRAYA.',
      keyFindings: formData.keyFindings?.filter((k) => k.trim()) || [
        'Documento público indexado no repositório digital.',
      ],
      pdfDriveUrl: formData.pdfDriveUrl || DRIVE_FOLDER_URL,
      destaque: false,
    };

    setStudiesList((prev) => [newStudy, ...prev]);
    setIsAddModalOpen(false);
    setNotificationMessage('Novo artigo adicionado com sucesso ao acervo!');
    setTimeout(() => setNotificationMessage(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Google Drive Folder Link & Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-serif italic text-slate-800 font-normal">
                Estudos Drive ASTRAYA & Acervo Científico
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {filteredList.length} de {studiesList.length} estudos
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Repositório digital de farmacologia de cannabis, fitoquímica e fitoterapia geral com acesso direto ao Google Drive
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* BOTÃO PRINCIPAL DE ACESSO AO GOOGLE DRIVE */}
            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
              title="Abrir pasta pública no Google Drive com todos os documentos"
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-100" />
              <span>Acessar Pasta no Google Drive</span>
              <ExternalLink className="w-3 h-3 text-emerald-200" />
            </a>

            <button
              onClick={() => {
                setFormData({
                  title: '',
                  authors: '',
                  year: 2024,
                  journal: 'Frontiers in Pharmacology / SciELO Brasil',
                  doiUrl: '',
                  category: 'Farmacologia & Canabinoides',
                  tags: ['Fitoterapia', 'Cannabis Medicinal', 'Farmacologia'],
                  abstract: '',
                  keyFindings: [''],
                  pdfDriveUrl: DRIVE_FOLDER_URL,
                });
                setIsAddModalOpen(true);
              }}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3 text-emerald-600" />
              <span>Adicionar Estudo</span>
            </button>
          </div>
        </div>

        {/* Search, Tag Filtering & View Switcher */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título, autor, fitoquímico, periódico, palavras-chave ou dosagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Limpar busca"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Visualização em Cards Detalhados"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Visualização em Tabela Compacta"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabela</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tag Filter Chips */}
        {allTags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-slate-600">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" />
              Filtro Rápido:
            </span>
            {selectedTag && (
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Limpar filtro: #{selectedTag}</span>
                <X className="w-2.5 h-2.5" />
              </button>
            )}
            {allTags.map((tag) => {
              const isTagSelected = selectedTag === tag;
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedTag(isTagSelected ? null : tag)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                    isTagSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Studies Results Container */}
      {filteredList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Nenhum estudo encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Tente buscar com outros termos ou selecione outra divisão no topo.
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDivision('TODAS');
                setSelectedTag(null);
              }}
              className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
            >
              Limpar Filtros
            </button>
            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Ver no Google Drive</span>
            </a>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {filteredList.map((study) => {
            const title = study.title || study.titulo || 'Estudo sem título';
            const authors = study.authors || study.autores || 'Pesquisadores ASTRAYA';
            const journal = study.journal || study.revista || 'Acervo ASTRAYA';
            const year = study.year || study.ano || 2024;
            const abstract = study.abstract || study.resumo || '';
            const doi = study.doiUrl || study.doi || DRIVE_FOLDER_URL;
            const driveUrl = study.pdfDriveUrl || DRIVE_FOLDER_URL;
            const normCat = getNormalizedCategory(study);
            const badgeClass = getDivisionBadgeStyle(normCat);

            return (
              <div
                key={study.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 shadow-xs transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}>
                      {normCat}
                    </span>
                    <div className="flex items-center gap-2">
                      {study.destaque && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Destaque
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-mono font-semibold">{year}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-500 mb-2 italic">
                    {authors} • <span className="text-slate-700 font-medium">{journal}</span>
                  </p>

                  <p className="text-xs text-slate-700 leading-relaxed mb-3 line-clamp-3">
                    {abstract}
                  </p>

                  {study.keyFindings && study.keyFindings.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-3 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-700 block">
                        Conclusões & Evidências Principais:
                      </span>
                      {study.keyFindings.slice(0, 3).map((finding, idx) => (
                        <div key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{finding}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {study.tags && study.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded bg-slate-50 text-[10px] text-slate-600 border border-slate-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {/* Botão de Acesso ao Drive do Estudo */}
                    <a
                      href={driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                      title="Abrir pasta / arquivo no Google Drive"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Google Drive</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>

                    {/* Botão de Acesso ao DOI / Periódico */}
                    {doi && (
                      <a
                        href={doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 rounded hover:bg-slate-100"
                        title="Acessar publicação oficial / DOI"
                      >
                        <span>Acessar DOI</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(study)}
                      className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Copiar citação ABNT"
                    >
                      {copiedId === study.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveStudyDetail(study)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      Ficha Completa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Estudo / Título</th>
                  <th className="px-4 py-3">Divisão</th>
                  <th className="px-4 py-3">Periódico & Autores</th>
                  <th className="px-4 py-3 text-center">Ano</th>
                  <th className="px-4 py-3 text-right">Acesso & Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((study) => {
                  const title = study.title || study.titulo || 'Estudo sem título';
                  const authors = study.authors || study.autores || 'ASTRAYA';
                  const journal = study.journal || study.revista || 'Acervo ASTRAYA';
                  const year = study.year || study.ano || 2024;
                  const doi = study.doiUrl || study.doi || DRIVE_FOLDER_URL;
                  const driveUrl = study.pdfDriveUrl || DRIVE_FOLDER_URL;
                  const normCat = getNormalizedCategory(study);
                  const badgeClass = getDivisionBadgeStyle(normCat);

                  return (
                    <tr key={study.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 max-w-sm">
                        <div className="flex items-start gap-1.5">
                          {study.destaque && (
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold">{title}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(study.tags || []).slice(0, 3).map((t) => (
                                <span key={t} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}>
                          {normCat}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">
                        <div className="font-semibold text-slate-800">{journal}</div>
                        <div className="text-[11px] text-slate-500 italic truncate">{authors}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-slate-700 whitespace-nowrap font-bold">
                        {year}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold"
                            title="Acessar no Google Drive"
                          >
                            <FolderOpen className="w-3 h-3" />
                            <span>Drive</span>
                          </a>

                          {doi && (
                            <a
                              href={doi}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                              title="Acessar DOI"
                            >
                              <span>DOI</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => setActiveStudyDetail(study)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold"
                          >
                            Ficha
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeStudyDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-900 max-h-[88vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {getNormalizedCategory(activeStudyDetail)} ({activeStudyDetail.year || activeStudyDetail.ano || 2024})
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                  {activeStudyDetail.title || activeStudyDetail.titulo}
                </h3>
              </div>
              <button
                onClick={() => setActiveStudyDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                  Autores e Periódico / Indexação:
                </span>
                <p className="text-slate-900 font-medium">
                  {activeStudyDetail.authors || activeStudyDetail.autores} —{' '}
                  <span className="text-emerald-800 font-bold">
                    {activeStudyDetail.journal || activeStudyDetail.revista}
                  </span>
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                  Resumo Científico (Abstract):
                </span>
                <p className="text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  {activeStudyDetail.abstract || activeStudyDetail.resumo}
                </p>
              </div>

              {activeStudyDetail.keyFindings && activeStudyDetail.keyFindings.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 uppercase text-[10px] block mb-1.5">
                    Conclusões, Mecanismos Fitoquímicos e Farmacotécnica:
                  </span>
                  <ul className="space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    {activeStudyDetail.keyFindings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeStudyDetail.tags && activeStudyDetail.tags.length > 0 && (
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Tags Fitoquímicas:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeStudyDetail.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={activeStudyDetail.pdfDriveUrl || DRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Abrir no Google Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {(activeStudyDetail.doiUrl || activeStudyDetail.doi) && (
                    <a
                      href={activeStudyDetail.doiUrl || activeStudyDetail.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      <span>Acessar DOI Oficial</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCitation(activeStudyDetail)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Citação ABNT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStudyDetail(null)}
                    className="px-3 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Study Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase">
                  Novo Artigo / Estudo para o Acervo
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudy} className="p-6 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">TÍTULO DO ESTUDO / DOCUMENTO</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Farmacocinética e biodisponibilidade de fitocanabinoides..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">AUTORES</label>
                  <input
                    type="text"
                    required
                    value={formData.authors || ''}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    placeholder="Ex: Zuardi, A. W., Crippa, J. A. et al."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">PERIÓDICO / FONTE</label>
                  <input
                    type="text"
                    value={formData.journal || ''}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    placeholder="Ex: SciELO Brasil / PubMed"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">ANO</label>
                  <input
                    type="number"
                    value={formData.year || 2024}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">DIVISÃO / CATEGORIA</label>
                  <select
                    value={formData.category || 'Farmacologia & Canabinoides'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as StudyCategory })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    {divisions
                      .filter((d) => d.id !== 'TODAS')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LINK DO ARQUIVO / PASTA NO GOOGLE DRIVE</label>
                <input
                  type="text"
                  value={formData.pdfDriveUrl || DRIVE_FOLDER_URL}
                  onChange={(e) => setFormData({ ...formData, pdfDriveUrl: e.target.value })}
                  placeholder={DRIVE_FOLDER_URL}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">DOI / URL DO ARTIGO PÚBLICO</label>
                <input
                  type="text"
                  value={formData.doiUrl || ''}
                  onChange={(e) => setFormData({ ...formData, doiUrl: e.target.value })}
                  placeholder="Ex: https://doi.org/10.1590/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">RESUMO (ABSTRACT)</label>
                <textarea
                  rows={3}
                  value={formData.abstract || ''}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  placeholder="Resumo dos objetivos, métodos e achados fitoquímicos..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">TAGS (SEPARADAS POR VÍRGULA)</label>
                <input
                  type="text"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value as any })}
                  placeholder="Ex: Farmacocinética, CBD, TCM, SciELO Brasil"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-600 uppercase hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Estudo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
