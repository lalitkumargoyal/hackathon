import { create } from 'zustand';

export type SortCriteria = 'price-asc' | 'price-desc' | 'rating' | 'name';

export interface FilterState {
  searchQuery: string;
  selectedCategoryIds: string[];
  sortCriteria: SortCriteria;
  setSearchQuery: (query: string) => void;
  setSelectedCategoryIds: (categoryIds: string[]) => void;
  setSortCriteria: (criteria: SortCriteria) => void;
  clearFilters: () => void;
}

/**
 * Filter State Store using Zustand
 * Manages product filtering and sorting state
 * Includes search query, category selection, and sort criteria
 */
export const useFilterStore = create<FilterState>()((set) => ({
  searchQuery: '',
  selectedCategoryIds: [],
  sortCriteria: 'name',

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSelectedCategoryIds: (categoryIds) => {
    set({ selectedCategoryIds: categoryIds });
  },

  setSortCriteria: (criteria) => {
    set({ sortCriteria: criteria });
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      selectedCategoryIds: [],
      sortCriteria: 'name',
    });
  },
}));
