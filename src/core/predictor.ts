import type { WordSuggestion } from './types';
import type { DictEntry } from '../data/core';
import { CORE_WORDS } from '../data/core';
import { SOCIAL_WORDS } from '../data/social';

const DEFAULT_FREQ = 50;

function normalizeInput(input: string[] | DictEntry[]): DictEntry[] {
  if (input.length === 0) return [];
  return typeof input[0] === 'string'
    ? (input as string[]).map(w => [w, DEFAULT_FREQ] as DictEntry)
    : (input as DictEntry[]);
}

export class SinhalaPredictor {
  private entries: DictEntry[];

  constructor(wordsOrEntries?: string[] | DictEntry[]) {
    if (!wordsOrEntries) {
      // Default: core + social combined, already sorted by source freq
      this.entries = [...CORE_WORDS, ...SOCIAL_WORDS];
    } else {
      this.entries = normalizeInput(wordsOrEntries);
    }
  }

  addWords(words: string[] | DictEntry[]): void {
    const incoming = normalizeInput(words);
    const existing = new Set(this.entries.map(([w]) => w));
    for (const entry of incoming) {
      if (!existing.has(entry[0])) {
        this.entries.push(entry);
        existing.add(entry[0]);
      }
    }
  }

  predict(sinhalaPrefix: string, max = 5): WordSuggestion[] {
    if (!sinhalaPrefix?.trim()) return [];

    // Strip trailing hal sign so "ක්" matches words starting with "ක"
    const prefix = sinhalaPrefix.replace(/්$/, '');
    if (!prefix) return [];

    const matches: DictEntry[] = [];
    for (const entry of this.entries) {
      if (entry[0].startsWith(prefix) && entry[0] !== prefix) {
        matches.push(entry);
      }
    }

    // Sort by frequency descending so the most common word surfaces first
    matches.sort((a, b) => b[1] - a[1]);

    return matches.slice(0, max).map(([word, frequency]) => ({ word, frequency }));
  }
}

export const defaultPredictor = new SinhalaPredictor();
