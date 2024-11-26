import { francAll, franc } from 'franc';
import WinkTokenizer from 'wink-tokenizer';

const tokenizer = new WinkTokenizer();

/**
 * Tokenizes text into words, counts the number of words, and detects languages.
 * @param {string} text - The input text to analyze.
 * @returns {{
 *   tokens: string[];
 *   count: number;
 *   languages: { language: string; probability: number }[];
 * }}
 
 */
export function tokenizeText(text: string): {
  tokens: string[];
  count: number;
  languages: string;
} {
  console.log('🚀 ~ tokenizeText ~ text:', text);

  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('Input must be a non-empty string');
  }

  // Detect multiple languages in the text
  const detectedLanguages = franc(text); // Get the top 10 most probable languages
  console.log('🚀 ~ tokenizeText ~ Detected Languages:', detectedLanguages);

  // const languages = detectedLanguages.map(([language, probability]) => ({
  //   language,
  //   probability,
  // }));
  const languages = detectedLanguages;

  // Tokenize the text
  try {
    const tokens = tokenizer
      .tokenize(text)
      .filter((token) => {
        return token.tag === 'word' && /^[a-zA-Z0-9'-]+$/u.test(token.value);
      })
      .map((token) => token.value);

    return {
      tokens,
      count: tokens.length,
      languages,
    };
  } catch (error) {
    console.error('🚀 ~ tokenizeText ~ Error tokenizing:', error);
    throw new Error('Tokenization failed');
  }
}
