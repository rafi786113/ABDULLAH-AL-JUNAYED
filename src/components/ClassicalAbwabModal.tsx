/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, BookMarked, GraduationCap } from 'lucide-react';
import {
  THULATHI_MUJARRAD_ABWAB,
  MAZID_ABWAB,
  SARF_GLOSSARY,
  ClassicalBaabInfo,
} from '../data/classicalAbwab';
import { ExplanationLanguage } from '../types/grammar';

interface ClassicalAbwabModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: ExplanationLanguage;
}

export const ClassicalAbwabModal: React.FC<ClassicalAbwabModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'thulathi' | 'mazid' | 'glossary'>('thulathi');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base sm:text-lg">
            <BookMarked className="w-5 h-5 text-amber-400" />
            <span>
              {language === 'bn'
                ? 'আব্বাবের বিশ্বকোষ ও সরফের পরিভাষাসমূহ (Classical Abwab Reference)'
                : language === 'ar'
                ? 'موسوعة أبواب الصرف ومصطلحات النحو'
                : 'Encyclopedia of Classical Abwab & Grammar Terminology'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-3 bg-slate-950/60 border-b border-slate-800 text-xs sm:text-sm overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('thulathi')}
            className={`px-4 py-2 rounded-xl font-medium transition-all shrink-0 ${
              activeTab === 'thulathi'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {language === 'bn'
              ? 'সুলাছী মুজাররাদের ৬টি বাব'
              : language === 'ar'
              ? 'أبواب الثلاثي المجرد الستة'
              : '6 Thulathi Mujarrad Doors'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mazid')}
            className={`px-4 py-2 rounded-xl font-medium transition-all shrink-0 ${
              activeTab === 'mazid'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {language === 'bn'
              ? 'সুলাছী মাযীদের বাবসমূহ'
              : language === 'ar'
              ? 'أبواب الثلاثي المزيد فيه'
              : 'Mazid Feeh Forms (II - X)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('glossary')}
            className={`px-4 py-2 rounded-xl font-medium transition-all shrink-0 ${
              activeTab === 'glossary'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {language === 'bn'
              ? 'পরিভাষার পরিচয় (সিগাহ, বহস, বাব, মাসদার)'
              : language === 'ar'
              ? 'دليل المصطلحات (صيغة، بحث، باب، مصدر)'
              : 'Terms Glossary (Sighah, Bahath, Baab, Masdar)'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'thulathi' && (
            <div className="space-y-4">
              {/* Mnemonic Poetry Box */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 text-center">
                <span className="text-xs text-amber-400 font-semibold block mb-1">
                  {language === 'bn'
                    ? 'সুলাছী মুজাররাদের হরকত মনে রাখার বিখ্যাত ছন্দযুক্ত কবিতা (ইবনে মালিক রহ.):'
                    : 'Classical mnemonic verse for Thulathi Mujarrad stem vowels (Ibn Malik):'}
                </span>
                <p className="font-amiri text-xl sm:text-2xl font-bold text-amber-200 tracking-wide" dir="rtl">
                  «فَتْحُ ضَمٍّ، فَتْحُ كَسْرٍ، فَتْحَتَانْ ... كَسْرُ فَتْحٍ، ضَمُّ ضَمٍّ، كَسْرَتَانْ»
                </p>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {language === 'bn'
                    ? '(১ম: ফাতহ-যাম [নাসারা], ২য়: ফাতহ-কাসর [যারাবা], ৩য়: দুই ফাতহ [ফাতাহা], ৪র্থ: কাসর-ফাতহ [আলিমা], ৫ম: দুই যাম [কারুমা], ৬ষ্ঠ: দুই কাসর [হাসিবা])'
                    : '(1: Fat-ha/Damm [Nasara], 2: Fat-ha/Kasr [Daraba], 3: Two Fat-has [Fataha], 4: Kasr/Fat-ha [Alima], 5: Two Damms [Karuma], 6: Two Kasrs [Hasiba])'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {THULATHI_MUJARRAD_ABWAB.map((baab: ClassicalBaabInfo) => (
                  <div
                    key={baab.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div>
                        <span className="font-amiri text-lg font-bold text-amber-300 block" dir="rtl">
                          {baab.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {language === 'bn' ? baab.nameBn : baab.nameEn}
                        </span>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-emerald-500/20">
                        {baab.mnemonic}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1.5">
                      <div>
                        <span className="text-slate-400">Template: </span>
                        <span className="font-amiri text-base font-bold text-amber-100" dir="rtl">{baab.pattern}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Stem Vowels: </span>
                        <span>Past: {baab.pastVowel} | Present: {baab.presentVowel}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Examples: </span>
                        <span className="font-amiri text-sm text-slate-200" dir="rtl">{baab.examplePast} ← {baab.examplePresent}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Masdar: </span>
                        <span className="font-amiri text-sm text-slate-300" dir="rtl">{baab.exampleMasdar}</span>
                      </div>
                      <div className="text-slate-400 pt-1 text-[11px] border-t border-slate-800/50">
                        <span className="text-amber-400 font-medium">Significance: </span>
                        {language === 'bn' ? baab.commonMeaningBn : baab.commonMeaningEn}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mazid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {MAZID_ABWAB.map((baab: ClassicalBaabInfo) => (
                <div
                  key={baab.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div>
                      <span className="font-amiri text-lg font-bold text-emerald-300 block" dir="rtl">
                        {baab.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {language === 'bn' ? baab.nameBn : baab.nameEn}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {baab.category}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1.5">
                    <div>
                      <span className="text-slate-400">Conjugation: </span>
                      <span className="font-amiri text-base font-bold text-amber-200" dir="rtl">{baab.pattern}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Augmentation: </span>
                      <span>{baab.mnemonic}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Examples: </span>
                      <span className="font-amiri text-sm text-slate-200" dir="rtl">{baab.examplePast} ← {baab.examplePresent}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Masdar: </span>
                      <span className="font-amiri text-sm text-purple-300" dir="rtl">{baab.exampleMasdar}</span>
                    </div>
                    <div className="text-slate-400 pt-1 text-[11px] border-t border-slate-800/50">
                      <span className="text-amber-400 font-medium">Meanings: </span>
                      {language === 'bn' ? baab.commonMeaningBn : baab.commonMeaningEn}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'glossary' && (
            <div className="space-y-3">
              {SARF_GLOSSARY.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5"
                >
                  <h4 className="font-bold text-amber-300 text-base flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    {item.term}
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-arabic" dir="rtl">
                    {item.arabicDesc}
                  </p>
                  <p className="text-xs text-amber-100/90 font-medium">
                    {language === 'bn' ? item.bengaliDesc : item.englishDesc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : language === 'ar' ? 'إغلاق' : 'Close Reference'}
          </button>
        </div>
      </div>
    </div>
  );
};
