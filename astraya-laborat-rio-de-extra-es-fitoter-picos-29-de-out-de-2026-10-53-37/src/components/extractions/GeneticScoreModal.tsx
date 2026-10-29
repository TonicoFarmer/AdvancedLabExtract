import React, { useState } from 'react';
import { Star, X, Check, Dna } from 'lucide-react';
import { GeneticYieldRating, ExtractionType } from '../../types';

interface GeneticScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  cultivarName: string;
  extractionType: ExtractionType;
  recordId: string;
  initialRating?: GeneticYieldRating;
  onSave: (rating: GeneticYieldRating) => void;
}

export const GeneticScoreModal: React.FC<GeneticScoreModalProps> = ({
  isOpen,
  onClose,
  cultivarName,
  extractionType,
  recordId,
  initialRating,
  onSave,
}) => {
  if (!isOpen) return null;

  const getExtractionCategory = (type: ExtractionType): GeneticYieldRating['extractionCategory'] => {
    switch (type) {
      case 'DRY_ICE':
        return 'Dry Ice (Gelo Seco)';
      case 'ICEOLATOR':
        return 'Ice Hash';
      case 'ALCOOL_GELO_SECO':
        return 'Gelo Seco + Álcool';
      case 'ALCOOL_TINTURA':
        return 'Álcool Tintura';
      case 'ROSIN':
        return 'Rosin';
      default:
        return 'Gelo Seco + Álcool';
    }
  };

  const defaultCategory = getExtractionCategory(extractionType);

  const [score, setScore] = useState<number>(initialRating?.score || 5);
  const [yieldCategory, setYieldCategory] = useState<GeneticYieldRating['yieldCategory']>(
    initialRating?.yieldCategory || 'Alto (12-18%)'
  );
  const [trichomeQuality, setTrichomeQuality] = useState<GeneticYieldRating['trichomeQuality']>(
    initialRating?.trichomeQuality || 'Excelente'
  );
  const [notes, setNotes] = useState<string>(initialRating?.notes || '');
  const [ratedBy, setRatedBy] = useState<string>(initialRating?.ratedBy || 'Farmacêutico ASTRAYA');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const rating: GeneticYieldRating = {
      id: initialRating?.id || `gen-rat-${Date.now()}`,
      cultivarName,
      extractionCategory: defaultCategory,
      score,
      yieldCategory,
      trichomeQuality,
      notes,
      ratedAt: new Date().toLocaleDateString('pt-BR'),
      ratedBy: ratedBy.trim() || 'Farmacêutico ASTRAYA',
    };
    onSave(rating);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Dna className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Classificação de Rendimento Genético
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Sincronização Direta com Biblioteca de Genéticas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Target Genotype Info */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Cultivar / Genética
              </span>
              <span className="text-sm font-bold text-slate-900">{cultivarName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Método Vinculado
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {defaultCategory}
              </span>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">
              Pontuação de Rendimento & Tricomas (1 a 5 Estrelas)
            </label>
            <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setScore(star)}
                  className="transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= score
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-300 hover:text-slate-400'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-auto font-mono">
                {score === 5 && 'Excepcional (5/5)'}
                {score === 4 && 'Muito Bom (4/5)'}
                {score === 3 && 'Médio / Satisfatório (3/5)'}
                {score === 2 && 'Baixo Rendimento (2/5)'}
                {score === 1 && 'Insatisfatório (1/5)'}
              </span>
            </div>
          </div>

          {/* Yield Category & Trichome Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Faixa de Rendimento
              </label>
              <select
                value={yieldCategory}
                onChange={(e) => setYieldCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="Excepcional (>18%)">Excepcional (&gt;18%)</option>
                <option value="Alto (12-18%)">Alto (12-18%)</option>
                <option value="Médio (8-12%)">Médio (8-12%)</option>
                <option value="Baixo (<8%)">Baixo (&lt;8%)</option>
                <option value="Experimental">Experimental / Em Teste</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Qualidade / Maturação Tricomas
              </label>
              <select
                value={trichomeQuality}
                onChange={(e) => setTrichomeQuality(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="Excelente">Excelente (Glândulas intactas / Âmbar 10-20%)</option>
                <option value="Bom">Bom (Leitoso uniforme)</option>
                <option value="Regular">Regular (Misto / Presença de clorofila)</option>
              </select>
            </div>
          </div>

          {/* Evaluator Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              Observações Fitoquímicas & Comportamento
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Cabeças de tricoma de fácil separação no gelo, alta viscosidade..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none placeholder-slate-400"
            />
          </div>

          {/* Rated By */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              Avaliador / Farmacêutico
            </label>
            <input
              type="text"
              value={ratedBy}
              onChange={(e) => setRatedBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 uppercase transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-bold uppercase text-white shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar e Sincronizar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
