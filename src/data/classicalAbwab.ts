/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClassicalBaabInfo {
  id: number | string;
  name: string; // e.g. باب نَصَرَ - يَنْصُرُ
  nameEn: string;
  nameBn: string;
  pattern: string; // فَعَلَ - يَفْعُلُ
  mnemonic: string; // فتح ضم
  pastVowel: string; // عين الفعل في الماضي
  presentVowel: string; // عين الفعل في المضارع
  examplePast: string;
  examplePresent: string;
  exampleMasdar: string;
  commonMeaning: string;
  commonMeaningEn: string;
  commonMeaningBn: string;
  category: 'ثلاثي مجرد' | 'ثلاثي مزيد بحرف' | 'ثلاثي مزيد بحرفين' | 'ثلاثي مزيد بثلاثة أحرف' | 'رباعي';
}

export const THULATHI_MUJARRAD_ABWAB: ClassicalBaabInfo[] = [
  {
    id: 1,
    name: 'باب نَصَرَ يَنْصُرُ',
    nameEn: 'Baab Naṣara - Yanṣuru',
    nameBn: 'বাব নাসারা - ইয়ানসুরু (ফাতহ-যাম)',
    pattern: 'فَعَلَ - يَفْعُلُ',
    mnemonic: 'فَتْحُ ضَمٍّ (Fat-ha / Dammah)',
    pastVowel: 'مفتوحة (عَ) - Fat-ha on Ayn',
    presentVowel: 'مضمومة (عُ) - Dammah on Ayn',
    examplePast: 'نَصَرَ، كَتَبَ، دَخَلَ، قَالَ',
    examplePresent: 'يَنْصُرُ، يَكْتُبُ، يَدْخُلُ، يَقُولُ',
    exampleMasdar: 'نَصْر، كِتَابَة، دُخُول، قَوْل',
    commonMeaning: 'أشهر الأبواب، يغلب فيه التعدي والشمول',
    commonMeaningEn: 'Most widely used door; predominantly transitive actions, encompassing verbs of creation and movement.',
    commonMeaningBn: 'সবচেয়ে বহুল ব্যবহৃত বাব; অধিকাংশ ক্ষেত্রে সকর্মক (মুতাআদ্দী) ক্রিয়া নির্দেশ করে।',
    category: 'ثلاثي مجرد',
  },
  {
    id: 2,
    name: 'باب ضَرَبَ يَضْرِبُ',
    nameEn: 'Baab Ḍaraba - Yaḍribu',
    nameBn: 'বাব যারাবা - ইয়াদরিবু (ফাতহ-কাসর)',
    pattern: 'فَعَلَ - يَفْعِلُ',
    mnemonic: 'فَتْحُ كَسْرٍ (Fat-ha / Kasrah)',
    pastVowel: 'مفتوحة (عَ) - Fat-ha on Ayn',
    presentVowel: 'مكسورة (عِ) - Kasrah on Ayn',
    examplePast: 'ضَرَبَ، جَلَسَ، رَمَى، وَعَدَ',
    examplePresent: 'يَضْرِبُ، يَجْلِسُ، يَرْمِي، يَعِدُ',
    exampleMasdar: 'ضَرْب، جُلُوس، رَمْي، وَعْد',
    commonMeaning: 'كثير في الأفعال المتعدية واللازمة والمعتلة (المثال والناقص)',
    commonMeaningEn: 'Extensive in both transitive and intransitive verbs; very common in Mithal (assimilated) and Naqis (defective) verbs.',
    commonMeaningBn: 'মুতাআদ্দী ও লাযিম উভয় ক্রিয়ায় বহুল ব্যবহৃত; বিশেষত মিছাল ও নাকিছ হরফে ইল্লতের ক্ষেত্রে ব্যাপক।',
    category: 'ثلاثي مجرد',
  },
  {
    id: 3,
    name: 'باب فَتَحَ يَفْتَحُ',
    nameEn: 'Baab Fataḥa - Yaftaḥu',
    nameBn: 'বাব ফাতাহা - ইয়াফতাহু (ফাতহাতান)',
    pattern: 'فَعَلَ - يَفْعَلُ',
    mnemonic: 'فَتْحَتَانْ (Two Fat-has)',
    pastVowel: 'مفتوحة (عَ) - Fat-ha on Ayn',
    presentVowel: 'مفتوحة (عَ) - Fat-ha on Ayn',
    examplePast: 'فَتَحَ، ذَهَبَ، قَرَأَ، سَعَى',
    examplePresent: 'يَفْتَحُ، يَذْهَبُ، يَقْرَأُ، يَسْعَى',
    exampleMasdar: 'فَتْح، ذَهَاب، قِرَاءَة، سَعْي',
    commonMeaning: 'يشترط فيه أن تكون عينه أو لامه حرفاً من حروف الحلق (أ، هـ، ع، ح، غ، خ)',
    commonMeaningEn: 'Requires the Ayn or Lam root letter to be a guttural/throat letter (ء، هـ، ع، ح، غ، خ).',
    commonMeaningBn: 'শর্ত হলো এর আইন বা লাম হরফে হলক্বী (কণ্ঠনালীয় হরফ: ء، هـ، ع، ح، غ، خ) হতে হয়।',
    category: 'ثلاثي مجرد',
  },
  {
    id: 4,
    name: 'باب عَلِمَ يَعْلَمُ',
    nameEn: 'Baab ‘Alima - Ya‘lamu',
    nameBn: 'বাব আলিমা - ইয়ালামু (কাসর-ফাতহ)',
    pattern: 'فَعِلَ - يَفْعَلُ',
    mnemonic: 'كَسْرُ فَتْحٍ (Kasrah / Fat-ha)',
    pastVowel: 'مكسورة (عِ) - Kasrah on Ayn',
    presentVowel: 'مفتوحة (عَ) - Fat-ha on Ayn',
    examplePast: 'عَلِمَ، فَرِحَ، شَرِبَ، خَافَ',
    examplePresent: 'يَعْلَمُ، يَفْرَحُ، يَشْرَبُ، يَخَافُ',
    exampleMasdar: 'عِلْم، فَرَح، شُرْب، خَوْف',
    commonMeaning: 'يغلب في أفعال الفرح والحزن والعلل والصفات العارضة والامتلاء والخلو',
    commonMeaningEn: 'Predominates in verbs of emotion (joy/grief), perception, temporary bodily states, fullness and emptiness.',
    commonMeaningBn: 'আনন্দ, বেদনা, রোগব্যাধি, অস্থির অবস্থা ও অনুভূতি প্রকাশক ক্রিয়াসমূহে ব্যবহৃত হয়।',
    category: 'ثلاثي مجرد',
  },
  {
    id: 5,
    name: 'باب كَرُمَ يَكْرُمُ',
    nameEn: 'Baab Karuma - Yakrumu',
    nameBn: 'বাব কারুমা - ইয়াকরুমু (যাম-যাম)',
    pattern: 'فَعُلَ - يَفْعُلُ',
    mnemonic: 'ضَمُّ ضَمٍّ (Two Dammahs)',
    pastVowel: 'مضمومة (عُ) - Dammah on Ayn',
    presentVowel: 'مضمومة (عُ) - Dammah on Ayn',
    examplePast: 'كَرُمَ، حَسُنَ، شَرُفَ، عَظُمَ',
    examplePresent: 'يَكْرُمُ، يَحْسُنُ، يَشْرُفُ، يَعْظُمُ',
    exampleMasdar: 'كَرَم، حُسْن، شَرَف، عِظَم',
    commonMeaning: 'خاص بالطبائع والغرائز والسجايا الثابتة، ولا يكون إلا لازماً',
    commonMeaningEn: 'Exclusively designates innate human traits, inherent disposition, and qualities; always strictly intransitive (Lazim).',
    commonMeaningBn: 'মানুষের স্থায়ী স্বভাব, চারিত্রিক বৈশিষ্ট্য ও জন্মগত গুণাবলীতে বিশিষ্ট; এটি সর্বদা অকর্মক (লাযিম) হয়।',
    category: 'ثلاثي مجرد',
  },
  {
    id: 6,
    name: 'باب حَسِبَ يَحْسِبُ',
    nameEn: 'Baab Ḥasiba - Yaḥsibu',
    nameBn: 'বাব হাসিবা - ইয়াহসিবু (কাসরাতান)',
    pattern: 'فَعِلَ - يَفْعِلُ',
    mnemonic: 'كَسْرَتَانْ (Two Kasrahs)',
    pastVowel: 'مكسورة (عِ) - Kasrah on Ayn',
    presentVowel: 'مكسورة (عِ) - Kasrah on Ayn',
    examplePast: 'حَسِبَ، وَرِثَ، وَثِقَ، وَلِيَ',
    examplePresent: 'يَحْسِبُ، يَرِثُ، يَثِقُ، يَلِي',
    exampleMasdar: 'حِسَاب، وِرَاثَة، ثِقَة، وِلَايَة',
    commonMeaning: 'أقل الأبواب دوراناً في الصحيح، يكثر في المثال الواوي',
    commonMeaningEn: 'The rarest of the six doors in sound verbs; predominantly found in Mithal (Waw-initial) verbs.',
    commonMeaningBn: 'ছয়টি বাবের মধ্যে সবচেয়ে বিরল; বিশেষত মিছালে ওয়াবী (ওয়াত দ্বারা শুরু ক্রিয়া) ক্ষেত্রে পাওয়া যায়।',
    category: 'ثلاثي مجرد',
  },
];

