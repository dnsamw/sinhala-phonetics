import type { WordSuggestion } from './types';
import { SINHALA_WORDS } from '../data/dictionary';

export class SinhalaPredictor {
  private words: string[];

  constructor(customWords?: string[]) {
    this.words = customWords ?? SINHALA_WORDS;
  }

  addWords(words: string[]): void {
    const existing = new Set(this.words);
    for (const w of words) {
      if (!existing.has(w)) this.words.push(w);
    }
  }

  predict(sinhalaPrefix: string, max = 5): WordSuggestion[] {
    if (!sinhalaPrefix || sinhalaPrefix.trim() === '') return [];

    // Strip trailing hal sign (්) so "ක්" matches words starting with "ක"
    const normalizedPrefix = sinhalaPrefix.replace(/්$/, '');
    if (!normalizedPrefix) return [];

    const results: WordSuggestion[] = [];
    for (const word of this.words) {
      if (word.startsWith(normalizedPrefix) && word !== normalizedPrefix) {
        results.push({ word });
        if (results.length >= max) break;
      }
    }
    return results;
  }
}

export const defaultPredictor = new SinhalaPredictor();
