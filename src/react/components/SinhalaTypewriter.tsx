import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import type { SinhalaTypewriterProps } from '../../core/types';
import { convertText } from '../../core/converter';
import { SuggestionList } from './SuggestionList';
import { useWordPrediction } from '../hooks/useWordPrediction';

// Extract the trailing unconverted phonetic chars (ASCII) from the current word.
function trailingPhonetic(text: string): string {
  const words = text.split(/[\s\n]+/);
  const last = words[words.length - 1] ?? '';
  // ASCII phonetic chars (a-z, A-Z, backslash, parens used in phonetic scheme)
  return last.match(/[a-zA-Z\\/()]+$/)?.[0] ?? '';
}

export function SinhalaTypewriter({
  value,
  defaultValue = '',
  onChange,
  onPhoneticChange,
  onSuggestionSelect,
  showSuggestions = true,
  maxSuggestions = 5,
  placeholder = 'Type phonetically (e.g. "ayubowan")…',
  disabled = false,
  rows = 4,
  className,
  inputClassName,
  suggestionsClassName,
  suggestionItemClassName,
  unstyled = false,
}: SinhalaTypewriterProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [showDropdown, setShowDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayValue = isControlled ? value : internalValue;

  // Current phonetic word = trailing ASCII chars in the textarea (not yet converted)
  const currentPhonetic = useMemo(() => trailingPhonetic(displayValue), [displayValue]);
  const currentWordSinhala = useMemo(() => convertText(currentPhonetic), [currentPhonetic]);
  const suggestions = useWordPrediction(currentWordSinhala, { maxSuggestions });

  useEffect(() => {
    setShowDropdown(showSuggestions && suggestions.length > 0 && currentPhonetic.length > 0);
  }, [suggestions, showSuggestions, currentPhonetic]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const raw = e.target.value;

      if (!isControlled) setInternalValue(raw);
      onPhoneticChange?.(raw);

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const converted = convertText(raw);
        if (!isControlled) setInternalValue(converted);
        onChange?.(converted);
      }, 300);
    },
    [isControlled, onChange, onPhoneticChange],
  );

  const handleSelect = useCallback(
    (word: string) => {
      setShowDropdown(false);

      // Find where the current phonetic word starts in displayValue and replace it.
      const cursorAt = textareaRef.current?.selectionStart ?? displayValue.length;
      const textUpToCursor = displayValue.slice(0, cursorAt);
      const lastBoundary = Math.max(
        textUpToCursor.lastIndexOf(' '),
        textUpToCursor.lastIndexOf('\n'),
      );
      const before = lastBoundary >= 0 ? displayValue.slice(0, lastBoundary + 1) : '';
      const after = displayValue.slice(cursorAt);
      const newValue = before + word + ' ' + after;

      if (!isControlled) setInternalValue(newValue);
      onChange?.(newValue);
      onSuggestionSelect?.(word);

      // Restore focus and set cursor after inserted word
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const pos = before.length + word.length + 1;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(pos, pos);
        }
      });
    },
    [displayValue, isControlled, onChange, onSuggestionSelect],
  );

  const wrapperCls = unstyled
    ? className ?? ''
    : className ?? 'relative w-full font-sans';

  const textareaCls = unstyled
    ? inputClassName ?? ''
    : inputClassName ??
      'w-full rounded-lg border border-gray-300 dark:border-gray-600 ' +
        'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ' +
        'px-3 py-2 text-base leading-relaxed focus:outline-none ' +
        'focus:ring-2 focus:ring-indigo-500 resize-y ' +
        'disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400';

  return (
    <div className={wrapperCls}>
      <textarea
        ref={textareaRef}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className={textareaCls}
        value={displayValue}
        onChange={handleChange}
        onFocus={() => {
          if (showSuggestions && suggestions.length > 0 && currentPhonetic.length > 0)
            setShowDropdown(true);
        }}
        onBlur={() => {
          // Delay hiding so onMouseDown on a suggestion can fire first
          setTimeout(() => setShowDropdown(false), 150);
        }}
        aria-autocomplete="list"
        aria-expanded={showDropdown}
      />

      {showDropdown && (
        <SuggestionList
          suggestions={suggestions}
          onSelect={handleSelect}
          className={suggestionsClassName}
          itemClassName={suggestionItemClassName}
        />
      )}
    </div>
  );
}
