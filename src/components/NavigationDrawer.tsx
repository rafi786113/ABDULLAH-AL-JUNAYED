/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  BookMarked,
  Languages,
  Layers,
  ChevronRight,
  Table,
  Compass,
  Info,
  Clock,
  CloudSun,
  MessageSquare,
} from 'lucide-react';
import { ExplanationLanguage } from '../types/grammar';
import { AppLogoIcon } from './AppLogo';

export type AppFeatureMode =
  | 'grammar'
  | 'quran'
  | 'bukhari'
  | 'muslim'
  | 'translate'
  | 'salat'
  | 'compass'
  | 'weather'
  | 'contact';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: AppFeatureMode;
  onSelectFeature: (mode: AppFeatureMode) => void;
  language: ExplanationLanguage;
  onLanguageChange: (lang: ExplanationLanguage) => void;
  onOpenAbwabModal: () => void;
  onOpenTasreefModal?: () => void;
  hasTasreef: boolean;
}

interface FeatureItem {
  id: AppFeatureMode;
  titleBn: string;
  titleEn: string;
  titleAr: string;
  badgeBn: string;
  badgeEn: string;
  badgeAr: string;
  descBn: string;
  descEn: string;
  descAr: string;
  statsBn: string;
  statsEn: string;
  statsAr: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeColor: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'grammar',
    titleBn: 'নাহু ও সরফ ব্যাকরণ ইঞ্জিন',
    titleEn: 'Sarf & Nahw Grammar Engine',
    titleAr: 'تحليل النحو والصرف والتركيب',
    badgeBn: 'তাহকীক ও তারকীব',
    badgeEn: 'Tahqiq & Tarkib',
    badgeAr: 'تحقيق وإعراب',
    descBn: 'শব্দের ৭টি অনুষঙ্গ (সিগাহ, বহস, বাব, মাসদার, মাদ্দা, জিনস, অর্থ), জুমলাহর তারকীব ও শানে নুযূল।',
    descEn: 'Comprehensive word-level morphology (Sighah, Bahath, Baab, Masdar, Root, Jins), clause Tarkib, and Asbab al-Nuzul.',
    descAr: 'تحليل صرفي دقيق (الصيغة، البحث، الباب، المصدر، المادة، الجنس) مع الإعراب التفصيلي وأسباب النزول.',
    statsBn: 'দারসে নিজামী পদ্ধতি',
    statsEn: 'Classical Scholarly Method',
    statsAr: 'منهج علمي رصين',
    icon: Sparkles,
    accentColor: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400 group-hover:border-amber-400',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'quran',
    titleBn: 'পবিত্র কুরআনুল কারীম',
    titleEn: 'The Holy Quran Explorer',
    titleAr: 'القرآن الكريم والتفسير',
    badgeBn: '১১৪টি পূর্ণাঙ্গ সূরা',
    badgeEn: '114 Surahs',
    badgeAr: '١١٤ سورة كريمة',
    descBn: 'উসমানী লিপি, প্রামাণ্য বাংলা ও ইংরেজি অর্থ, অডিও তিলাওয়াত এবং ১-ক্লিকে সরাসরি ব্যাকরণ ও শানে নুযূল।',
    descEn: 'Full 114 Surahs in Uthmani calligraphy, English & Bengali translations, audio recital, and 1-click grammatical breakdown.',
    descAr: 'المصحف الشريف بالرسم العثماني مع الترجمة والتلاوة الصوتية والتحليل النحوي والصرفي المباشر لكل آية.',
    statsBn: '৬,২৩৬ আয়াত • ৩০ পারা',
    statsEn: '6,236 Ayahs • 30 Juz',
    statsAr: '٦٢٣٦ آية • ٣٠ جزءاً',
    icon: BookOpen,
    accentColor: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'bukhari',
    titleBn: 'সহীহ আল-বুখারী',
    titleEn: 'Sahih al-Bukhari',
    titleAr: 'صحيح البخاري',
    badgeBn: '৯৭টি কিতাব',
    badgeEn: '97 Books',
    badgeAr: '٩٧ كتاباً',
    descBn: 'ইমাম বুখারী (রহ.) সংকলিত বিশুদ্ধতম হাদিসের আরবি মতন, বাংলা অনুবাদ, হাদিস নম্বর ও শব্দবিশ্লেষণ।',
    descEn: 'Authentic prophetic traditions compiled by Imam Bukhari with pristine Arabic Matn, translations, and grammatical insight.',
    descAr: 'الجامع المسند الصحيح للإمام البخاري بنصه العربي المعتمد والترجمة مع التفكيك اللغوي والإعراب.',
    statsBn: '৭,৫৬৩+ বিশুদ্ধ হাদিস',
    statsEn: '7,563+ Hadiths',
    statsAr: '٧٥٦٣+ حديث شريف',
    icon: BookMarked,
    accentColor: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400 group-hover:border-indigo-400',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  },
  {
    id: 'muslim',
    titleBn: 'সহীহ মুসলিম',
    titleEn: 'Sahih Muslim',
    titleAr: 'صحيح مسلم',
    badgeBn: '৫৬টি কিতাব',
    badgeEn: '56 Books',
    badgeAr: '٥٦ كتاباً',
    descBn: 'ইমাম মুসলিম (রহ.) সংকলিত সহীহ হাদিসগ্রন্থের অধ্যায়ভিত্তিক পাঠ, অনুবাদ ও সরাসরি ব্যাকরণিক তাহকীক।',
    descEn: 'All chapters of Sahih Muslim with authentic Arabic text, translations, and instant morphological analysis.',
    descAr: 'صحيح الإمام مسلم بن الحجاج بنصوصه الشريفة وبواباته المعتمدة مع أدوات التحقيق النحوي.',
    statsBn: '৭,৪০০+ প্রামাণ্য হাদিস',
    statsEn: '7,400+ Hadiths',
    statsAr: '٧٤٠٠+ حديث شريف',
    icon: Layers,
    accentColor: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 'translate',
    titleBn: 'বাংলা অনুবাদ স্টুডিও',
    titleEn: 'Translation Studio',
    titleAr: 'استوديو الترجمة الفورية',
    badgeBn: 'Google Translate আদলে',
    badgeEn: 'Dual-Pane Studio',
    badgeAr: 'ترجمة دقيقة',
    descBn: 'কুরআনিক ও সাহিত্যিক আরবি থেকে নিখুঁত ভাবার্থ, দ্রুত কপি এবং তাৎক্ষণিক ব্যাকরণিক লিঙ্কিং।',
    descEn: 'Instant scholarly Arabic translation to Bengali and English with real-time bidirectional cross-analysis.',
    descAr: 'ترجمة فورية بليغة من وإلى اللغة العربية مع إمكانية التحويل المباشر لمحرك التحليل النحوي.',
    statsBn: 'দ্বিভাষিক অনুবাদক',
    statsEn: 'Scholarly Translation',
    statsAr: 'ترجمة لغوية متقنة',
    icon: Languages,
    accentColor: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400 group-hover:border-blue-400',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'salat',
    titleBn: 'সালাতের সময়সূচি',
    titleEn: 'Salat Prayer Times',
    titleAr: 'مواقيت الصلاة الدقيقة',
    badgeBn: 'লোকেশন অনুযায়ী',
    badgeEn: 'Precise GPS',
    badgeAr: 'حسب موقعك',
    descBn: 'বর্তমান অবস্থান ও জিপিএস স্থানাঙ্কের ওপর ভিত্তি করে ফজর, যোহর, আসর, মাগরিব, ইশা ও তাহাজ্জুদের সঠিক সময়।',
    descEn: 'Astronomically calculated prayer times with next prayer countdown, Hanafi & Standard Asr, and Tahajjud indicator.',
    descAr: 'حساب فلكي دقيق لأوقات الصلوات الخمس والشروق وثلث الليل الأخير بناءً على موقعك الجغرافي.',
    statsBn: 'দৈনিক ৫ ওয়াক্ত + তাহাজ্জুদ',
    statsEn: 'Daily 5 Prayers + Tahajjud',
    statsAr: 'الصلوات الخمس وقيام الليل',
    icon: Clock,
    accentColor: 'from-amber-500/20 to-orange-600/10 border-amber-500/30 text-amber-400 group-hover:border-amber-400',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'compass',
    titleBn: 'কিবলা কম্পাস',
    titleEn: 'Qibla Compass',
    titleAr: 'بوصلة القبلة الشريفة',
    badgeBn: 'সরাসরি কাবার দিক',
    badgeEn: 'Kaaba Alignment',
    badgeAr: 'اتجاه الكعبة',
    descBn: 'ফোনের সেন্সর ও জিপিএস ব্যবহার করে পবিত্র কাবার সঠিক কোণ (ডিগ্রি), দূরত্ব এবং কিবলামুখী হওয়ার ভাইব্রেশন এলার্ট।',
    descEn: 'Accurate Qibla direction dial with live phone sensor compass, Kaaba angle, and haptic feedback when aligned.',
    descAr: 'تحديد دقيق لزاوية القبلة والمسافة إلى مكة المكرمة مع مؤشر محاذاة الكعبة المشرفة وتنبيه الاهتزاز.',
    statsBn: 'সঠিক কিবলা অ্যালাইনমেন্ট',
    statsEn: 'Precise Kaaba Bearing',
    statsAr: 'محاذاة دقيقة للكعبة',
    icon: Compass,
    accentColor: 'from-amber-500/20 to-yellow-600/10 border-amber-500/30 text-amber-400 group-hover:border-amber-400',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'weather',
    titleBn: 'আবহাওয়া পূর্বাভাস',
    titleEn: 'Precise Weather',
    titleAr: 'الطقس المباشر',
    badgeBn: 'লাইভ আবহাওয়া',
    badgeEn: 'Live Forecast',
    badgeAr: 'توقعات فورية',
    descBn: 'বর্তমান তাপমাত্রাসহ ২৪ ঘণ্টার আবহাওয়া, বৃষ্টিপাত, বাতাসের গতি ও সালাতের জন্য প্রস্তুতিমূলক আবহাওয়া বার্তা।',
    descEn: 'Real-time temperature, humidity, wind, 24-hour slider, and 7-day outlook tailored to your location.',
    descAr: 'درجات الحرارة الحالية، الرطوبة، سرعة الرياح، وتوقعات ٢٤ ساعة و٧ أيام لموقعك الحالي.',
    statsBn: 'লাইভ ডেটা ও ৭ দিনের চিত্র',
    statsEn: 'Live Weather & 7-Day Outlook',
    statsAr: 'بيانات حية وتوقعات أسبوعية',
    icon: CloudSun,
    accentColor: 'from-sky-500/20 to-blue-600/10 border-sky-500/30 text-sky-400 group-hover:border-sky-400',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  {
    id: 'contact',
    titleBn: 'পরামর্শ ও মতামত (Contact Us)',
    titleEn: 'Advice & Contact Us',
    titleAr: 'النصائح والملاحظات للتطوير',
    badgeBn: 'সরাসরি ডেভেলপারকে',
    badgeEn: 'Direct Feedback',
    badgeAr: 'تواصل مباشر',
    descBn: 'অ্যাপকে আরও সমৃদ্ধ করতে আপনার নাম ও মূল্যবান পরামর্শ সরাসরি rafi786113@gmail.com ঠিকানায় পাঠান।',
    descEn: 'Share your advices, ideas, and suggestions directly with our team at rafi786113@gmail.com.',
    descAr: 'شاركنا نصائحك واقتراحاتك لتطوير المنصة لتصل رسالتك مباشرة إلى المشرفين.',
    statsBn: 'সরাসরি rafi786113@gmail.com',
    statsEn: 'Direct to rafi786113@gmail.com',
    statsAr: 'مباشرة إلى rafi786113@gmail.com',
    icon: MessageSquare,
    accentColor: 'from-rose-500/20 to-amber-600/10 border-rose-500/30 text-rose-400 group-hover:border-rose-400',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
];

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeMode,
  onSelectFeature,
  language,
  onLanguageChange,
  onOpenAbwabModal,
  onOpenTasreefModal,
  hasTasreef,
}) => {
  const isEn = language === 'en';
  const isAr = language === 'ar';

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Application Navigation and Features"
        className="relative ml-0 mr-auto w-full max-w-md bg-[#090d16] border-r border-slate-800 shadow-2xl flex flex-col h-full z-10 overflow-hidden transform transition-transform animate-in slide-in-from-left duration-250"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0c111e] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AppLogoIcon size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-amiri text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400" dir="rtl">
                  نور
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                  {isEn ? 'Feature Hub' : isAr ? 'مركز الميزات' : 'ফিচার হাব'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isEn
                  ? 'Quran, Hadith, Arabic Grammar & Translation Platform'
                  : isAr
                  ? 'منصة القرآن الكريم والحديث النبوي وعلوم العربية'
                  : 'কুরআন, হাদিস, আরবি ব্যাকরণ ও অনুবাদ কেন্দ্র'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Section: Main Features List */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isEn
                    ? 'Application Features'
                    : isAr
                    ? 'أقسام المنصة الرئيسية'
                    : 'প্রধান ফিচারসমূহ'}
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {isEn ? '5 Modules' : isAr ? '٥ أقسام' : '৫টি মডিউল'}
              </span>
            </div>

            <div className="space-y-2.5">
              {FEATURES.map((item) => {
                const Icon = item.icon;
                const isActive = activeMode === item.id;

                const title = isEn ? item.titleEn : isAr ? item.titleAr : item.titleBn;
                const badge = isEn ? item.badgeEn : isAr ? item.badgeAr : item.badgeBn;
                const desc = isEn ? item.descEn : isAr ? item.descAr : item.descBn;
                const stats = isEn ? item.statsEn : isAr ? item.statsAr : item.statsBn;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectFeature(item.id);
                      onClose();
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all group flex items-start gap-3.5 cursor-pointer relative overflow-hidden ${
                      isActive
                        ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
                    )}

                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 border transition-all ${item.accentColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                          {title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-medium shrink-0 ${item.badgeColor}`}
                        >
                          {badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-1.5">
                        {desc}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>{stats}</span>
                        <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-sans">
                          {isEn ? 'Open' : isAr ? 'فتح' : 'খুলুন'}{' '}
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Auxiliary Scholarly Tools */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3 px-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {isEn
                  ? 'Scholarly Tools & References'
                  : isAr
                  ? 'الأدوات والمراجع اللغوية'
                  : 'সহায়ক সরঞ্জাম'}
              </span>
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  onOpenAbwabModal();
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 text-left cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <BookMarked className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 block">
                      {isEn
                        ? 'Classical Abwab Encyclopedia (39 Doors)'
                        : isAr
                        ? 'موسوعة أبواب الصرف (٣٩ باباً)'
                        : '৩৯টি আরবি আবওয়াব বিশ্বকোষ'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isEn
                        ? 'Complete catalog of Thulathi Mujarrad & Mazid Fih verb paradigms'
                        : isAr
                        ? 'دليل أوزان الأفعال المجردة والمزيدة ومعانيها'
                        : 'সুলাসী মুজাররাদ ও মাযীদ ফীহ এর পূর্ণাঙ্গ ওযন ও বাবের তালিকা'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </button>

              {hasTasreef && onOpenTasreefModal && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenTasreefModal();
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 text-left cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Table className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 block">
                        {isEn
                          ? 'Morphological Paradigm (Tasreef Saghir)'
                          : isAr
                          ? 'جدول التصريف الصغير'
                          : 'তাসরীফে সগীর ছক (Conjugations)'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {isEn
                          ? 'Full tense, voice, participle and verbal noun paradigm for active root'
                          : isAr
                          ? 'تصريف الماضي والمضارع والأمر واسمي الفاعل والمفعول'
                          : 'বর্তমান নির্বাচিত ক্রিয়াপদের সম্পূর্ণ রূপান্তর তালিকা'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </button>
              )}
            </div>
          </div>

          {/* Section: Language Selection */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3 px-1">
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {isEn
                  ? 'Explanation Language'
                  : isAr
                  ? 'لغة البيان والشرح'
                  : 'ব্যাখ্যার ভাষা নির্বাচন'}
              </span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('bn')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer font-bengali ${
                  language === 'bn'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ar')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer font-amiri ${
                  language === 'ar'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Info className="w-3.5 h-3.5" />
              <span>
                {isEn
                  ? 'Integrated Islamic & Linguistic Workflow'
                  : isAr
                  ? 'تكامل متقدم بين النصوص والتحليل'
                  : 'সমন্বিত ইসলামিক ও ভাষাতাত্ত্বিক স্টুডিও'}
              </span>
            </div>
            <p className="leading-relaxed">
              {isEn
                ? 'When reading any Quranic verse or Hadith, click "Analyze Grammar & Context" to inspect its word-level morphology, syntactic I\'rab, and historical occasion of revelation.'
                : isAr
                ? 'عند قراءة أي آية أو حديث، انقر على زر التحليل النحوي لاستعراض الصيغة والباب والإعراب التام وأسباب النزول فوراً.'
                : 'যেকোনো কুরআন বা হাদিস পড়ার সময় সরাসরি «নাহু-সরফ ও শানে নুযূল» বাটনে ক্লিক করে সংশ্লিষ্ট আয়াতের বা বাক্যের বিস্তারিত ব্যাকরণিক বিশ্লেষণ দেখা যায়।'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0c111e] flex items-center justify-between text-xs text-slate-500">
          <span className="font-amiri text-lg text-amber-400 font-semibold" dir="rtl">نور</span>
          <span className="font-mono text-[11px]">v3.0 • Scholarly Edition</span>
        </div>
      </div>
    </div>
  );
};