export const MAZID_ABWAB: ClassicalBaabInfo[] = [
  {
    id: 'if_aal',
    name: 'باب إِفْعَال',
    nameEn: 'Baab If‘āl (Form IV)',
    nameBn: 'বাব ইফ\'আল (أَفْعَلَ - يُفْعِلُ)',
    pattern: 'أَفْعَلَ - يُفْعِلُ - إِفْعَالاً',
    mnemonic: 'Augmented with Hamzah at start',
    pastVowel: 'أَفْعَلَ',
    presentVowel: 'يُفْعِلُ',
    examplePast: 'أَكْرَمَ، أَنْزَلَ، أَحْسَنَ',
    examplePresent: 'يُكْرِمُ، يُنْزِلُ، يُحْسِنُ',
    exampleMasdar: 'إِكْرَام، إِنْزَال، إِحْسَان',
    commonMeaning: 'التعدية (نقل اللازم لمتعدٍ)، الدخول في الشيء، السلب',
    commonMeaningEn: 'Causation/transitivity (making intransitive verbs transitive), entering a time or place, divestment.',
    commonMeaningBn: 'তাআদিয়্যাহ বা সকর্মককরণ (অকর্মককে সকর্মক রূপান্তর), সময়ে প্রবেশ করা (আসবাহা), ইত্যাদি।',
    category: 'ثلاثي مزيد بحرف',
  },
  {
    id: 'taf_eel',
    name: 'باب تَفْعِيل',
    nameEn: 'Baab Taf‘īl (Form II)',
    nameBn: 'বাব তাফ\'ঈল (فَعَّلَ - يُفَعِّلُ)',
    pattern: 'فَعَّلَ - يُفَعِّلُ - تَفْعِيلاً',
    mnemonic: 'Augmented by doubling Ayn (Tashdeed)',
    pastVowel: 'فَعَّلَ',
    presentVowel: 'يُفَعِّلُ',
    examplePast: 'عَلَّمَ، فَرَّحَ، كَبَّرَ، قَدَّسَ',
    examplePresent: 'يُعَلِّمُ، يُفَرِّحُ، يُكَبِّرُ، يُقَدِّسُ',
    exampleMasdar: 'تَعْلِيم، تَفْرِيح، تَكْبِير، تَقْدِيس',
    commonMeaning: 'التكثير والمبالغة، التعدية، النسبة إلى الأصل',
    commonMeaningEn: 'Intensification, frequency, thoroughness, causation, declarative attribution.',
    commonMeaningBn: 'তাকসীর ও মুবালাগা (কাজে আধিক্য ও তীব্রতা), সকর্মককরণ, গুণের আরোপ করা।',
    category: 'ثلاثي مزيد بحرف',
  },
  {
    id: 'mufaa_alah',
    name: 'باب مُفَاعَلَة',
    nameEn: 'Baab Mufā‘alah (Form III)',
    nameBn: 'বাব মুফা\'আলাহ (فَاعَلَ - يُفَاعِلُ)',
    pattern: 'فَاعَلَ - يُفَاعِلُ - مُفَاعَلَةً وفِعَالاً',
    mnemonic: 'Augmented with Alif after Fa',
    pastVowel: 'فَاعَلَ',
    presentVowel: 'يُفَاعِلُ',
    examplePast: 'قَاتَلَ، جَادَلَ، سَابَقَ',
    examplePresent: 'يُقَاتِلُ، يُجَادِلُ، يُسَابِقُ',
    exampleMasdar: 'مُقَاتَلَة وقِتَال، مُجَادَلَة وجِدَال',
    commonMeaning: 'المشاركة بين اثنين فأكثر، المتابعة، المبالغة',
    commonMeaningEn: 'Reciprocity/mutual interaction between two or more parties, continuity.',
    commonMeaningBn: 'মুশারাকাত (পারস্পরিক ক্রিয়া বিনিময় - দুই বা ততোধিক ব্যক্তির মধ্যে অংশীদারিত্ব)।',
    category: 'ثلاثي مزيد بحرف',
  },
  {
    id: 'istif_aal',
    name: 'باب اسْتِفْعَال',
    nameEn: 'Baab Istif‘āl (Form X)',
    nameBn: 'বাব ইসতিফ\'আল (اسْتَفْعَلَ - يَسْتَفْعِلُ)',
    pattern: 'اسْتَفْعَلَ - يَسْتَفْعِلُ - اسْتِفْعَالاً',
    mnemonic: 'Augmented with Alif, Seen, Ta (استـ)',
    pastVowel: 'اسْتَفْعَلَ',
    presentVowel: 'يَسْتَفْعِلُ',
    examplePast: 'اسْتَغْفَرَ، اسْتَعَانَ، اسْتَخْرَجَ',
    examplePresent: 'يَسْتَغْفِرُ، يَسْتَعِينُ، يَسْتَخْرِجُ',
    exampleMasdar: 'اسْتِغْفَار، اسْتِعَانَة، اسْتِخْرَاج',
    commonMeaning: 'طلب حصول الشيء، الصيرورة، التحول، اعتقاد الصفة',
    commonMeaningEn: 'Seeking, requesting, demanding (e.g., seeking forgiveness), transformation, finding something to have a quality.',
    commonMeaningBn: 'তলব বা প্রার্থনা করা (যেমন: ইসতিগফার - ক্ষমা প্রার্থনা করা), রূপান্তর ও অনুসন্ধান।',
    category: 'ثلاثي مزيد بثلاثة أحرف',
  },
];

