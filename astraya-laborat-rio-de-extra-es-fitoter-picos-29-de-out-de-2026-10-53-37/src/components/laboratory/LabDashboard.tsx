import React from 'react';
import {
  Activity,
  FlaskConical,
  Package,
  FileCheck2,
  Truck,
  Dna,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LabDashboard: React.FC = () => {
  const {
    alcoolGeloSecoList,
    rosinList,
    iceolatorList,
    dryIceList,
    alcoolTinturaList,
    diluicaoEnvaseList,
    tcheckList,
    geneticsLibrary,
    setActiveSession,
    setActiveSubSession,
  } = useApp();

  // Metrics calculations
  const totalExtracoes =
    alcoolGeloSecoList.length +
    rosinList.length +
    iceolatorList.length +
    dryIceList.length +
    alcoolTinturaList.length;

  const totalEnvasesFrascos = diluicaoEnvaseList.reduce(
    (acc, curr) => acc + (Number(curr.quantidadeFrascos) || 0),
    0
  );

  const totalVolumePreparadoMl = diluicaoEnvaseList.reduce(
    (acc, curr) => acc + (Number(curr.volumeTotalPreparadoMl) || 0),
    0
  );

  // Top Cultivars
  const sortedCultivars = [...geneticsLibrary].sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif italic text-slate-800 font-normal">
                Painel Central do Laboratório ASTRAYA
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Visão Geral & Rastreabilidade
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Indicadores de produção fitoquímica, rendimentos comparativos, frascos envazados e integração com a Biblioteca de Genéticas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Operacional</span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Laboratório 100% Operacional
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Hub to Lab Subsections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setActiveSession('LABORATORIO');
            setActiveSubSession('ESTOQUE');
          }}
          className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-lg text-left transition-colors group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight mb-0.5">Controle de Estoque</h3>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            Matérias-primas secas, solventes, carreador TCM, vidrarias e frascos
          </p>
        </button>

        <button
          onClick={() => {
            setActiveSession('LABORATORIO');
            setActiveSubSession('CERTIFICADOS');
          }}
          className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-lg text-left transition-colors group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight mb-0.5">Certificados & COAs</h3>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            Laudos HPLC externos, análise microbiológica e pureza
          </p>
        </button>

        <button
          onClick={() => {
            setActiveSession('LABORATORIO');
            setActiveSubSession('FORNECEDORES');
          }}
          className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-lg text-left transition-colors group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight mb-0.5">Fornecedores</h3>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            Parceiros homologados para insumos e equipamentos laboratoriais
          </p>
        </button>

        <button
          onClick={() => {
            setActiveSession('LABORATORIO');
            setActiveSubSession('BIBLIOTECA_GENETICAS');
          }}
          className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-lg text-left transition-colors group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
              <Dna className="w-4 h-4 text-amber-600" />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight mb-0.5">Biblioteca de Genéticas</h3>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            Interligação de cultivares e avaliações de rendimento sincronizadas
          </p>
        </button>
      </div>

      {/* Production KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Lotes de Extração</span>
            <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalExtracoes}</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Distribuídos em 5 métodos</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Frascos Envazados</span>
            <Package className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono">{totalEnvasesFrascos} frascos</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">{totalVolumePreparadoMl} mL formulados</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Laudos T-Check</span>
            <Activity className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-800 font-mono">{tcheckList.length} laudos</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Espectrofotometria UV</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Genéticas Indexadas</span>
            <Dna className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800 font-mono">{geneticsLibrary.length} cultivares</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Interligadas à plataforma</span>
        </div>
      </div>

      {/* Production by Extraction Type Table Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            <span>Volume de Produção por Linha de Extração</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <div>
                  <span className="font-bold text-slate-800">Álcool + Gelo Seco (Solvente Criogênico)</span>
                  <p className="text-[10px] text-slate-500">Lavagem rápida etílica a -20°C</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 text-xs">{alcoolGeloSecoList.length} lotes</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div>
                  <span className="font-bold text-slate-800">Extração Rosin (Solventless)</span>
                  <p className="text-[10px] text-slate-500">Prensagem térmica e pressão mecânica hidráulica</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 text-xs">{rosinList.length} lotes</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <span className="font-bold text-slate-800">Ice-O-Lator (Bubble Hash)</span>
                  <p className="text-[10px] text-slate-500">Separação em água gelada e bolsas de micronagem</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 text-xs">{iceolatorList.length} lotes</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <div>
                  <span className="font-bold text-slate-800">Extração Dry Ice (Kief Mecânico)</span>
                  <p className="text-[10px] text-slate-500">Separação mecânica a seco com CO₂ sólido</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 text-xs">{dryIceList.length} lotes</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <div>
                  <span className="font-bold text-slate-800">Álcool Tintura (Maceração)</span>
                  <p className="text-[10px] text-slate-500">Maceração alcoólica estendida de fitoterápicos</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 text-xs">{alcoolTinturaList.length} lotes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Cultivars by Extraction Yield */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Top Eficiência de Extração</span>
            </h3>

            <button
              onClick={() => {
                setActiveSession('LABORATORIO');
                setActiveSubSession('BIBLIOTECA_GENETICAS');
              }}
              className="text-[11px] text-emerald-700 hover:underline font-semibold"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {sortedCultivars.slice(0, 5).map((cultivar) => (
              <div
                key={cultivar.id}
                className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 text-xs">{cultivar.name}</span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono">
                      {cultivar.primaryMolecule}
                    </span>
                    <span>{cultivar.extractionHistoryCount} extrações</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-0.5 text-amber-700 font-bold justify-end font-mono">
                    <span>{cultivar.averageScore.toFixed(1)}</span>
                    <span className="text-xs">★</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold font-mono block">
                    {cultivar.averageYieldPercent}% rend.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
