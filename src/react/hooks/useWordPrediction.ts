import { useMemo } from 'react';
import type { WordSuggestion } from '../../core/types';
import { SinhalaPredictor, defaultPredictor } from '../../core/predictor';

export interface UseWordPredictionOptions {
  maxSuggestions?: number;
  predictor?: SinhalaPredictor;
}

export function useWordPrediction(
  currentWordSinhala: string,
  options: UseWordPredictionOptions = {},
): WordSuggestion[] {
  const { maxSuggestions = 5, predictor = defaultPredictor } = options;

  return useMemo(
    () => predictor.predict(currentWordSinhala, maxSuggestions),
    [currentWordSinhala, maxSuggestions, predictor],
  );
}
