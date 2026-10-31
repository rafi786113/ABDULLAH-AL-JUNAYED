/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExplanationLanguage } from '../types/grammar';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  inputPlaceholder: string;
  inputLabel: string;
  analyzeBtn: string;
  analyzingBtn: string;
  clearBtn: string;
  toggleTashkeelHide: string;
  toggleTashkeelShow: string;
  abwabEncyclopedia: string;
  abwabShort: string;
  tasreefTable: string;
  exportReport: string;
  copied: string;
  languageSelectLabel: string;
  presetSectionTitle: string;
  vocalizedTextTitle: string;
  listenAll: string;
  clickTokenHint: string;
  overallSummary: string;
  clauseTitle: string;
  hasPosition: string;
  noPosition: string;
  wordBreakdownTitle: (count: number) => string;
  wordBreakdownSubtitle: string;
  fieldSighah: string;
  fieldBahath: string;
  fieldBaab: string;
  fieldMasdar: string;
  fieldRoot: string;
  fieldMizan: string;
  fieldMorphophonemics: string;
  fieldClitics: string;
  fieldIrabRole: string;
  fieldDetailedIrab: string;
  fieldDependencies: string;
  fieldSubtleNote: string;
  copyWord: string;
  listenWord: string;
  partPrefix: string;
  partStem: string;
  partSuffix: string;
  tahqiqTitle: string;
  tarkibTitle: string;
  shanENuzulTitle: string;
  quranAyahDetected: string;
  fieldJins: string;
  fieldMaddah: string;
  fieldMeaning: string;
  footerTitle: string;
  footerTagline: string;
}

