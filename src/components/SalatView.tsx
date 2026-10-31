/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Compass,
  RefreshCw,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  SlidersHorizontal,
} from 'lucide-react';
import { ExplanationLanguage } from '../types/grammar';
import { calculatePrayerTimes, PrayerTimes } from '../utils/islamicCalculations';
import { useUserLocation, UserLocation } from '../utils/useUserLocation';
import { LocationPermissionPrompt } from './LocationPermissionPrompt';
import { CitySwitcherModal } from './CitySwitcherModal';

interface SalatViewProps {
  language: ExplanationLanguage;
  onNavigateToCompass?: () => void;
}

export const SalatView: React.FC<SalatViewProps> = ({ language, onNavigateToCompass }) => {
  const isEn = language === 'en';
  const isAr = language === 'ar';

  const {
    location,
    isRequesting,
    error,
    isDenied,
    requestLocation,
    setManualLocation,
    clearLocation,
  } = useUserLocation();

  const [asrMethod, setAsrMethod] = useState<'hanafi' | 'standard'>('hanafi');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [showCitySwitcher, setShowCitySwitcher] = useState(false);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Recalculate prayer times whenever location or asrMethod or currentTime changes
  useEffect(() => {
    if (location) {
      const times = calculatePrayerTimes(
        location.latitude,
        location.longitude,
        currentTime,
        asrMethod
      );
      setPrayerTimes(times);
    } else {
      setPrayerTimes(null);
    }
  }, [location, asrMethod, currentTime]);

  const prayerIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Fajr: Sunrise,
    Sunrise: Sun,
    Dhuhr: Sun,
    Asr: Sun,
    Maghrib: Sunset,
    Isha: Moon,
  };

  const prayerLabels: Record<string, { en: string; bn: string; ar: string }> = {
    Fajr: { en: 'Fajr', bn: 'ফজর', ar: 'الفجر' },
    Sunrise: { en: 'Sunrise (Ishraq)', bn: 'সূর্যোদয় (ইশরাক)', ar: 'الشروق' },
    Dhuhr: { en: 'Dhuhr', bn: 'যোহর', ar: 'الظهر' },
    Asr: { en: 'Asr', bn: 'আসর', ar: 'العصر' },
    Maghrib: { en: 'Maghrib', bn: 'মাগরিব', ar: 'المغرب' },
    Isha: { en: 'Isha', bn: 'ইশা', ar: 'العشاء' },
  };

  const formatCountdown = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) {
      return isEn
        ? `in ${h} hr ${m} min`
        : isAr
        ? `خلال ${h} ساعة و ${m} دقيقة`
        : `${h} ঘণ্টা ${m} মিনিটে`;
    }
    return isEn
      ? `in ${m} minutes`
      : isAr
      ? `خلال ${m} دقيقة`
      : `${m} মিনিটের মধ্যে`;
  };

  // If user hasn't allowed location yet, display dedicated permission prompt
  if (!location) {
    return (
      <LocationPermissionPrompt
        language={language}
        featureTitle="salat"
        isRequesting={isRequesting}
        error={error}
        isDenied={isDenied}
        onRequestLocation={requestLocation}
        onSelectManualCity={(lat, lon, city, country) => setManualLocation(lat, lon, city, country)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Location Banner & Controls */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <MapPin className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                {isEn ? 'Current Location' : isAr ? 'الموقع الجغرافي' : 'আপনার বর্তমান অবস্থান'}
              </span>
              <button
                type="button"
                onClick={requestLocation}
                disabled={isRequesting}
                className="p-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                title={isEn ? 'Refresh location' : isAr ? 'تحديث الموقع' : 'অবস্থান রিফ্রেশ করুন'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRequesting ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setShowCitySwitcher(true)}
                className="text-[10px] text-amber-400 hover:text-amber-300 underline ml-1 cursor-pointer font-medium"
              >
                {isEn ? 'Change City' : isAr ? 'تغيير المدينة' : 'জেলা পরিবর্তন'}
              </button>
            </div>
            <h2 className="text-base font-semibold text-slate-100">{location.displayName}</h2>
          </div>
        </div>

        {/* Calculation Settings */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setAsrMethod('hanafi')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                asrMethod === 'hanafi'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEn ? 'Hanafi Asr' : isAr ? 'عصر الحنفي' : 'হানাফী আসর'}
            </button>
            <button
              type="button"
              onClick={() => setAsrMethod('standard')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                asrMethod === 'standard'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEn ? 'Standard Asr' : isAr ? 'عصر الجمهور' : 'জমহুর আসর'}
            </button>
          </div>

          {onNavigateToCompass && (
            <button
              type="button"
              onClick={onNavigateToCompass}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/25 transition-all cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Qibla' : isAr ? 'القبلة' : 'কিবলা'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Next Prayer Card */}
      {prayerTimes && (
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-[#121929] border border-amber-500/40 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Upcoming Prayer' : isAr ? 'الصلاة القادمة' : 'পরবর্তী সালাত'}</span>
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100">
                {prayerLabels[prayerTimes.nextPrayer.name]?.[language] || prayerTimes.nextPrayer.name}
              </h1>

              <p className="text-xl sm:text-2xl font-mono text-amber-300 font-bold mt-1">
                {prayerTimes.nextPrayer.time}
              </p>
            </div>

            <div className="text-left sm:text-right bg-slate-950/70 p-4 rounded-2xl border border-amber-500/20">
              <span className="text-xs text-slate-400 block mb-1">
                {isEn ? 'Time Remaining' : isAr ? 'الوقت المتبقي' : 'বাকি সময়'}
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
                {formatCountdown(prayerTimes.nextPrayer.remainingMinutes)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1 font-mono">
                {currentTime.toLocaleDateString(
                  language === 'ar' ? 'ar-SA' : language === 'bn' ? 'bn-BD' : 'en-US',
                  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of 6 Daily Prayer Times */}
      {prayerTimes && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {[
            { key: 'Fajr', time: prayerTimes.fajr },
            { key: 'Sunrise', time: prayerTimes.sunrise },
            { key: 'Dhuhr', time: prayerTimes.dhuhr },
            { key: 'Asr', time: prayerTimes.asr },
            { key: 'Maghrib', time: prayerTimes.maghrib },
            { key: 'Isha', time: prayerTimes.isha },
          ].map((item) => {
            const isNext = prayerTimes.nextPrayer.name === item.key;
            const Icon = prayerIcons[item.key] || Sun;
            const label = prayerLabels[item.key]?.[language] || item.key;

            return (
              <div
                key={item.key}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isNext
                    ? 'bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl ${
                        isNext ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-100">{label}</span>
                  </div>

                  {isNext && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold uppercase tracking-wider">
                      {isEn ? 'Next' : isAr ? 'التالي' : 'আসন্ন'}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-amber-200">
                    {item.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tahajjud & Qiyamul Layl Indicator */}
      {prayerTimes && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-900/40 flex items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="font-semibold text-indigo-300 block">
                {isEn ? 'Tahajjud (Last Third of Night)' : isAr ? 'ثلث الليل الأخير (التهجد)' : 'তাহাজ্জুদ (রাত্রির শেষ তৃতীয়াংশ)'}
              </span>
              <span className="text-slate-400 text-[11px]">
                {isEn
                  ? 'Best time for voluntary nocturnal prayer & supplications'
                  : isAr
                  ? 'أفضل أوقات الدعاء والقيام والتضرع إلى الله'
                  : 'নফল সালাত ও দোয়ার সর্বোত্তম মহিমান্বিত সময়'}
              </span>
            </div>
          </div>
          <span className="font-mono text-base font-bold text-indigo-200 bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-500/30">
            {prayerTimes.tahajjud}
          </span>
        </div>
      )}

      {/* 64 Districts of Bangladesh City Switcher Modal */}
      <CitySwitcherModal
        isOpen={showCitySwitcher}
        onClose={() => setShowCitySwitcher(false)}
        language={language}
        currentCityName={location.displayName}
        onSelectCity={(lat, lon, city, country) => setManualLocation(lat, lon, city, country)}
        onUseGps={requestLocation}
        isGpsRequesting={isRequesting}
      />
    </div>
  );
};
