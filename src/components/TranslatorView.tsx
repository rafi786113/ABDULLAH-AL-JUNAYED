/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  ArrowLeftRight,
  Volume2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Keyboard,
  Layers,
} from 'lucide-react';
import { TranslationResponse } from '../types/translation';
import { TashkeelKeyboard } from './TashkeelKeyboard';
import { speakArabic } from '../utils/speech';
import { ExplanationLanguage } from '../types/grammar';

interface TranslatorViewProps {
  language?: ExplanationLanguage;
  onAnalyzeGrammar?: (text: string) => void;
}

const SAMPLE_PHRASES_MAP = {
  en: [
    { title: 'Bismillah', arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
    { title: 'Ease with Hardship', arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا' },
    { title: 'Seeking Knowledge', arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ' },
    { title: 'Reward of Labor', arabic: 'مَنْ جَدَّ وَجَدَ وَمَنْ زَرَعَ حَصَدَ' },
    { title: 'Praise to Allah', arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا' },
  ],
  bn: [
    { title: 'বিসমিল্লাহ', arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
    { title: 'কষ্টের সাথে স্বস্তি', arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا' },
    { title: 'জ্ঞান অর্জন ফরজ', arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ' },
    { title: 'পরিশ্রমের ফল', arabic: 'مَنْ جَدَّ وَجَدَ وَمَنْ زَرَعَ حَصَدَ' },
    { title: 'আল্লাহর সন্তুষ্টি', arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا' },
  ],
  ar: [
    { title: 'البسملة الشريفة', arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
    { title: 'اليسر مع العسر', arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا' },
    { title: 'فضل طلب العلم', arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ' },
    { title: 'ثمرة الجد والاجتهاد', arabic: 'مَنْ جَدَّ وَجَدَ وَمَنْ زَرَعَ حَصَدَ' },
    { title: 'الرضا بالله تعالى', arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا' },
  ],
};

export const TranslatorView: React.FC<TranslatorViewProps> = ({
  language = 'bn',
  onAnalyzeGrammar,
}) => {
  const isEn = language === 'en';
  const isAr = language === 'ar';
  const samplePhrases = SAMPLE_PHRASES_MAP[language] || SAMPLE_PHRASES_MAP.bn;

  const [sourceText, setSourceText] = useState('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
  const [loading, setLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState<TranslationResponse | null>({
    sourceText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translatedText: isEn
      ? 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'
      : 'পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে (শুরু করছি)।',
    literalTranslation: isEn
      ? 'In the Name of God, the All-Merciful, the Ever-Merciful.'
      : 'আল্লাহর নামে, যিনি পরম করুণাময়, অতি দয়ালু।',
    transliteration: 'Bismillahir Rahmanir Raheem',
    wordGlossary: [
      { arabic: 'بِـ', bengali: isEn ? 'With / In (Preposition)' : 'দ্বারা / মাধ্যমে (জার হরফ)', grammarRole: 'حرف جر' },
      { arabic: 'اسْمِ', bengali: isEn ? 'Name' : 'নামে', grammarRole: 'اسم مجرور' },
      { arabic: 'اللَّهِ', bengali: isEn ? 'Allah / God' : 'আল্লাহর', grammarRole: 'مضاف إليه مجرور' },
      { arabic: 'الرَّحْمَٰنِ', bengali: isEn ? 'The Entirely Merciful' : 'পরম করুণাময়', grammarRole: 'نعت أول مجرور' },
      { arabic: 'الرَّحِيمِ', bengali: isEn ? 'The Especially Merciful' : 'অসীম দয়ালু', grammarRole: 'نعت ثانٍ مجرور' },
    ],
    contextNotes: isEn
      ? 'Opening verse of every Surah in the Holy Quran (except Surah At-Tawbah), affirming Divine Unity and Boundless Mercy.'
      : 'এটি পবিত্র কুরআনের প্রতিটি সূরার প্রারম্ভিক আয়াত (সূরা তাওবা ব্যতীত)। এতে আল্লাহর একত্ববাদ ও অপার রহমতের ঘোষণা রয়েছে।',
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bhavartho' | 'shobdartho' | 'ucharon'>('bhavartho');
  const [showTashkeel, setShowTashkeel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeakingSource, setIsSpeakingSource] = useState(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleTranslate = async (textToTranslate?: string) => {
    const text = (textToTranslate !== undefined ? textToTranslate : sourceText).trim();
    if (!text) {
      setError(
        isEn
          ? 'Please enter Arabic text to translate.'
          : isAr
          ? 'يرجى إدخال نص عربي للترجمة.'
          : 'অনুগ্রহ করে অনুবাদের জন্য আরবি টেক্সট লিখুন।'
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang: 'ar', targetLang: isEn ? 'en' : 'bn' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEn
              ? 'Translation failed.'
              : 'অনুবাদ সম্পন্ন করা যায়নি।')
        );
      }

      setTranslationResult(data);
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(
        err.message ||
          (isEn
            ? 'An error occurred during translation. Please try again.'
            : 'অনুবাদে ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInsertTashkeel = (char: string) => {
    if (!inputRef.current) return;
    const start = inputRef.current.selectionStart;
    const end = inputRef.current.selectionEnd;
    const nextText = sourceText.substring(0, start) + char + sourceText.substring(end);
    setSourceText(nextText);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start + char.length, start + char.length);
      }
    }, 0);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakSource = () => {
    if (!sourceText.trim()) return;
    setIsSpeakingSource(true);
    speakArabic(sourceText, () => setIsSpeakingSource(false));
  };

  const handleSpeakTarget = (text: string) => {
    if (!text.trim() || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeakingTarget(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isEn ? 'en-US' : 'bn-BD';
    utterance.onend = () => setIsSpeakingTarget(false);
    utterance.onerror = () => setIsSpeakingTarget(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Header bar inspired by Google Translate prototype */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Language Tabs Row */}
        <div className="px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>العربية (Arabic)</span>
            </div>

            <div className="p-1.5 text-slate-500">
              <ArrowLeftRight className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>{isEn ? 'English (Scholarly)' : isAr ? 'البنغالية' : 'বাংলা (Bengali)'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTashkeel(!showTashkeel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                showTashkeel
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{isEn ? 'Tashkeel Bar' : isAr ? 'لوحة التشكيل' : 'হরকত কিবোর্ড'}</span>
            </button>
          </div>
        </div>

        {/* Dual Pane Layout (Google Translate Prototype Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x lg:divide-slate-800">
          {/* Left Pane: Source (Arabic) */}
          <div className="p-5 sm:p-6 flex flex-col justify-between min-h-[260px] bg-slate-950/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">
                  {isEn ? 'Arabic Source Input:' : isAr ? 'النص العربي:' : 'আরবি ইনপুট:'}
                </span>
                {sourceText && (
                  <button
                    type="button"
                    onClick={() => setSourceText('')}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {isEn ? 'Clear' : isAr ? 'مسح' : 'মুছুন'}
                  </button>
                )}
              </div>

              <textarea
                ref={inputRef}
                rows={5}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleTranslate();
                  }
                }}
                placeholder={
                  isEn
                    ? 'Enter Arabic words, Quranic verses, Hadiths, or sentences...'
                    : isAr
                    ? 'أدخل الكلمات أو الآيات أو الأحاديث أو الجمل هنا...'
                    : 'এখানে আরবি শব্দ, আয়াত, হাদিস বা বাক্য লিখুন...'
                }
                className="w-full bg-transparent text-amber-100 placeholder:text-slate-600 font-amiri text-2xl sm:text-3xl leading-relaxed outline-none resize-none text-right"
                dir="rtl"
              />
            </div>

            {/* Source Tools & Footer */}
            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeakSource}
                  title={isEn ? 'Recite Arabic' : isAr ? 'استمع للنطق' : 'আরবি উচ্চারণ শুনুন'}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/60 transition-colors cursor-pointer"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeakingSource ? 'animate-bounce text-amber-400' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(sourceText)}
                  title={isEn ? 'Copy Arabic' : isAr ? 'نسخ النص العربي' : 'আরবি কপি করুন'}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500 font-mono">
                  {sourceText.length} {isEn ? 'chars' : isAr ? 'حرف' : 'হরফ'}
                </span>
                <button
                  type="button"
                  onClick={() => handleTranslate()}
                  disabled={loading || !sourceText.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isEn ? 'Translating...' : isAr ? 'جاري الترجمة...' : 'অনুবাদ হচ্ছে...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Translate Now' : isAr ? 'ترجم الآن' : 'অনুবাদ করুন'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Pane: Target Translation */}
          <div className="p-5 sm:p-6 flex flex-col justify-between min-h-[260px] bg-slate-900/40">
            <div>
              {/* Target Mode Switcher Tabs */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('bhavartho')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      activeTab === 'bhavartho'
                        ? 'bg-blue-600 text-white font-semibold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isEn ? 'Contextual Meaning' : isAr ? 'المعنى السياقي' : 'ভাবার্থ (Contextual)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('shobdartho')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      activeTab === 'shobdartho'
                        ? 'bg-blue-600 text-white font-semibold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isEn ? 'Word-by-Word' : isAr ? 'ترجمة حرفية' : 'শব্দার্থ (Word-by-Word)'}
                  </button>
                  {translationResult?.transliteration && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('ucharon')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        activeTab === 'ucharon'
                          ? 'bg-blue-600 text-white font-semibold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isEn ? 'Transliteration' : isAr ? 'النطق اللاتيني' : 'উচ্চারণ'}
                    </button>
                  )}
                </div>

                {onAnalyzeGrammar && (
                  <button
                    type="button"
                    onClick={() => onAnalyzeGrammar(sourceText)}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
                    title={isEn ? 'Inspect complete I\'rab and grammatical breakdown' : 'এই বাক্যের পূর্ণাঙ্গ ব্যাকরণ ও ইরাব বিশ্লেষণ দেখুন'}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>{isEn ? 'Inspect I\'rab' : isAr ? 'عرض الإعراب' : 'ই\'রাব দেখুন'}</span>
                  </button>
                )}
              </div>

              {/* Translation Output Body */}
              <div className="py-2 min-h-[120px]">
                {loading ? (
                  <div className="flex items-center gap-3 py-8 text-slate-400">
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">
                      {isEn ? 'Translating with scholarly precision...' : isAr ? 'جاري تجهيز الترجمة...' : 'অনুবাদ প্রস্তুত করা হচ্ছে...'}
                    </span>
                  </div>
                ) : translationResult ? (
                  <>
                    {activeTab === 'bhavartho' && (
                      <p className="text-xl sm:text-2xl text-slate-100 font-medium leading-relaxed tracking-wide">
                        {translationResult.translatedText}
                      </p>
                    )}

                    {activeTab === 'shobdartho' && (
                      <div className="space-y-3">
                        {translationResult.literalTranslation && (
                          <p className="text-base text-slate-200 font-medium leading-relaxed pb-2 border-b border-slate-800">
                            {translationResult.literalTranslation}
                          </p>
                        )}

                        {translationResult.wordGlossary && translationResult.wordGlossary.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {translationResult.wordGlossary.map((w, idx) => (
                              <div
                                key={idx}
                                className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 text-xs shadow-sm"
                              >
                                <span className="font-amiri text-base font-bold text-amber-300" dir="rtl">
                                  {w.arabic}
                                </span>
                                <span className="text-slate-500">=</span>
                                <span className="text-blue-200 font-medium">
                                  {w.bengali}
                                </span>
                                {w.grammarRole && (
                                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                                    {w.grammarRole}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'ucharon' && translationResult.transliteration && (
                      <p className="text-lg text-emerald-300 italic leading-relaxed">
                        {translationResult.transliteration}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500 text-sm">
                    {isEn
                      ? 'Type Arabic and click "Translate Now".'
                      : isAr
                      ? 'اكتب النص العربي واضغط "ترجم الآن".'
                      : 'আরবি লিখে "অনুবাদ করুন" বাটনে চাপুন।'}
                  </p>
                )}
              </div>
            </div>

            {/* Target Tools & Footer */}
            {translationResult && (
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeakTarget(translationResult.translatedText)}
                    title={isEn ? 'Listen to translation' : 'অনুবাদ শুনুন'}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 border border-slate-700/60 transition-colors cursor-pointer"
                  >
                    <Volume2 className={`w-4 h-4 ${isSpeakingTarget ? 'animate-bounce text-blue-400' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(translationResult.translatedText)}
                    title={isEn ? 'Copy translation' : 'অনুবাদ কপি করুন'}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {translationResult.contextNotes && (
                  <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[280px]">
                    {isEn ? 'Note: ' : 'টিকা: '}{translationResult.contextNotes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Floating Tashkeel Toolbar */}
        {showTashkeel && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80">
            <TashkeelKeyboard
              onInsertChar={handleInsertTashkeel}
              onClear={() => setSourceText('')}
            />
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs">
          {error}
        </div>
      )}

      {/* Detailed Word-by-Word Interlinear Section */}
      {translationResult?.wordGlossary && translationResult.wordGlossary.length > 0 && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>
                {isEn
                  ? 'Interlinear Word-by-Word Analysis:'
                  : isAr
                  ? 'التفكيك المعجمي والإعرابي للمفردات:'
                  : 'শব্দে শব্দে অর্থ ও ব্যাকরণিক ভূমিকা (Interlinear Gloss):'}
              </span>
            </h3>
            <span className="text-xs text-slate-400">
              {isEn
                ? `Total ${translationResult.wordGlossary.length} tokens`
                : isAr
                ? `${translationResult.wordGlossary.length} مفردات`
                : `মোট ${translationResult.wordGlossary.length}টি পদ`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {translationResult.wordGlossary.map((token, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-amiri text-xl font-bold text-amber-300" dir="rtl">
                    {token.arabic}
                  </span>
                  {token.grammarRole && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {token.grammarRole}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-200 font-medium">
                  {token.bengali}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contextual & Rhetorical Notes Card */}
      {translationResult?.contextNotes && (
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/30 text-xs sm:text-sm text-blue-200 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-blue-300 mr-1.5">
              {isEn ? 'Linguistic & Contextual Nuance:' : isAr ? 'لطيفة لغوية وسياقية:' : 'ভাষাগত ও প্রাসঙ্গিক টিকা:'}
            </span>
            <span>{translationResult.contextNotes}</span>
          </div>
        </div>
      )}

      {/* Curated Sample Arabic Phrases for Quick Translation */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {isEn
              ? 'Curated Classical Arabic Phrases for Instant Exploration:'
              : isAr
              ? 'أمثلة ونماذج عربية فصيحة للتجربة الفورية:'
              : 'অনুশীলনের জন্য তাৎক্ষণিক ক্লাসিক্যাল আরবি নমুনা বাক্য:'}
          </span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {samplePhrases.map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSourceText(phrase.arabic);
                handleTranslate(phrase.arabic);
              }}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
            >
              <span className="text-[11px] text-blue-400 font-semibold mb-1">
                {phrase.title}
              </span>
              <span className="font-amiri text-lg font-bold text-slate-200 group-hover:text-amber-300 block text-right" dir="rtl">
                {phrase.arabic}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
