/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Clock,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Search,
  Globe,
  Building2,
  Check,
} from 'lucide-react';
import { ExplanationLanguage } from '../types/grammar';
import { BANGLADESH_CITIES, BD_DIVISIONS, CityData } from '../data/bangladeshCities';

interface LocationPermissionPromptProps {
  language: ExplanationLanguage;
  featureTitle: 'salat' | 'compass' | 'weather';
  isRequesting: boolean;
  error: string | null;
  isDenied: boolean;
  onRequestLocation: () => void;
  onSelectManualCity: (lat: number, lon: number, city: string, country: string) => void;
}

export const LocationPermissionPrompt: React.FC<LocationPermissionPromptProps> = ({
  language,
  featureTitle,
  isRequesting,
  error,
  isDenied,
  onRequestLocation,
  onSelectManualCity,
}) => {
  const isEn = language === 'en';
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [showCityPicker, setShowCityPicker] = useState(true);

  const featureName =
    featureTitle === 'salat'
      ? isEn
        ? 'Salat Prayer Times'
        : isAr
        ? 'مواقيت الصلاة'
        : 'সালাতের সময়সূচি'
      : featureTitle === 'compass'
      ? isEn
        ? 'Qibla Compass'
        : isAr
        ? 'بوصلة القبلة'
        : 'কিবলা কম্পাস'
      : isEn
      ? 'Precise Weather'
      : isAr
      ? 'الطقس المباشر'
      : 'আবহাওয়া';

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
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0d1424] to-slate-950 border border-amber-500/30 shadow-2xl space-y-6">
        {/* Pulsating Location Icon & Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-75" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <MapPin className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              {isEn
                ? `Set Location for ${featureName}`
                : isAr
                ? `تحديد الموقع لعرض ${featureName}`
                : `${featureName} দেখতে লোকেশন সেট করুন`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              {isEn
                ? 'Allow live GPS location, or pick your city from all 64 districts of Bangladesh below for exact local prayer times and Qibla bearing.'
                : isAr
                ? 'فعل تحديد الموقع التلقائي أو اختر مدينتك من بين جميع مدن بنغلاديش الـ ٦٤ لمواقيت صلاة دقيقة واتجاه قبلة صحيح.'
                : 'স্বয়ংক্রিয় জিপিএস লোকেশন চালু করুন অথবা নিচের তালিকা থেকে বাংলাদেশের ৬৪টি জেলার যেকোনো জেলা বেছে নিন।'}
            </p>
          </div>
        </div>

        {/* Error / Denied Feedback */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* GPS Live Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onRequestLocation}
            disabled={isRequesting}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isRequesting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>
                  {isEn
                    ? 'Detecting GPS Location...'
                    : isAr
                    ? 'جاري تحديد موقعك الجغرافي...'
                    : 'জিপিএস দিয়ে স্বয়ংক্রিয়ভাবে সনাক্ত করা হচ্ছে...'}
                </span>
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                <span>
                  {isEn
                    ? 'Use Live GPS Location'
                    : isAr
                    ? 'استخدام موقعي المباشر (GPS)'
                    : 'স্বয়ংক্রিয় জিপিএস লোকেশন ব্যবহার করুন'}
                </span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isEn
                ? 'Instant astronomical calculation for your exact latitude & longitude'
                : 'আপনার জেলার নিখুঁত অক্ষাংশ ও দ্রাঘিমাংশের ওপর ভিত্তি করে সরাসরি হিসাব'}
            </span>
          </div>
        </div>

        {/* Bangladesh 64 Districts Section */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>
                {isEn
                  ? 'All 64 Districts of Bangladesh'
                  : isAr
                  ? 'جميع مدن ومحافظات بنغلاديش (٦٤ مدينة)'
                  : 'বাংলাদেশের সকল ৬৪টি জেলা ও শহর'}
              </span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {filteredCities.length} {isEn ? 'Cities' : 'টি শহর'}
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={
                isEn
                  ? 'Search any city or district (e.g. Bogura, Sylhet, কুমিল্লা)...'
                  : 'যেকোনো জেলা বা শহরের নাম লিখুন (যেমন: বগুড়া, সিলেট, ফেনী)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Division Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {BD_DIVISIONS.map((div) => {
              const label =
                div === 'All Divisions'
                  ? isEn
                    ? 'All (সব)'
                    : 'সকল'
                  : div;
              const isActive = selectedDivision === div;
              return (
                <button
                  type="button"
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3 py-1 rounded-lg shrink-0 transition-all font-medium cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Scrollable Cities Grid */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
            {filteredCities.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-500">
                {isEn ? 'No district found matching your search.' : 'কোনো জেলা খুঁজে পাওয়া যায়নি।'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredCities.map((c) => (
                  <button
                    key={`${c.city}-${c.country}`}
                    type="button"
                    onClick={() =>
                      onSelectManualCity(
                        c.lat,
                        c.lon,
                        language === 'bn' ? c.cityBn : c.city,
                        language === 'bn' ? c.countryBn : c.country
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800/80 hover:border-amber-500/50 text-left flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                          {c.cityBn}
                        </span>
                        <span className="text-[11px] text-slate-400">({c.city})</span>
                      </div>
                      {c.division && (
                        <span className="text-[10px] text-slate-500 block">
                          {c.division} বিভাগ
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400/80 group-hover:bg-amber-500/20 group-hover:text-amber-300">
                      নির্বাচন করুন
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
