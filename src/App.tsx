/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  BookMarked,
  Search,
  Volume2,
  Table,
  RotateCcw,
  Download,
  Check,
  AlertCircle,
  HelpCircle,
  Compass,
  BookOpen,
  Languages,
  Menu,
  LayoutGrid,
  Layers,
} from 'lucide-react';
import { FullAnalysisResponse, ExplanationLanguage } from './types/grammar';
import { PRESET_EXAMPLES, PresetItem, getPresetAnalysis } from './data/presetExamples';
import { TashkeelKeyboard } from './components/TashkeelKeyboard';
import { AnalysisCard } from './components/AnalysisCard';
import { InteractiveSentenceBanner } from './components/InteractiveSentenceBanner';
import { SentenceClausesView } from './components/SentenceClausesView';
import { QuranShanENuzulCard } from './components/QuranShanENuzulCard';
import { SentenceTarkibCard } from './components/SentenceTarkibCard';
import { TasreefModal } from './components/TasreefModal';
import { ClassicalAbwabModal } from './components/ClassicalAbwabModal';
import { TranslatorView } from './components/TranslatorView';
import { QuranExplorerView } from './components/QuranExplorerView';
import { HadithLibraryView } from './components/HadithLibraryView';
import { SalatView } from './components/SalatView';
import { QiblaCompassView } from './components/QiblaCompassView';
import { WeatherView } from './components/WeatherView';
import { ContactAdviceView } from './components/ContactAdviceView';
import { BottomNavBar } from './components/BottomNavBar';
import { NavigationDrawer, AppFeatureMode } from './components/NavigationDrawer';
import { AppLogo, AppLogoIcon } from './components/AppLogo';
import { TRANSLATIONS } from './utils/translations';