export const SARF_GLOSSARY = [
  {
    term: 'الصيغة (Sighah)',
    arabicDesc: 'الهيئة والبنية التي صيغت عليها الكلمة وما تدل عليه من فاعل أو مفعول أو نوع الفعل وزمنه وضميره.',
    englishDesc: 'The exact morphological form, grammatical aspect, person, number, gender, and voice of a word.',
    bengaliDesc: 'শব্দের গঠন রূপ, বাচ্য (মারূফ/মাজহুল), বচন (মুফরাদ/তাছনিয়া/জমা), লিঙ্গ (মুযাক্কার/মুয়ান্নাস) ও পুরুষ (গায়েব/হাযের/মুতাকাল্লিম)।',
  },
  {
    term: 'البحث (Bahath)',
    arabicDesc: 'المبحث الصرفي في كتب الصرف التراثية، كبحث الماضي المعروف، أو الماضي المجهول، أو المضارع المنفي، أو الأمر الحاضر.',
    englishDesc: 'The paradigm chapter in classical morphology governing conjugation polarity, tense, and mood.',
    bengaliDesc: 'সরফের অধ্যায় বা আলোচনা, যেমন: বহসে মাযী মারূফ মুসবাত, বহসে মুযারে মানফী, বহসে আমর হাযের মারূফ ইত্যাদি।',
  },
  {
    term: 'الباب (Baab)',
    arabicDesc: 'باب تصريف الفعل وفق حركة عين ماضيه ومضارعه في الثلاثي المجرد (نصر، ضرب...) أو حروف الزيادة في المزيد.',
    englishDesc: 'The verbal conjugation category/pattern defined by stem vocalization changes and augmentations.',
    bengaliDesc: 'ক্রিয়াপদের রূপান্তর প্রণালী বা বাব, যা অতীত ও বর্তমান কালে আইন হরফের হরকত ও অতিরিক্ত হরফের ওপর নির্ভর করে।',
  },
  {
    term: 'المصدر (Masdar)',
    arabicDesc: 'الاسم الدال على الحدث المجرد من الزمان، وهو أصل المشتقات عند البصريين.',
    englishDesc: 'The abstract verbal noun indicating an action stripped of tense, serving as the foundational root noun in classical grammar.',
    bengaliDesc: 'কালমুক্ত ভাববাচক মূল বিশেষ্য, যা থেকে অন্যান্য সমস্ত ক্রিয়াপদ ও ইসমে মুশতাক্ব নিঃসৃত হয় (বসরী মাযহাব মতে)।',
  },
  {
    term: 'الإعلال والإبدال (I\'lal & Ibdal)',
    arabicDesc: 'التغيرات الصوتية الدقيقة في حروف العلة والهمزة لتسهيل النطق (كالقلب بالحركة، أو الحذف للالتقاء بالساكنين).',
    englishDesc: 'Subtle morphophonemic alternations including weak letter mutation, assimilation, elision, and consonant harmony.',
    bengaliDesc: 'তালীল ও ইব্দাল: হরফে ইল্লত (দুর্বল হরফ) বা সমজাতীয় হরফের রূপান্তর, বিলুপ্তি ও উচ্চারণের সহজীকরণ কায়েদা।',
  },
];
