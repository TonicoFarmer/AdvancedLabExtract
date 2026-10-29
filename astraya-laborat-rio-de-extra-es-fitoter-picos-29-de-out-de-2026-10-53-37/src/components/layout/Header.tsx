import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  RotateCcw, 
  Sparkles,
  FileDown,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2
} from 'lucide-react';
import { useApp, LayoutMode } from '../../context/AppContext';
import { exportToPdf, exportToXls } from '../../utils/exportUtils';

export const Header: React.FC = () => {
  const { 
    alcoolGeloSecoList, 
    rosinList, 
    alcoolTinturaList, 
    dryIceList, 
    iceolatorList,
    diluicaoEnvaseList,
    tcheckList,
    allGeneticRatings,
    resetToDefaultData,
    notificationMessage,
    layoutMode,
    setLayoutMode
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGlobalExportPdf = () => {
    const headers = ['Tipo de Extração', 'Total Registros', 'Última Atualização', 'Status'];
    const rows = [
      ['Álcool - Gelo Seco', String(alcoolGeloSecoList.length), 'Hoje', 'Operacional'],
      ['Rosin Solventless', String(rosinList.length), 'Hoje', 'Operacional'],
      ['Álcool Tintura', String(alcoolTinturaList.length), 'Hoje', 'Operacional'],
      ['Dry Ice', String(dryIceList.length), 'Hoje', 'Operacional'],
      ['Iceolator (Ice Hash)', String(iceolatorList.length), 'Hoje', 'Operacional'],
      ['Diluição & Envase', String(diluicaoEnvaseList.length), 'Hoje', 'Operacional'],
      ['Registros T-Check', String(tcheckList.length), 'Hoje', 'Calibrado'],
    ];

    exportToPdf({
      title: 'Relatório Executivo Geral de Extrações e Fitoterápicos',
      subtitle: 'ASTRAYA LAB - Rastreabilidade Farmacotécnica & Controle de Qualidade',
      headers,
      rows,
      fileName: `ASTRAYA_Relatorio_Geral_${Date.now()}`,
    });
  };

  const handleGlobalExportXls = () => {
    const headers = ['Sessão', 'Quantidade de Registros', 'Status do Módulo', 'Sincronização Genética'];
    const rows = [
      ['Álcool - Gelo Seco', alcoolGeloSecoList.length, 'Ativo', `${allGeneticRatings.length} avaliações`],
      ['Rosin', rosinList.length, 'Ativo', 'Integrado'],
      ['Álcool Tintura', alcoolTinturaList.length, 'Ativo', 'Integrado'],
      ['Dry Ice', dryIceList.length, 'Ativo', 'Integrado'],
      ['Iceolator', iceolatorList.length, 'Ativo', 'Integrado'],
      ['Diluição e Envase', diluicaoEnvaseList.length, 'Ativo', 'Rastreável'],
      ['T-Check Espectrofotometria', tcheckList.length, 'Calibrado', 'Validado'],
    ];

    exportToXls({
      title: 'INVENTÁRIO GERAL DE DADOS ASTRAYA LAB',
      headers,
      rows,
      fileName: `ASTRAYA_DataGrid_Geral_${Date.now()}`,
    });
  };

  const layoutModes: { id: LayoutMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'AUTO', label: 'Auto', icon: Maximize2 },
    { id: 'MOBILE', label: 'Celular', icon: Smartphone },
    { id: 'TABLET', label: 'Tablet', icon: Tablet },
    { id: 'DESKTOP', label: 'Desktop', icon: Monitor },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs print:hidden">
      {/* Top laboratory header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Brand identity */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-sm shadow-xs mr-2 shrink-0">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-800 uppercase">
                  ASTRAYA <span className="text-emerald-600">LAB</span>
                </span>
                <span className="text-[9.5px] sm:text-[10px] uppercase font-mono px-1.5 sm:px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  P&D
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal line-clamp-1">
                Controle de Extrações, Fitoterápicos & Lab
              </p>
            </div>
          </div>

          {/* Quick Layout Mode for Mobile Screen bar */}
          <div className="flex sm:hidden items-center bg-slate-100 p-0.5 rounded border border-slate-200">
            {layoutModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = layoutMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setLayoutMode(mode.id)}
                  title={`Modo de Layout: ${mode.label}`}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Clock, Layout Switcher & Quick Export Tools */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 text-xs w-full sm:w-auto">
          {/* Desktop Layout Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-[11px]">
            <span className="text-[9.5px] font-mono text-slate-500 font-bold uppercase px-2">Layout:</span>
            {layoutModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = layoutMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setLayoutMode(mode.id)}
                  title={`Modo de visualização ${mode.label}`}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-emerald-800 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Live Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[11px]">
            <Activity className="w-3 h-3 text-emerald-600" />
            <span>{currentTime || 'Sincronizando...'}</span>
          </div>

          {/* Export Quick Buttons */}
          <button
            onClick={handleGlobalExportPdf}
            className="px-2 py-1 border border-slate-200 rounded text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-700 uppercase flex items-center gap-1 transition-colors cursor-pointer"
            title="Exportar Relatório Geral em PDF"
          >
            <FileDown className="w-3 h-3 text-slate-500" />
            <span>PDF</span>
          </button>

          <button
            onClick={handleGlobalExportXls}
            className="px-2 py-1 border border-slate-200 rounded text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-700 uppercase flex items-center gap-1 transition-colors cursor-pointer"
            title="Exportar Tabela Geral em Excel"
          >
            <FileDown className="w-3 h-3 text-emerald-600" />
            <span>XLS</span>
          </button>

          {/* Reset button */}
          <button
            onClick={resetToDefaultData}
            title="Restaurar dados originais"
            className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-[10px] font-bold uppercase transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Dynamic Toast Notification */}
      {notificationMessage && (
        <div className="bg-emerald-600 text-white text-xs py-1 px-4 text-center font-semibold flex items-center justify-center gap-2 animate-fadeIn shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{notificationMessage}</span>
        </div>
      )}
    </header>
  );
};
