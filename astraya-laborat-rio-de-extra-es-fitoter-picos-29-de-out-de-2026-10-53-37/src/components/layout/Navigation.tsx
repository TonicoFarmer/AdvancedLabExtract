import React from 'react';
import {
  FlaskConical,
  BookOpen,
  Calculator,
  Building2,
  Snowflake,
  Droplet,
  PackageCheck,
  Search,
  FileText,
  FileSpreadsheet,
  Leaf,
  Layers,
  Award,
  ExternalLink,
  Dna,
} from 'lucide-react';
import {
  useApp,
  MainSession,
} from '../../context/AppContext';

export const Navigation: React.FC = () => {
  const {
    activeSession,
    activeExtracoesTab,
    setActiveExtracoesTab,
    activeBibliotecaTab,
    setActiveBibliotecaTab,
    activeTCheckTab,
    setActiveTCheckTab,
    activeLabTab,
    setActiveLabTab,
  } = useApp();

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[57px] z-30 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Sub-Sessions Horizontal Tab Bar */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
          {activeSession === 'EXTRACOES' && (
            <>
              <button
                onClick={() => setActiveExtracoesTab('ALCOOL_GELO_SECO')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeExtracoesTab === 'ALCOOL_GELO_SECO'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
                <span>Álcool-Gelo Seco</span>
              </button>

              <button
                onClick={() => setActiveExtracoesTab('ALCOOL_TINTURA')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeExtracoesTab === 'ALCOOL_TINTURA'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Droplet className="w-3.5 h-3.5 text-teal-600" />
                <span>Tintura</span>
              </button>

              <button
                onClick={() => setActiveExtracoesTab('DILUICAO_ENVASE')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeExtracoesTab === 'DILUICAO_ENVASE'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Diluição / Envase</span>
              </button>
            </>
          )}

          {activeSession === 'BIBLIOTECA' && (
            <>
              <button
                onClick={() => setActiveBibliotecaTab('PESQUISA_ESTUDO')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeBibliotecaTab === 'PESQUISA_ESTUDO'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pesquisa e IA</span>
              </button>

              <button
                onClick={() => setActiveBibliotecaTab('ESTUDOS_CANNABIS')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeBibliotecaTab === 'ESTUDOS_CANNABIS'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>Estudos Drive ASTRAYA</span>
              </button>

              <button
                onClick={() => setActiveBibliotecaTab('POP')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeBibliotecaTab === 'POP'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                <span>POP - Padrão Operacional</span>
              </button>

              <button
                onClick={() => setActiveBibliotecaTab('FITOTERAPIA')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeBibliotecaTab === 'FITOTERAPIA'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-green-600" />
                <span>Fitoterapia & Farmacopeia</span>
              </button>
            </>
          )}

          {activeSession === 'TCHECK_CALC' && (
            <>
              <button
                onClick={() => setActiveTCheckTab('CALCULADORAS')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTCheckTab === 'CALCULADORAS'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span>Calculadoras Farmacotécnicas</span>
              </button>

              <button
                onClick={() => setActiveTCheckTab('REGISTROS_TCHECK')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTCheckTab === 'REGISTROS_TCHECK'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Registros & Calculadora T-Check</span>
              </button>
            </>
          )}

          {activeSession === 'LABORATORIO' && (
            <>
              <button
                onClick={() => setActiveLabTab('FORNECEDORES_INSUMOS')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeLabTab === 'FORNECEDORES_INSUMOS'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fornecedores de Insumos</span>
              </button>

              <button
                onClick={() => setActiveLabTab('ESTOQUE_MATERIA_PRIMA')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeLabTab === 'ESTOQUE_MATERIA_PRIMA'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-green-600" />
                <span>Estoque Matéria-Prima</span>
              </button>

              <button
                onClick={() => setActiveLabTab('CERTIFICADOS')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeLabTab === 'CERTIFICADOS'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Certificados / COAs</span>
              </button>

              <button
                onClick={() => setActiveLabTab('BIBLIOTECA_GENETICAS')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeLabTab === 'BIBLIOTECA_GENETICAS'
                    ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40 font-bold'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Dna className="w-3.5 h-3.5 text-teal-600" />
                <span>Biblioteca de Genéticas (Sync)</span>
              </button>

              <a
                href="https://astraya-associacao.org/estoque_insumos/login.php?return_to=%2Festoque_insumos%2Fi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors ml-auto uppercase"
              >
                <span>Estoque ASTRAYA Web</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const BottomSessionBar: React.FC = () => {
  const { activeSession, setActiveSession } = useApp();

  const sessions: { id: MainSession; label: string; shortLabel: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'EXTRACOES', label: 'Extrações', shortLabel: 'Extrações', icon: FlaskConical },
    { id: 'BIBLIOTECA', label: 'Biblioteca de Estudos', shortLabel: 'Biblioteca', icon: BookOpen },
    { id: 'TCHECK_CALC', label: 'TCheck & Calculadoras', shortLabel: 'T-Check & Calc', icon: Calculator },
    { id: 'LABORATORIO', label: 'Laboratório', shortLabel: 'Laboratório', icon: Building2 },
  ];

  return (
    <footer aria-label="Navegação Principal" className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl px-2 sm:px-6 py-2 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Navigation buttons */}
        <div className="flex items-center justify-around sm:justify-start space-x-1 sm:space-x-8 w-full sm:w-auto">
          {sessions.map((session) => {
            const isActive = activeSession === session.id;
            const Icon = session.icon;
            return (
              <button
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 sm:px-3 rounded-lg group transition-all cursor-pointer min-h-[44px] ${
                  isActive ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-400'}`} />
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all hidden sm:block ${
                      isActive ? 'bg-emerald-500 opacity-100 scale-125' : 'bg-transparent opacity-0'
                    }`}
                  />
                </div>
                <span
                  className={`text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  <span className="sm:hidden">{session.shortLabel}</span>
                  <span className="hidden sm:inline">{session.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Operator status badge */}
        <div className="hidden md:flex items-center space-x-3 border-l border-slate-800 pl-4 sm:pl-6">
          <div className="text-right">
            <p className="text-[9px] uppercase font-mono text-slate-400">Operador Lab</p>
            <p className="text-[10px] font-bold text-slate-100">Dr. Farmacêutico ASTRAYA</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold border border-slate-700 text-emerald-400 font-mono">
            LB
          </div>
        </div>
      </div>
    </footer>
  );
};
