/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';
import { speakArabic } from '../utils/speech';
import { MorphologicalBreakdown, ExplanationLanguage } from '../types/grammar';
import { TRANSLATIONS } from '../utils/translations';

interface InteractiveSentenceBannerProps {
  diacritizedText: string;
  sentenceType: string;
  summary: string;
  words: MorphologicalBreakdown[];
  selectedWordIndex: number | null;
  onSelectWord: (index: number) => void;
  language?: ExplanationLanguage;
  onTranslate?: () => void;
}

export const InteractiveSentenceBanner: React.FC<InteractiveSentenceBannerProps> = ({
  diacritizedText,
  sentenceType,
  summary,
  words,
  selectedWordIndex,
  onSelectWord,
  language = 'en',
  onTranslate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = TRANSLATIONS[language];

  const handlePlay = () => {
    setIsPlaying(true);
    speakArabic(diacritizedText, () => setIsPlaying(false));
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-5 sm:p-7 shadow-xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Meta info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-300">
            {t.vocalizedTextTitle}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30">
            {sentenceType}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onTranslate && (
            <button
              type="button"
              onClick={onTranslate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs transition-colors font-medium font-bengali"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>বাংলা অনুবাদ</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs transition-colors"
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-amber-400' : ''}`} />
            <span>{t.listenAll}</span>
          </button>
        </div>
      </div>

      {/* Interactive Clickable Words in the Sentence */}
      <div className="py-2 flex flex-wrap gap-2.5 sm:gap-3.5 items-center justify-center sm:justify-start" dir="rtl">
        {words.map((w, idx) => {
          const isSelected = selectedWordIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectWord(idx)}
              className={`font-amiri text-2xl sm:text-3xl px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-amber-200 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
              title={`Click to inspect (${w.cleanWord})`}
            >
              {w.word}
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
        <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>{t.clickTokenHint}</span>
      </div>

      {/* Scholarly Overview Summary */}
      {summary && (
        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300 mr-1.5">{t.overallSummary}</span>
            <span>{summary}</span>
          </div>
        </div>
      )}
    </div>
  );
};
