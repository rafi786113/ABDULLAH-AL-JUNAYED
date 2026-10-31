/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Table, Volume2 } from 'lucide-react';
import { speakArabic } from '../utils/speech';

interface TasreefModalProps {
  isOpen: boolean;
  onClose: () => void;
  rootWord: string;
  conjugations?: {
    past: string;
    present: string;
    imperative: string;
    passivePast: string;
    passivePresent: string;
    activeParticiple: string;
    passiveParticiple: string;
    masdar: string;
  };
}

export const TasreefModal: React.FC<TasreefModalProps> = ({
  isOpen,
  onClose,
  rootWord,
  conjugations,
}) => {
  if (!isOpen || !conjugations) return null;

  const items = [
    { label: 'الماضي المعلوم (Past Active)', value: conjugations.past, color: 'text-emerald-300' },
    { label: 'المضارع المعلوم (Present Active)', value: conjugations.present, color: 'text-blue-300' },
    { label: 'الأمر (Imperative)', value: conjugations.imperative, color: 'text-amber-300' },
    { label: 'المصدر الصريح (Masdar)', value: conjugations.masdar, color: 'text-purple-300' },
    { label: 'الماضي المجهول (Passive Past)', value: conjugations.passivePast, color: 'text-rose-300' },
    { label: 'المضارع المجهول (Passive Present)', value: conjugations.passivePresent, color: 'text-orange-300' },
    { label: 'اسم الفاعل (Active Participle)', value: conjugations.activeParticiple, color: 'text-teal-300' },
    { label: 'اسم المفعول (Passive Participle)', value: conjugations.passiveParticiple, color: 'text-indigo-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-right"
        dir="rtl"
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Table className="w-5 h-5" />
            <span>جدول التصريف الصغير (التصريف النمطي الأساسي)</span>
            <span className="text-slate-400 font-normal text-xs mr-2">«{rootWord}»</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[75vh] overflow-y-auto">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-slate-400 block mb-1">{item.label}</span>
                <span className={`font-amiri text-2xl font-bold ${item.color}`}>
                  {item.value || '—'}
                </span>
              </div>
              {item.value && (
                <button
                  type="button"
                  onClick={() => speakArabic(item.value)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="استمع"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