export const TRANSLATIONS: Record<ExplanationLanguage, TranslationDictionary> = {
  bn: {
    appName: 'نور',
    appSubtitle: 'আরবি ব্যাকরণ ও শব্দরূপ বিশ্লেষণ ইঞ্জিন: সিগাহ • বহস • বাব • মাসদার • মূলধাতু • তালীল ও ইব্দাল • পূর্ণাঙ্গ ই\'রাব',
    inputPlaceholder: 'এখানে যেকোনো আরবি শব্দ (যেমন: اضْطَرَبَ, نَسْتَعِينُ) অথবা পূর্ণ বাক্য (যেমন: إِنَّ مَعَ الْعُسْرِ يُسْرًا) লিখুন...',
    inputLabel: 'বিশ্লেষণের জন্য আরবি শব্দ বা বাক্য লিখুন:',
    analyzeBtn: 'সূক্ষ্ম ব্যাকরণগত বিশ্লেষণ',
    analyzingBtn: 'বিশ্লেষণ চলছে...',
    clearBtn: 'মুছুন',
    toggleTashkeelHide: 'হরকত কিবোর্ড লুকান',
    toggleTashkeelShow: 'হরকত কিবোর্ড দেখান',
    abwabEncyclopedia: 'আব্বাবের বিশ্বকোষ ও পরিভাষা',
    abwabShort: 'আব্বাব',
    tasreefTable: 'তাসরীফে সাগীর',
    exportReport: 'রিপোর্ট কপি করুন',
    copied: 'কপি হয়েছে!',
    languageSelectLabel: 'ব্যাখ্যার ভাষা:',
    presetSectionTitle: 'অনুশীলনের জন্য তাৎক্ষণিক ক্লাসিক্যাল উদাহরণ:',
    vocalizedTextTitle: 'পূর্ণ হরকতসহ পাঠ্য (Vocalized Text)',
    listenAll: 'পুরো পাঠ্যটি শুনুন',
    clickTokenHint: 'যেকোনো শব্দের সিগাহ, বহস, বাব ও ইরাব দেখতে তার ওপর ক্লিক করুন।',
    overallSummary: 'সামগ্রিক ব্যাকরণিক সারসংক্ষেপ:',
    clauseTitle: 'জুমলাহ ও বাক্যাংশের তারকীব (Clause Breakdown)',
    hasPosition: 'মহলবিশিষ্ট (لها محل)',
    noPosition: 'মহলহীন (لا محل لها)',
    wordBreakdownTitle: (count: number) => `প্রতিটি শব্দের পুঙ্খানুপুঙ্খ ব্যাকরণিক বিশ্লেষণ (${count}টি শব্দ)`,
    wordBreakdownSubtitle: 'সিগাহ, বহস, বাব, মাসদার, তালীল/ইব্দাল এবং পূর্ণাঙ্গ ই\'রাব অন্তর্ভুক্ত',
    fieldSighah: 'সিগাহ (صيغة - রূপ ও পদ)',
    fieldBahath: 'বহস (بحث - রূপান্তর অধ্যায় ও কাল)',
    fieldBaab: 'বাব (باب - রূপান্তর ধারা)',
    fieldMasdar: 'মাসদার (مصدر - মূল ভাববাচক বিশেষ্য)',
    fieldRoot: 'মূলধাতু বা মাদ্দা ও শ্রেণি (Root & Type)',
    fieldMizan: 'মীযান বা ওযন সারফী (Mizan)',
    fieldMorphophonemics: 'তালীল ও ইব্দাল / ধ্বনিতাত্ত্বিক পরিবর্তন (I\'lal & Ibdal):',
    fieldClitics: 'সংযুক্ত হরফ ও সর্বনামের পৃথকীকরণ (Clitic Breakdown):',
    fieldIrabRole: 'বাক্যে অবস্থান (তারকীব)',
    fieldDetailedIrab: 'শব্দের বিস্তারিত ও পূর্ণাঙ্গ ই\'রাব (Detailed I\'rab)',
    fieldDependencies: 'মুতা\'আল্লাক ও সম্পর্ক:',
    fieldSubtleNote: 'সূক্ষ্ম ব্যাকরণিক বা আলঙ্কারিক সূক্ষ্মতা (Subtle Nuance):',
    copyWord: 'শব্দের তথ্য কপি করুন',
    listenWord: 'উচ্চারণ শুনুন',
    partPrefix: 'পূর্বপদ/সাবেক্বা',
    partStem: 'মূল কাণ্ড/জذع',
    partSuffix: 'পরপদ/লাহেক্বা',
    tahqiqTitle: 'তাহকীকুল আলফায (تحقيقات الألفاظ)',
    tarkibTitle: 'তারকীবুল জুমলাহ (تركيب الجملة)',
    shanENuzulTitle: 'এ আয়াতের শানে নুযূল (শান-ই নুযূল)',
    quranAyahDetected: 'পবিত্র কুরআনুল কারীমের আয়াত শনাক্ত হয়েছে',
    fieldJins: 'জিনস (جنس - সহীহ/মিছাল/আজওয়াফ/ইত্যাদি)',
    fieldMaddah: 'মাদ্দা / মূল অক্ষর (مادة)',
    fieldMeaning: 'শব্দার্থ (المعنى)',
    footerTitle: 'نور',
    footerTagline: 'পবিত্র কুরআন, হাদিস ও আরবি ব্যাকরণ গবেষণা প্ল্যাটফর্ম',
  },
  en: {
    appName: 'نور',
    appSubtitle: 'Subtle Arabic Grammar & Morphology Analyzer: Sighah • Bahath • Baab • Masdar • Root • I\'lal & Ibdal • Detailed I\'rab',
    inputPlaceholder: 'Enter any Arabic word (e.g. اضْطَرَبَ, نَسْتَعِينُ) or full sentence (e.g. إِنَّ مَعَ الْعُسْرِ يُسْرًا)...',
    inputLabel: 'Enter Arabic word or sentence for grammatical analysis:',
    analyzeBtn: 'Deep Grammar Analysis',
    analyzingBtn: 'Analyzing subtle layers...',
    clearBtn: 'Clear',
    toggleTashkeelHide: 'Hide Tashkeel Bar',
    toggleTashkeelShow: 'Show Tashkeel Bar',
    abwabEncyclopedia: 'Encyclopedia of Abwab & Terms',
    abwabShort: 'Abwab Guide',
    tasreefTable: 'Conjugation Table',
    exportReport: 'Copy Full Report',
    copied: 'Copied!',
    languageSelectLabel: 'Explanation Language:',
    presetSectionTitle: 'Curated Classical & Quranic Presets for Instant Exploration:',
    vocalizedTextTitle: 'Fully Vocalized Classical Text',
    listenAll: 'Listen to Full Text',
    clickTokenHint: 'Click any word to jump directly to its Sighah, Bahath, Baab, and I\'rab details.',
    overallSummary: 'Overall Grammatical Overview:',
    clauseTitle: 'Clause-Level Syntactic Breakdown (Jumla Analysis)',
    hasPosition: 'Has Inflectional Place',
    noPosition: 'No Inflectional Place',
    wordBreakdownTitle: (count: number) => `Word-by-Word Grammatical & Morphological Breakdown (${count} words)`,
    wordBreakdownSubtitle: 'Includes Sighah, Bahath, Baab, Masdar, Morphophonemics, and full Syntactic I\'rab',
    fieldSighah: 'Sighah (صيغة - Form & Aspect)',
    fieldBahath: 'Bahath (بحث - Paradigm Chapter)',
    fieldBaab: 'Baab (باب - Conjugation Door)',
    fieldMasdar: 'Masdar (مصدر - Verbal Noun)',
    fieldRoot: 'Root & Classification (الجذر)',
    fieldMizan: 'Mizan Sarfi (الوزن - Morphological Template)',
    fieldMorphophonemics: 'Morphophonemic Changes / I\'lal & Ibdal (الإعلال والإبدال):',
    fieldClitics: 'Clitic Decomposition (Affixes & Pronouns):',
    fieldIrabRole: 'Syntactic Role (الموقع الإعرابي)',
    fieldDetailedIrab: 'Comprehensive Syntactic I\'rab (الإعراب التفصيلي)',
    fieldDependencies: 'Syntactic Dependencies & Attachment:',
    fieldSubtleNote: 'Subtle Grammatical / Rhetorical Nuance:',
    copyWord: 'Copy Word Analysis',
    listenWord: 'Listen to Pronunciation',
    partPrefix: 'Prefix',
    partStem: 'Stem',
    partSuffix: 'Suffix',
    tahqiqTitle: 'Word Morphological Tahqiq (تحقيقات الألفاظ)',
    tarkibTitle: 'Sentence Syntactic Compounding (تركيب الجملة)',
    shanENuzulTitle: 'Occasion of Revelation (Asbab al-Nuzul)',
    quranAyahDetected: 'Holy Quran Verse Detected',
    fieldJins: 'Jins / Radical Characteristic (الجنس)',
    fieldMaddah: 'Maddah / Radicals (المادة)',
    fieldMeaning: 'Meaning (المعنى)',
    footerTitle: 'نور',
    footerTagline: 'Quran, Hadith, Arabic Grammar & Translation Platform',
  },
  ar: {
    appName: 'نور',
    appSubtitle: 'نظام التحليل الصرفي والنحوي فائق الدقة: الصيغة • البحث • الباب • المصدر • الجذر • الإعلال والإبدال • الإعراب التفصيلي',
    inputPlaceholder: 'اكتب هنا أي كلمة مفردة (مثل: اضْطَرَبَ، نَسْتَعِينُ) أو جملة كاملة (مثل: إِنَّ مَعَ الْعُسْرِ يُسْرًا)...',
    inputLabel: 'أدخل الكلمة أو الجملة العربية للتحليل الصرفي والنحوي:',
    analyzeBtn: 'تحليل نحوي وصرفي دقيق',
    analyzingBtn: 'جاري التحقيق الصرفي...',
    clearBtn: 'مسح',
    toggleTashkeelHide: 'إخفاء لوحة التشكيل',
    toggleTashkeelShow: 'إظهار لوحة التشكيل',
    abwabEncyclopedia: 'موسوعة الأبواب وقواعد الصرف',
    abwabShort: 'الأبواب',
    tasreefTable: 'جدول التصريف',
    exportReport: 'نسخ التقرير الشامل',
    copied: 'تم النسخ!',
    languageSelectLabel: 'لغة الشرح والبيان:',
    presetSectionTitle: 'نماذج وأمثلة نحوية وصرفية بليغة للاستكشاف الفوري:',
    vocalizedTextTitle: 'النص المضبوط بالشكل التام (Fully Vocalized)',
    listenAll: 'استمع للنص كاملاً',
    clickTokenHint: 'انقر على أي مفردة للانتقال الفوري إلى تفصيل صيغتها وبابها وبحثها وإعرابها.',
    overallSummary: 'الخلاصة الإجمالية:',
    clauseTitle: 'إعراب الجمل وشبه الجمل (Clause-Level Breakdown)',
    hasPosition: 'لها محل من الإعراب',
    noPosition: 'لا محل لها من الإعراب',
    wordBreakdownTitle: (count: number) => `التحليل الصرفي والنحوي التفصيلي لكل مفردة (${count} مفردات)`,
    wordBreakdownSubtitle: 'يتضمن الصيغة، والبحث، والباب، والمصدر، والإعلال والإبدال، والإعراب الكامل',
    fieldSighah: 'الصيغة (Sighah)',
    fieldBahath: 'البحث (Bahath)',
    fieldBaab: 'الباب (Baab)',
    fieldMasdar: 'المصدر (Masdar)',
    fieldRoot: 'الجذر ونوعه (Root & Type)',
    fieldMizan: 'الوزن الصرفي (Mizan Sarfi)',
    fieldMorphophonemics: 'أصل الكلمة وتغيراتها الصرفية (الإعلال والإبدال والقلب والحذف):',
    fieldClitics: 'تفكيك الزوائد والضمائر المتصلة (Clitic Decomposition):',
    fieldIrabRole: 'الموقع الإعرابي',
    fieldDetailedIrab: 'الإعراب التفصيلي للمفردة (Detailed Syntactic I\'rab)',
    fieldDependencies: 'المتعلقات والرتبة:',
    fieldSubtleNote: '✦ نكتة نحوية / لطيفة لغوية:',
    copyWord: 'نسخ بيانات الكلمة',
    listenWord: 'استمع للنطق الصحيح',
    partPrefix: 'سابقة',
    partStem: 'جذع',
    partSuffix: 'لاحقة',
    tahqiqTitle: 'تحقيقات الألفاظ (Tahqiq)',
    tarkibTitle: 'تركيب الجملة (Tarkib)',
    shanENuzulTitle: 'سبب نزول الآية الكريمة (شان نزول)',
    quranAyahDetected: 'آية كريمة من القرآن الكريم',
    fieldJins: 'الجنس (صحيح، معتل، مهموز، مضاعف)',
    fieldMaddah: 'المادة (الحروف الأصلية)',
    fieldMeaning: 'المعنى في السياق',
    footerTitle: 'نور',
    footerTagline: 'منصة القرآن والحديث والنحو والصرف والترجمة',
  },
};
