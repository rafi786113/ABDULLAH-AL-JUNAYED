/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WordGlossItem {
  arabic: string;
  bengali: string;
  grammarRole?: string;
}

export interface TranslationResponse {
  sourceText: string;
  translatedText: string; // ভাবার্থ (fluent contextual translation)
  literalTranslation?: string; // শব্দার্থ (word-by-word meaning)
  transliteration?: string; // বাংলায় উচ্চারণ (phonetic)
  wordGlossary?: WordGlossItem[]; // শব্দকোষ ও তারকীব
  contextNotes?: string; // ব্যাকরণিক বা ঐতিহাসিক টিকা
}
