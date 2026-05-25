import { useState, useCallback, useRef } from 'react';
import { convertText, getCurrentWordPhonetic } from '../../core/converter';

export interface UseSinhalaConverterReturn {
  phoneticValue: string;
  sinhalaValue: string;
  currentWordPhonetic: string;
  currentWordSinhala: string;
  handlePhoneticChange: (raw: string) => void;
  replaceCurrentWord: (replacement: string) => void;
  reset: () => void;
}

export function useSinhalaConverter(
  initialPhonetic = '',
  onChange?: (sinhala: string) => void,
): UseSinhalaConverterReturn {
  const [phoneticValue, setPhoneticValue] = useState(initialPhonetic);
  const [sinhalaValue, setSinhalaValue] = useState(() => convertText(initialPhonetic));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handlePhoneticChange = useCallback((raw: string) => {
    setPhoneticValue(raw);
    const converted = convertText(raw);
    setSinhalaValue(converted);
    onChangeRef.current?.(converted);
  }, []);

  const replaceCurrentWord = useCallback((replacement: string) => {
    setPhoneticValue(prev => {
      const parts = prev.split(/(\s+)/);
      // Replace the last non-whitespace segment with the replacement in phonetic space.
      // Since we now show Sinhala, we replace the last sinhala word in the sinhala value.
      // Strategy: trim the trailing phonetic word, append a space, then the sinhala replacement.
      const trailingWhitespace = prev.match(/(\s+)$/)?.[0] ?? '';
      const withoutTrailing = prev.replace(/(\s+)$/, '');
      const lastWordStart = Math.max(
        withoutTrailing.lastIndexOf(' '),
        withoutTrailing.lastIndexOf('\n'),
      ) + 1;
      const beforeLastWord = withoutTrailing.slice(0, lastWordStart);
      // New phonetic: keep everything before current word, but phonetic side is now stale.
      // We store the replacement as Sinhala directly by appending to sinhala buffer.
      const newPhonetic = beforeLastWord + trailingWhitespace;
      const newSinhala = convertText(newPhonetic) + replacement + ' ';
      setSinhalaValue(newSinhala);
      onChangeRef.current?.(newSinhala);
      return newPhonetic;
    });
  }, []);

  const reset = useCallback(() => {
    setPhoneticValue('');
    setSinhalaValue('');
    onChangeRef.current?.('');
  }, []);

  const currentWordPhonetic = getCurrentWordPhonetic(phoneticValue);
  const currentWordSinhala = convertText(currentWordPhonetic);

  return {
    phoneticValue,
    sinhalaValue,
    currentWordPhonetic,
    currentWordSinhala,
    handlePhoneticChange,
    replaceCurrentWord,
    reset,
  };
}
