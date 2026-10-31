/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HadithBookMeta {
  bookNumber: number;
  nameArabic: string;
  nameBengali: string;
  nameEnglish: string;
  descriptionBengali?: string;
}

export interface HadithCollectionMeta {
  id: 'bukhari' | 'muslim';
  nameArabic: string;
  nameBengali: string;
  nameEnglish: string;
  authorArabic: string;
  authorBengali: string;
  totalHadithApprox: number;
  books: HadithBookMeta[];
}

export const HADITH_COLLECTIONS: Record<'bukhari' | 'muslim', HadithCollectionMeta> = {
  bukhari: {
    id: 'bukhari',
    nameArabic: 'صحيح البخاري',
    nameBengali: 'সহীহুল বুখারী',
    nameEnglish: 'Sahih al-Bukhari',
    authorArabic: 'الإمام محمد بن إسماعيل البخاري',
    authorBengali: 'ইমাম মুহাম্মদ ইবনে ইসমাইল আল-বুখারী (রহ.)',
    totalHadithApprox: 7563,
    books: [
      { bookNumber: 1, nameArabic: 'كتاب بدء الوحي', nameBengali: 'ওহীর সূচনা পর্ব', nameEnglish: 'Revelation' },
      { bookNumber: 2, nameArabic: 'كتاب الإيمان', nameBengali: 'ঈমান অধ্যায়', nameEnglish: 'Belief (Faith)' },
      { bookNumber: 3, nameArabic: 'كتاب العلم', nameBengali: 'ইলম বা জ্ঞান অধ্যায়', nameEnglish: 'Knowledge' },
      { bookNumber: 4, nameArabic: 'كتاب الوضوء', nameBengali: 'ওযূ অধ্যায়', nameEnglish: 'Ablutions (Wudu)' },
      { bookNumber: 5, nameArabic: 'كتاب الغسل', nameBengali: 'গোসল অধ্যায়', nameEnglish: 'Bathing (Ghusl)' },
      { bookNumber: 6, nameArabic: 'كتاب الحيض', nameBengali: 'হায়েয (ঋতুস্রাব) অধ্যায়', nameEnglish: 'Menses' },
      { bookNumber: 7, nameArabic: 'كتاب التيمم', nameBengali: 'তায়াম্মুম অধ্যায়', nameEnglish: 'Tayammum' },
      { bookNumber: 8, nameArabic: 'كتاب الصلاة', nameBengali: 'সালাত (নামাজ) অধ্যায়', nameEnglish: 'Prayers (Salat)' },
      { bookNumber: 9, nameArabic: 'كتاب مواقيت الصلاة', nameBengali: 'নামাজের ওয়াক্তসমূহ', nameEnglish: 'Times of the Prayers' },
      { bookNumber: 10, nameArabic: 'كتاب الأذان', nameBengali: 'আযান অধ্যায়', nameEnglish: 'Call to Prayer (Adhan)' },
      { bookNumber: 11, nameArabic: 'كتاب الجمعة', nameBengali: 'জুমুআহ অধ্যায়', nameEnglish: 'Friday Prayer' },
      { bookNumber: 12, nameArabic: 'كتاب صلاة الخوف', nameBengali: 'ভয়কালীন নামাজ', nameEnglish: 'Fear Prayer' },
      { bookNumber: 13, nameArabic: 'كتاب العيدين', nameBengali: 'দুই ঈদের নামাজ', nameEnglish: 'The Two Festivals (Eids)' },
      { bookNumber: 14, nameArabic: 'كتاب الوتر', nameBengali: 'বিতর নামাজ অধ্যায়', nameEnglish: 'Witr Prayer' },
      { bookNumber: 15, nameArabic: 'كتاب الاستسقاء', nameBengali: 'বৃষ্টি কামনায় সালাত (ইস্তিসকা)', nameEnglish: 'Invoking Allah for Rain' },
      { bookNumber: 16, nameArabic: 'كتاب الكسوف', nameBengali: 'সূর্যগ্রহণকালীন সালাত (কুসূফ)', nameEnglish: 'Eclipses' },
      { bookNumber: 17, nameArabic: 'كتاب سجود القرآن', nameBengali: 'কুরআনের তিলাওয়াতের সিজদাহ', nameEnglish: 'Prostration During Recitation' },
      { bookNumber: 18, nameArabic: 'كتاب تقصير الصلاة', nameBengali: 'মুসাফিরের সালাত সংক্ষেপকরণ (কসর)', nameEnglish: 'Shortening Prayers' },
      { bookNumber: 19, nameArabic: 'كتاب التهجد', nameBengali: 'তাহাজ্জুদ ও কিয়ামুল লাইল', nameEnglish: 'Night Prayer (Tahajjud)' },
      { bookNumber: 21, nameArabic: 'كتاب العمل في الصلاة', nameBengali: 'নামাজের ভেতর বৈধ কাজ', nameEnglish: 'Actions while Praying' },
      { bookNumber: 22, nameArabic: 'كتاب السهو', nameBengali: 'সিজদায়ে সাহু', nameEnglish: 'Forgetfulness in Prayer' },
      { bookNumber: 23, nameArabic: 'كتاب الجنائز', nameBengali: 'জানাযা অধ্যায়', nameEnglish: 'Funerals (Al-Janaaiz)' },
      { bookNumber: 24, nameArabic: 'كتاب الزكاة', nameBengali: 'যাকাত অধ্যায়', nameEnglish: 'Obligatory Charity (Zakat)' },
      { bookNumber: 25, nameArabic: 'كتاب الحج', nameBengali: 'হজ্জ অধ্যায়', nameEnglish: 'Hajj (Pilgrimage)' },
      { bookNumber: 26, nameArabic: 'كتاب العمرة', nameBengali: 'উমরাহ অধ্যায়', nameEnglish: 'Umrah' },
      { bookNumber: 27, nameArabic: 'كتاب المحصر', nameBengali: 'হজ্জে বাধাপ্রাপ্ত ব্যক্তি', nameEnglish: 'Muhsar (Restricted in Hajj)' },
      { bookNumber: 28, nameArabic: 'كتاب جزاء الصيد', nameBengali: 'ইহরামকালীন শিকারের দণ্ড', nameEnglish: 'Penalty of Hunting' },
      { bookNumber: 29, nameArabic: 'كتاب فضائل المدينة', nameBengali: 'মদীনা মুনাওয়ারার ফযীলত', nameEnglish: 'Virtues of Madinah' },
      { bookNumber: 30, nameArabic: 'كتاب الصوم', nameBengali: 'সাওম বা রোজা অধ্যায়', nameEnglish: 'Fasting (Sawm)' },
      { bookNumber: 31, nameArabic: 'كتاب صلاة التراويح', nameBengali: 'তারাবীহ সালাত অধ্যায়', nameEnglish: 'Tarawih Prayer' },
      { bookNumber: 32, nameArabic: 'كتاب فضل ليلة القدر', nameBengali: 'লাইলাতুল ক্বদরের ফযীলত', nameEnglish: 'Virtues of Laylat al-Qadr' },
      { bookNumber: 33, nameArabic: 'كتاب الاعتكاف', nameBengali: 'ইতিকাফ অধ্যায়', nameEnglish: 'Itikaf' },
      { bookNumber: 34, nameArabic: 'كتاب البيوع', nameBengali: 'ব্যবসা-বাণিজ্য ও ক্রয়-বিক্রয়', nameEnglish: 'Sales and Trade' },
      { bookNumber: 43, nameArabic: 'كتاب المساقاة', nameBengali: 'বর্গাচাষ ও সেচ ব্যবস্থা', nameEnglish: 'Watering & Sharecropping' },
      { bookNumber: 46, nameArabic: 'كتاب العتق', nameBengali: 'দাসমুক্তি ও সওয়াব', nameEnglish: 'Manumission of Slaves' },
      { bookNumber: 47, nameArabic: 'كتاب الهبة', nameBengali: 'উপহার ও অনুদান (হিবা)', nameEnglish: 'Gifts' },
      { bookNumber: 48, nameArabic: 'كتاب الشهادات', nameBengali: 'সাক্ষ্য ও প্রমাণাদি', nameEnglish: 'Witnesses' },
      { bookNumber: 49, nameArabic: 'كتاب الصلح', nameBengali: 'আপস-মীমাংসা ও সন্ধি', nameEnglish: 'Peacemaking' },
      { bookNumber: 50, nameArabic: 'كتاب الشروط', nameBengali: 'চুক্তির শর্তাবলি', nameEnglish: 'Conditions' },
      { bookNumber: 51, nameArabic: 'كتاب الوصايا', nameBengali: 'অসিয়ত বা ইচ্ছাপত্র', nameEnglish: 'Wills and Testaments' },
      { bookNumber: 52, nameArabic: 'كتاب الجهاد والسير', nameBengali: 'জিহাদ ও সামরিক সফর', nameEnglish: 'Jihad (Fighting for Cause of Allah)' },
      { bookNumber: 55, nameArabic: 'كتاب فرض الخمس', nameBengali: 'খুমুস (এক-পঞ্চমাংশ)', nameEnglish: 'One-Fifth of Booty to Allah' },
      { bookNumber: 56, nameArabic: 'كتاب الجزية والموادعة', nameBengali: 'জিযিয়া ও নিরাপত্তা চুক্তি', nameEnglish: 'Jizyah and Tax' },
      { bookNumber: 59, nameArabic: 'كتاب بدء الخلق', nameBengali: 'সৃষ্টিজগতের সূচনা', nameEnglish: 'Beginning of Creation' },
      { bookNumber: 60, nameArabic: 'كتاب أحاديث الأنبياء', nameBengali: 'নবীগণের জীবনী ও ঘটনাবলী', nameEnglish: 'Prophets of Allah' },
      { bookNumber: 61, nameArabic: 'كتاب المناقب', nameBengali: 'নবীজী (সা.) ও সাহাবাদের মর্যাদা', nameEnglish: 'Virtues and Merits' },
      { bookNumber: 62, nameArabic: 'كتاب فضائل أصحاب النبي', nameBengali: 'সাহাবায়ে কিরামের ফযীলত', nameEnglish: 'Companions of the Prophet' },
      { bookNumber: 63, nameArabic: 'كتاب مناقب الأنصار', nameBengali: 'আনসার সাহাবীদের মর্যাদা', nameEnglish: 'Merits of Al-Ansar' },
      { bookNumber: 64, nameArabic: 'كتاب المغازي', nameBengali: 'মাগাযী (নবীজীর যুদ্ধাভিযান)', nameEnglish: 'Military Expeditions' },
      { bookNumber: 65, nameArabic: 'كتاب تفسير القرآن', nameBengali: 'কুরআনের তাফসীর অধ্যায়', nameEnglish: 'Prophetic Commentary on Quran' },
      { bookNumber: 66, nameArabic: 'كتاب فضائل القرآن', nameBengali: 'কুরআনুল কারীমের ফযীলত', nameEnglish: 'Virtues of the Quran' },
      { bookNumber: 67, nameArabic: 'كتاب النكاح', nameBengali: 'নিকাহ ও বিবাহ অধ্যায়', nameEnglish: 'Wedlock, Marriage (Nikah)' },
      { bookNumber: 68, nameArabic: 'كتاب الطلاق', nameBengali: 'তালাক অধ্যায়', nameEnglish: 'Divorce' },
      { bookNumber: 69, nameArabic: 'كتاب النفقات', nameBengali: 'পরিবারের ভরণপোষণ (নাফাকা)', nameEnglish: 'Supporting the Family' },
      { bookNumber: 70, nameArabic: 'كتاب الأطعمة', nameBengali: 'খাদ্য ও আহারের আদব', nameEnglish: 'Food, Meals' },
      { bookNumber: 71, nameArabic: 'كتاب العقيقة', nameBengali: 'আক্বীক্বাহ অধ্যায়', nameEnglish: 'Sacrifice for Newborn (Aqiqah)' },
      { bookNumber: 72, nameArabic: 'كتاب الذبائح والصيد', nameBengali: 'জবাই ও শিকার অধ্যায়', nameEnglish: 'Hunting, Slaughtering' },
      { bookNumber: 73, nameArabic: 'كتاب الأضاحي', nameBengali: 'কোরবানি অধ্যায়', nameEnglish: 'Al-Adha Festival Sacrifice' },
      { bookNumber: 74, nameArabic: 'كتاب الأشربة', nameBengali: 'পানীয় ও শারাবাত', nameEnglish: 'Drinks' },
      { bookNumber: 75, nameArabic: 'كتاب المرضى', nameBengali: 'রোগী সেবা ও রুগ্নতা', nameEnglish: 'Patients' },
      { bookNumber: 76, nameArabic: 'كتاب الطب', nameBengali: 'চিকিৎসা ও শেফা', nameEnglish: 'Medicine' },
      { bookNumber: 77, nameArabic: 'كتاب اللباس', nameBengali: 'পোশাক ও পরিচ্ছদ', nameEnglish: 'Dress' },
      { bookNumber: 78, nameArabic: 'كتاب الأدب', nameBengali: 'আদব ও উত্তম চরিত্র', nameEnglish: 'Good Manners and Form (Al-Adab)' },
      { bookNumber: 79, nameArabic: 'كتاب الاستئذان', nameBengali: 'অনুমতি প্রার্থনা (ইস্তিজান)', nameEnglish: 'Asking Permission' },
      { bookNumber: 80, nameArabic: 'كتاب الدعوات', nameBengali: 'দোআ ও যিকিরসমূহ', nameEnglish: 'Invocations (Dua)' },
      { bookNumber: 81, nameArabic: 'كتاب الرقاق', nameBengali: 'চিত্তাকর্ষক নসীহত ও রিকাক্ব', nameEnglish: 'To make the Heart Tender (Ar-Riqaq)' },
      { bookNumber: 82, nameArabic: 'كتاب القدر', nameBengali: 'তাকদীর বা ভাগ্য', nameEnglish: 'Divine Will (Al-Qadar)' },
      { bookNumber: 83, nameArabic: 'كتاب الأيمان والنذور', nameBengali: 'কসম ও মান্নত', nameEnglish: 'Oaths and Vows' },
      { bookNumber: 86, nameArabic: 'كتاب الحدود', nameBengali: 'হুদূদ বা শারয়ী দণ্ডবিধি', nameEnglish: 'Punishments (Hudood)' },
      { bookNumber: 92, nameArabic: 'كتاب الفتن', nameBengali: 'ফিতনা-ফাসাদ ও শেষযামানা', nameEnglish: 'Afflictions and End of the World' },
      { bookNumber: 93, nameArabic: 'كتاب الأحكام', nameBengali: 'বিচার ও শাসনকার্য', nameEnglish: 'Judgments' },
      { bookNumber: 96, nameArabic: 'كتاب الاعتصام بالكتاب والسنة', nameBengali: 'কুরআন ও সুন্নাহর দৃঢ় অবলম্বন', nameEnglish: 'Holding Fast to Quran and Sunnah' },
      { bookNumber: 97, nameArabic: 'كتاب التوحيد', nameBengali: 'তাওহীদ বা একত্ববাদ', nameEnglish: 'Oneness of Allah (Tawheed)' }
    ]
  },
  muslim: {
    id: 'muslim',
    nameArabic: 'صحيح مسلم',
    nameBengali: 'সহীহ মুসলিম',
    nameEnglish: 'Sahih Muslim',
    authorArabic: 'الإمام مسلم بن الحجاج النيسابوري',
    authorBengali: 'ইমাম মুসলিম ইবনুল হাজ্জাজ আন-নিশাপুরী (রহ.)',
    totalHadithApprox: 7500,
    books: [
      { bookNumber: 1, nameArabic: 'كتاب الإيمان', nameBengali: 'ঈমান অধ্যায়', nameEnglish: 'The Book of Faith' },
      { bookNumber: 2, nameArabic: 'كتاب الطهارة', nameBengali: 'পবিত্রতা অধ্যায়', nameEnglish: 'The Book of Purification' },
      { bookNumber: 3, nameArabic: 'كتاب الحيض', nameBengali: 'হায়েয ও ঋতুস্রাব', nameEnglish: 'The Book of Menstruation' },
      { bookNumber: 4, nameArabic: 'كتاب الصلاة', nameBengali: 'সালাত (নামাজ) অধ্যায়', nameEnglish: 'The Book of Prayers' },
      { bookNumber: 5, nameArabic: 'كتاب المساجد ومواضع الصلاة', nameBengali: 'মসজিদ ও নামাজের স্থান', nameEnglish: 'Mosques and Places of Prayer' },
      { bookNumber: 6, nameArabic: 'كتاب صلاة المسافرين وقصرها', nameBengali: 'মুসাফিরের নামাজ ও কসর', nameEnglish: 'The Prayer of Travellers' },
      { bookNumber: 7, nameArabic: 'كتاب الجمعة', nameBengali: 'জুমুআহ অধ্যায়', nameEnglish: 'The Book of Friday Prayer' },
      { bookNumber: 8, nameArabic: 'كتاب صلاة العيدين', nameBengali: 'দুই ঈদের নামাজ', nameEnglish: 'Prayer of the Two Festivals' },
      { bookNumber: 9, nameArabic: 'كتاب صلاة الاستسقاء', nameBengali: 'ইস্তিসকা (বৃষ্টি প্রার্থনা)', nameEnglish: 'Prayer for Rain' },
      { bookNumber: 10, nameArabic: 'كتاب الكسوف', nameBengali: 'সূর্য ও চন্দ্রগ্রহণকালীন সালাত', nameEnglish: 'The Book of Eclipses' },
      { bookNumber: 11, nameArabic: 'كتاب الجنائز', nameBengali: 'জানাযা অধ্যায়', nameEnglish: 'The Book of Funerals' },
      { bookNumber: 12, nameArabic: 'كتاب الزكاة', nameBengali: 'যাকাত অধ্যায়', nameEnglish: 'The Book of Zakat' },
      { bookNumber: 13, nameArabic: 'كتاب الصيام', nameBengali: 'সিয়াম (রোজা) অধ্যায়', nameEnglish: 'The Book of Fasting' },
      { bookNumber: 14, nameArabic: 'كتاب الاعتكاف', nameBengali: 'ইতিকাফ অধ্যায়', nameEnglish: 'The Book of Itikaf' },
      { bookNumber: 15, nameArabic: 'كتاب الحج', nameBengali: 'হজ্জ অধ্যায়', nameEnglish: 'The Book of Pilgrimage' },
      { bookNumber: 16, nameArabic: 'كتاب النكاح', nameBengali: 'নিকাহ ও বিবাহ অধ্যায়', nameEnglish: 'The Book of Marriage' },
      { bookNumber: 17, nameArabic: 'كتاب الرضاع', nameBengali: 'দুধপান সম্পর্কিত বিধান', nameEnglish: 'The Book of Suckling' },
      { bookNumber: 18, nameArabic: 'كتاب الطلاق', nameBengali: 'তালাক অধ্যায়', nameEnglish: 'The Book of Divorce' },
      { bookNumber: 19, nameArabic: 'كتاب اللعان', nameBengali: 'লিআন অধ্যায়', nameEnglish: 'The Book of Li\'an' },
      { bookNumber: 20, nameArabic: 'كتاب العتق', nameBengali: 'দাসমুক্তি ও আজাদী', nameEnglish: 'The Book of Emancipating Slaves' },
      { bookNumber: 21, nameArabic: 'كتاب البيوع', nameBengali: 'ব্যবসা-বাণিজ্য ও বেচাকেনা', nameEnglish: 'The Book of Transactions' },
      { bookNumber: 22, nameArabic: 'كتاب المساقاة', nameBengali: 'বর্গাচাষ ও সেচ বণ্টন', nameEnglish: 'Sharecropping and Irrigation' },
      { bookNumber: 23, nameArabic: 'كتاب الفرائض', nameBengali: 'উত্তরাধিকার সম্পত্তি বণ্টন (মিরাস)', nameEnglish: 'Rules of Inheritance' },
      { bookNumber: 24, nameArabic: 'كتاب الهبات', nameBengali: 'দান ও উপহার (হিবা)', nameEnglish: 'The Book of Gifts' },
      { bookNumber: 25, nameArabic: 'كتاب الوصية', nameBengali: 'অসিয়ত বা ইচ্ছাপত্র', nameEnglish: 'The Book of Wills' },
      { bookNumber: 26, nameArabic: 'كتاب النذر', nameBengali: 'মান্নত অধ্যায়', nameEnglish: 'The Book of Vows' },
      { bookNumber: 27, nameArabic: 'كتاب الأيمان', nameBengali: 'কসম ও শপথ অধ্যায়', nameEnglish: 'The Book of Oaths' },
      { bookNumber: 28, nameArabic: 'كتاب القسامة والمحاربين', nameBengali: 'ক্বাসামাহ ও খুনের কাফফারা', nameEnglish: 'Oaths, Retaliation and Blood Money' },
      { bookNumber: 29, nameArabic: 'كتاب الحدود', nameBengali: 'হুদূদ ও আইনি দণ্ড', nameEnglish: 'The Book of Legal Punishments' },
      { bookNumber: 30, nameArabic: 'كتاب الأقضية', nameBengali: 'বিচার ও ফয়সালা', nameEnglish: 'The Book of Judicial Decisions' },
      { bookNumber: 32, nameArabic: 'كتاب الجهاد والسير', nameBengali: 'জিহাদ ও সামরিক অভিযান', nameEnglish: 'Jihad and Expeditions' },
      { bookNumber: 33, nameArabic: 'كتاب الإمارة', nameBengali: 'নেতৃত্ব ও রাষ্ট্রশাসন', nameEnglish: 'The Book on Government' },
      { bookNumber: 34, nameArabic: 'كتاب الصيد والذبائح', nameBengali: 'শিকার ও জবাইকৃত প্রাণী', nameEnglish: 'Hunting and Slaughter' },
      { bookNumber: 35, nameArabic: 'كتاب الأضاحي', nameBengali: 'কোরবানি অধ্যায়', nameEnglish: 'The Book of Sacrifices' },
      { bookNumber: 36, nameArabic: 'كتاب الأشربة', nameBengali: 'পানীয় ও শারাব', nameEnglish: 'The Book of Drinks' },
      { bookNumber: 37, nameArabic: 'كتاب اللباس والزينة', nameBengali: 'পোশাক ও সাজসজ্জা', nameEnglish: 'Clothes and Decoration' },
      { bookNumber: 38, nameArabic: 'كتاب الآداب', nameBengali: 'শিষ্টাচার ও আদব-কায়দা', nameEnglish: 'The Book of Manners' },
      { bookNumber: 39, nameArabic: 'كتاب السلام', nameBengali: 'সালাম ও অভিবাদন', nameEnglish: 'The Book of Greetings' },
      { bookNumber: 43, nameArabic: 'كتاب الفضائل', nameBengali: 'নবীজীর মর্যাদা ও ফযীলত', nameEnglish: 'The Book of Virtues' },
      { bookNumber: 44, nameArabic: 'كتاب فضائل الصحابة', nameBengali: 'সাহাবায়ে কিরামের মর্যাদা', nameEnglish: 'Virtues of the Companions' },
      { bookNumber: 45, nameArabic: 'كتاب البر والصلة والآداب', nameBengali: 'সদাচরণ, আত্মীয়তা ও সম্প্রীতি', nameEnglish: 'Virtue, Good Manners and Joining Ties' },
      { bookNumber: 46, nameArabic: 'كتاب القدر', nameBengali: 'তাকদীর ও ঐশী নির্ধারণ', nameEnglish: 'The Book of Destiny' },
      { bookNumber: 47, nameArabic: 'كتاب الذكر والدعاء والتوبة', nameBengali: 'যিকির, দোআ ও তাওবাহ', nameEnglish: 'Dhikr, Dua, Repentance' },
      { bookNumber: 48, nameArabic: 'كتاب الرقاق', nameBengali: 'চিত্তাকর্ষক উপদেশ ও সতর্কতা', nameEnglish: 'Heart-Melting Traditions' },
      { bookNumber: 49, nameArabic: 'كتاب التوبة', nameBengali: 'তাওবাহ ও ক্ষমা প্রার্থনা', nameEnglish: 'The Book of Repentance' },
      { bookNumber: 52, nameArabic: 'كتاب صفة القيامة والجنة والنار', nameBengali: 'কিয়ামত, জান্নাত ও জাহান্নামের বিবরণ', nameEnglish: 'Paradise, Its Blessings, and Hell' },
      { bookNumber: 54, nameArabic: 'كتاب الفتن وأشراط الساعة', nameBengali: 'ফিতনা ও কেয়ামতের লক্ষণসমূহ', nameEnglish: 'Tribulations and Portents of Hour' },
      { bookNumber: 55, nameArabic: 'كتاب الزهد والرقائق', nameBengali: 'যুহদ (সংসারবিমুখতা) ও বৈরাগ্য', nameEnglish: 'Zuhd (Asceticism)' }
    ]
  }
};
