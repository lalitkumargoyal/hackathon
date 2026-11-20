import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Input } from '../atoms/Input';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
  initialValue?: string;
  hint?: string;
}

/**
 * Molecular SearchBar Component
 * Input with search icon and 300ms debounce
 * WCAG AA compliant with proper labeling and focus states
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search products...',
  onSearch,
  debounceMs = 300,
  className,
  initialValue = '',
  hint,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const searchIcon = (
    <img src="/icons/search.svg" alt="" width={20} height={20} />
  );

  const clearButton = searchQuery ? (
    <button
      onClick={handleClear}
      className="text-text-secondary hover:text-text-primary transition-colors"
      aria-label="Clear search"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  ) : null;

  return (
    <div className={clsx('w-full', className)}>
      <Input
        type="search"
        label="Search products"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        leftIcon={searchIcon}
        rightIcon={clearButton}
        helperText={hint}
        fullWidth
        aria-label="Search products"
      />
    </div>
  );
};
