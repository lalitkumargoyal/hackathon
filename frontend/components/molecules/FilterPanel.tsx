import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Checkbox } from '../atoms/Checkbox';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterPanelProps {
  title?: string;
  sectionLabel?: string;
  description?: string;
  options: FilterOption[];
  selectedIds: string[];
  onFilterChange: (selectedIds: string[]) => void;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * Molecular FilterPanel Component
 * Collapsible/expandable filter panel with checkboxes for category filtering
 * WCAG AA compliant with proper ARIA attributes
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  title = 'Filters',
  sectionLabel = 'Categories',
  description,
  options,
  selectedIds,
  onFilterChange,
  isCollapsible = true,
  defaultExpanded = true,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedIds, optionId]
      : selectedIds.filter((id) => id !== optionId);
    onFilterChange(newSelectedIds);
  };

  const toggleExpanded = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <aside
      className={clsx(
        'rounded-lg border border-border bg-surface p-6',
        className
      )}
      aria-label="Product filters"
    >
      <div className="flex min-h-11 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/icons/sliders.svg" alt="" width={20} height={20} />
          <h2 className="text-xl font-semibold leading-normal text-text-primary">{title}</h2>
        </div>
        {isCollapsible && (
          <button
            onClick={toggleExpanded}
            className="flex size-11 items-center justify-center rounded-lg"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            type="button"
          >
            <img
              src={isExpanded ? '/icons/chevron-up.svg' : '/icons/chevron-down.svg'}
              alt=""
              width={20}
              height={20}
            />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-5 flex flex-col gap-1 border-t border-border pt-4" role="group" aria-label="Filter options">
          <p className="mb-1 text-base font-semibold text-text-primary">{sectionLabel}</p>
          {options.map((option) => (
            <Checkbox
              key={option.id}
              id={`filter-${option.id}`}
              label={
                option.count !== undefined
                  ? `${option.label} (${option.count})`
                  : option.label
              }
              checked={selectedIds.includes(option.id)}
              onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
            />
          ))}
          {description && (
            <p className="mt-3 text-sm text-text-secondary">{description}</p>
          )}
        </div>
      )}
    </aside>
  );
};
