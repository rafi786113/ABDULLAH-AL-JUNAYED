/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface TashkeelKeyboardProps {
  onInsertChar: (char: string) => void;
  onClear: () => void;
}

export const TashkeelKeyboard: React.FC<TashkeelKeyboardProps> = ({ onInsertChar, onClear }) => {
  const harakat = [
    { label: 'فَتْحَة', char: '\u064E', display: 'ـَ' },
    { label: 'ضَمَّة', char: '\u064F', display: 'ـُ' },
    { label: 'كَسْرَة', char: '\u0650', display: 'ـِ' },
    { label: 'سُكُون', char: '\u0652', display: 'ـْ' },
    { label: 'شَدَّة', char: '\u0651', display: 'ـّ' },
    { label: 'تَنْوِين فَتْح', char: '\u064B', display: 'ـً' },
    { label: 'تَنْوِين ضَمّ', char: '\u064C', display: 'ـٌ' },
    { label: 'تَنْوِين كَسْر', char: '\u064D', display: 'ـٍ' },
    { label: 'أَلِف خَنْجَرِيَّة', char: '\u0670', display: 'ـٰ' },
    { label: 'شَدَّة وفَتْحَة', char: '\u0651\u064E', display: 'ـَّ' },
    { label: 'شَدَّة وضَمَّة', char: '\u0651\u064F', display: 'ـُّ' },
    { label: 'شَدَّة وكَسْرَة', char: '\u0651\u0650', display: 'ـِّ' },
    { label: 'هَمْزَة وَصْل', char: 'ٱ', display: 'ٱ' },
    { label: 'مَدَّة', char: '\u0653', display: 'ـٓ' },
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-lg select-none">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 text-xs text-amber-300 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          لوحة التشكيل السريع (Tashkeel Toolbar)
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-slate-400 hover:text-red-400 text-xs transition-colors px-2 py-0.5 rounded hover:bg-slate-800"
        >
          مسح النص
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 items-center justify-start">
        {harakat.map((item, idx) => (
          <button
            key={idx}
            type="button"
            title={item.label}
            onClick={() => onInsertChar(item.char)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-amber-950/60 hover:border-amber-500/50 border border-slate-700/60 text-slate-100 font-amiri text-xl transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm group relative"
          >
            <span>{item.display}</span>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex px-2 py-0.5 bg-slate-950 text-amber-200 text-[10px] rounded border border-slate-700 whitespace-nowrap z-30 shadow">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
