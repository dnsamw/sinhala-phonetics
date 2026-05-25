export interface WordSuggestion {
  word: string;
  frequency?: number;
}

// Re-export DictEntry so consumers only need to import from one place
export type { DictEntry } from '../data/core';

export interface ConvertResult {
  sinhala: string;
  currentWordPhonetic: string;
}

export interface SinhalaInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (sinhalaValue: string) => void;
  onPhoneticChange?: (phoneticValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
  inputClassName?: string;
}

export interface SuggestionListProps {
  suggestions: WordSuggestion[];
  onSelect: (word: string) => void;
  className?: string;
  itemClassName?: string;
}

export interface SinhalaTypewriterProps extends SinhalaInputProps {
  showSuggestions?: boolean;
  maxSuggestions?: number;
  suggestionsClassName?: string;
  suggestionItemClassName?: string;
  onSuggestionSelect?: (word: string) => void;
  unstyled?: boolean;
}
