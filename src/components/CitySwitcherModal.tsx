/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Search, MapPin, Building2, Check } from 'lucide-react';
import { ExplanationLanguage } from '../types/grammar';
import { BANGLADESH_CITIES, BD_DIVISIONS, CityData } from '../data/bangladeshCities';

interface CitySwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: ExplanationLanguage;
  currentCityName?: string;
  onSelectCity: (lat: number, lon: number, city: string, country: string) => void;
  onUseGps: () => void;
  isGpsRequesting?: boolean;
}

export const CitySwitcherModal: React.FC<CitySwitcherModalProps> = ({
  isOpen,
  onClose,
  language,
  currentCityName,
  onSelectCity,
  onUseGps,
  isGpsRequesting,
}) => {
  if (!isOpen) return null;

  const isEn = language === 'en';
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');

  const filteredCities = BANGLADESH_CITIES.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.city.toLowerCase().includes(q) ||
      c.cityBn.includes(q) ||
      (c.division && c.division.toLowerCase().includes(q));

    const matchesDivision =
      selectedDivision === 'All Divisions'
        ? true
        : selectedDivision === 'International'
        ? !c.isBdDistrict
        : c.division === selectedDivision;

    return matchesSearch && matchesDivision;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-[#090e1a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0c1222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {isEn
                  ? 'Select City in Bangladesh'
                  : isAr
                  ? 'اختر المدينة أو المحافظة'
                  : 'বাংলাদেশের জেলা ও শহর নির্বাচন'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isEn ? 'All 64 districts with astronomical coordinates' : '৬৪টি জেলার সঠিক অক্ষাংশ ও দ্রাঘিমাংশ'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Action */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/60">
          <button
            type="button"
            onClick={() => {
              onUseGps();
              onClose();
            }}
            disabled={isGpsRequesting}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>
              {isEn ? 'Use Live GPS Auto-Detect' : 'স্বয়ংক্রিয় জিপিএস লোকেশন চালু করুন'}
            </span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={isEn ? 'Search district (e.g. Bogura, Barishal, কুমিল্লা)...' : 'জেলার নাম দিয়ে খুঁজুন...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {BD_DIVISIONS.map((div) => {
              const label = div === 'All Divisions' ? (isEn ? 'All' : 'সকল') : div;
              const isActive = selectedDivision === div;
              return (
                <button
                  type="button"
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* City Grid */}
        <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-1.5 no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredCities.map((c) => {
              const displayName = language === 'bn' ? c.cityBn : c.city;
              const isSelected = currentCityName?.toLowerCase().includes(c.city.toLowerCase());

              return (
                <button
                  key={`${c.city}-${c.country}`}
                  type="button"
                  onClick={() => {
                    onSelectCity(
                      c.lat,
                      c.lon,
                      language === 'bn' ? c.cityBn : c.city,
                      language === 'bn' ? c.countryBn : c.country
                    );
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                      : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800/80 hover:border-amber-500/40 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-100">{c.cityBn}</span>
                      <span className="text-[11px] text-slate-400">({c.city})</span>
                    </div>
                    {c.division && (
                      <span className="text-[10px] text-slate-500 block">{c.division} বিভাগ</span>
                    )}
                  </div>

                  {isSelected ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-amber-400 font-mono">নির্বাচন</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
