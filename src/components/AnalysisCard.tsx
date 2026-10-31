/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MorphologicalBreakdown, ExplanationLanguage } from '../types/grammar';
import { Volume2, Copy, Check, Sparkles, BookOpen, Layers, GitBranch, ArrowLeftRight } from 'lucide-react';
import { speakArabic } from '../utils/speech';
import { TRANSLATIONS } from '../utils/translations';

interface AnalysisCardProps {
  wordData: MorphologicalBreakdown;
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
  language?: ExplanationLanguage;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  wordData,
  index,
  isSelected = false,
  onSelect,
  language = 'en',
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const t = TRANSLATIONS[language];

  const handleCopy = () => {
    const textToCopy = `
【${wordData.word} - ${wordData.cleanWord}】
${t.tahqiqTitle}:
- ${t.fieldSighah}: ${wordData.sighah}
- ${t.fieldBahath}: ${wordData.bahath}
- ${t.fieldBaab}: ${wordData.baab}
- ${t.fieldMasdar}: ${wordData.masdar} ${wordData.masdarType ? `(${wordData.masdarType})` : ''}
- ${t.fieldMaddah}: ${wordData.maddah || wordData.root}
- ${t.fieldJins}: ${wordData.jins || wordData.rootClassification}
${wordData.meaning ? `- ${t.fieldMeaning}: ${wordData.meaning}\n` : ''}- ${t.fieldMizan}: ${wordData.mizanSarfi}
${wordData.morphophonemicChange ? `- ${t.fieldMorphophonemics} ${wordData.morphophonemicChange}\n` : ''}- ${t.fieldIrabRole}: ${wordData.irabRole}
- ${t.fieldDetailedIrab}: ${wordData.irabFull}
${wordData.subtleNote ? `- ${t.fieldSubtleNote} ${wordData.subtleNote}` : ''}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    speakArabic(wordData.word, () => setIsPlayingAudio(false));
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'فعل':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
      case 'اسم':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/60';
      case 'حرف':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getCaseBadge = (caseType: string) => {
    switch (caseType) {
      case 'مرفوع':
        return 'bg-sky-950/80 text-sky-300 border-sky-800';
      case 'منصوب':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'مجرور':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'مجزوم':
        return 'bg-teal-950/80 text-teal-300 border-teal-800';
      case 'مبني':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl border transition-all duration-200 overflow-hidden text-right ${
        isSelected
          ? 'bg-slate-900/95 border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30'
          : 'bg-slate-900/70 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
      }`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top Banner / Word Showcase */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
            {index + 1}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-amiri text-3xl sm:text-4xl font-bold text-amber-300 tracking-wide" dir="rtl">
                {wordData.word}
              </span>
              {wordData.cleanWord !== wordData.word && (
                <span className="text-slate-500 text-sm font-arabic" dir="rtl">
                  ({wordData.cleanWord})
                </span>
              )}
            </div>
            {wordData.subType && (
              <span className="text-xs text-slate-400 mt-0.5 inline-block">
                {wordData.subType}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Part of Speech Badge */}
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeBadge(wordData.wordType)}`}>
            {wordData.wordType}
          </span>

          {/* Grammatical State Badge */}
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCaseBadge(wordData.irabCase)}`}>
            {wordData.irabCase}
          </span>

