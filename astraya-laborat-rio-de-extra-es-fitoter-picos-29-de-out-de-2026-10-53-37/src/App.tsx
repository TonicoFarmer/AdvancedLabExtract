import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navigation, BottomSessionBar } from './components/layout/Navigation';

// Extractions
import { ExtractionAlcoolGeloSeco } from './components/extractions/ExtractionAlcoolGeloSeco';
import { ExtractionRosin } from './components/extractions/ExtractionRosin';
import { ExtractionIceolator } from './components/extractions/ExtractionIceolator';
import { ExtractionDryIce } from './components/extractions/ExtractionDryIce';
import { ExtractionAlcoolTintura } from './components/extractions/ExtractionAlcoolTintura';
import { DiluicaoEnvase } from './components/extractions/DiluicaoEnvase';

// Library & Studies
import { StudySearchAI } from './components/library/StudySearchAI';
import { StudiesCannabisDrive } from './components/library/StudiesCannabisDrive';
import { PopViewer } from './components/library/PopViewer';
import { FitoterapiaGuide } from './components/library/FitoterapiaGuide';

// Calculators & T-Check
import { TCheckSession } from './components/calculators/TCheckSession';
import { CalculatorsSession } from './components/calculators/CalculatorsSession';

// Laboratory
import { LabStock } from './components/laboratory/LabStock';
import { LabCertificates } from './components/laboratory/LabCertificates';
import { LabSuppliers } from './components/laboratory/LabSuppliers';
import { GeneticsLibraryBridge } from './components/laboratory/GeneticsLibraryBridge';

const MainContent: React.FC = () => {
  const {
    activeSession,
    activeExtracoesTab,
    activeBibliotecaTab,
    activeTCheckTab,
    activeLabTab,
    notificationMessage,
    layoutMode,
  } = useApp();

  const renderActiveView = () => {
    // 1. CONTROLE DE EXTRAÇÕES
    if (activeSession === 'EXTRACOES') {
      switch (activeExtracoesTab) {
        case 'ALCOOL_GELO_SECO':
          return <ExtractionAlcoolGeloSeco />;
        case 'ROSIN':
          return <ExtractionRosin />;
        case 'ALCOOL_TINTURA':
          return <ExtractionAlcoolTintura />;
        case 'DRY_ICE':
          return <ExtractionDryIce />;
        case 'ICEOLATOR':
          return <ExtractionIceolator />;
        case 'DILUICAO_ENVASE':
          return <DiluicaoEnvase />;
        default:
          return <ExtractionAlcoolGeloSeco />;
      }
    }

    // 2. BIBLIOTECA DE ESTUDO
    if (activeSession === 'BIBLIOTECA') {
      switch (activeBibliotecaTab) {
        case 'PESQUISA_ESTUDO':
          return <StudySearchAI />;
        case 'ESTUDOS_CANNABIS':
          return <StudiesCannabisDrive />;
        case 'POP':
          return <PopViewer />;
        case 'FITOTERAPIA':
          return <FitoterapiaGuide />;
        default:
          return <StudySearchAI />;
      }
    }

    // 3. TCHECK e CALCULADORAS
    if (activeSession === 'TCHECK_CALC') {
      switch (activeTCheckTab) {
        case 'CALCULADORAS':
          return <CalculatorsSession />;
        case 'REGISTROS_TCHECK':
          return <TCheckSession />;
        default:
          return <CalculatorsSession />;
      }
    }

    // 4. LABORATÓRIO
    if (activeSession === 'LABORATORIO') {
      switch (activeLabTab) {
        case 'FORNECEDORES_INSUMOS':
          return <LabSuppliers />;
        case 'ESTOQUE_MATERIA_PRIMA':
          return <LabStock />;
        case 'CERTIFICADOS':
          return <LabCertificates />;
        case 'BIBLIOTECA_GENETICAS':
          return <GeneticsLibraryBridge />;
        default:
          return <LabSuppliers />;
      }
    }

    return <ExtractionAlcoolGeloSeco />;
  };

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-800">
      {/* Top Header */}
      <Header />

      {/* Top Sub-Session Navigation Bar */}
      <Navigation />

      {/* Notification Toast */}
      {notificationMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce print:hidden">
          <div className="bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-lg shadow-2xl text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Main View Container with Responsive / Device Simulator Modes */}
      <main
        className={`flex-1 w-full mx-auto transition-all duration-200 ${
          layoutMode === 'MOBILE'
            ? 'max-w-md px-3 py-4 shadow-xl my-3 rounded-2xl border border-slate-200/80 bg-white'
            : layoutMode === 'TABLET'
            ? 'max-w-3xl px-4 py-5 shadow-lg my-3 rounded-xl border border-slate-200/80 bg-white'
            : 'max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-5'
        } pb-36 sm:pb-44 md:pb-52 lg:pb-60 print:max-w-none print:w-full print:p-0 print:m-0 print:shadow-none print:border-none print:rounded-none print:bg-white`}
      >
        {layoutMode !== 'AUTO' && (
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center justify-between print:hidden">
            <span>Modo de visualização: <strong>{layoutMode === 'MOBILE' ? 'Celular / Smartphone' : layoutMode === 'TABLET' ? 'Tablet / iPad' : 'Desktop Amplo'}</strong></span>
            <span className="text-[10px] font-mono opacity-80">{layoutMode === 'MOBILE' ? 'max-w: 448px' : layoutMode === 'TABLET' ? 'max-w: 768px' : 'max-w: 1280px'}</span>
          </div>
        )}
        {renderActiveView()}

        {/* Dedicated Desktop & Mobile Bottom Safe Area Spacer */}
        <div className="h-16 sm:h-20 md:h-24 w-full pointer-events-none print:hidden" aria-hidden="true" />
      </main>

      {/* Bottom Main Session Navigation Bar */}
      <BottomSessionBar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
