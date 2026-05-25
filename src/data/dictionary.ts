export { CORE_WORDS } from './core';
export type { DictEntry } from './core';
export { SOCIAL_WORDS } from './social';

// Combined dictionary — backwards-compatible string[] export
import { CORE_WORDS } from './core';
import { SOCIAL_WORDS } from './social';

export const SINHALA_WORDS: string[] = [
  ...CORE_WORDS.map(([w]) => w),
  ...SOCIAL_WORDS.map(([w]) => w),
];
