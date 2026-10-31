/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Sparkles, Quote, Info, CheckCircle2 } from 'lucide-react';
import { QuranReferenceInfo, ShanENuzulInfo, ExplanationLanguage } from '../types/grammar';
import { TRANSLATIONS } from '../utils/translations';

interface QuranShanENuzulCardProps {
  quranReference?: QuranReferenceInfo;
  shanENuzul?: ShanENuzulInfo;
  language?: ExplanationLanguage;
}

export const QuranShanENuzulCard: React.FC<QuranShanENuzulCardProps> = ({
  quranReference,
  shanENuzul,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language];

  if (!quranReference && !shanENuzul) return null;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Decorative Islamic geometric accent backdrop */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner: Quranic Identification */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-emerald-800/40 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 shrink-0">
            <BookOpen className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-base sm:text-lg text-emerald-300 font-bengali">
                {language === 'bn'
                  ? 'পবিত্র কুরআনুল কারীমের আয়াত শনাক্তকরণ'
                  : language === 'ar'
                  ? 'تم التحقق: آية من القرآن الكريم'
                  : 'Holy Quran Verse Identification'}
              </h3>
            </div>
            {quranReference && (
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="font-amiri text-sm font-semibold text-amber-300" dir="rtl">
                  {quranReference.surahNameArabic}
                </span>
                <span className="text-slate-500">•</span>
                <span className="font-semibold text-slate-200 font-bengali">
                  {quranReference.surahNameBangla || quranReference.surahNameEnglish}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                  {language === 'bn'
                    ? `সূরা নং ${quranReference.surahNumber}, আয়াত নং ${quranReference.ayahNumber}`
                    : `Surah ${quranReference.surahNumber}, Ayah ${quranReference.ayahNumber}`}
                </span>
              </p>
            )}
          </div>
        </div>

        {quranReference && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-200 text-xs font-amiri font-bold" dir="rtl">
            <span>﴿ {quranReference.surahNameArabic} : {quranReference.ayahNumber} ﴾</span>
          </div>
        )}
      </div>

      {/* Ayah Snippet if provided */}
      {quranReference?.ayahSnippetArabic && (
        <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-emerald-800/30 text-center">
          <p className="font-amiri text-xl sm:text-2xl text-emerald-100 leading-loose" dir="rtl">
            ﴿ {quranReference.ayahSnippetArabic} ﴾
          </p>
        </div>
      )}

      {/* শানে নুযূল (Shan-e-Nuzul / Occasion of Revelation) Section */}
      {shanENuzul && (
        <div className="space-y-3.5 relative z-10">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base border-b border-slate-800 pb-2">
            <Quote className="w-4 h-4 text-amber-400 rotate-180" />
            <h4 className="font-bengali">
              {shanENuzul.title || (language === 'bn' ? 'এ আয়াতের শানে নুযূল' : 'Occasion of Revelation (Asbab al-Nuzul)')}
            </h4>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 ml-auto font-normal font-bengali hidden sm:inline-block">
              তাফসীরভিত্তিক ঐতিহাসিক প্রেক্ষাপট
            </span>
          </div>

          {/* Numbered Narrations list matching the textbook image */}
          {shanENuzul.narrations && shanENuzul.narrations.length > 0 ? (
            <div className="space-y-3">
              {shanENuzul.narrations.map((narration, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition-all flex items-start gap-3.5 text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-bengali">
                      {narration.text}
                    </p>
                    {narration.source && (
                      <span className="inline-block text-xs font-semibold text-amber-400/90 font-bengali bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 mt-1">
                        সূত্র: {narration.source}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : shanENuzul.generalContext ? (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-sm leading-relaxed font-bengali">
              {shanENuzul.generalContext}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
};
