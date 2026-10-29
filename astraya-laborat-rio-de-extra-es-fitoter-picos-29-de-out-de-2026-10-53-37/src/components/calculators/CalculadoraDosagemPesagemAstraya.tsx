import React, { useState } from 'react';
import { Scale, Sparkles, Droplets, Flame, X } from 'lucide-react';

interface CalculadoraDosagemPesagemAstrayaProps {
  onClose?: () => void;
  isClosable?: boolean;
  className?: string;
}

export const CalculadoraDosagemPesagemAstraya: React.FC<CalculadoraDosagemPesagemAstrayaProps> = ({
  onClose,
  isClosable = false,
  className = '',
}) => {
  const [calcFormulaTipo, setCalcFormulaTipo] = useState<
    'CBD_YGRIEGA' | 'THC_MELON' | 'HIBRIDO' | 'DERMATOLOGICO_13' | 'CREME_17' | 'POMADA_18'
  >('CBD_YGRIEGA');
  const [calcVolumeFrascos, setCalcVolumeFrascos] = useState<number>(1);
  const [calcConcentracaoAlvo, setCalcConcentracaoAlvo] = useState<string>('1500mg');

  return (
    <div
      className={`bg-emerald-900 text-white rounded-lg p-4 shadow-lg border border-emerald-800 animate-fadeIn ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-300" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Calculadora de Dosagem & Pesagem em Extrações - Astraya
          </h3>
        </div>
        {isClosable && onClose && (
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-emerald-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Fechar</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 text-xs">
        <div>
          <label className="block text-emerald-300 uppercase text-[10px] font-bold mb-1">
            Fórmula / Cepa:
          </label>
          <select
            value={calcFormulaTipo}
            onChange={(e) => setCalcFormulaTipo(e.target.value as any)}
            className="w-full bg-emerald-950 border border-emerald-700 rounded p-1.5 text-white font-semibold outline-none focus:border-emerald-400"
          >
            <option value="CBD_YGRIEGA">Alto CBD (Ygriega 2.0) - Via Oral 30mL</option>
            <option value="THC_MELON">Alto THC (Tha Melon) - Via Oral 30mL</option>
            <option value="HIBRIDO">Óleo Híbrido CBD:THC - Via Oral 30mL</option>
            <option value="DERMATOLOGICO_13">Óleo de Massagem (Cód. 13 - 60mL)</option>
            <option value="CREME_17">Creme Hidratante (Cód. 17 - 50g)</option>
            <option value="POMADA_18">Pomada Transdérmica (Cód. 18 - 30g)</option>
          </select>
        </div>

        <div>
          <label className="block text-emerald-300 uppercase text-[10px] font-bold mb-1">
            Concentração Alvo:
          </label>
          <select
            value={calcConcentracaoAlvo}
            onChange={(e) => setCalcConcentracaoAlvo(e.target.value)}
            className="w-full bg-emerald-950 border border-emerald-700 rounded p-1.5 text-white font-semibold outline-none focus:border-emerald-400"
          >
            <option value="700mg">700 mg (~23 mg/mL)</option>
            <option value="1500mg">1.500 mg (50 mg/mL)</option>
            <option value="3000mg">3.000 mg (100 mg/mL)</option>
          </select>
        </div>

        <div>
          <label className="block text-emerald-300 uppercase text-[10px] font-bold mb-1">
            Qtd. de Frascos / Unidades:
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={calcVolumeFrascos}
            onChange={(e) => setCalcVolumeFrascos(Math.max(1, Number(e.target.value)))}
            className="w-full bg-emerald-950 border border-emerald-700 rounded p-1.5 text-white font-mono font-bold outline-none focus:border-emerald-400"
          />
        </div>

        <div className="bg-emerald-950/90 p-2.5 rounded border border-emerald-700/80 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Resina Estimada Requerida:</span>
          </span>
          <div className="text-base font-bold text-emerald-200 font-mono mt-0.5">
            {calcFormulaTipo === 'CBD_YGRIEGA' && (
              calcConcentracaoAlvo === '700mg'
                ? `${(0.513 * calcVolumeFrascos).toFixed(3)} g de Resina`
                : calcConcentracaoAlvo === '1500mg'
                ? `${(1.1 * calcVolumeFrascos).toFixed(2)} g de Resina`
                : `${(2.23 * calcVolumeFrascos).toFixed(2)} g de Resina`
            )}
            {calcFormulaTipo === 'THC_MELON' && (
              calcConcentracaoAlvo === '700mg'
                ? `${(0.493 * calcVolumeFrascos).toFixed(3)} g de Resina`
                : calcConcentracaoAlvo === '1500mg'
                ? `${(1.04 * calcVolumeFrascos).toFixed(2)} g de Resina`
                : `${(2.0 * calcVolumeFrascos).toFixed(2)} g de Resina`
            )}
            {calcFormulaTipo === 'HIBRIDO' && `${(1.0 * calcVolumeFrascos).toFixed(2)} g (0.5g CBD + 0.5g THC)`}
            {calcFormulaTipo === 'DERMATOLOGICO_13' && `${(2.0 * calcVolumeFrascos).toFixed(1)} mL de Extrato Descarb.`}
            {calcFormulaTipo === 'CREME_17' && `${(2.0 * calcVolumeFrascos).toFixed(1)} mL de Extrato Descarb.`}
            {calcFormulaTipo === 'POMADA_18' && `${(1.8 * calcVolumeFrascos).toFixed(1)} g de Extrato em TCM`}
          </div>
          <span className="text-[9.5px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
            <Droplets className="w-2.5 h-2.5" />
            <span>TCM veículo: {calcVolumeFrascos * 30} mL • Descarb: 95°C / 35min</span>
          </span>
        </div>
      </div>
    </div>
  );
};