          {/* Sound button */}
          <button
            type="button"
            onClick={handlePlayAudio}
            title={t.listenWord}
            className="p-2 rounded-lg bg-slate-800 hover:bg-amber-600/30 border border-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-amber-400' : ''}`} />
          </button>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            title={t.copyWord}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* تحقيقات الألفاظ (তাহকীকুল আলফায) Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <h4 className="font-bold text-sm sm:text-base text-amber-300 font-bengali">
              {t.tahqiqTitle}
            </h4>
            <span className="text-[11px] text-slate-400 hidden sm:inline-block">
              (সিগাহ • বহস • বাব • মাসদার • মাদ্দা • জিনস • অর্থ)
            </span>
          </div>
          {wordData.meaning && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bengali">
              <span className="text-amber-400 font-medium">{t.fieldMeaning}:</span>
              <span className="text-slate-100 font-bold">{wordData.meaning}</span>
            </div>
          )}
        </div>

        {/* 1. The 4 Primary Tahqiq Fields: الصيغة، البحث، الباب، المصدر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. الصيغة (Sighah) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/25 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1 h-full bg-amber-500"></div>
            <div className="flex items-center justify-between text-xs text-amber-400 font-medium mb-1">
              <span className="flex items-center gap-1 font-bengali">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                {t.fieldSighah}
              </span>
            </div>
            <p className="text-slate-100 font-semibold text-sm leading-relaxed font-bengali">
              {wordData.sighah || '—'}
            </p>
          </div>

          {/* 2. البحث (Bahath) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-blue-500/25 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center justify-between text-xs text-blue-400 font-medium mb-1">
              <span className="flex items-center gap-1 font-bengali">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                {t.fieldBahath}
              </span>
            </div>
            <p className="text-slate-100 font-semibold text-sm leading-relaxed font-bengali">
              {wordData.bahath || '—'}
            </p>
          </div>

          {/* 3. الباب (Baab) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/25 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium mb-1">
              <span className="flex items-center gap-1 font-bengali">
                <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                {t.fieldBaab}
              </span>
            </div>
            <p className="text-slate-100 font-semibold text-sm leading-relaxed font-bengali">
              {wordData.baab || '—'}
            </p>
            {wordData.baabMeaning && (
              <span className="text-[11px] text-emerald-300/80 block mt-1 font-bengali">
                {wordData.baabMeaning}
              </span>
            )}
          </div>

          {/* 4. المصدر (Masdar) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/25 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1 h-full bg-purple-500"></div>
            <div className="flex items-center justify-between text-xs text-purple-400 font-medium mb-1">
              <span className="flex items-center gap-1 font-bengali">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                {t.fieldMasdar}
              </span>
            </div>
            <p className="text-slate-100 font-amiri font-bold text-base leading-relaxed text-purple-200" dir="rtl">
              {wordData.masdar || '—'}
            </p>
            {wordData.masdarType && (
              <span className="text-[11px] text-purple-300/80 block mt-0.5 font-bengali">
                {wordData.masdarType}
              </span>
            )}
          </div>
        </div>

        {/* 2. Maddah, Jins, Meaning, and Mizan Sarfi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Maddah / মাদ্দা (مادة) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-bengali">{t.fieldMaddah}</span>
            <span className="font-amiri text-lg font-bold text-amber-300 tracking-widest block" dir="rtl">
              {wordData.maddah || wordData.root?.replace(/-/g, '+') || '—'}
            </span>
          </div>

          {/* Jins / জিনস (جنس) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-bengali">{t.fieldJins}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-teal-300 font-bengali">
                {wordData.jins || wordData.rootClassification || 'صحيح'}
              </span>
            </div>
          </div>

          {/* Mizan Sarfi / মীযান সারফী (الوزن) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-bengali">{t.fieldMizan}</span>
            <span className="font-amiri text-lg font-bold text-emerald-300" dir="rtl">
              {wordData.mizanSarfi || '—'}
            </span>
          </div>

          {/* Word Meaning / অর্থ (المعنى) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-bengali">{t.fieldMeaning}</span>
            <span className="text-sm font-bold text-slate-100 font-bengali truncate block">
              {wordData.meaning || 'প্রসঙ্গানুযায়ী অর্থ'}
            </span>
          </div>
        </div>

        {/* Subtle Transformations: الإعلال والإبدال والنقل والحذف */}
        {wordData.morphophonemicChange && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1.5">
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <span>{t.fieldMorphophonemics}</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {wordData.morphophonemicChange}
            </p>
          </div>
        )}

        {/* Clitic Decomposition (تجزئة الزوائد والضمائر) */}
        {wordData.cliticDecomposition && wordData.cliticDecomposition.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-2 font-medium">
              {t.fieldClitics}
            </span>
            <div className="flex flex-wrap gap-2">
              {wordData.cliticDecomposition.map((part, idx) => {
                const typeLabel =
                  part.type === 'prefix'
                    ? t.partPrefix
                    : part.type === 'stem'
                    ? t.partStem
                    : t.partSuffix;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200"
                  >
                    <span className="font-amiri text-base font-bold text-amber-300" dir="rtl">
                      {part.part}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      [{typeLabel}]
                    </span>
                    <span className="text-slate-300 ml-1">: {part.meaning}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Syntactic I'rab (الإعراب التفصيلي الكامل) */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {t.fieldDetailedIrab}
            </span>
            <span className="text-xs text-amber-400 font-medium">
              {t.fieldIrabRole}: {wordData.irabRole}
            </span>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {wordData.irabFull}
          </div>

          {wordData.syntacticDependencies && (
            <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400">
              <span className="text-slate-300 font-medium">{t.fieldDependencies} </span>
              {wordData.syntacticDependencies}
            </div>
          )}
        </div>

        {/* Subtle Note / Rhetorical Nuance */}
        {wordData.subtleNote && (
          <div className="p-3 rounded-lg bg-indigo-950/25 border border-indigo-700/30 text-xs text-indigo-200 leading-relaxed">
            <span className="font-bold text-indigo-300 mr-1.5">✦ {t.fieldSubtleNote}</span>
            {wordData.subtleNote}
          </div>
        )}
      </div>
    </div>
  );
};
