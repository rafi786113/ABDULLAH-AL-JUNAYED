/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ExplanationLanguage = 'en' | 'bn' | 'ar';

export interface AttachedTokenPart {
  part: string; // e.g. "فَـ", "أَسْقَيْ", "نَا", "كُمُ", "وهُ"
  type: 'prefix' | 'stem' | 'suffix'; // سابق / جذر أو جذع / لاحق
  meaning: string; // e.g. "الفاء عاطفة تفيد التعقيب", "ضمير متصل في محل رفع فاعل"
}

export interface MorphologicalBreakdown {
  word: string; // The token with full diacritics
  cleanWord: string; // Without diacritics
  wordType: 'فعل' | 'اسم' | 'حرف'; // Part of speech
  subType?: string; // e.g. فعل ماض، اسم مشتق (اسم فاعل)، اسم جامد، حرف جر

  // Core requested fields:
  sighah: string; // الصيغة: e.g. "مفرد مذكر غائب - فعل ماض مبني للمجهول"
  bahath: string; // البحث: e.g. "بحث ماضي معروف مثبت" or "بحث مضارع منفي بـ لم"
  baab: string; // الباب: e.g. "باب نَصَرَ يَنْصُرُ (فَعَلَ - يَفْعُلُ)" or "باب اسْتِفْعَال (ثلاثي مزيد بثلاثة أحرف)"
  baabMeaning?: string; // المعنى المستفاد من الباب كالطلب أو التعدية أو المطاوعة
  masdar: string; // المصدر: e.g. "إِكْرَام" or "عِلْم"
  masdarType?: string; // e.g. "مصدر أصلي صريح", "مصدر ميمي", "اسم مرة"

  // Subtle morphological fields:
  root: string; // الجذر: e.g. "ع - ل - م"
  maddah?: string; // المادة: e.g. "ر + ج + ع"
  jins?: string; // الجنس (هفت جنس): e.g. "صحيح" / "معتل أجوف" / "مهموز"
  rootClassification: string; // نوع الجذر: e.g. "صحيح سالم", "معتل أجوف واوي", "مهموز الفاء", "مضعف ثلاثي"
  meaning?: string; // المعنى السياقي والدقيق للكلمة
  mizanSarfi: string; // الوزن الصرفي: e.g. "فَعَلَ", "مُسْتَفْعِل", "فُعُول", "تَفَعَّلَ"
  morphophonemicChange?: string; // الإعلال والإبدال والنقل والحذف: e.g. "أصلها قَوَلَ: تحركت الواو وانفتح ما قبلها فقُلبت ألفاً"
  cliticDecomposition?: AttachedTokenPart[]; // تفكيك الزوائد والضمائر

  // Syntactic fields (الإعراب):
  irabRole: string; // الموقع الإعرابي: e.g. "فاعل مرفوع", "مفعول به ثانٍ منصوب", "خبر المبتدأ"
  irabCase: 'مرفوع' | 'منصوب' | 'مجرور' | 'مجزوم' | 'مبني'; // الحالة الإعرابية
  irabSign: string; // علامة الإعراب: e.g. "الضمة الظاهرة على آخره", "الياء لأنه جمع مذكر سالم", "حذف حرف العلة"
  irabFull: string; // الإعراب التفصيلي الكامل والشامل
  syntacticDependencies?: string; // متعلقات الكلمة (متعلق بـ الفعل كذا، أو متعلق بمحذوف خبر...)
  subtleNote?: string; // نكتة بلاغية أو لفتة نحوية صرفية دقيقة
}

export interface SentenceClauseIrab {
  clause: string; // الجملة أو شبه الجملة
  clauseType: string; // فعلية، اسمية، شبه جملة
  hasPosition: boolean; // لها محل أم لا محل لها من الإعراب
  irabPosition: string; // e.g. "في محل رفع خبر المبتدأ" or "ابتدائية لا محل لها من الإعراب"
  reason: string; // التعليل
}

export interface QuranReferenceInfo {
  isQuranic?: boolean;
  surahNameArabic: string; // e.g. "سورة البقرة"
  surahNameBangla: string; // e.g. "সূরা আল-বাক্বারাহ"
  surahNameEnglish: string; // e.g. "Surah Al-Baqarah"
  surahNumber: number; // e.g. 2
  ayahNumber: string | number; // e.g. "44"
  ayahSnippetArabic?: string; // النص القرآني المضبوط
}

export interface ShanENuzulInfo {
  hasShanENuzul: boolean;
  title: string; // e.g. "এ আয়াতের শানে নুযূল"
  narrations: Array<{
    point: number;
    text: string;
    source?: string; // e.g. "বায়যাবি", "হযরত আব্দুল্লাহ ইবনে আব্বাস (রাযি.) হতে বর্ণিত"
  }>;
  generalContext?: string;
}

export interface TarkibStep {
  token: string; // e.g. "و", "انتم", "تتلون", "الكتاب"
  roleText: string; // e.g. "এখানে و হলো حالیة", "انتم হলো مبتدأ", "تتلون হলো فعل ও ফায়েল", "الكتاب হলো مفعول به"
  roleArabic?: string;
}

export interface TarkibInfo {
  title: string; // "تركيب الجملة" / "তারকীব"
  breakdownSteps: TarkibStep[];
  synthesisText: string; // e.g. "অতঃপর (ফেল, ফায়েল ও মাফঊল মিলে جملة فعلية হয়ে খবর হয়েছে। مبتدأ ও খবর মিলে جملة اسمية হয়ে حال হয়েছে।)"
  finalSentenceType: string; // e.g. "جملة اسمية حالية"
}

export interface FullAnalysisResponse {
  input: string; // Original text input
  diacritizedText: string; // Fully vowelled classical text
  analysisSummary: string; // High-level scholarly summary
  sentenceType: 'جملة فعلية' | 'جملة اسمية' | 'شبه جملة' | 'مفردة لغوية مستقلة';
  isQuranic?: boolean;
  quranReference?: QuranReferenceInfo;
  shanENuzul?: ShanENuzulInfo;
  tarkib?: TarkibInfo;
  words: MorphologicalBreakdown[];
  clauses?: SentenceClauseIrab[];
  sarfConjugationTable?: {
    past: string; // الماضي (نَصَرَ)
    present: string; // المضارع (يَنْصُرُ)
    imperative: string; // الأمر (اُنْصُرْ)
    passivePast: string; // الماضي المجهول (نُصِرَ)
    passivePresent: string; // المضارع المجهول (يُنْصَرُ)
    activeParticiple: string; // اسم الفاعل (نَاصِر)
    passiveParticiple: string; // اسم المفعول (مَنْصُور)
    masdar: string; // المصدر (نَصْر)
  };
}
