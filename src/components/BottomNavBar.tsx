/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  CloudSun,
  MessageCircle,
} from 'lucide-react';
import { ExplanationLanguage } from '../types/grammar';
import { AppFeatureMode } from './NavigationDrawer';

export type BottomNavTab = 'abwab' | 'salat' | 'compass' | 'weather' | 'contact';

interface BottomNavBarProps {
  activeMode: AppFeatureMode;
  onSelectFeature: (mode: AppFeatureMode) => void;
  onOpenAbwabGuide: () => void;
  language: ExplanationLanguage;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeMode,
  onSelectFeature,
  onOpenAbwabGuide,
  language,
}) => {
  const isEn = language === 'en';
  const isAr = language === 'ar';

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#060b15]/95 backdrop-blur-lg border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-between relative">
        {/* Button 1: Abwab Guide (📖) */}
        <button
          type="button"
          onClick={onOpenAbwabGuide}
          className="flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-transform active:scale-95 text-slate-400 hover:text-amber-300"
          title={isEn ? 'Classical Abwab Guide' : isAr ? 'دليل الأبواب الصرفية' : 'আব্বাব গাইড'}
        >
          <span className="text-xl leading-none transition-transform group-hover:scale-110">📖</span>
          <span className="text-[10px] font-medium tracking-tight mt-1 text-slate-300 group-hover:text-amber-300">
            {isEn ? 'Abwab' : isAr ? 'الأبواب' : 'আব্বাব'}
          </span>
        </button>

        {/* Button 2: Salat (Pray - Mosque Dome) */}
        <button
          type="button"
          onClick={() => onSelectFeature('salat' as AppFeatureMode)}
          className={`flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-transform active:scale-95 ${
            activeMode === ('salat' as AppFeatureMode)
              ? 'text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title={isEn ? 'Salat Prayer Times' : isAr ? 'مواقيت الصلاة' : 'সালাতের সময়সূচি'}
        >
          {/* Custom SVG Mosque Dome matching screenshot */}
          <svg
            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              activeMode === ('salat' as AppFeatureMode) ? 'text-amber-400 fill-amber-400/20' : 'text-slate-300'
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {/* Crescent on top */}
            <path d="M12 2a1.8 1.8 0 0 1 1 1.6 1.8 1.8 0 0 1-1.6 1.8 1.8 1.8 0 0 1-1.2-.5 1.5 1.5 0 0 0 .8.2 1.5 1.5 0 0 0 1.5-1.5c0-.6-.3-1.1-.5-1.6z" />
            {/* Dome arch */}
            <path d="M12 5.5c-3.5 0-6 3.5-6 8.5h12c0-5-2.5-8.5-6-8.5z" />
            {/* Mosque base */}
            <path d="M4 14h16v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5z" />
            {/* Door arch */}
            <path d="M10 20v-3a2 2 0 0 1 4 0v3" />
          </svg>
          <span
            className={`text-[10px] font-medium tracking-tight mt-1 ${
              activeMode === ('salat' as AppFeatureMode) ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {isEn ? 'Pray' : isAr ? 'الصلاة' : 'সালাত'}
          </span>
        </button>

        {/* Button 3 (CENTER ELEVATED): App Logo + Qibla Compass */}
        <div className="relative -top-5 flex flex-col items-center justify-center px-1">
          <button
            type="button"
            onClick={() => onSelectFeature('compass' as AppFeatureMode)}
            className={`w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-[#2d1b2a] via-[#1a2238] to-[#3a2034] border-2 shadow-[0_4px_16px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              activeMode === ('compass' as AppFeatureMode)
                ? 'border-amber-400 shadow-amber-500/30'
                : 'border-amber-300/60 hover:border-amber-300'
            }`}
            title={isEn ? 'Qibla Compass' : isAr ? 'بوصلة القبلة' : 'কিবলা কম্পাস'}
            aria-label="Qibla Compass"
          >
            {/* App Circular Emblem */}
            <div className="w-full h-full rounded-full overflow-hidden bg-[#2c1d29] flex items-center justify-center">
              <img
                src="/assets/aistudio/20261031_171524_0000_798e640e.png"
                alt="Noor Compass"
                className="w-full h-full object-cover scale-[1.38] rounded-full select-none"
              />
            </div>
          </button>
          <span
            className={`text-[10px] font-semibold tracking-tight mt-0.5 ${
              activeMode === ('compass' as AppFeatureMode) ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            {isEn ? 'Compass' : isAr ? 'القبلة' : 'কিবলা'}
          </span>
        </div>

        {/* Button 4: Weather (CloudSun) */}
        <button
          type="button"
          onClick={() => onSelectFeature('weather' as AppFeatureMode)}
          className={`flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-transform active:scale-95 ${
            activeMode === ('weather' as AppFeatureMode)
              ? 'text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title={isEn ? 'Live Weather' : isAr ? 'الطقس الحالي' : 'আবহাওয়া'}
        >
          <CloudSun className="w-5 h-5 text-slate-300 transition-transform group-hover:scale-110" />
          <span
            className={`text-[10px] font-medium tracking-tight mt-1 ${
              activeMode === ('weather' as AppFeatureMode) ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {isEn ? 'Weather' : isAr ? 'الطقس' : 'আবহাওয়া'}
          </span>
        </button>

        {/* Button 5: Advice & Contact (💭) */}
        <button
          type="button"
          onClick={() => onSelectFeature('contact' as AppFeatureMode)}
          className={`flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-transform active:scale-95 ${
            activeMode === ('contact' as AppFeatureMode)
              ? 'text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title={isEn ? 'Advices & Contact Us' : isAr ? 'نصائح وتواصل' : 'পরামর্শ ও মতামত'}
        >
          <span className="text-xl leading-none transition-transform group-hover:scale-110">💭</span>
          <span
            className={`text-[10px] font-medium tracking-tight mt-1 ${
              activeMode === ('contact' as AppFeatureMode) ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {isEn ? 'Advice' : isAr ? 'نصائح' : 'পরামর্শ'}
          </span>
        </button>
      </div>
    </nav>
  );
};
