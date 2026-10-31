/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookMarked,
  Search,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Languages,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { HADITH_COLLECTIONS } from '../data/hadithBookList';
import { speakArabic } from '../utils/speech';
import { ExplanationLanguage } from '../types/grammar';

interface HadithLibraryViewProps {
  language?: ExplanationLanguage;
  initialCollection?: 'bukhari' | 'muslim';
  onCollectionChange?: (col: 'bukhari' | 'muslim') => void;
  onAnalyzeHadith?: (text: string) => void;
  onTranslateHadith?: (text: string) => void;
}

interface HadithItem {
  hadithNumber: number;
  arabicNumber?: number;
  arabicText: string;
  bengaliText: string;
  reference?: string;
}

export const HadithLibraryView: React.FC<HadithLibraryViewProps> = ({
  language = 'bn',
  initialCollection = 'bukhari',
  onCollectionChange,
  onAnalyzeHadith,
  onTranslateHadith,
}) => {
  const isEn = language === 'en';
  const isAr = language === 'ar';

  const [collectionId, setCollectionId] = useState<'bukhari' | 'muslim'>(initialCollection);
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number>(1);

  // Sync if initialCollection prop changes from navigation or hamburger menu
  useEffect(() => {
    if (initialCollection && initialCollection !== collectionId) {
      setCollectionId(initialCollection);
      setSelectedSectionNumber(1);
    }
  }, [initialCollection]);

  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('large');

  const currentCollection = HADITH_COLLECTIONS[collectionId];

  // Currently selected book/chapter metadata
  const currentBookMeta = useMemo(() => {
    return (
      currentCollection.books.find((b) => b.bookNumber === selectedSectionNumber) ||
      currentCollection.books[0]
    );
  }, [currentCollection, selectedSectionNumber]);

  // Fetch Hadiths when collectionId or selectedSectionNumber changes
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/hadith/${collectionId}/${selectedSectionNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load Hadiths');
        return res.json();
      })
      .then((data) => {
        if (!isCancelled) {
          setHadiths(data.hadiths || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Hadith fetch error:', err);
          setError(
            isEn
              ? 'Failed to load Hadith section. Please try again.'
              : isAr
              ? 'تعذر تحميل نصوص الأحاديث الشريفة.'
              : 'হাদিস লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
          );
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [collectionId, selectedSectionNumber, isEn, isAr]);

  // Filter hadiths by search query
  const filteredHadiths = useMemo(() => {
    if (!searchQuery.trim()) return hadiths;
    const q = searchQuery.toLowerCase().trim();
    return hadiths.filter((h) => {
      return (
        h.hadithNumber.toString() === q ||
        h.arabicText.includes(q) ||
        h.bengaliText.toLowerCase().includes(q)
      );
    });
  }, [hadiths, searchQuery]);

  const handleCopy = (h: HadithItem) => {
    const text = isEn
      ? `
[${currentCollection.nameEnglish} - Hadith #${h.hadithNumber}]
Chapter: ${currentBookMeta?.nameEnglish || ''} (${currentBookMeta?.nameArabic || ''})

Arabic Matn:
${h.arabicText}

Bengali Translation:
${h.bengaliText}
      `.trim()
      : `
【${currentCollection.nameBengali} - হাদিস নং ${h.hadithNumber}】
অধ্যায়: ${currentBookMeta?.nameBengali || ''} (${currentBookMeta?.nameArabic || ''})

মূল আরবি হাদিস:
${h.arabicText}

বাংলা অনুবাদ:
${h.bengaliText}
      `.trim();

    navigator.clipboard.writeText(text);
    setCopiedIndex(h.hadithNumber);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (h: HadithItem) => {
    setSpeakingIndex(h.hadithNumber);
    speakArabic(h.arabicText, () => setSpeakingIndex(null));
  };

  const arabicFontSizeClass =
    fontSize === 'normal'
      ? 'text-xl sm:text-2xl leading-loose'
      : fontSize === 'large'
      ? 'text-2xl sm:text-3xl leading-loose'
      : 'text-3xl sm:text-4xl leading-loose';

  return (
    <div className="space-y-6">
      {/* Top Banner: Hadith Library Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold text-amber-300">
                {isEn
                  ? 'Sahih al-Bukhari & Sahih Muslim Hadith Library'
                  : isAr
                  ? 'مكتبة صحيح البخاري وصحيح مسلم'
                  : 'সহীহুল বুখারী ও সহীহ মুসলিম হাদিস লাইব্রেরি'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {isEn
                ? 'Authentic Prophetic traditions with verified Arabic Matn, translations, and direct grammatical breakdown'
                : isAr
                ? 'الصحاح النبوية المعتمدة بنصوصها العربية وإعرابها النحوي والصرفي المباشر'
                : 'বিশুদ্ধতম হাদিস সংকলনের মূল আরবি পাঠ, প্রামাণ্য বাংলা অনুবাদ এবং সরাসরি ব্যাকরণিক বিশ্লেষণ'}
            </p>
          </div>

          {/* Collection Switcher Buttons */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 self-start md:self-auto">
            <button
              type="button"
              onClick={() => {
                setCollectionId('bukhari');
                setSelectedSectionNumber(1);
                onCollectionChange?.('bukhari');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                collectionId === 'bukhari'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>{isEn ? 'Sahih al-Bukhari' : isAr ? 'صحيح البخاري' : 'সহীহুল বুখারী'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCollectionId('muslim');
                setSelectedSectionNumber(1);
                onCollectionChange?.('muslim');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                collectionId === 'muslim'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isEn ? 'Sahih Muslim' : isAr ? 'صحيح مسلم' : 'সহীহ মুসলিম'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Selection & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Chapter / Book Select Dropdown */}
        <div className="md:col-span-2 relative">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isEn
              ? `Select Book / Chapter (${currentCollection.books.length} Books):`
              : isAr
              ? `اختر الكتاب أو الباب (${currentCollection.books.length} باباً):`
              : `হাদিস গ্রন্থ ও অধ্যায় নির্বাচন করুন (${currentCollection.books.length}টি অধ্যায়):`}
          </label>
          <div className="relative">
            <select
              value={selectedSectionNumber}
              onChange={(e) => setSelectedSectionNumber(parseInt(e.target.value, 10))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-amber-200 appearance-none focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
            >
              {currentCollection.books.map((b) => (
                <option key={b.bookNumber} value={b.bookNumber} className="bg-slate-950 text-slate-100">
                  {isEn
                    ? `${b.bookNumber}. ${b.nameEnglish} — ${b.nameArabic}`
                    : isAr
                    ? `${b.bookNumber}. ${b.nameArabic} (${b.nameEnglish})`
                    : `${b.bookNumber}. ${b.nameBengali} — ${b.nameArabic} (${b.nameEnglish})`}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isEn ? 'Search Hadith # or Word:' : isAr ? 'بحث برقم الحديث أو الكلمة:' : 'হাদিস নম্বর বা শব্দ অনুসন্ধান:'}
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Hadith # (e.g. 1) or word...' : isAr ? 'أدخل الرقم أو الكلمة...' : 'হাদিস নং বা শব্দ লিখুন...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Selected Book Heading Card */}
      {currentBookMeta && (
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-amber-300 font-mono text-sm">
              {currentBookMeta.bookNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-amiri text-lg font-bold text-amber-200" dir="rtl">
                  {currentBookMeta.nameArabic}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="font-bold text-sm text-slate-100">
                  {isEn ? currentBookMeta.nameEnglish : isAr ? currentBookMeta.nameArabic : currentBookMeta.nameBengali}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {currentCollection.nameEnglish} • Book #{currentBookMeta.bookNumber}
              </p>
            </div>
          </div>

          {/* Font size toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              {isEn ? 'Arabic Font Size:' : isAr ? 'حجم الخط:' : 'ফন্ট সাইজ:'}
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
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-amber-300">
            {isEn ? 'Loading Hadiths...' : isAr ? 'جاري تحميل الأحاديث...' : 'হাদিসসমূহ ও অনুবাদ লোড হচ্ছে...'}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-sm">
          {error}
        </div>
      )}

      {/* Hadith Cards List */}
      {!loading && (
        <div className="space-y-4">
          {filteredHadiths.map((hadith) => (
            <div
              key={hadith.hadithNumber}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4"
            >
              {/* Top Meta & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                    {isEn ? currentCollection.nameEnglish : isAr ? currentCollection.nameArabic : currentCollection.nameBengali} • {isEn ? 'Hadith #' : isAr ? 'حديث رقم ' : 'হাদিস নং '}{hadith.hadithNumber}
                  </span>
                  {hadith.arabicNumber && (
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      ({isEn ? 'Arabic #' : isAr ? 'الترقيم العربي: ' : 'আরবি ক্রম: '}{hadith.arabicNumber})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Speech button */}
                  <button
                    type="button"
                    onClick={() => handleSpeak(hadith)}
                    title={isEn ? 'Listen to Hadith' : isAr ? 'استمع للحديث' : 'হাদিস শ্রবণ করুন'}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <Volume2
                      className={`w-4 h-4 ${
                        speakingIndex === hadith.hadithNumber ? 'text-amber-400 animate-pulse' : ''
                      }`}
                    />
                  </button>

                  {/* Copy button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(hadith)}
                    title={isEn ? 'Copy Hadith' : isAr ? 'نسخ الحديث' : 'হাদিস কপি করুন'}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    {copiedIndex === hadith.hadithNumber ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* 1-Click Grammar Breakdown */}
                  {onAnalyzeHadith && (
                    <button
                      type="button"
                      onClick={() => onAnalyzeHadith(hadith.arabicText)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isEn ? 'Grammar & Sarf' : isAr ? 'تحليل لغوي وإعراب' : 'ব্যাকরণ ও সরফ বিশ্লেষণ'}</span>
                    </button>
                  )}

                  {/* 1-Click Translation Studio */}
                  {onTranslateHadith && (
                    <button
                      type="button"
                      onClick={() => onTranslateHadith(hadith.arabicText)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Languages className="w-3.5 h-3.5 text-blue-400" />
                      <span>{isEn ? 'Translate' : isAr ? 'ترجمة' : 'অনুবাদ স্টুডিও'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Authentic Arabic Matn */}
              <div className="py-2 text-right">
                <p className={`font-amiri text-amber-100 ${arabicFontSizeClass}`} dir="rtl">
                  {hadith.arabicText}
                </p>
              </div>

              {/* Translation */}
              {hadith.bengaliText && (
                <div className="pt-2 border-t border-slate-800/60">
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    {hadith.bengaliText}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && filteredHadiths.length === 0 && (
        <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <p className="text-sm text-slate-400">
            {isEn
              ? 'No Hadiths found matching your query.'
              : isAr
              ? 'لم يتم العثور على أي حديث مطابق.'
              : 'কোনো হাদিস খুঁজে পাওয়া যায়নি। অনুসন্ধান পরিবর্তন করে পুনরায় চেষ্টা করুন।'}
          </p>
        </div>
      )}
    </div>
  );
};
