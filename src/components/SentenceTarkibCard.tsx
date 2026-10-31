/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GitBranch, Layers, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { TarkibInfo, ExplanationLanguage } from '../types/grammar';
import { TRANSLATIONS } from '../utils/translations';

interface SentenceTarkibCardProps {
  tarkib: TarkibInfo;
  language?: ExplanationLanguage;
}

export const SentenceTarkibCard: React.FC<SentenceTarkibCardProps> = ({
  tarkib,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language];

  if (!tarkib) return null;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 p-5 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 shrink-0">
            <GitBranch className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-amiri text-lg sm:text-xl font-bold text-amber-300" dir="rtl">
                {tarkib.title || 'تَرْكِيبُ الْجُمْلَة'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bengali">
                {language === 'bn' ? 'তারকীবুল জুমলাহ' : 'Sentence Syntax Compounding'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-bengali">
              {language === 'bn'
                ? 'দারসে নিজামী পদ্ধতিতে বাক্যের প্রতিটি খণ্ড ও অন্বয়ের সমন্বয়'
                : 'Classical syntactic compounding & clause tree structure'}
            </p>
          </div>
        </div>

        {tarkib.finalSentenceType && (
          <span className="px-3 py-1 rounded-xl bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-semibold font-amiri" dir="rtl">
            {tarkib.finalSentenceType}
          </span>
        )}
      </div>

      {/* 1. Step-by-Step Word / Particle Tarkib Roles */}
      {tarkib.breakdownSteps && tarkib.breakdownSteps.length > 0 && (
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-bengali">
            {language === 'bn' ? 'খণ্ডভিত্তিক তারকীব:' : 'Component-Level Syntax Assignment:'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {tarkib.breakdownSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-200 font-bengali">
                    {step.roleText}
                  </span>
                </div>
                <span className="font-amiri text-lg font-bold text-amber-300 shrink-0 px-2 py-0.5 rounded bg-slate-900 border border-slate-800" dir="rtl">
                  {step.token}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Synthesis compounding box (যেমন বইয়ের ফটোতে: অতঃপর ফেল, ফায়েল ও মাফঊল মিলে جملة فعلية হয়ে...) */}
      {tarkib.synthesisText && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 border border-amber-500/40 relative overflow-hidden">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2 font-bengali">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'পূর্ণাঙ্গ তারকীব সংশ্লেষণ ও সিদ্ধান্ত:' : 'Compound Syntactic Synthesis:'}</span>
          </div>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed font-bengali font-medium">
            {tarkib.synthesisText}
          </p>
        </div>
      )}
    </section>
  );
};
