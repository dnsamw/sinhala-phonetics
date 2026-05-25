// Core (framework-agnostic)
export { convertText, getCurrentWordPhonetic } from './core/converter';
export { SinhalaPredictor, defaultPredictor } from './core/predictor';
export { SINHALA_WORDS, CORE_WORDS, SOCIAL_WORDS } from './data/dictionary';
export type {
  WordSuggestion,
  ConvertResult,
  SinhalaInputProps,
  SuggestionListProps,
  SinhalaTypewriterProps,
  DictEntry,
} from './core/types';

// React components & hooks
export {
  SinhalaInput,
  SinhalaTypewriter,
  SuggestionList,
  useSinhalaConverter,
  useWordPrediction,
} from './react/index';
