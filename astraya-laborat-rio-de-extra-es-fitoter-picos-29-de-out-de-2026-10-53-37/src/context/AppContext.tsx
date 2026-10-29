import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ExtractionAlcoolGeloSecoRecord,
  ExtractionRosinRecord,
  ExtractionAlcoolTinturaRecord,
  ExtractionDryIceRecord,
  ExtractionIceolatorRecord,
  DiluicaoEnvaseRecord,
  TCheckRecord,
  ScientificStudy,
  StandardOperatingProcedure,
  FornecedorInsumo,
  CertificadoLaboratorio,
  LabStockItem,
  LabCertificate,
  LabSupplier,
  CultivarGenetics,
  GeneticYieldRating,
  ExtractionType,
} from '../types';
import {
  initialAlcoolGeloSeco,
  initialRosin,
  initialAlcoolTintura,
  initialDryIce,
  initialIceolator,
  initialDiluicaoEnvase,
  initialTCheckRecords,
  initialStudies,
  initialPOPs,
  initialFornecedores,
  initialCertificados,
  initialStock,
  initialGenetics,
} from '../data/initialData';

export type MainSession = 'EXTRACOES' | 'BIBLIOTECA' | 'TCHECK_CALC' | 'LABORATORIO';

export type LayoutMode = 'AUTO' | 'MOBILE' | 'TABLET' | 'DESKTOP';

export type ExtracoesSubTab = 
  | 'ALCOOL_GELO_SECO'
  | 'ROSIN'
  | 'ALCOOL_TINTURA'
  | 'DRY_ICE'
  | 'ICEOLATOR'
  | 'DILUICAO_ENVASE';

export type BibliotecaSubTab = 
  | 'PESQUISA_ESTUDO'
  | 'ESTUDOS_CANNABIS'
  | 'POP'
  | 'FITOTERAPIA';

export type TCheckSubTab = 
  | 'CALCULADORAS'
  | 'REGISTROS_TCHECK';

export type LaboratorioSubTab = 
  | 'DASHBOARD'
  | 'FORNECEDORES_INSUMOS'
  | 'ESTOQUE_MATERIA_PRIMA'
  | 'CERTIFICADOS'
  | 'BIBLIOTECA_GENETICAS';

interface AppContextType {
  // Navigation
  activeSession: MainSession;
  setActiveSession: (session: MainSession) => void;
  activeExtracoesTab: ExtracoesSubTab;
  setActiveExtracoesTab: (tab: ExtracoesSubTab) => void;
  activeBibliotecaTab: BibliotecaSubTab;
  setActiveBibliotecaTab: (tab: BibliotecaSubTab) => void;
  activeTCheckTab: TCheckSubTab;
  setActiveTCheckTab: (tab: TCheckSubTab) => void;
  activeLabTab: LaboratorioSubTab;
  setActiveLabTab: (tab: LaboratorioSubTab) => void;

  // Responsive Layout Mode
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;

  // Data sets
  alcoolGeloSecoList: ExtractionAlcoolGeloSecoRecord[];
  setAlcoolGeloSecoList: React.Dispatch<React.SetStateAction<ExtractionAlcoolGeloSecoRecord[]>>;
  rosinList: ExtractionRosinRecord[];
  setRosinList: React.Dispatch<React.SetStateAction<ExtractionRosinRecord[]>>;
  alcoolTinturaList: ExtractionAlcoolTinturaRecord[];
  setAlcoolTinturaList: React.Dispatch<React.SetStateAction<ExtractionAlcoolTinturaRecord[]>>;
  dryIceList: ExtractionDryIceRecord[];
  setDryIceList: React.Dispatch<React.SetStateAction<ExtractionDryIceRecord[]>>;
  iceolatorList: ExtractionIceolatorRecord[];
  setIceolatorList: React.Dispatch<React.SetStateAction<ExtractionIceolatorRecord[]>>;
  diluicaoEnvaseList: DiluicaoEnvaseRecord[];
  setDiluicaoEnvaseList: React.Dispatch<React.SetStateAction<DiluicaoEnvaseRecord[]>>;
  tcheckList: TCheckRecord[];
  setTcheckList: React.Dispatch<React.SetStateAction<TCheckRecord[]>>;
  studiesList: ScientificStudy[];
  setStudiesList: React.Dispatch<React.SetStateAction<ScientificStudy[]>>;
  popsList: StandardOperatingProcedure[];
  setPopsList: React.Dispatch<React.SetStateAction<StandardOperatingProcedure[]>>;
  fornecedoresList: FornecedorInsumo[];
  setFornecedoresList: React.Dispatch<React.SetStateAction<FornecedorInsumo[]>>;
  certificadosList: CertificadoLaboratorio[];
  setCertificadosList: React.Dispatch<React.SetStateAction<CertificadoLaboratorio[]>>;

