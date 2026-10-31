/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));

// In-memory cache for fast repeated analysis
const analysisCache = new Map<string, any>();
const translationCache = new Map<string, any>();

// Initialize Google GenAI client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    input: { type: Type.STRING, description: 'Original user input' },
    diacritizedText: { type: Type.STRING, description: 'The text with full accurate classical vocalization / tashkeel' },
    sentenceType: {
      type: Type.STRING,
      description: 'جملة فعلية / جملة اسمية / شبه جملة / مفردة لغوية مستقلة',
    },
    analysisSummary: {
      type: Type.STRING,
      description: 'Scholarly overview of the sentence/word structure and general meaning',
    },
    isQuranic: {
      type: Type.BOOLEAN,
      description: 'True if the text is from or forms part of an Ayah of the Holy Quran',
    },
    quranReference: {
      type: Type.OBJECT,
      description: 'Reference of the Holy Quran verse if isQuranic is true',
      properties: {
        surahNameArabic: { type: Type.STRING, description: 'e.g. سورة البقرة' },
        surahNameBangla: { type: Type.STRING, description: 'e.g. সূরা আল-বাক্বারাহ' },
        surahNameEnglish: { type: Type.STRING, description: 'e.g. Surah Al-Baqarah' },
        surahNumber: { type: Type.INTEGER, description: 'e.g. 2' },
        ayahNumber: { type: Type.STRING, description: 'e.g. 44' },
        ayahSnippetArabic: { type: Type.STRING, description: 'The complete Quranic Ayah text' },
      },
    },
    shanENuzul: {
      type: Type.OBJECT,
      description: 'Occasion of revelation (Asbab al-Nuzul) for Quranic verses based on classical Tafsir',
      properties: {
        hasShanENuzul: { type: Type.BOOLEAN },
        title: { type: Type.STRING, description: 'এ আয়াতের শানে নুযূল' },
        narrations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              point: { type: Type.INTEGER },
              text: { type: Type.STRING, description: 'Detailed cause of revelation' },
              source: { type: Type.STRING, description: 'Classical source, e.g. বায়যাবি, ইবনে আব্বাস (রা.), কুরতুবী, মাআরিফুল কুরআন' },
            },
            required: ['point', 'text'],
          },
        },
        generalContext: { type: Type.STRING },
      },
      required: ['title', 'narrations'],
    },
    tarkib: {
      type: Type.OBJECT,
      description: 'Traditional Dars-e-Nizami Tarkibul Jumlah (তারকীবুল জুমলাহ) syntax compounding',
      properties: {
        title: { type: Type.STRING, description: 'تركيب الجملة / তারকীব' },
        breakdownSteps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              token: { type: Type.STRING, description: 'e.g. و, انتم, تتلون, الكتاب' },
              roleText: { type: Type.STRING, description: 'e.g. এখানে ও হলো حالیة আর انتم হলো مبتدأ...' },
            },
            required: ['token', 'roleText'],
          },
        },
        synthesisText: {
          type: Type.STRING,
          description: 'Overall compounding synthesis e.g. অতঃপর (ফেল, ফায়েল ও মাফঊল মিলে جملة فعلية হয়ে খবর হয়েছে...)',
        },
        finalSentenceType: { type: Type.STRING, description: 'e.g. جملة اسمية حالية' },
      },
      required: ['title', 'breakdownSteps', 'synthesisText'],
    },
    words: {
      type: Type.ARRAY,
      description: 'Word by word linguistic decomposition (تحقيقات الألفاظ)',
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: 'Word with full tashkeel' },
          cleanWord: { type: Type.STRING, description: 'Word without diacritics' },
          wordType: { type: Type.STRING, description: 'فعل / اسم / حرف' },
          subType: { type: Type.STRING, description: 'e.g. فعل ماض، اسم فاعل، حرف جر، ظرف زمان' },
          sighah: {
            type: Type.STRING,
            description: 'الصيغة: e.g. مفرد مذكر غائب - فعل ماض / جمع مذكر اسم فاعل',
          },
          bahath: {
            type: Type.STRING,
            description: 'البحث: e.g. بحث ماضي معروف مثبت / اسم فاعل',
          },
          baab: {
            type: Type.STRING,
            description: 'الباب: e.g. ضرب (ضَرَبَ يَضْرِبُ) / نصر / إفعال',
          },
          baabMeaning: {
            type: Type.STRING,
            description: 'المعنى المستفاد من الباب إن وُجد',
          },
          masdar: {
            type: Type.STRING,
            description: 'المصدر: e.g. الرجوع / الضرب / النصر',
          },
          masdarType: {
            type: Type.STRING,
            description: 'نوع المصدر: صريح أصلي / ميمي',
          },
          maddah: {
            type: Type.STRING,
            description: 'المادة بالحروف الأصلية مفصولة: e.g. ر + ج + ع',
          },
          jins: {
            type: Type.STRING,
            description: 'الجنس (هفت جنس): صحيح / معتل مثال / أجوف / ناقص / لفيف / مضاعف / مهموز',
          },
          meaning: {
            type: Type.STRING,
            description: 'المعنى / অর্থ: direct translation in context',
          },
          root: {
            type: Type.STRING,
            description: 'الجذر الثلاثي أو الرباعي: e.g. ر - ج - ع',
          },
          rootClassification: {
            type: Type.STRING,
            description: 'تصنيف الجذر: صحيح سالم / مهموز / أجوف / ناقص',
          },
          mizanSarfi: {
            type: Type.STRING,
            description: 'الوزن الصرفي بالميزان (ف-ع-ل): e.g. فَاعِلُون / فَعَلَ',
          },
          morphophonemicChange: {
            type: Type.STRING,
            description: 'الإعلال والإبدال والقلب والنقل والحذف الدقيق إن وُجد',
          },
          cliticDecomposition: {
            type: Type.ARRAY,
            description: 'تجزئة السوابق واللواحق والضمائر المتصلة',
            items: {
              type: Type.OBJECT,
              properties: {
                part: { type: Type.STRING, description: 'الجزء' },
                type: { type: Type.STRING, description: 'prefix / stem / suffix' },
                meaning: { type: Type.STRING, description: 'معنى الجزء' },
              },
              required: ['part', 'type', 'meaning'],
            },
          },
          irabRole: {
            type: Type.STRING,
            description: 'الموقع الإعرابي: مبتدأ، خبر، فاعل، مفعول به، حال',
          },
          irabCase: {
            type: Type.STRING,
            description: 'مرفوع / منصوب / مجرور / مجزوم / مبني',
          },
          irabSign: {
            type: Type.STRING,
            description: 'علامة الإعراب أو البناء مع التعليل',
          },
          irabFull: {
            type: Type.STRING,
            description: 'الإعراب الكامل الدقيق المفصل',
          },
          syntacticDependencies: {
            type: Type.STRING,
            description: 'المتعلقات',
          },
          subtleNote: {
            type: Type.STRING,
            description: 'نكتة لغوية বা ব্যাকরণিক সূক্ষ্মতা',
          },
        },
        required: [
          'word',
          'cleanWord',
          'wordType',
          'sighah',
          'bahath',
          'baab',
          'masdar',
          'maddah',
          'jins',
          'meaning',
          'root',
          'rootClassification',
          'mizanSarfi',
          'irabRole',
          'irabCase',
          'irabSign',
          'irabFull',
        ],
      },
    },
    clauses: {
      type: Type.ARRAY,
      description: 'إعراب الجمل وشبه الجمل (التي لها محل والتي لا محل لها من الإعراب)',
      items: {
        type: Type.OBJECT,
        properties: {
          clause: { type: Type.STRING, description: 'نص الجملة أو شبه الجملة' },
          clauseType: { type: Type.STRING, description: 'فعلية / اسمية / شبه جملة' },
          hasPosition: { type: Type.BOOLEAN, description: 'هل لها محل من الإعراب؟' },
          irabPosition: { type: Type.STRING, description: 'e.g. لا محل لها من الإعراب (ابتدائية) أو في محل رفع خبر' },
          reason: { type: Type.STRING, description: 'التعليل الإعرابي لمحل الجملة' },
        },
        required: ['clause', 'clauseType', 'hasPosition', 'irabPosition', 'reason'],
      },
    },
    sarfConjugationTable: {
      type: Type.OBJECT,
      description: 'التصريف الصغير (إن كان الإدخال فعلاً أو كلمة مفردة مشتقة)',
      properties: {
        past: { type: Type.STRING, description: 'الماضي المعلوم' },
        present: { type: Type.STRING, description: 'المضارع المعلوم' },
        imperative: { type: Type.STRING, description: 'الأمر' },
        passivePast: { type: Type.STRING, description: 'الماضي المجهول' },
        passivePresent: { type: Type.STRING, description: 'المضارع المجهول' },
        activeParticiple: { type: Type.STRING, description: 'اسم الفاعل' },
        passiveParticiple: { type: Type.STRING, description: 'اسم المفعول' },
        masdar: { type: Type.STRING, description: 'المصدر' },
      },
    },
  },
  required: ['input', 'diacritizedText', 'sentenceType', 'analysisSummary', 'words'],
};

