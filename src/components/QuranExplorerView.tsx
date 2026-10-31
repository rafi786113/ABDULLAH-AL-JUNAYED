/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowLeft,
  Volume2,
  Copy,
  Check,
  Languages,
} from 'lucide-react';
import { QURAN_SURAHS } from '../data/quranSurahList';
import { speakArabic } from '../utils/speech';
import { ExplanationLanguage } from '../types/grammar';

interface QuranExplorerViewProps {
  language?: ExplanationLanguage;
  onAnalyzeAyah?: (text: string) => void;
  onTranslateAyah?: (text: string) => void;
}

interface AyahData {
  numberInSurah: number;
  numberInQuran: number;
  textArabic: string;
  textBengali: string;
  textEnglish: string;
  juz: number;
  page: number;
}

interface LoadedSurah {
  surahNumber: number;
  nameArabic: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: AyahData[];
}

export const QuranExplorerView: React.FC<QuranExplorerViewProps> = ({
  language = 'bn',
  onAnalyzeAyah,
  onTranslateAyah,
}) => {
  const isEn = language === 'en';
  const isAr = language === 'ar';

  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [surahData, setSurahData] = useState<LoadedSurah | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [errorSurah, setErrorSurah] = useState<string | null>(null);

  // Reader Settings
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('large');
  const [showBengali, setShowBengali] = useState(language === 'bn');
  const [showEnglish, setShowEnglish] = useState(language === 'en' || language === 'ar');
  const [copiedAyahIndex, setCopiedAyahIndex] = useState<number | null>(null);
  const [speakingAyahIndex, setSpeakingAyahIndex] = useState<number | null>(null);

  // Sync translation checkboxes when top language changes
  useEffect(() => {
    if (language === 'en') {
      setShowEnglish(true);
      setShowBengali(false);
    } else if (language === 'bn') {
      setShowBengali(true);
      setShowEnglish(false);
    } else {
      setShowEnglish(true);
      setShowBengali(false);
    }
  }, [language]);

  // Filtered Surahs for directory
  const filteredSurahs = useMemo(() => {
    return QURAN_SURAHS.filter((surah) => {
      const matchFilter =
        filterType === 'all' ||
        (filterType === 'Meccan' && (surah.revelationType === 'মাক্কী' || surah.revelationTypeEn === 'Meccan')) ||
        (filterType === 'Medinan' && (surah.revelationType === 'মাদানীয়' || surah.revelationTypeEn === 'Medinan'));

      if (!searchQuery.trim()) return matchFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchName =
        surah.nameBangla.toLowerCase().includes(q) ||
        surah.meaningBangla.toLowerCase().includes(q) ||
        surah.nameArabic.includes(q) ||
        surah.nameArabicFull.includes(q) ||
        surah.englishName.toLowerCase().includes(q) ||
        surah.englishNameTranslation.toLowerCase().includes(q) ||
        surah.number.toString() === q;

      return matchFilter && matchName;
    });
  }, [searchQuery, filterType]);

  const selectedMeta = useMemo(() => {
    if (!selectedSurahNumber) return null;
    return QURAN_SURAHS.find((s) => s.number === selectedSurahNumber) || null;
  }, [selectedSurahNumber]);

  // Fetch Surah details when selectedSurahNumber changes
  useEffect(() => {
    if (!selectedSurahNumber) {
      setSurahData(null);
      return;
    }

    let isCancelled = false;
    setLoadingSurah(true);
    setErrorSurah(null);

    fetch(`/api/quran/surah/${selectedSurahNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load Surah');
        return res.json();
      })
      .then((data) => {
        if (!isCancelled) {
          setSurahData(data);
          setLoadingSurah(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Surah fetch error:', err);
          setErrorSurah(
            isEn
              ? 'Failed to load Surah. Please try again.'
              : isAr
              ? 'تعذر تحميل السورة الكريمة، يرجى إعادة المحاولة.'
              : 'সূরা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
          );
          setLoadingSurah(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedSurahNumber, isEn, isAr]);

  const handleCopyAyah = (ayah: AyahData) => {
    const text = isEn
      ? `
﴿ ${selectedMeta?.englishName || ''} - Ayah ${ayah.numberInSurah} ﴾
${ayah.textArabic}

Translation:
${ayah.textEnglish || ayah.textBengali}
      `.trim()
      : `
﴿ ${selectedMeta?.nameArabicFull || ''} : আয়াত ${ayah.numberInSurah} ﴾
${ayah.textArabic}

অনুবাদ:
${ayah.textBengali || ayah.textEnglish}
      `.trim();

    navigator.clipboard.writeText(text);
    setCopiedAyahIndex(ayah.numberInSurah);
    setTimeout(() => setCopiedAyahIndex(null), 2000);
  };

  const handleSpeakAyah = (ayah: AyahData) => {
    setSpeakingAyahIndex(ayah.numberInSurah);
    speakArabic(ayah.textArabic, () => {
      setSpeakingAyahIndex(null);
    });
  };

  const arabicFontSizeClass =
    fontSize === 'normal'
      ? 'text-xl sm:text-2xl leading-loose'
      : fontSize === 'large'
      ? 'text-2xl sm:text-3xl leading-loose'
      : 'text-3xl sm:text-4xl leading-loose';

  return (
    <div className="space-y-6">
      {/* 1. Surah Reader View */}
      {selectedSurahNumber && selectedMeta ? (
        <div className="space-y-6">
          {/* Top Bar with Back Button & Surah Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedSurahNumber(null)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>
                {isEn
                  ? 'Back to All Surahs'
                  : isAr
                  ? 'العودة لقائمة السور'
                  : 'সকল সূরা তালিকায় ফিরুন'}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {isEn
                  ? `${selectedMeta.revelationTypeEn} • ${selectedMeta.numberOfAyahs} Ayahs`
                  : isAr
                  ? `${selectedMeta.revelationTypeEn === 'Meccan' ? 'مكية' : 'مدنية'} • ${selectedMeta.numberOfAyahs} آية`
                  : `${selectedMeta.revelationType} • ${selectedMeta.numberOfAyahs} টি আয়াত`}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">
                {isEn
                  ? `Surah #${selectedMeta.number}`
                  : isAr
                  ? `سورة رقم ${selectedMeta.number}`
                  : `সূরা নং ${selectedMeta.number}`}
              </span>
            </div>
          </div>

          {/* Surah Header Card */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-lg">
                <span className="font-amiri text-2xl font-bold">{selectedMeta.number}</span>
              </div>
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-amber-300" dir="rtl">
                {selectedMeta.nameArabicFull}
              </h2>
              <p className="text-lg sm:text-xl font-bold text-slate-100">
                {isEn ? (
                  <>
                    {selectedMeta.englishName}
                    <span className="text-sm font-normal text-slate-400 ml-2">
                      ({selectedMeta.englishNameTranslation})
                    </span>
                  </>
                ) : isAr ? (
                  <span>سورة {selectedMeta.nameArabic}</span>
                ) : (
                  <>
                    সূরা {selectedMeta.nameBangla}
                    <span className="text-sm font-normal text-slate-400 ml-2">
                      ({selectedMeta.meaningBangla})
                    </span>
                  </>
                )}
              </p>

              {/* Bismillah Banner for all Surahs except At-Tawbah (9) */}
              {selectedMeta.number !== 9 && (
                <div className="pt-4 mt-4 border-t border-emerald-800/30">
                  <p className="font-amiri text-2xl sm:text-3xl text-emerald-200" dir="rtl">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reading Controls Bar */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">
                {isEn ? 'Arabic Font Size:' : isAr ? 'حجم الخط:' : 'হরকত ও ফন্ট সাইজ:'}
              </span>
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    fontSize === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {isEn ? 'Small' : isAr ? 'صغير' : 'ছোট'}
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    fontSize === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {isEn ? 'Medium' : isAr ? 'متوسط' : 'মাঝারি'}
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('xl')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    fontSize === 'xl' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {isEn ? 'Large' : isAr ? 'كبير' : 'বড়'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showEnglish}
                  onChange={(e) => setShowEnglish(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span>{isEn ? 'English Translation' : isAr ? 'الترجمة الإنجليزية' : 'ইংরেজি অনুবাদ'}</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showBengali}
                  onChange={(e) => setShowBengali(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span>{isEn ? 'Bengali Translation' : isAr ? 'الترجمة البنغالية' : 'বাংলা অনুবাদ'}</span>
              </label>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loadingSurah && (
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-emerald-300">
                {isEn
                  ? 'Loading Holy Verses & Translations...'
                  : isAr
                  ? 'جاري تحميل الآيات الكريمة...'
                  : 'পবিত্র সূরার আয়াত ও অনুবাদ লোড হচ্ছে...'}
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorSurah && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-sm">
              {errorSurah}
            </div>
          )}

          {/* Ayah List */}
          {!loadingSurah && surahData && (
            <div className="space-y-4">
              {surahData.ayahs.map((ayah) => (
                <div
                  key={ayah.numberInSurah}
                  id={`ayah-${ayah.numberInSurah}`}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4 relative group"
                >
                  {/* Top Meta & Action Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-mono font-bold text-xs">
                        {ayah.numberInSurah}
                      </span>
                      <span className="text-xs text-slate-400">
                        {isEn
                          ? `Juz ${ayah.juz} • Page ${ayah.page}`
                          : isAr
                          ? `الجزء ${ayah.juz} • الصفحة ${ayah.page}`
                          : `পারা ${ayah.juz} • পৃষ্ঠা ${ayah.page}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Audio recitation button */}
                      <button
                        type="button"
                        onClick={() => handleSpeakAyah(ayah)}
                        title={isEn ? 'Recite Ayah' : isAr ? 'استمع للتلاوة' : 'তেলাওয়াত শুনুন'}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      >
                        <Volume2
                          className={`w-4 h-4 ${
                            speakingAyahIndex === ayah.numberInSurah
                              ? 'text-emerald-400 animate-pulse'
                              : ''
                          }`}
                        />
                      </button>

                      {/* Copy button */}
                      <button
                        type="button"
                        onClick={() => handleCopyAyah(ayah)}
                        title={isEn ? 'Copy Ayah' : isAr ? 'نسخ الآية' : 'আয়াত কপি করুন'}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      >
                        {copiedAyahIndex === ayah.numberInSurah ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* 1-Click Grammar & Shan-e-Nuzul Analysis */}
                      {onAnalyzeAyah && (
                        <button
                          type="button"
                          onClick={() => onAnalyzeAyah(ayah.textArabic)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {isEn
                              ? 'Grammar & Context'
                              : isAr
                              ? 'تحليل نحوي وإعراب'
                              : 'নাহু-সরফ ও শানে নুযূল'}
                          </span>
                        </button>
                      )}

                      {/* 1-Click Translation Studio */}
                      {onTranslateAyah && (
                        <button
                          type="button"
                          onClick={() => onTranslateAyah(ayah.textArabic)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Languages className="w-3.5 h-3.5 text-blue-400" />
                          <span>{isEn ? 'Translate' : isAr ? 'ترجمة' : 'অনুবাদ স্টুডিও'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div className="py-2 text-right">
                    <p
                      className={`font-amiri text-amber-100 ${arabicFontSizeClass}`}
                      dir="rtl"
                    >
                      {ayah.textArabic}
                      <span className="inline-block mx-2 text-emerald-400/80 font-amiri font-normal">
                        ﴿{ayah.numberInSurah}﴾
                      </span>
                    </p>
                  </div>

                  {/* English Translation */}
                  {showEnglish && ayah.textEnglish && (
                    <div className="pt-2 border-t border-slate-800/50">
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {ayah.textEnglish}
                      </p>
                    </div>
                  )}

                  {/* Bengali Translation */}
                  {showBengali && ayah.textBengali && (
                    <div className="pt-2 border-t border-slate-800/60 font-bengali">
                      <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                        {ayah.textBengali}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* 2. Surah Catalog Directory View */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="text-xl sm:text-2xl font-bold text-emerald-300">
                    {isEn
                      ? 'The Holy Quran (القرآن الكريم)'
                      : isAr
                      ? 'القرآن الكريم والتفسير'
                      : 'পবিত্র কুরআনুল কারীম (القرآن الكريم)'}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  {isEn
                    ? '114 complete Surahs with authentic Uthmani script, translations, and 1-click grammatical breakdown'
                    : isAr
                    ? '١١٤ سورة كريمة بالرسم العثماني مع الترجمة والتحليل النحوي والصرفي المباشر'
                    : '১১৪টি পূর্ণাঙ্গ সূরার উসমানী আরবি মূলপাঠ, বিশুদ্ধ বাংলা অনুবাদ এবং সরাসরি ব্যাকরণিক বিশ্লেষণ'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-emerald-300">
                  {isEn ? '114 Surahs' : isAr ? '١١٤ سورة' : '১১৪টি সূরা'}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-amber-300">
                  {isEn ? '6,236 Ayahs' : isAr ? '٦٢٣٦ آية' : '৬,২৩৬টি আয়াত'}
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEn
                    ? 'Search Surah by name (e.g. Fatiha, Baqarah, الفاتحة) or number (1-114)...'
                    : isAr
                    ? 'ابحث باسم السورة أو رقمها (١-١١٤)...'
                    : 'সূরার নাম (যেমন: বাক্বারাহ, ফাতিহা, Baqarah, الفاتحة) বা সূরা নম্বর (1-114)...'
                }
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isEn
                  ? `All Surahs (${QURAN_SURAHS.length})`
                  : isAr
                  ? `جميع السور (${QURAN_SURAHS.length})`
                  : `সকল সূরা (${QURAN_SURAHS.length})`}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('Meccan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterType === 'Meccan'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isEn ? 'Meccan (Makki)' : isAr ? 'السور المكية' : 'মাক্কী সূরা'}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('Medinan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterType === 'Medinan'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isEn ? 'Medinan (Madani)' : isAr ? 'السور المدنية' : 'মাদানীয় সূরা'}
              </button>
            </div>
          </div>

          {/* Surah Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.number}
                type="button"
                onClick={() => setSelectedSurahNumber(surah.number)}
                className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:shadow-md hover:shadow-emerald-500/5"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/40 flex items-center justify-center font-bold text-xs text-amber-300 font-mono shrink-0">
                    {surah.number}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 truncate">
                      {isEn ? (
                        surah.englishName
                      ) : isAr ? (
                        <span>سورة {surah.nameArabic}</span>
                      ) : (
                        <span>সূরা {surah.nameBangla}</span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {isEn
                        ? surah.englishNameTranslation
                        : isAr
                        ? `${surah.numberOfAyahs} آية`
                        : surah.meaningBangla}
                    </p>
                    <span className="inline-block text-[10px] text-slate-500 font-mono">
                      {isEn
                        ? `${surah.revelationTypeEn} • ${surah.numberOfAyahs} Ayahs`
                        : isAr
                        ? `${surah.revelationTypeEn === 'Meccan' ? 'مكية' : 'مدنية'}`
                        : `${surah.revelationType} • ${surah.numberOfAyahs} টি আয়াত`}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-amiri text-xl font-bold text-amber-200 group-hover:text-amber-300 block" dir="rtl">
                    {surah.nameArabic}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {surah.englishName}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filteredSurahs.length === 0 && (
            <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
              <p className="text-sm text-slate-400">
                {isEn
                  ? 'No Surahs matched your search. Try adjusting the query.'
                  : isAr
                  ? 'لم يتم العثور على أي سورة مطابقة.'
                  : 'কোনো সূরা খুঁজে পাওয়া যায়নি। অনুসন্ধান শব্দ পরিবর্তন করে আবার চেষ্টা করুন।'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