  // Laboratory Extras
  stockList: LabStockItem[];
  setStockList: React.Dispatch<React.SetStateAction<LabStockItem[]>>;
  suppliersList: LabSupplier[];
  setSuppliersList: React.Dispatch<React.SetStateAction<LabSupplier[]>>;
  certificatesList: LabCertificate[];
  setCertificatesList: React.Dispatch<React.SetStateAction<LabCertificate[]>>;
  geneticsLibrary: CultivarGenetics[];
  setGeneticsLibrary: React.Dispatch<React.SetStateAction<CultivarGenetics[]>>;

  // Genetic library synchronization & rating
  rateGeneticRecord: (
    type: ExtractionType,
    recordId: string,
    rating: GeneticYieldRating
  ) => void;
  allGeneticRatings: GeneticYieldRating[];

  // Helpers
  resetToDefaultData: () => void;
  notificationMessage: string | null;
  setNotificationMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ALCOOL_GELO_SECO: 'astraya_lab_alcool_gelo_seco_v6',
  ROSIN: 'astraya_lab_rosin_v6',
  ALCOOL_TINTURA: 'astraya_lab_alcool_tintura_v6',
  DRY_ICE: 'astraya_lab_dry_ice_v6',
  ICEOLATOR: 'astraya_lab_iceolator_v6',
  DILUICAO_ENVASE: 'astraya_lab_diluicao_envase_v6_199_full',
  TCHECK: 'astraya_lab_tcheck_v6',
  STUDIES: 'astraya_lab_studies_v6',
  POPS: 'astraya_lab_pops_v6',
  FORNECEDORES: 'astraya_lab_fornecedores_v6',
  CERTIFICADOS: 'astraya_lab_certificados_v6',
  STOCK: 'astraya_lab_stock_v6',
  GENETICS: 'astraya_lab_genetics_v6',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeSession, setActiveSession] = useState<MainSession>('EXTRACOES');
  const [activeExtracoesTab, setActiveExtracoesTab] = useState<ExtracoesSubTab>('ALCOOL_GELO_SECO');
  const [activeBibliotecaTab, setActiveBibliotecaTab] = useState<BibliotecaSubTab>('PESQUISA_ESTUDO');
  const [activeTCheckTab, setActiveTCheckTab] = useState<TCheckSubTab>('CALCULADORAS');
  const [activeLabTab, setActiveLabTab] = useState<LaboratorioSubTab>('FORNECEDORES_INSUMOS');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('AUTO');

  // Notifications
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Initialize data from localStorage or fallback to initial sets
  const [alcoolGeloSecoList, setAlcoolGeloSecoList] = useState<ExtractionAlcoolGeloSecoRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALCOOL_GELO_SECO);
      return saved ? JSON.parse(saved) : initialAlcoolGeloSeco;
    } catch {
      return initialAlcoolGeloSeco;
    }
  });

  const [rosinList, setRosinList] = useState<ExtractionRosinRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROSIN);
      return saved ? JSON.parse(saved) : initialRosin;
    } catch {
      return initialRosin;
    }
  });

  const [alcoolTinturaList, setAlcoolTinturaList] = useState<ExtractionAlcoolTinturaRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALCOOL_TINTURA);
      return saved ? JSON.parse(saved) : initialAlcoolTintura;
    } catch {
      return initialAlcoolTintura;
    }
  });

  const [dryIceList, setDryIceList] = useState<ExtractionDryIceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRY_ICE);
      return saved ? JSON.parse(saved) : initialDryIce;
    } catch {
      return initialDryIce;
    }
  });

  const [iceolatorList, setIceolatorList] = useState<ExtractionIceolatorRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ICEOLATOR);
      return saved ? JSON.parse(saved) : initialIceolator;
    } catch {
      return initialIceolator;
    }
  });

  const [diluicaoEnvaseList, setDiluicaoEnvaseList] = useState<DiluicaoEnvaseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DILUICAO_ENVASE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 199) {
          return parsed;
        }
      }
      return initialDiluicaoEnvase;
    } catch {
      return initialDiluicaoEnvase;
    }
  });

  const [tcheckList, setTcheckList] = useState<TCheckRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TCHECK);
      return saved ? JSON.parse(saved) : initialTCheckRecords;
    } catch {
      return initialTCheckRecords;
    }
  });

  const [studiesList, setStudiesList] = useState<ScientificStudy[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDIES);
      return saved ? JSON.parse(saved) : initialStudies;
    } catch {
      return initialStudies;
    }
  });

  const [popsList, setPopsList] = useState<StandardOperatingProcedure[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POPS);
      return saved ? JSON.parse(saved) : initialPOPs;
    } catch {
      return initialPOPs;
    }
  });

  const [fornecedoresList, setFornecedoresList] = useState<FornecedorInsumo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORNECEDORES);
      return saved ? JSON.parse(saved) : initialFornecedores;
    } catch {
      return initialFornecedores;
    }
  });

  const [certificadosList, setCertificadosList] = useState<CertificadoLaboratorio[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICADOS);
      return saved ? JSON.parse(saved) : initialCertificados;
    } catch {
      return initialCertificados;
    }
  });

  const [stockList, setStockList] = useState<LabStockItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK);
      return saved ? JSON.parse(saved) : (initialStock as any);
    } catch {
      return initialStock as any;
    }
  });

  const [suppliersList, setSuppliersList] = useState<LabSupplier[]>(() => {
    return initialFornecedores.map((f) => ({
      id: f.id,
      name: f.nomeEmpresa,
      category: f.categoriaInsumo,
      contactPerson: f.contatoNome,
      phone: f.telefone,
      email: f.email,
      address: f.cidadeEstado,
      productsSupplied: [f.categoriaInsumo],
    }));
  });

  const [certificatesList, setCertificatesList] = useState<LabCertificate[]>(() => {
    return initialCertificados.map((c) => ({
      id: c.id,
      code: c.numeroRegistro,
      title: c.titulo,
      type: 'POTENCIA_HPLC',
      issueDate: c.dataEmissao,
      laboratory: c.emissor,
      cultivarOrLot: 'Geral',
      status: c.status,
      pdfUrl: 'https://drive.google.com/',
      notes: c.categoria,
    }));
  });

  const [geneticsLibrary, setGeneticsLibrary] = useState<CultivarGenetics[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GENETICS);
      return saved ? JSON.parse(saved) : initialGenetics;
    } catch {
      return initialGenetics;
    }
  });

  // Auto-sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALCOOL_GELO_SECO, JSON.stringify(alcoolGeloSecoList));
  }, [alcoolGeloSecoList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROSIN, JSON.stringify(rosinList));
  }, [rosinList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALCOOL_TINTURA, JSON.stringify(alcoolTinturaList));
  }, [alcoolTinturaList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRY_ICE, JSON.stringify(dryIceList));
  }, [dryIceList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ICEOLATOR, JSON.stringify(iceolatorList));
  }, [iceolatorList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DILUICAO_ENVASE, JSON.stringify(diluicaoEnvaseList));
  }, [diluicaoEnvaseList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TCHECK, JSON.stringify(tcheckList));
  }, [tcheckList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(studiesList));
  }, [studiesList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POPS, JSON.stringify(popsList));
  }, [popsList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FORNECEDORES, JSON.stringify(fornecedoresList));
  }, [fornecedoresList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CERTIFICADOS, JSON.stringify(certificadosList));
  }, [certificadosList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stockList));
  }, [stockList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GENETICS, JSON.stringify(geneticsLibrary));
  }, [geneticsLibrary]);

  // Genetic Rating assignment
  const rateGeneticRecord = (
    type: ExtractionType,
    recordId: string,
    rating: GeneticYieldRating
  ) => {
    if (type === 'ALCOOL_GELO_SECO') {
      setAlcoolGeloSecoList((prev) =>
        prev.map((item) => (item.id === recordId ? { ...item, geneticRating: rating } : item))
      );
    } else if (type === 'ROSIN') {
      setRosinList((prev) =>
        prev.map((item) => (item.id === recordId ? { ...item, geneticRating: rating } : item))
      );
    } else if (type === 'ALCOOL_TINTURA') {
      setAlcoolTinturaList((prev) =>
        prev.map((item) => (item.id === recordId ? { ...item, geneticRating: rating } : item))
      );
    } else if (type === 'DRY_ICE') {
      setDryIceList((prev) =>
        prev.map((item) => (item.id === recordId ? { ...item, geneticRating: rating } : item))
      );
    } else if (type === 'ICEOLATOR') {
      setIceolatorList((prev) =>
        prev.map((item) => (item.id === recordId ? { ...item, geneticRating: rating } : item))
      );
    }

    setNotificationMessage(
      `Classificação salva para ${rating.cultivarName} em "${rating.extractionCategory}". Sincronizado com Biblioteca de Genéticas!`
    );
    setTimeout(() => setNotificationMessage(null), 4500);
  };

  // Consolidate all rated genetics across all extractions
  const allGeneticRatings: GeneticYieldRating[] = [
    ...alcoolGeloSecoList.filter((r) => r.geneticRating).map((r) => r.geneticRating!),
    ...rosinList.filter((r) => r.geneticRating).map((r) => r.geneticRating!),
    ...alcoolTinturaList.filter((r) => r.geneticRating).map((r) => r.geneticRating!),
    ...dryIceList.filter((r) => r.geneticRating).map((r) => r.geneticRating!),
    ...iceolatorList.filter((r) => r.geneticRating).map((r) => r.geneticRating!),
  ];

  const resetToDefaultData = () => {
    if (window.confirm('Deseja restaurar todos os dados originais da ASTRAYA?')) {
      setAlcoolGeloSecoList(initialAlcoolGeloSeco);
      setRosinList(initialRosin);
      setAlcoolTinturaList(initialAlcoolTintura);
      setDryIceList(initialDryIce);
      setIceolatorList(initialIceolator);
      setDiluicaoEnvaseList(initialDiluicaoEnvase);
      setTcheckList(initialTCheckRecords);
      setStudiesList(initialStudies);
      setPopsList(initialPOPs);
      setFornecedoresList(initialFornecedores);
      setCertificadosList(initialCertificados);
      setStockList(initialStock as any);
      setGeneticsLibrary(initialGenetics);
      setNotificationMessage('Dados laboratoriais restaurados com sucesso.');
      setTimeout(() => setNotificationMessage(null), 3000);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeSession,
        setActiveSession,
        activeExtracoesTab,
        setActiveExtracoesTab,
        activeBibliotecaTab,
        setActiveBibliotecaTab,
        activeTCheckTab,
        setActiveTCheckTab,
        activeLabTab,
        setActiveLabTab,
        layoutMode,
        setLayoutMode,
        alcoolGeloSecoList,
        setAlcoolGeloSecoList,
        rosinList,
        setRosinList,
        alcoolTinturaList,
        setAlcoolTinturaList,
        dryIceList,
        setDryIceList,
        iceolatorList,
        setIceolatorList,
        diluicaoEnvaseList,
        setDiluicaoEnvaseList,
        tcheckList,
        setTcheckList,
        studiesList,
        setStudiesList,
        popsList,
        setPopsList,
        fornecedoresList,
        setFornecedoresList,
        certificadosList,
        setCertificadosList,
        stockList,
        setStockList,
        suppliersList,
        setSuppliersList,
        certificatesList,
        setCertificatesList,
        geneticsLibrary,
        setGeneticsLibrary,
        rateGeneticRecord,
        allGeneticRatings,
        resetToDefaultData,
        notificationMessage,
        setNotificationMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
