/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SentenceClauseIrab, ExplanationLanguage } from '../types/grammar';
import { GitCommit } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface SentenceClausesViewProps {
  clauses?: SentenceClauseIrab[];
  language?: ExplanationLanguage;
}

export const SentenceClausesView: React.FC<SentenceClausesViewProps> = ({
  clauses,
  language = 'en',
}) => {
  if (!clauses || clauses.length === 0) return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <GitCommit className="w-4 h-4 text-amber-400" />
        <h3 className="font-semibold text-sm text-slate-200">
          {t.clauseTitle}
        </h3>
      </div>

      <div className="space-y-3">
        {clauses.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-amiri text-lg font-bold text-amber-300" dir="rtl">
                  «{item.clause}»
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.clauseType}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {item.reason}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium border ${
                  item.hasPosition
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700'
                }`}
              >
                {item.hasPosition ? t.hasPosition : t.noPosition}
              </span>
              <span className="text-xs text-amber-300 font-semibold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                {item.irabPosition}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
