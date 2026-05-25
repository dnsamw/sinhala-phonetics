import React, { useEffect } from 'react';
import type { SinhalaInputProps } from '../../core/types';
import { useSinhalaConverter } from '../hooks/useSinhalaConverter';

export function SinhalaInput({
  value,
  defaultValue = '',
  onChange,
  onPhoneticChange,
  placeholder = 'Type phonetically (e.g. "ayubowan")…',
  disabled = false,
  rows = 4,
  className,
  inputClassName,
}: SinhalaInputProps) {
  const { phoneticValue, sinhalaValue, handlePhoneticChange } =
    useSinhalaConverter(defaultValue, onChange);

  // If controlled (value prop provided), sync on external changes.
  // Note: controlled mode only sets the display; phonetic buffer is internal.
  useEffect(() => {
    if (value !== undefined) {
      // no-op — controlled sinhala value is overridden externally
    }
  }, [value]);

  const wrapperCls =
    className ??
    'relative w-full font-sans';

  const textareaCls =
    inputClassName ??
    'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 ' +
    'text-gray-900 dark:text-gray-100 px-3 py-2 text-base leading-relaxed ' +
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y ' +
    'disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400';

  const displayValue = value !== undefined ? value : sinhalaValue;

  return (
    <div className={wrapperCls}>
      <textarea
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className={textareaCls}
        value={displayValue}
        onChange={(e) => {
          handlePhoneticChange(e.target.value);
          onPhoneticChange?.(e.target.value);
        }}
      />
    </div>
  );
}
