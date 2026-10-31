/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  Droplets,
  MapPin,
  RefreshCw,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { ExplanationLanguage } from '../types/grammar';
import { useUserLocation } from '../utils/useUserLocation';
import { LocationPermissionPrompt } from './LocationPermissionPrompt';
import { CitySwitcherModal } from './CitySwitcherModal';

interface WeatherViewProps {
  language: ExplanationLanguage;
}

interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: number;
}

interface HourlyForecast {
  time: string[];
  temperature: number[];
  weatherCode: number[];
}

interface DailyForecast {
  time: string[];
  weatherCode: number[];
  tempMax: number[];
  tempMin: number[];
}

export const WeatherView: React.FC<WeatherViewProps> = ({ language }) => {
  const isEn = language === 'en';
  const isAr = language === 'ar';

  const {
    location,
    isRequesting,
    error: locError,
    isDenied,
    requestLocation,
    setManualLocation,
    clearLocation,
  } = useUserLocation();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [hourly, setHourly] = useState<HourlyForecast | null>(null);
  const [daily, setDaily] = useState<DailyForecast | null>(null);
  const [showCitySwitcher, setShowCitySwitcher] = useState(false);

  const fetchWeather = (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Weather service unavailable');
        return res.json();
      })
      .then((data) => {
        setCurrent({
          temperature: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day,
        });

        setHourly({
          time: data.hourly.time.slice(0, 24),
          temperature: data.hourly.temperature_2m.slice(0, 24),
          weatherCode: data.hourly.weather_code.slice(0, 24),
        });

        setDaily({
          time: data.daily.time,
          weatherCode: data.daily.weather_code,
          tempMax: data.daily.temperature_2m_max,
          tempMin: data.daily.temperature_2m_min,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error('Weather fetch error:', err);
        setError(
          isEn
            ? 'Unable to load real-time weather. Please check internet connection.'
            : isAr
            ? 'تعذر تحميل بيانات الطقس الحالية. يرجى التحقق من الاتصال.'
            : 'আবহাওয়ার তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।'
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    if (location) {
      fetchWeather(location.latitude, location.longitude);
    }
  }, [location]);

  // If user hasn't allowed location yet, display dedicated permission prompt
  if (!location) {
    return (
      <LocationPermissionPrompt
        language={language}
        featureTitle="weather"
        isRequesting={isRequesting}
        error={locError}
        isDenied={isDenied}
        onRequestLocation={requestLocation}
        onSelectManualCity={(lat, lon, city, country) => setManualLocation(lat, lon, city, country)}
      />
    );
  }

  const getWeatherInterpretation = (code: number) => {
    if (code === 0) {
      return {
        label: isEn ? 'Clear Sky' : isAr ? 'سماء صافية' : 'পরিষ্কার আকাশ',
        icon: Sun,
        color: 'text-amber-400',
      };
    }
    if (code === 1 || code === 2) {
      return {
        label: isEn ? 'Mainly Clear' : isAr ? 'صافٍ غالباً' : 'স্বচ্ছ ও কম মেঘলা',
        icon: Sun,
        color: 'text-amber-300',
      };
    }
    if (code === 3) {
      return {
        label: isEn ? 'Overcast' : isAr ? 'غائم كلياً' : 'মেঘলা আকাশ',
        icon: Cloud,
        color: 'text-slate-300',
      };
    }
    if (code >= 45 && code <= 48) {
      return {
        label: isEn ? 'Foggy' : isAr ? 'ضبابي' : 'কুয়াশাচ্ছন্ন',
        icon: CloudFog,
        color: 'text-slate-400',
      };
    }
    if (code >= 51 && code <= 67) {
      return {
        label: isEn ? 'Rain & Drizzle' : isAr ? 'أمطار ورذاذ' : 'বৃষ্টি ও গুঁড়ি গুঁড়ি বৃষ্টি',
        icon: CloudRain,
        color: 'text-blue-400',
      };
    }
    if (code >= 71 && code <= 77) {
      return {
        label: isEn ? 'Snowfall' : isAr ? 'تساقط الثلوج' : 'তুষারপাত',
        icon: CloudSnow,
        color: 'text-cyan-300',
      };
    }
    if (code >= 80 && code <= 82) {
      return {
        label: isEn ? 'Rain Showers' : isAr ? 'زخات مطر' : 'ভারী বর্ষণ',
        icon: CloudRain,
        color: 'text-blue-400',
      };
    }
    if (code >= 95) {
      return {
        label: isEn ? 'Thunderstorm' : isAr ? 'عاصفة رعدية' : 'বজ্রঝড়',
        icon: CloudLightning,
        color: 'text-yellow-400',
      };
    }
    return {
      label: isEn ? 'Partly Cloudy' : isAr ? 'غائم جزئياً' : 'আংশিক মেঘলা',
      icon: Cloud,
      color: 'text-slate-300',
    };
  };

  const formatTemp = (valC: number) => {
    if (tempUnit === 'F') {
      const f = Math.round((valC * 9) / 5 + 32);
      return `${f}°F`;
    }
    return `${Math.round(valC)}°C`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Location Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <MapPin className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
                {isEn ? 'Precise Location Weather' : isAr ? 'طقس موقعك الحالي' : 'বর্তমান আবহাওয়া'}
              </span>
              <button
                type="button"
                onClick={requestLocation}
                disabled={isRequesting}
                className="p-1 text-slate-400 hover:text-blue-300 transition-colors cursor-pointer"
                title={isEn ? 'Refresh GPS' : isAr ? 'تحديث' : 'রিফ্রেশ'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRequesting ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setShowCitySwitcher(true)}
                className="text-[10px] text-blue-400 hover:text-blue-300 underline ml-1 cursor-pointer font-medium"
              >
                {isEn ? 'Change City' : isAr ? 'تغيير المدينة' : 'জেলা পরিবর্তন'}
              </button>
            </div>
            <h2 className="text-base font-semibold text-slate-100">{location.displayName}</h2>
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setTempUnit('C')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              tempUnit === 'C' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => setTempUnit('F')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              tempUnit === 'F' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Current Weather */}
      {current && (
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-[#0e1626] border border-blue-500/30 shadow-2xl overflow-hidden">
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {(() => {
                const interp = getWeatherInterpretation(current.weatherCode);
                const Icon = interp.icon;
                return (
                  <div className={`p-5 rounded-3xl bg-blue-500/10 border border-blue-500/30 ${interp.color}`}>
                    <Icon className="w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                );
              })()}

              <div>
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-100 font-mono">
                  {formatTemp(current.temperature)}
                </span>
                <p className="text-base sm:text-lg font-semibold text-blue-300 mt-1">
                  {getWeatherInterpretation(current.weatherCode).label}
                </p>
                <p className="text-xs text-slate-400">
                  {isEn ? 'Feels like:' : isAr ? 'يبدو كأنه:' : 'অনুভূত তাপমাত্রা:'}{' '}
                  <strong className="text-slate-200">{formatTemp(current.apparentTemperature)}</strong>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <Droplets className="w-5 h-5 text-blue-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    {isEn ? 'Humidity' : isAr ? 'الرطوبة' : 'আর্দ্রতা'}
                  </span>
                  <span className="text-sm font-bold text-slate-200 font-mono">{current.humidity}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <Wind className="w-5 h-5 text-teal-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    {isEn ? 'Wind' : isAr ? 'الرياح' : 'বাতাস'}
                  </span>
                  <span className="text-sm font-bold text-slate-200 font-mono">
                    {Math.round(current.windSpeed)} km/h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hourly 24h Slider */}
      {hourly && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{isEn ? 'Hourly Forecast (24 Hours)' : isAr ? 'توقعات الساعات القادمة' : 'ঘণ্টাভিত্তিক পূর্বাভাস'}</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {hourly.time.map((t, idx) => {
              const hourDate = new Date(t);
              const hourLabel = hourDate.toLocaleTimeString([], { hour: 'numeric' });
              const interp = getWeatherInterpretation(hourly.weatherCode[idx]);
              const Icon = interp.icon;

              return (
                <div
                  key={t}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 min-w-[76px] text-center shrink-0 space-y-1.5"
                >
                  <span className="text-[11px] text-slate-400 block">{hourLabel}</span>
                  <div className="flex justify-center">
                    <Icon className={`w-5 h-5 ${interp.color}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-200 font-mono block">
                    {formatTemp(hourly.temperature[idx])}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {daily && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {isEn ? '7-Day Outlook' : isAr ? 'توقعات الأيام السبعة' : '৭ দিনের পূর্বাভাস'}
          </span>

          <div className="space-y-2">
            {daily.time.slice(0, 7).map((d, idx) => {
              const dateObj = new Date(d);
              const dayName = dateObj.toLocaleDateString(
                language === 'ar' ? 'ar-SA' : language === 'bn' ? 'bn-BD' : 'en-US',
                { weekday: 'short', month: 'short', day: 'numeric' }
              );
              const interp = getWeatherInterpretation(daily.weatherCode[idx]);
              const Icon = interp.icon;

              return (
                <div
                  key={d}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <span className="w-28 font-medium text-slate-300">{dayName}</span>

                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${interp.color}`} />
                    <span className="text-slate-400 hidden sm:inline">{interp.label}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold text-slate-100">{formatTemp(daily.tempMax[idx])}</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-slate-400">{formatTemp(daily.tempMin[idx])}</span>
                  </div>
                </div>
              );
            })}
          </div>
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
