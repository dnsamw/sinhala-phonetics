import React from 'react';
import type { SuggestionListProps } from '../../core/types';

const defaultItemCls =
  'px-3 py-1.5 cursor-pointer text-sm rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/40 ' +
  'text-gray-800 dark:text-gray-100 transition-colors select-none';

export function SuggestionList({
  suggestions,
  onSelect,
  className,
  itemClassName,
}: SuggestionListProps) {
  if (suggestions.length === 0) return null;

  return (
    <ul
      role="listbox"
      className={
        className ??
        'absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 ' +
          'dark:border-gray-700 rounded-lg shadow-lg overflow-hidden'
      }
    >
      {suggestions.map((s) => (
        <li
          key={s.word}
          role="option"
          aria-selected={false}
          className={itemClassName ?? defaultItemCls}
          onMouseDown={(e) => {
            e.preventDefault(); // keep focus on input
            onSelect(s.word);
          }}
        >
          {s.word}
        </li>
      ))}
    </ul>
  );
}