export default function App() {
  const [activeAppMode, setActiveAppMode] = useState<AppFeatureMode>('grammar');
  const [showNavigationDrawer, setShowNavigationDrawer] = useState(false);
  const [inputText, setInputText] = useState('إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ');
  const [language, setLanguage] = useState<ExplanationLanguage>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FullAnalysisResponse | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [showTashkeelKeyboard, setShowTashkeelKeyboard] = useState(true);
  const [showAbwabModal, setShowAbwabModal] = useState(false);
  const [showTasreefModal, setShowTasreefModal] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wordCardsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const t = TRANSLATIONS[language];

  // Load default preset on initial mount
  useEffect(() => {
    const defaultPreset = PRESET_EXAMPLES[0];
    if (defaultPreset) {
      const initial = getPresetAnalysis(defaultPreset, 'en');
      if (initial) {
        setAnalysisResult(initial);
        setSelectedWordIndex(0);
      }
    }
  }, []);

  const handleAnalyze = async (textToAnalyze?: string, langOverride?: ExplanationLanguage) => {
    const text = (textToAnalyze !== undefined ? textToAnalyze : inputText).trim();
    const currentLang = langOverride || language;

    if (!text) {
      setError(
        currentLang === 'bn'
          ? 'অনুগ্রহ করে বিশ্লেষণের জন্য একটি আরবি শব্দ বা বাক্য লিখুন।'
          : currentLang === 'ar'
          ? 'يرجى إدخال كلمة أو جملة عربية للتحليل.'
          : 'Please enter an Arabic word or sentence to analyze.'
      );
      return;
    }

    setError(null);

    // Check if it matches any cached preset for instantaneous response
    const matchedPreset = PRESET_EXAMPLES.find(
      (p) => p.text.trim() === text || p.cachedAnalysis?.words?.[0]?.cleanWord === text
    );
    if (matchedPreset) {
      const presetData = getPresetAnalysis(matchedPreset, currentLang);
      if (presetData) {
        setAnalysisResult(presetData);
        setSelectedWordIndex(0);
        return;
      }
    }

    setLoading(true);

    try {
      let data: any;
      let lastErrMsg = '';

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language: currentLang }),
          });

          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const jsonBody = await response.json();
            if (response.ok) {
              data = jsonBody;
              break;
            } else {
              lastErrMsg = jsonBody?.error || 'Analysis failed.';
              // If 503 or engine busy, retry once after a short pause
              if (response.status === 503 && attempt < 2) {
                await new Promise((r) => setTimeout(r, 1200));
                continue;
              }
              break;
            }
          } else {
            const rawText = await response.text();
            if ((rawText.includes('Starting Server') || rawText.includes('<!doctype')) && attempt < 2) {
              // Server is rebooting/starting up, wait 1.5s
              await new Promise((r) => setTimeout(r, 1500));
              continue;
            }
            lastErrMsg =
              currentLang === 'bn'
                ? 'সার্ভার সক্রিয় হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
                : 'Server is starting up. Please click Analyze again.';
          }
        } catch (fetchErr: any) {
          lastErrMsg = fetchErr?.message || '';
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 1200));
            continue;
          }
        }
      }

      if (!data) {
        throw new Error(
          lastErrMsg ||
            (currentLang === 'bn'
              ? 'বিশ্লেষণে ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
              : 'Analysis failed. Please try again.')
        );
      }

      setAnalysisResult(data);
      setSelectedWordIndex(0);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang: ExplanationLanguage) => {
    setLanguage(newLang);
    const text = inputText.trim();
    if (text) {
      const matchedPreset = PRESET_EXAMPLES.find((p) => p.text.trim() === text);
      if (matchedPreset) {
        const presetData = getPresetAnalysis(matchedPreset, newLang);
        if (presetData) {
          setAnalysisResult(presetData);
          setSelectedWordIndex(0);
          return;
        }
      }
      handleAnalyze(text, newLang);
    }
  };

  const handleSelectPreset = (preset: PresetItem) => {
    setInputText(preset.text);
    const presetData = getPresetAnalysis(preset, language);
    if (presetData) {
      setAnalysisResult(presetData);
      setSelectedWordIndex(0);
      setError(null);
    } else {
      handleAnalyze(preset.text, language);
    }
  };

  const handleInsertTashkeel = (char: string) => {
    if (!inputRef.current) return;
    const textarea = inputRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = inputText;
    const updated = current.substring(0, start) + char + current.substring(end);
    setInputText(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  const handleClear = () => {
    setInputText('');
    inputRef.current?.focus();
  };

  const handleSelectWord = (index: number) => {
    setSelectedWordIndex(index);
    const cardEl = wordCardsRef.current[index];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCopyFullAnalysis = () => {
    if (!analysisResult) return;

    let text = `# ${t.appName} - Grammar Analysis\n\n`;
    text += `Text: ${analysisResult.diacritizedText}\n`;
    text += `Type: ${analysisResult.sentenceType}\n`;
    text += `Summary: ${analysisResult.analysisSummary}\n\n`;
    text += `## Word-by-Word Breakdown:\n`;

    analysisResult.words.forEach((w, i) => {
      text += `\n### ${i + 1}. ${w.word} (${w.cleanWord})\n`;
      text += `- ${t.fieldSighah}: ${w.sighah}\n`;
      text += `- ${t.fieldBahath}: ${w.bahath}\n`;
      text += `- ${t.fieldBaab}: ${w.baab}\n`;
      text += `- ${t.fieldMasdar}: ${w.masdar} ${w.masdarType ? `(${w.masdarType})` : ''}\n`;
      text += `- ${t.fieldRoot}: ${w.root} (${w.rootClassification})\n`;
      text += `- ${t.fieldMizan}: ${w.mizanSarfi}\n`;
      if (w.morphophonemicChange) text += `- ${t.fieldMorphophonemics} ${w.morphophonemicChange}\n`;
      text += `- ${t.fieldIrabRole}: ${w.irabRole}\n`;
      text += `- ${t.fieldDetailedIrab}: ${w.irabFull}\n`;
      if (w.subtleNote) text += `- ${t.fieldSubtleNote} ${w.subtleNote}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div
      className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-arabic"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top Scholarly Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setShowNavigationDrawer(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer group"
              title={language === 'en' ? 'Open Feature Menu' : language === 'ar' ? 'فتح القائمة' : 'সকল ফিচার মেনু খুলুন'}
              aria-label={language === 'en' ? 'Open Feature Menu' : language === 'ar' ? 'فتح القائمة' : 'সকল ফিচার মেনু খুলুন'}
            >
              <Menu className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-slate-200">
                {language === 'en' ? 'Menu' : language === 'ar' ? 'القائمة' : 'মেনু'}
              </span>
            </button>

            <AppLogo language={language} onClick={() => setActiveAppMode('grammar')} />
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector Buttons */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Explain in English"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('bn')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer font-bengali ${
                  language === 'bn'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="বাংলায় ব্যাখ্যা (Explain in Bengali)"
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('ar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer font-amiri ${
                  language === 'ar'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="باللغة العربية"
              >
                عربي
              </button>
            </div>

            {analysisResult?.sarfConjugationTable && (
              <button
                type="button"
                onClick={() => setShowTasreefModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all cursor-pointer"
              >
                <Table className="w-4 h-4 text-amber-400" />
                <span>{t.tasreefTable}</span>
              </button>
            )}

            {analysisResult && (
              <button
                type="button"
                onClick={handleCopyFullAnalysis}
                title={t.exportReport}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Primary Navigation Tabs: Grammar, Holy Quran, Sahih Bukhari, Sahih Muslim, and Translation */}
      <nav aria-label="Main Navigation" className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-1.5 py-2 overflow-x-auto no-scrollbar">
            {/* 1. Grammar Analyzer */}
            <button
              type="button"
              onClick={() => setActiveAppMode('grammar')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                activeAppMode === 'grammar'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'en'
                  ? 'Grammar & Sarf'
                  : language === 'ar'
                  ? 'النحو والصرف'
                  : 'নাহু ও সরফ'}
              </span>
            </button>

            {/* 2. Holy Quran Explorer */}
            <button
              type="button"
              onClick={() => setActiveAppMode('quran')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                activeAppMode === 'quran'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'en'
                  ? 'Holy Quran'
                  : language === 'ar'
                  ? 'القرآن الكريم'
                  : 'পবিত্র কুরআন'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono hidden md:inline-block">
                {language === 'en' ? '114 Surahs' : language === 'ar' ? '١١٤ سورة' : '১১৪ সূরা'}
              </span>
            </button>

            {/* 3. Sahih al-Bukhari */}
            <button
              type="button"
              onClick={() => setActiveAppMode('bukhari')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                activeAppMode === 'bukhari'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <BookMarked className="w-4 h-4 text-indigo-300" />
              <span>
                {language === 'en'
                  ? 'Sahih Bukhari'
                  : language === 'ar'
                  ? 'صحيح البخاري'
                  : 'সহীহ বুখারী'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono hidden md:inline-block">
                {language === 'en' ? '97 Books' : language === 'ar' ? '٩٧ كتاباً' : '৯৭ কিতাব'}
              </span>
            </button>

            {/* 4. Sahih Muslim */}
            <button
              type="button"
              onClick={() => setActiveAppMode('muslim')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                activeAppMode === 'muslim'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-300" />
              <span>
                {language === 'en'
                  ? 'Sahih Muslim'
                  : language === 'ar'
                  ? 'صحيح مسلم'
                  : 'সহীহ মুসলিম'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono hidden md:inline-block">
                {language === 'en' ? '56 Books' : language === 'ar' ? '٥٦ كتاباً' : '৫৬ কিতাব'}
              </span>
            </button>

            {/* 5. Arabic-Bengali Translator */}
            <button
              type="button"
              onClick={() => setActiveAppMode('translate')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                activeAppMode === 'translate'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Languages className="w-4 h-4 text-blue-300" />
              <span>
                {language === 'en'
                  ? 'Translation'
                  : language === 'ar'
                  ? 'الترجمة'
                  : 'বাংলা অনুবাদ'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {activeAppMode === 'quran' ? (
          <QuranExplorerView
            language={language}
            onAnalyzeAyah={(txt) => {
              setInputText(txt);
              setActiveAppMode('grammar');
              handleAnalyze(txt, language);
            }}
            onTranslateAyah={(_txt) => {
              setActiveAppMode('translate');
            }}
          />
        ) : activeAppMode === 'bukhari' ? (
          <HadithLibraryView
            language={language}
            initialCollection="bukhari"
            onCollectionChange={(col) => setActiveAppMode(col)}
            onAnalyzeHadith={(txt) => {
              setInputText(txt);
              setActiveAppMode('grammar');
              handleAnalyze(txt, language);
            }}
            onTranslateHadith={(_txt) => {
              setActiveAppMode('translate');
            }}
          />
        ) : activeAppMode === 'muslim' ? (
          <HadithLibraryView
            language={language}
            initialCollection="muslim"
            onCollectionChange={(col) => setActiveAppMode(col)}
            onAnalyzeHadith={(txt) => {
              setInputText(txt);
              setActiveAppMode('grammar');
              handleAnalyze(txt, language);
            }}
            onTranslateHadith={(_txt) => {
              setActiveAppMode('translate');
            }}
          />
        ) : activeAppMode === 'translate' ? (
          <TranslatorView
            language={language}
            onAnalyzeGrammar={(txt) => {
              setInputText(txt);
              setActiveAppMode('grammar');
              handleAnalyze(txt, language);
            }}
          />
        ) : activeAppMode === 'salat' ? (
          <SalatView
            language={language}
            onNavigateToCompass={() => setActiveAppMode('compass')}
          />
        ) : activeAppMode === 'compass' ? (
          <QiblaCompassView language={language} />
        ) : activeAppMode === 'weather' ? (
          <WeatherView language={language} />
        ) : activeAppMode === 'contact' ? (
          <ContactAdviceView language={language} />
        ) : (
          <>
            {/* Analysis Input & Tashkeel Section */}
        <section className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <label htmlFor="arabic-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.inputLabel}</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowTashkeelKeyboard(!showTashkeelKeyboard)}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                {showTashkeelKeyboard ? t.toggleTashkeelHide : t.toggleTashkeelShow}
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              id="arabic-input"
              ref={inputRef}
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
              placeholder={t.inputPlaceholder}
              className="w-full bg-slate-950/90 text-amber-100 placeholder:text-slate-600 font-amiri text-2xl sm:text-3xl p-4 sm:p-5 rounded-xl border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none leading-relaxed resize-y transition-all text-right"
              dir="rtl"
            />
          </div>

          {/* Tashkeel Quick Insert Toolbar */}
          {showTashkeelKeyboard && (
            <div className="mt-3">
              <TashkeelKeyboard
                onInsertChar={handleInsertTashkeel}
                onClear={handleClear}
              />
            </div>
          )}

          {/* Action Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>
                {language === 'bn'
                  ? 'সিগাহ, বহস, বাব, মাসদার, তালীল ও ইব্দাল এবং পূর্ণাঙ্গ ই\'রাব বাংলায় প্রদর্শিত হবে।'
                  : language === 'ar'
                  ? 'يدعم المفردات، الأفعال المجردة والمزيدة، الحروف، والجمل الإعرابية المركبة.'
                  : 'Provides complete breakdown of Sighah, Bahath, Baab, Masdar, Morphophonemics, and Detailed I\'rab in English.'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                {t.clearBtn}
              </button>
              <button
                type="button"
                onClick={() => handleAnalyze()}
                disabled={loading || !inputText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.analyzingBtn}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t.analyzeBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Curated Presets / Iconic Classical Samples */}
        <section className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Compass className="w-4 h-4 text-amber-400" />
              {t.presetSectionTitle}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {PRESET_EXAMPLES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-amber-400/90 font-medium">{preset.category}</span>
                  </div>
                  <span className="font-amiri text-lg font-bold text-slate-200 group-hover:text-amber-300 block transition-colors text-right" dir="rtl">
                    {preset.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.subtleHighlight}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-sm block">
                {language === 'bn' ? 'বিশ্লেষণ ব্যর্থ হয়েছে:' : 'Analysis Error:'}
              </span>
              <p className="text-xs leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Scholarly Skeleton */}
        {loading && (
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-8 text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-400 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-amber-300">
                {language === 'bn'
                  ? 'গভীর ব্যাকরণিক ও রূপতাত্ত্বিক বিশ্লেষণ চলছে...'
                  : 'Analyzing root letters, conjugation doors, and subtle morphophonemic layers...'}
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                {language === 'bn'
                  ? 'শব্দের মূলধাতু (মাদ্দা), সুলাছী মুজাররাদ ও মাযীদের বাব, তালীল ও ইব্দাল এবং পূর্ণাঙ্গ ই\'রাব ও তারকীব তৈরি করা হচ্ছে।'
                  : 'Extracting triconsonantal roots, classifying under the 6 classical doors and Mazid forms, elucidating I\'lal & Ibdal rules, and constructing syntax trees.'}
              </p>
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {!loading && analysisResult && (
          <div className="space-y-6">
            {/* Interactive Sentence Vocalization & Word Selector */}
            <InteractiveSentenceBanner
              diacritizedText={analysisResult.diacritizedText}
              sentenceType={analysisResult.sentenceType}
              summary={analysisResult.analysisSummary}
              words={analysisResult.words}
              selectedWordIndex={selectedWordIndex}
              onSelectWord={handleSelectWord}
              language={language}
              onTranslate={() => setActiveAppMode('translate')}
            />

            {/* Quranic Ayah Identification & Shān-e-Nuzūl (شان نزول) */}
            {(analysisResult.isQuranic || analysisResult.shanENuzul || analysisResult.quranReference) && (
              <QuranShanENuzulCard
                quranReference={analysisResult.quranReference}
                shanENuzul={analysisResult.shanENuzul}
                language={language}
              />
            )}

            {/* Traditional Dars-e-Nizami Sentence Tarkib (تركيب الجملة) */}
            {analysisResult.tarkib && (
              <SentenceTarkibCard
                tarkib={analysisResult.tarkib}
                language={language}
              />
            )}

            {/* Sentence-Level Clauses */}
            {analysisResult.clauses && analysisResult.clauses.length > 0 && (
              <SentenceClausesView clauses={analysisResult.clauses} language={language} />
            )}

            {/* Detailed Word-by-Word Analysis Cards */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base sm:text-lg text-slate-100">
                    {t.wordBreakdownTitle(analysisResult.words.length)}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {t.wordBreakdownSubtitle}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {analysisResult.words.map((word, idx) => (
                  <div
                    key={idx}
                    ref={(el) => {
                      wordCardsRef.current[idx] = el;
                    }}
                  >
                    <AnalysisCard
                      wordData={word}
                      index={idx}
                      isSelected={selectedWordIndex === idx}
                      onSelect={() => setSelectedWordIndex(idx)}
                      language={language}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      {/* Classical Abwab Encyclopedia & Glossary Modal */}
      <ClassicalAbwabModal
        isOpen={showAbwabModal}
        onClose={() => setShowAbwabModal(false)}
        language={language}
      />

      {/* Navigation & Features Hamburger Drawer */}
      <NavigationDrawer
        isOpen={showNavigationDrawer}
        onClose={() => setShowNavigationDrawer(false)}
        activeMode={activeAppMode}
        onSelectFeature={(mode) => setActiveAppMode(mode)}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenAbwabModal={() => setShowAbwabModal(true)}
        onOpenTasreefModal={() => setShowTasreefModal(true)}
        hasTasreef={Boolean(analysisResult?.sarfConjugationTable)}
      />

      {/* Tasreef Saghir Paradigm Modal */}
      {analysisResult?.sarfConjugationTable && (
        <TasreefModal
          isOpen={showTasreefModal}
          onClose={() => setShowTasreefModal(false)}
          rootWord={analysisResult.diacritizedText}
          conjugations={analysisResult.sarfConjugationTable}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#070a12] py-6 mb-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AppLogoIcon size="sm" />
            <span>{t.footerTagline}</span>
          </div>
          {/* Contact Us & Community Dedication */}
          <div className="flex flex-col sm:items-end items-center text-center sm:text-right text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">
              {language === 'bn' ? 'যোগাযোগ:' : language === 'ar' ? 'تواصل معنا:' : 'Contact us:'}
            </span>
            <div className="flex flex-col sm:items-end items-center gap-0.5 text-[11px] text-slate-400">
              <a
                href="mailto:rafi786113@gmail.com"
                className="hover:text-amber-400 transition-colors inline-flex items-center gap-1 text-amber-300/90 font-mono"
              >
                <span>•</span>
                <span>rafi786113@gmail.com</span>
              </a>
              <span className="inline-flex items-center gap-1">
                <span>•</span>
                <span>
                  {language === 'bn'
                    ? 'অবস্থান: খুলনা, বাংলাদেশ'
                    : language === 'ar'
                    ? 'الموقع: خولنا، بنغلاديش'
                    : 'Location: Khulna, bangladesh.'}
                </span>
              </span>
              <span className="text-slate-400 inline-flex items-center gap-1 max-w-md">
                <span>•</span>
                <span>
                  {language === 'bn'
                    ? 'এই অ্যাপটি বাংলাদেশের সকল জ্ঞানপিপাসুদের জন্য। আশা করি সবার উপকারে আসবে।'
                    : language === 'ar'
                    ? 'هذا التطبيق لجميع طالبي العلم في بنغلاديش. نرجو أن تجدوا فيه النفع والفائدة.'
                    : "The app is for all knowledge seeker of Bangladesh. Hope y'all find this useful."}
                </span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sleek Mobile Bottom Navigation Bar matching user photo */}
      <BottomNavBar
        activeMode={activeAppMode}
        onSelectFeature={(mode) => setActiveAppMode(mode)}
        onOpenAbwabGuide={() => setShowAbwabModal(true)}
        language={language}
      />
    </div>
  );
}
