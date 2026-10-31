/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  RefreshCw,
  Navigation,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { ExplanationLanguage } from '../types/grammar';
import {
  calculateQiblaBearing,
  calculateDistanceToKaaba,
} from '../utils/islamicCalculations';
import { useUserLocation } from '../utils/useUserLocation';
import { LocationPermissionPrompt } from './LocationPermissionPrompt';
import { CitySwitcherModal } from './CitySwitcherModal';

interface QiblaCompassViewProps {
  language: ExplanationLanguage;
}

export const QiblaCompassView: React.FC<QiblaCompassViewProps> = ({ language }) => {
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

  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean | null>(null);
  const [manualHeadingOffset, setManualHeadingOffset] = useState<number>(0);
  const [showCitySwitcher, setShowCitySwitcher] = useState(false);

  // Handle device orientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS WebKit compass heading
      if (
        'webkitCompassHeading' in e &&
        typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number'
      ) {
        heading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android standard (alpha is rotation around z-axis in degrees)
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setHasCompassSensor(true);
        setDeviceHeading(Math.round(heading));
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    const timeout = setTimeout(() => {
      if (hasCompassSensor === null) {
        setHasCompassSensor(false);
      }
    }, 1800);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
      clearTimeout(timeout);
    };
  }, [hasCompassSensor]);

  // Request iOS permission if available
  const requestIOSSensorPermission = async () => {
    const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DeviceOrientationEventAny?.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEventAny.requestPermission();
        if (response === 'granted') {
          setHasCompassSensor(true);
        }
      } catch (err) {
        console.warn('Sensor permission error:', err);
      }
    }
  };

  // If user hasn't allowed location yet, display dedicated permission prompt
  if (!location) {
    return (
      <LocationPermissionPrompt
        language={language}
        featureTitle="compass"
        isRequesting={isRequesting}
        error={error}
        isDenied={isDenied}
        onRequestLocation={requestLocation}
        onSelectManualCity={(lat, lon, city, country) => setManualLocation(lat, lon, city, country)}
      />
    );
  }

  const qiblaBearing = calculateQiblaBearing(location.latitude, location.longitude);
  const distanceKm = calculateDistanceToKaaba(location.latitude, location.longitude);

  const currentHeading = hasCompassSensor ? deviceHeading : manualHeadingOffset;
  const angleDiff = (qiblaBearing - currentHeading + 360) % 360;
  const isAligned = angleDiff <= 4 || angleDiff >= 356;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Location and Bearing Info */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                {isEn ? 'Qibla Direction' : isAr ? 'اتجاه القبلة الشريفة' : 'কিবলার দিক ও কম্পাস'}
              </span>
              <button
                type="button"
                onClick={requestLocation}
                disabled={isRequesting}
                className="p-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                title={isEn ? 'Refresh GPS' : isAr ? 'تحديث الموقع' : 'জিপিএস রিফ্রেশ'}
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

        <div className="flex items-center gap-4 text-center sm:text-right">
          <div>
            <span className="text-[11px] text-slate-400 block">
              {isEn ? 'Qibla Angle' : isAr ? 'زاوية القبلة' : 'কিবলার কোণ'}
            </span>
            <span className="text-xl font-mono font-bold text-amber-300">
              {Math.round(qiblaBearing)}°
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <span className="text-[11px] text-slate-400 block">
              {isEn ? 'Distance to Kaaba' : isAr ? 'المسافة إلى الكعبة' : 'মক্কা থেকে দূরত্ব'}
            </span>
            <span className="text-xl font-mono font-bold text-amber-300">
              {distanceKm.toLocaleString()} km
            </span>
          </div>
        </div>
      </div>

      {/* Alignment Status Banner */}
      <div
        className={`p-3.5 rounded-2xl border text-center transition-all ${
          isAligned
            ? 'bg-gradient-to-r from-amber-500/25 via-emerald-500/20 to-amber-500/25 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20'
            : 'bg-slate-900/80 border-slate-800 text-slate-400'
        }`}
      >
        <div className="flex items-center justify-center gap-2 font-semibold text-sm">
          {isAligned ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span className="text-emerald-300">
                {isEn
                  ? 'Aligned with the Holy Kaaba (Qibla)!'
                  : isAr
                  ? 'أنت مواجه للكعبة المشرفة تماماً!'
                  : 'আপনি সরাসরি পবিত্র কাবার (কিবলা) মুখোমুখি হয়েছেন!'}
              </span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-amber-400 transform -rotate-45" />
              <span>
                {isEn
                  ? `Rotate your phone until the needle matches the golden Kaaba (${Math.round(qiblaBearing)}°)`
                  : isAr
                  ? `قم بتدوير هاتفك حتى تطابق الإبرة اتجاه الكعبة الذهبي (${Math.round(qiblaBearing)}°)`
                  : `ফোনটি ঘুরিয়ে সোনালী কাবার চিহ্নের সাথে মিলান (${Math.round(qiblaBearing)}°)`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* The Visual Circular Compass Rose */}
      <div className="relative flex flex-col items-center justify-center py-6 sm:py-8">
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full border-4 border-amber-500/40 bg-gradient-to-b from-[#131b2e] via-[#0a0f1d] to-[#060a14] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center select-none overflow-hidden">
          {/* Compass Rose Dial (rotates with current device heading) */}
          <div
            className="absolute inset-0 rounded-full transition-transform duration-150 ease-out flex items-center justify-center"
            style={{
              transform: `rotate(${-currentHeading}deg)`,
            }}
          >
            {/* Cardinal Directions */}
            <span className="absolute top-3 font-bold text-red-500 text-sm font-mono">N</span>
            <span className="absolute bottom-3 font-bold text-slate-400 text-sm font-mono">S</span>
            <span className="absolute right-3 font-bold text-slate-400 text-sm font-mono">E</span>
            <span className="absolute left-3 font-bold text-slate-400 text-sm font-mono">W</span>

            {/* Degree Markings */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute w-full h-full flex items-start justify-center pointer-events-none"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div
                  className={`w-0.5 ${
                    deg % 90 === 0 ? 'h-3 bg-amber-400' : 'h-2 bg-slate-600'
                  }`}
                />
              </div>
            ))}

            {/* Golden Kaaba Direction Marker on the dial */}
            <div
              className="absolute w-full h-full flex items-start justify-center pointer-events-none"
              style={{ transform: `rotate(${qiblaBearing}deg)` }}
            >
              <div className="flex flex-col items-center -mt-2">
                <div className="p-1.5 rounded-full bg-amber-400 text-slate-950 shadow-md shadow-amber-400/50">
                  <div className="w-4 h-4 bg-slate-950 border border-amber-300 rounded-sm relative flex items-center justify-center">
                    <div className="w-full h-0.5 bg-amber-400 absolute top-1" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-300 font-mono mt-0.5">
                  {isEn ? 'QIBLA' : isAr ? 'قبلة' : 'কিবলা'}
                </span>
              </div>
            </div>
          </div>

          {/* Fixed Center Point and Arrow Needle */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
            <div
              className="w-48 h-48 sm:w-56 sm:h-56 flex items-start justify-center transition-transform duration-150 ease-out"
              style={{
                transform: `rotate(${angleDiff}deg)`,
              }}
            >
              <div className="w-1.5 h-24 bg-gradient-to-t from-transparent via-amber-400 to-amber-300 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)] relative">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[14px] border-b-amber-300 absolute -top-3 left-1/2 -translate-x-1/2" />
              </div>
            </div>

            <div className="absolute w-12 h-12 rounded-full bg-[#1b253b] border-2 border-amber-400 shadow-xl flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-amber-400 shadow-inner" />
            </div>
          </div>
        </div>

        {/* Current Compass Readout */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-3 font-mono text-slate-300 text-sm">
            <span>
              {isEn ? 'Device Heading:' : isAr ? 'اتجاه الجهاز:' : 'ফোনের দিক:'}{' '}
              <strong className="text-amber-300">{currentHeading}°</strong>
            </span>
            <span>•</span>
            <span>
              {isEn ? 'Kaaba:' : isAr ? 'الكعبة:' : 'পবিত্র কাবা:'}{' '}
              <strong className="text-amber-300">{Math.round(qiblaBearing)}°</strong>
            </span>
          </div>

          {/* Sensor Permission / Manual Fallback Slider */}
          {hasCompassSensor === false && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>
                  {isEn
                    ? 'No magnetic compass sensor detected or permission required.'
                    : isAr
                    ? 'لم يتم العثور على مستشعر البوصلة أو يلزم إذن الوصول.'
                    : 'কম্পাস সেন্সর পাওয়া যায়নি বা পারমিশন প্রয়োজন।'}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={requestIOSSensorPermission}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition-all cursor-pointer"
                >
                  {isEn ? 'Enable Sensor Permission' : isAr ? 'تفعيل الإذن' : 'সেন্সর পারমিশন দিন'}
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {isEn ? 'Manual Orientation Slider' : isAr ? 'شريط التدوير اليدوي' : 'ম্যানুয়াল কম্পাস স্লাইডার'}: {manualHeadingOffset}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={manualHeadingOffset}
                  onChange={(e) => setManualHeadingOffset(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

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
