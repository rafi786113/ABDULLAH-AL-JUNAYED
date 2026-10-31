/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  User,
  Send,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Heart,
  Copy,
  Check,
} from 'lucide-react';
import { ExplanationLanguage } from '../types/grammar';

interface ContactAdviceViewProps {
  language: ExplanationLanguage;
}

export const ContactAdviceView: React.FC<ContactAdviceViewProps> = ({ language }) => {
  const isEn = language === 'en';
  const isAr = language === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'general' | 'quran_hadith' | 'grammar' | 'ui'>('general');
  const [adviceText, setAdviceText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const RECIPIENT_EMAIL = 'rafi786113@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !adviceText.trim()) return;

    setSubmitted(true);

    // Create mailto link to rafi786113@gmail.com
    const subject = encodeURIComponent(`[Noor App Advice] from ${name} (${category})`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email || 'Not provided'}\nCategory: ${category}\n\nAdvice & Feedback:\n${adviceText}\n\nSent from Noor App (rafi786113@gmail.com)`
    );
    const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;

    // Open email client safely
    window.location.href = mailtoUrl;
  };

  const handleCopyAdvice = () => {
    const text = `To: ${RECIPIENT_EMAIL}\nName: ${name}\nEmail: ${email}\nCategory: ${category}\nAdvice:\n${adviceText}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-1">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100">
          {isEn ? 'Advices & Contact Us' : isAr ? 'النصائح والملاحظات والتواصل' : 'পরামর্শ ও যোগাযোগ'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          {isEn
            ? 'We deeply appreciate your valuable advice and recommendations to improve Noor. Your message directly reaches our team.'
            : isAr
            ? 'نرحب بنصائحكم واقتراحاتكم الكريمة لتطوير المنصة. تصل رسائلكم مباشرة إلى المشرفين.'
            : 'নূর অ্যাপকে আরও উন্নত ও সমৃদ্ধ করতে আপনার মূল্যবান পরামর্শ ও উপদেশ আমাদের টিমকে সরাসরি জানাতে পারেন।'}
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-300 font-mono mt-1">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>{RECIPIENT_EMAIL}</span>
        </div>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/40 text-center space-y-4 shadow-xl">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold text-slate-100">
            {isEn ? 'JazakAllahu Khairan for your advice!' : isAr ? 'جزاكم الله خيراً على نصائحكم القيمة!' : 'জাযাকাল্লাহু খাইরান! আপনার পরামর্শের জন্য ধন্যবাদ!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {isEn
              ? `Your email client has been prepared to deliver your message to ${RECIPIENT_EMAIL}. If your mail client did not open automatically, you can copy your message below.`
              : isAr
              ? `تم تجهيز رسالتك لإرسالها مباشرة إلى ${RECIPIENT_EMAIL}. يمكنك نسخ محتوى النصيحة أدناه.`
              : `আপনার ইমেইল ক্লায়েন্টে বার্তাটি পাঠানো হয়েছে (${RECIPIENT_EMAIL})। যদি ইমেইল স্বয়ংক্রিয়ভাবে চালু না হয়, নিচের বাটনে ক্লিক করে মেসেজ কপি করতে পারেন।`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopyAdvice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isEn ? 'Copied!' : 'কপি হয়েছে!') : (isEn ? 'Copy Message' : 'মেসেজ কপি করুন')}</span>
            </button>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all cursor-pointer"
            >
              {isEn ? 'Send Another Advice' : isAr ? 'إرسال نصيحة أخرى' : 'আরেকটি পরামর্শ পাঠান'}
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5"
        >
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Your Name' : isAr ? 'الاسم الكريم' : 'আপনার নাম'}</span>
                <span className="text-red-400">*</span>
              </span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? 'e.g. Abdullah / Fatimah' : isAr ? 'مثال: عبد الله' : 'উদা: মোঃ আব্দুল্লাহ'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/70"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Your Email Address' : isAr ? 'البريد الإلكتروني' : 'আপনার ইমেইল ঠিকানা'}</span>
                <span className="text-slate-500 text-[11px] font-normal">
                  ({isEn ? 'Optional, for reply' : isAr ? 'اختياري' : 'ঐচ্ছিক'})
                </span>
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/70"
            />
          </div>

          {/* Advice Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Advice Category' : isAr ? 'مجال النصيحة' : 'পরামর্শের বিষয়'}</span>
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'general', en: 'General Advice', bn: 'সাধারণ পরামর্শ', ar: 'نصيحة عامة' },
                { id: 'quran_hadith', en: 'Quran / Hadith', bn: 'কুরআন ও হাদিস', ar: 'القرآن والحديث' },
                { id: 'grammar', en: 'Arabic Grammar', bn: 'নাহু ও সরফ', ar: 'النحو والصرف' },
                { id: 'ui', en: 'Design & Feature', bn: 'ডিজাইন ও ফিচার', ar: 'المظهر والميزات' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isEn ? cat.en : isAr ? cat.ar : cat.bn}
                </button>
              ))}
            </div>
          </div>

          {/* Advice Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isEn
                    ? 'What advices or recommendations do you have for us?'
                    : isAr
                    ? 'ما هي نصائحكم وملاحظاتكم القيمة لنا؟'
                    : 'আমাদের জন্য আপনার কী কী উপদেশ বা পরামর্শ রয়েছে?'}
                </span>
                <span className="text-red-400">*</span>
              </span>
            </label>
            <textarea
              required
              rows={5}
              value={adviceText}
              onChange={(e) => setAdviceText(e.target.value)}
              placeholder={
                isEn
                  ? 'Write your suggestions, corrections, or ideas here...'
                  : isAr
                  ? 'اكتب اقتراحاتك، أو تصويباتك، أو أفكارك التطويرية هنا...'
                  : 'এখানে আপনার মূল্যবান উপদেশ, পরামর্শ বা সংশোধনী লিখুন...'
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/70"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              <span>
                {isEn ? 'Delivered directly to rafi786113@gmail.com' : isAr ? 'تصل مباشرة إلى rafi786113@gmail.com' : 'সরাসরি rafi786113@gmail.com এ পৌঁছাবে'}
              </span>
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isEn ? 'Submit Advice' : isAr ? 'إرسال النصيحة' : 'পরামর্শ জমা দিন'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
