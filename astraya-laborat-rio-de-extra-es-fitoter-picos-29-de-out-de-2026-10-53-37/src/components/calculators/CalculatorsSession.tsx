import React, { useState } from 'react';
import {
  Scale,
  Droplet,
  Flame,
  Info,
} from 'lucide-react';
import { CalculadoraDosagemPesagemAstraya } from './CalculadoraDosagemPesagemAstraya';

export const CalculatorsSession: React.FC = () => {
  // Calculator 1: Rendimento de Extração
  const [materiaSeca, setMateriaSeca] = useState<number>(200);
  const [resinaObtida, setResinaObtida] = useState<number>(24);

  const rendimentoPorcentagem = materiaSeca > 0 ? (resinaObtida / materiaSeca) * 100 : 0;
  const gramasPorKg = materiaSeca > 0 ? (resinaObtida / materiaSeca) * 1000 : 0;

  // Calculator 2: Diluição Magistral Farmacêutica
  const [concentracaoAlvoMgMl, setConcentracaoAlvoMgMl] = useState<number>(100);
  const [volumePorFrasco, setVolumePorFrasco] = useState<number>(30);
  const [quantidadeFrascos, setQuantidadeFrascos] = useState<number>(20);
  const potenciaExtratoPorcento = 100; // Constante fixa em 100% de pureza/potência do extrato

  const volumeTotalMl = volumePorFrasco * quantidadeFrascos;
  const massaTotalCanabinoideNecessariaMg = volumeTotalMl * concentracaoAlvoMgMl;
  const massaResinaBrutaNecessariaG =
    potenciaExtratoPorcento > 0
      ? (massaTotalCanabinoideNecessariaMg / (potenciaExtratoPorcento * 10))
      : 0;
  const volumeVeiculoCarreadorMl = Math.max(0, volumeTotalMl - massaResinaBrutaNecessariaG);
  const massaResinaBrutaPorFrascoG = quantidadeFrascos > 0 ? massaResinaBrutaNecessariaG / quantidadeFrascos : 0;
  const mgPorFrasco = volumePorFrasco * concentracaoAlvoMgMl;
  const mgPorGota30 = (mgPorFrasco / (volumePorFrasco * 30)); // ~30 gotas por mL

  // Calculator 3: Descarboxilação Estequiométrica (Fator 0.877)
  const [thcaOuCbda, setThcaOuCbda] = useState<number>(18.5);
  const [eficienciaForno, setEficienciaForno] = useState<number>(90); // 90% de conversão sem degradação

  const neutralPotencyMax = thcaOuCbda * 0.877;
  const neutralPotencyReal = neutralPotencyMax * (eficienciaForno / 100);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-serif italic text-slate-800 font-normal">
            Calculadoras Farmacotécnicas Especializadas
          </h1>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Padrão ASTRAYA
          </span>
        </div>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Ferramentas de precisão para cálculo de rendimento, diluição em TCM/Azeite, posologia em gotas e descarboxilação estequiométrica
        </p>
      </div>

      {/* Astraya Official Dosage & Weighing Calculator */}
      <CalculadoraDosagemPesagemAstraya />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Calculator 1: Rendimento de Extração */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>1. Calculadora de Rendimento de Extração</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                MATÉRIA SECA INICIAL (g)
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={materiaSeca}
                onChange={(e) => setMateriaSeca(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                RESINA / EXTRATO OBTIDO (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={resinaObtida}
                onChange={(e) => setResinaObtida(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Results Block */}
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 grid grid-cols-2 gap-3 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Rendimento Real
              </span>
              <span className="text-2xl font-bold text-emerald-700 font-mono">
                {rendimentoPorcentagem.toFixed(2)}%
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Eficiência / Proporção
              </span>
              <span className="text-xl font-bold text-slate-800 font-mono">
                {gramasPorKg.toFixed(1)} g / kg
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded border border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Valores médios: Rosin (12-22%), Álcool/Gelo Seco (8-16%), Iceolator (10-18%).
            </span>
          </div>
        </div>

        {/* Calculator 3: Descarboxilação Estequiométrica */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>2. Descarboxilação & Conversão Estequiométrica</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                TEOR INICIAL THCA OU CBDA (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={thcaOuCbda}
                onChange={(e) => setThcaOuCbda(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                EFICIÊNCIA TÉRMICA DO FORNO (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={eficienciaForno}
                onChange={(e) => setEficienciaForno(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Results Block */}
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 grid grid-cols-2 gap-3 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Potencial Teórico Neutro
              </span>
              <span className="text-xl font-bold text-slate-700 font-mono">
                {neutralPotencyMax.toFixed(2)}%
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Canabinoide Ativo Estimado
              </span>
              <span className="text-2xl font-bold text-amber-700 font-mono">
                {neutralPotencyReal.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded border border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Fator estequiométrico oficial: <strong className="text-slate-800 font-mono">x 0.877</strong> devido à perda de CO₂.
            </span>
          </div>
        </div>
      </div>

      {/* Calculator 2: Diluição Magistral Farmacêutica (Full Width) */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
          <Droplet className="w-4 h-4 text-teal-600" />
          <span>3. Calculadora de Formulação Magistral, Diluição & Dosagem por Gota</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              CONCENTRAÇÃO ALVO (mg/mL)
            </label>
            <input
              type="number"
              min="1"
              value={concentracaoAlvoMgMl}
              onChange={(e) => setConcentracaoAlvoMgMl(Number(e.target.value))}
              placeholder="Ex: 100 mg/mL (10%)"
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              VOLUME POR FRASCO (mL)
            </label>
            <select
              value={volumePorFrasco}
              onChange={(e) => setVolumePorFrasco(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            >
              <option value={10}>10 mL</option>
              <option value={15}>15 mL</option>
              <option value={30}>30 mL (Padrão ASTRAYA)</option>
              <option value={50}>50 mL</option>
              <option value={100}>100 mL</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              QUANTIDADE DE FRASCOS
            </label>
            <input
              type="number"
              min="1"
              value={quantidadeFrascos}
              onChange={(e) => setQuantidadeFrascos(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        {/* Big Formula Calculation Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
              Extrato Bruto Necessário
            </span>
            <span className="text-2xl font-bold text-emerald-700 font-mono">
              {massaResinaBrutaNecessariaG.toFixed(2)} g
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Para {massaTotalCanabinoideNecessariaMg.toLocaleString()} mg ativos
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
              Quantidade de extrato por frasco
            </span>
            <span className="text-2xl font-bold text-teal-700 font-mono">
              {massaResinaBrutaPorFrascoG.toFixed(2)} g
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {(massaResinaBrutaPorFrascoG * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} mg / frasco
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
              Veículo Carreador (TCM)
            </span>
            <span className="text-2xl font-bold text-slate-800 font-mono">
              {volumeVeiculoCarreadorMl.toFixed(1)} mL
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Volume total: {volumeTotalMl} mL
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
              Dose por Frasco ({volumePorFrasco}mL)
            </span>
            <span className="text-2xl font-bold text-amber-700 font-mono">
              {mgPorFrasco.toLocaleString()} mg
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {concentracaoAlvoMgMl} mg / mL
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
              Dose por Gota Estimada
            </span>
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {mgPorGota30.toFixed(2)} mg
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Base: 30 gotas = 1 mL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