app.post('/api/analyze', async (req: Request, res: Response) => {
  const language = req.body?.language || 'en';
  try {
    const text = req.body?.text;

    if (!text || typeof text !== 'string' || !text.trim()) {
      const errMsg = language === 'bn'
        ? 'অনুগ্রহ করে বিশ্লেষণের জন্য একটি আরবি শব্দ বা বাক্য লিখুন।'
        : language === 'ar'
        ? 'يرجى إدخال كلمة أو جملة عربية للتحليل.'
        : 'Please enter an Arabic word or sentence to analyze.';
      return res.status(400).json({ error: errMsg });
    }

    const trimmed = text.trim();
    const cacheKey = `${trimmed}___${language}`;

    // Return cached result if available
    if (analysisCache.has(cacheKey)) {
      return res.json(analysisCache.get(cacheKey));
    }

    // Check if API key is present
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    let languageDirective = '';
    if (language === 'bn') {
      languageDirective = `
গুরুত্বপূর্ণ নির্দেশ (Language Requirement: BENGALI):
- সমস্ত ব্যাখ্যা, বিশ্লেষণ, ইরাব, তারকীব, এবং অর্থ প্রাঞ্জল ও পণ্ডিতসুলভ বাংলায় (Bengali) লিখুন।
- ঐতিহ্যবাহী আরবি ব্যাকরণ ও মাদরাসা দারসে নিজামী পরিভাষা (সিগাহ, বহস, বাব, মাসদার, মাদ্দা/মূলধাতু, জিনস, ওযন, তালীল/ই'লাল ও ইব্দাল, ফায়েল, মাফ'উল, মুবতাদা, খবর, তারকীব) বজায় রেখে বাংলায় প্রাঞ্জল ব্যাখ্যা দিন।
- তাহকীকুল আলফায (تحقيقات الألفاظ):
  * প্রতিটি শব্দের জন্য ৭টি প্রধান অনুষঙ্গ পুঙ্খানুপুঙ্খভাবে দিন:
    1. الصيغة (Sighah / সিগাহ): বাংলায় লিখুন (যেমন: "মুফরাদ মুযাক্কার গায়েব - ফে'লে মাযী" অথবা "জমা মুযাক্কার ইসমুল ফায়েল")।
    2. البحث (Bahath / বহস): বাংলায় লিখুন (যেমন: "বহসে মাযী মা'রূফ মুসবাত", "ইসমুল ফায়েল", "বহসে মুযারে মানফী")।
    3. الباب (Baab / বাব): বাংলায় লিখুন (যেমন: "বাব যারাবা-ইয়াযরিবু (ضرب)", "বাব নাসারা (نصر)", "বাব ইফ'আল (إفعال)")।
    4. المصدر (Masdar / মাসদার): মূল মাসদার আরবি হরকতসহ উল্লেখ করে বাংলায় অর্থ দিন (যেমন: "الرُّجُوع (প্রত্যাবর্তন করা)")।
    5. المادة (Maddah / মাদ্দা): মূল অক্ষর পৃথক করে লিখুন (যেমন: "ر + ج + ع")।
    6. الجنس (Jins / জিনস - সপ্ত জিনস): যেমন: "صحيح (সহীহ)", "معتل أجوف (আজওয়াফ)", "مثال (মিছাল)", "ناقص (নাক্বিস)", "مهموز (মাহমূয)", "مضاعف (মুদা'আফ)", "لفيف (লাফীফ)"।
    7. المعنى (Meaning / অর্থ): বাংলায় শব্দের সুস্পষ্ট ও প্রাসঙ্গিক অর্থ (যেমন: "প্রত্যাবর্তনকারীগণ")।
- পবিত্র কুরআনুল কারীমের আয়াত শনাক্তকরণ (Quran Ayah Detection) ও শানে নুযূল (শান-ই নুযূল / Asbab al-Nuzul):
  * যদি ইনপুটকৃত টেক্সট পবিত্র কুরআনের কোনো আয়াত বা আয়াতের কোনো অংশ হয়, তবে অবশ্যই isQuranic: true সেট করুন।
  * quranReference ফিল্ডে সূরার নাম আরবি (যেমন: "سورة البقرة"), বাংলা (যেমন: "সূরা আল-বাক্বারাহ"), ইংরেজি ("Surah Al-Baqarah"), সূরার ক্রমিক নম্বর (যেমন: 2) এবং আয়াত নম্বর (যেমন: "44") উল্লেখ করুন।
  * shanENuzul ফিল্ডে নির্ভরযোগ্য তাফসীর (যেমন: বায়যাবী, কুরতুবী, জালালাইন, ইবনে কাছীর, মা'আরিফুল কুরআন, সহীহ হাদীস ও সাহাবায়ে কিরামের রেওয়ায়েত) অনুসারে আয়াত অবতীর্ণ হওয়ার ঐতিহাসিক প্রেক্ষাপট ও সুনির্দিষ্ট কারণ ১, ২ করে পয়েন্ট আকারে উদ্ধৃতিসহ বাংলায় লিখুন (যেমন: ১. ইহুদিরা মানুষকে সৎকাজের আদেশ করত কিন্তু নিজেরা করত না... (বায়যাবী))।
- তারকীবুল জুমলাহ (تركيب الجملة / Tarkibul Jumlah):
  * বাক্য হলে প্রচলিত দারসে নিজামীর ঐতিহ্যবাহী তারকীবের আদলে প্রতিটি শব্দ ও হরফের ব্যাকরণিক ভূমিকা (যেমন: "এখানে و হলো حالیة আর انتم হলো مبتدأ এবং تتلون হলো فعل ও فায়েল, الكتاب হলো مفعول به") এবং শেষে পূর্ণাঙ্গ সংশ্লেষণ (যথা: "অতঃপর (ফেল, ফায়েল ও মাফঊল মিলে جملة فعلية হয়ে খবর হয়েছে। مبتدأ ও খবর মিলে جملة اسمية হয়ে حال হয়েছে।)") বাংলায় লিপিবদ্ধ করুন।`;
    } else if (language === 'en') {
      languageDirective = `
IMPORTANT REQUIREMENT (Language: ENGLISH):
- Provide all explanations, grammatical descriptions, I'rab, morphological shifts, and translations in clear, scholarly ENGLISH, while preserving classical Arabic terminology.
- For Word Analysis (تحقيقات الألفاظ):
  * Provide the 7 core components: 1. Sighah, 2. Bahath, 3. Baab, 4. Masdar, 5. Maddah (e.g. "ر + ج + ع"), 6. Jins (e.g. Sahih, Mithal, Ajwaf, Naqis, Lafif, Muda'af, Mahmuz), 7. Meaning in English.
- For Holy Quran Verses (Detection & Asbab al-Nuzul):
  * Detect if text is an Ayah or part of an Ayah from the Holy Quran; set isQuranic: true.
  * Provide Surah name (Arabic, Bengali, English), Surah number, Ayah number.
  * Provide authentic Asbab al-Nuzul (Occasion of Revelation) from classical Tafsir (al-Baydawi, al-Qurtubi, Ibn Kathir, Jalalayn) in structured numbered points with citations.
- For Sentence Tarkib (تركيب الجملة):
  * Provide the classical step-by-step grammatical connection and compound sentence synthesis.`;
    } else {
      languageDirective = `اللغة المطلوبة: العربية الفصحى التراثية الدقيقة. مع التحقيق الصرفي الشامل للألفاظ، وتركيب الجملة التراثي، وبيان ما إذا كان النص آية قرآنية مع ذكر السورة ورقم الآية وسبب النزول موثقاً من كتب التفسير (كالبيضاوي والقرطبي وابن كثير).`;
    }

    const systemInstruction = `أنت عالم مدقق ومحقق في علوم اللغة العربية (علم النحو وعلم الصرف وعلم فقه اللغة والاشتقاق والتفسير القرآني)، متبحر في مذهب المحققين كابن هشام في (مغني اللبيب) وسيبويه وابن مالك والرضي الإستراباذي وأئمة التفسير كالبيضاوي والقرطبي والزمخشري.
مهمتك: تقديم تحليل نحوي وصرفي فائق الدقة على مستوى أدق التفاصيل اللغوية (Subtle Level Analysis).

${languageDirective}

المعايير الصارمة للتحليل:
1. التشكيل التام (Harakat): اضبط الكلمة/النص بالحركات الكاملة والشاملة دون نقص.
2. تحقيقات الألفاظ (Tahqiq):
   - الصيغة (Sighah)
   - البحث (Bahath)
   - الباب (Baab)
   - المصدر (Masdar)
   - المادة (Maddah: الحروف الأصلية مفصولة بإشارة +)
   - الجنس (Jins: صحيح سالم، مهموز، مضعف، معتل مثال، أجوف، ناقص، لفيف)
   - المعنى (Meaning) في السياق بلغة الشرح المطلوبة
3. كشف الآيات القرآنية وأسباب النزول (Quran & Asbab al-Nuzul):
   - تحقق بدقة: هل النص آية كريمة أو جزء من آية؟
   - إن كان كذلك: حدد السورة ورقمها ورقم الآية بدقة، واذكر سبب النزول (شانه نزل) بنقاط مرقمة وموثقة بأسماء المفسرين.
4. تركيب الجملة (Tarkibul Jumlah):
   - تفكيك الجملة وربط أجزائها وصياغة تركيبها التركيبي التراثي الدقيق (فعل + فاعل + مفعول = جملة فعلية خبر، مبتدأ + خبر = جملة اسمية حال...).
5. الإعلال والإبدال والنقل والحذف الدقيق إن وُجد.
6. الإعراب التفصيلي الكامل وإعراب الجمل.
7. إن كان النص كلمة مفردة، أورد جدول التصريف الصغير.

أجب بصيغة JSON مطابقة تماماً للمخطط المعطى.`;

    let responseText: string | undefined;
    let lastError: any;

    try {
      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `قم بالتحليل النحوي والصرفي الدقيق والشامل للآتي:\n"${trimmed}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT_EXCEEDED')), 25000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      responseText = response.text;
    } catch (err: any) {
      lastError = err;
      console.error('Gemini call error:', err?.message || err);
    }

    if (!responseText) {
      let friendlyError = 'Linguistic analysis engine is busy. Please try again shortly.';
      if (language === 'bn') {
        friendlyError = 'ভাষাতাত্ত্বিক বিশ্লেষণ সার্ভিসে সাময়িক চাপ রয়েছে। অনুগ্রহ করে কয়েক সেকেন্ড পর পুনরায় চেষ্টা করুন।';
      } else if (language === 'ar') {
        friendlyError = 'محرك التحليل اللغوي مشغول حالياً، يرجى المحاولة بعد لحظات.';
      }

      if (lastError?.message && lastError.message.includes('API_KEY')) {
        friendlyError = 'Invalid or missing API key. Please check the Secrets panel.';
      }

      return res.status(503).json({ error: friendlyError });
    }

    const parsedData = JSON.parse(responseText);
    // Cache the verified response
    analysisCache.set(cacheKey, parsedData);

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing Arabic text:', error);
    const friendlyError =
      language === 'bn'
        ? 'বিশ্লেষণে ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
        : 'An error occurred during grammatical analysis. Please try again.';
    return res.status(500).json({ error: friendlyError });
  }
});

const translationSchema = {
  type: Type.OBJECT,
  properties: {
    sourceText: { type: Type.STRING },
    translatedText: {
      type: Type.STRING,
      description: 'Fluent, natural, and eloquent contextual Bengali translation (ভাবার্থ)',
    },
    literalTranslation: {
      type: Type.STRING,
      description: 'Word-for-word literal Bengali meaning (শব্দার্থ)',
    },
    transliteration: {
      type: Type.STRING,
      description: 'Accurate Bengali phonetic pronunciation (উচ্চারণ)',
    },
    wordGlossary: {
      type: Type.ARRAY,
      description: 'Word by word token mapping to Bengali meanings',
      items: {
        type: Type.OBJECT,
        properties: {
          arabic: { type: Type.STRING },
          bengali: { type: Type.STRING },
          grammarRole: { type: Type.STRING },
        },
        required: ['arabic', 'bengali'],
      },
    },
    contextNotes: {
      type: Type.STRING,
      description: 'Grammatical, theological, or contextual insights in Bengali',
    },
  },
  required: ['sourceText', 'translatedText', 'literalTranslation', 'wordGlossary'],
};

// API Route for Arabic to Bengali Translation
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, sourceLang = 'ar', targetLang = 'bn' } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'অনুগ্রহ করে অনুবাদের জন্য আরবি টেক্সট লিখুন।' });
    }

    const trimmed = text.trim();
    const cacheKey = `${trimmed}___${sourceLang}___${targetLang}`;
    if (translationCache.has(cacheKey)) {
      return res.json(translationCache.get(cacheKey));
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const systemInstruction = `You are a distinguished bilingual scholar and translator specializing in Arabic and Bengali literature, Quranic studies, and classical Arabic linguistics.
Your mission is to translate Arabic text into Bengali with the highest standard of eloquence, grammatical precision, and clarity.

Structure your output to provide:
1. translatedText: High-quality, natural, fluent Bengali contextual translation (ভাবার্থ).
2. literalTranslation: Word-for-word literal meaning in Bengali (শব্দার্থ).
3. transliteration: Accurate pronunciation transcribed into Bengali script (বাংলায় উচ্চারণ).
4. wordGlossary: Array of individual Arabic words with their direct Bengali meaning and part of speech / grammatical function.
5. contextNotes: Any relevant grammatical nuance, Quranic/classical context, or rhetorical elegance in Bengali.

Respond strictly in valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Translate this Arabic text to Bengali:\n"${trimmed}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: translationSchema,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    translationCache.set(cacheKey, parsed);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Translation error:', err);
    return res.status(500).json({
      error: 'অনুবাদ সম্পন্ন করতে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    });
  }
});

// Caches for Quran and Hadith
const quranSurahCache = new Map<number, any>();
const hadithSectionCache = new Map<string, any>();

// GET /api/quran/surahs
app.get('/api/quran/surahs', async (_req: Request, res: Response) => {
  try {
    const { QURAN_SURAHS } = await import('./src/data/quranSurahList.ts');
    return res.json({ surahs: QURAN_SURAHS });
  } catch (err: any) {
    console.error('Error serving surahs list:', err);
    return res.status(500).json({ error: 'Failed to load surahs list.' });
  }
});

// GET /api/quran/surah/:number
app.get('/api/quran/surah/:number', async (req: Request, res: Response) => {
  try {
    const surahNum = parseInt(req.params.number, 10);
    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return res.status(400).json({ error: 'Invalid surah number (1-114).' });
    }

    if (quranSurahCache.has(surahNum)) {
      return res.json(quranSurahCache.get(surahNum));
    }

    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,bn.bengali,en.sahih`);
    if (!response.ok) {
      throw new Error(`Upstream Quran API error: ${response.status}`);
    }

    const json = await response.json();
    const editions = json.data || [];
    const arabicEd = editions[0];
    const bengaliEd = editions[1];
    const englishEd = editions[2];

    const ayahs = (arabicEd?.ayahs || []).map((ayah: any, idx: number) => {
      return {
        numberInSurah: ayah.numberInSurah,
        numberInQuran: ayah.number,
        textArabic: ayah.text,
        textBengali: bengaliEd?.ayahs?.[idx]?.text || '',
        textEnglish: englishEd?.ayahs?.[idx]?.text || '',
        juz: ayah.juz,
        page: ayah.page,
        manzil: ayah.manzil,
        ruku: ayah.ruku,
      };
    });

    const result = {
      surahNumber: surahNum,
      nameArabic: arabicEd?.name || '',
      englishName: arabicEd?.englishName || '',
      numberOfAyahs: arabicEd?.numberOfAyahs || ayahs.length,
      revelationType: arabicEd?.revelationType || '',
      ayahs,
    };

    quranSurahCache.set(surahNum, result);
    return res.json(result);
  } catch (err: any) {
    console.error(`Error fetching surah ${req.params.number}:`, err);
    return res.status(500).json({ error: 'সূরা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।' });
  }
});

// GET /api/hadith/collections
app.get('/api/hadith/collections', async (_req: Request, res: Response) => {
  try {
    const { HADITH_COLLECTIONS } = await import('./src/data/hadithBookList.ts');
    return res.json(HADITH_COLLECTIONS);
  } catch (err: any) {
    console.error('Error serving hadith collections:', err);
    return res.status(500).json({ error: 'Failed to load hadith collections.' });
  }
});

// GET /api/hadith/:collection/:section
app.get('/api/hadith/:collection/:section', async (req: Request, res: Response) => {
  try {
    const collection = req.params.collection.toLowerCase();
    const section = parseInt(req.params.section, 10);

    if (collection !== 'bukhari' && collection !== 'muslim') {
      return res.status(400).json({ error: 'Supported collections: bukhari, muslim' });
    }
    if (isNaN(section) || section < 1) {
      return res.status(400).json({ error: 'Invalid section number' });
    }

    const cacheKey = `${collection}___${section}`;
    if (hadithSectionCache.has(cacheKey)) {
      return res.json(hadithSectionCache.get(cacheKey));
    }

    const [araRes, benRes] = await Promise.all([
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${collection}/sections/${section}.json`),
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-${collection}/sections/${section}.json`)
    ]);

    if (!araRes.ok) {
      throw new Error(`Hadith section not found: ${araRes.status}`);
    }

    const araData = await araRes.json();
    let benData: any = { hadiths: [] };
    if (benRes.ok) {
      benData = await benRes.json();
    }

    const benHadithMap = new Map<number, string>();
    (benData.hadiths || []).forEach((h: any) => {
      benHadithMap.set(h.hadithnumber, h.text);
    });

    const pairedHadiths = (araData.hadiths || []).map((h: any) => {
      return {
        hadithNumber: h.hadithnumber,
        arabicNumber: h.arabicnumber,
        arabicText: h.text,
        bengaliText: benHadithMap.get(h.hadithnumber) || '',
        reference: h.reference,
      };
    });

    const result = {
      collection,
      section,
      sectionName: araData.metadata?.name || '',
      totalInChapter: pairedHadiths.length,
      hadiths: pairedHadiths,
    };

    hadithSectionCache.set(cacheKey, result);
    return res.json(result);
  } catch (err: any) {
    console.error(`Error fetching hadith ${req.params.collection} section ${req.params.section}:`, err);
    return res.status(500).json({ error: 'হাদিস লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।' });
  }
});

// Configure Vite integration for dev server or static files for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Arabic Grammar Engine Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
