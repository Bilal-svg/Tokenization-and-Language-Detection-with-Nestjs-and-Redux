import { francAll } from 'franc';
import WinkTokenizer from 'wink-tokenizer';

const tokenizer = new WinkTokenizer();

/**
 * Tokenizes text into words, counts the number of words, and detects languages.
 * @param {string} text - The input text to analyze.
 * @returns {{
 *   tokens: string[];
 *   wordCount: number;
 *   languages: { language: string; probability: number }[];
 * }}
 * - Tokenized words, word count, and detected languages with probabilities.
 */
export function tokenizeText(text: string): {
  tokens: string[];
  wordCount: number;
  languages: { language: string; probability: number }[];
} {
  console.log('🚀 ~ tokenizeText ~ text:', text);

  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('Input must be a non-empty string');
  }

  // Detect multiple languages in the text
  const detectedLanguages = francAll(text).slice(0, 10); // Get the top 10 most probable languages
  console.log('🚀 ~ tokenizeText ~ Detected Languages:', detectedLanguages);

  const languages = detectedLanguages.map(([language, probability]) => ({
    language,
    probability,
  }));

  // Tokenize the text
  try {
    const tokens = tokenizer
      .tokenize(text)
      .filter((token) => token.tag === 'word')
      .map((token) => token.value);

    return {
      tokens,
      wordCount: tokens.length,
      languages,
    };
  } catch (error) {
    console.error('🚀 ~ tokenizeText ~ Error tokenizing:', error);
    throw new Error('Tokenization failed');
  }
}
