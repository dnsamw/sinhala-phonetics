// Core (framework-agnostic)
export { convertText, getCurrentWordPhonetic } from './core/converter';
export { SinhalaPredictor, defaultPredictor } from './core/predictor';
export { SINHALA_WORDS } from './data/dictionary';
export type {
  WordSuggestion,
  ConvertResult,
  SinhalaInputProps,
  SuggestionListProps,
  SinhalaTypewriterProps,
} from './core/types';

// React components & hooks
export {
  SinhalaInput,
  SinhalaTypewriter,
  SuggestionList,
  useSinhalaConverter,
  useWordPrediction,
} from './react/index';
