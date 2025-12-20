// =============================================================================
// DATACENDIA DESIGN SYSTEM - DATA DISPLAY COMPONENTS
// =============================================================================

import React, { forwardRef, useState } from 'react';
import { cn, formatRelativeTime, formatPercent } from '../lib/utils';
import type {
  TableProps,
  TableColumn,
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  ListProps,
  ListItemProps,
  StatProps,
  ProgressProps,
  CircularProgressProps,
  TimelineProps,
  TimelineItem as _TimelineItem,
  TreeProps,
  TreeNode,
} from '../lib/types';

// =============================================================================
// TABLE
// =============================================================================

export function Table<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  emptyState,
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
  stickyHeader = false,
  striped = false,
  hoverable = true,
}: TableProps<T>) {
  const [internalSelected, setInternalSelected] = useState<number[]>([]);
  const selected = onSelectionChange ? selectedRows : internalSelected;
  const setSelected = onSelectionChange || setInternalSelected;

  const handleSelectAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map((_, i) => i));
    }
  };

  const handleSelectRow = (index: number) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const renderCell = (row: T, column: TableColumn<T>, rowIndex: number) => {
    if (column.cell) {
      return column.cell(row, rowIndex);
    }
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor] as React.ReactNode;
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            {onSelectionChange && (
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider',
                  column.sortable && 'cursor-pointer select-none hover:bg-neutral-100',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
                style={{
                  width: column.width,
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                }}
                onClick={() => column.sortable && onSort?.(column.id, sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && sortColumn === column.id && (
                    <span className="text-primary-600">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length + (onSelectionChange ? 1 : 0)} className="px-4 py-12 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full" />
                  <span className="ml-2 text-neutral-500">Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onSelectionChange ? 1 : 0)} className="px-4 py-12">
                {emptyState || (
                  <div className="text-center text-neutral-500">No data available</div>
                )}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'border-b border-neutral-100 transition-colors',
                  striped && rowIndex % 2 === 1 && 'bg-neutral-50',
                  hoverable && 'hover:bg-neutral-50',
                  onRowClick && 'cursor-pointer',
                  selected.includes(rowIndex) && 'bg-primary-50'
                )}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {onSelectionChange && (
                  <td className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(rowIndex)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(rowIndex);
                      }}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      'px-4 py-3 text-sm text-neutral-900',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {renderCell(row, column, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// CARD
// =============================================================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'md',
      isClickable = false,
      isSelected = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      elevated: 'bg-white shadow-md',
      outline: 'bg-white border border-neutral-200',
      filled: 'bg-neutral-50',
    };

    const paddingStyles = {
      none: '',
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg overflow-hidden',
          variantStyles[variant],
          padding !== 'none' && paddingStyles[padding],
          isClickable && 'cursor-pointer hover:shadow-lg transition-shadow',
          isSelected && 'ring-2 ring-primary-500',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// =============================================================================
// CARD HEADER
// =============================================================================

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, avatar, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn('mb-4', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-start gap-4 mb-4', className)} {...props}>
        {avatar && <div className="flex-shrink-0">{avatar}</div>}
        <div className="flex-1 min-w-0">
          {title && <h3 className="text-lg font-semibold text-neutral-900 truncate">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-500 truncate">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

// =============================================================================
// CARD BODY
// =============================================================================

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ padding = 'none', className, children, ...props }, ref) => {
    const paddingStyles = {
      none: '',
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardBody.displayName = 'CardBody';

// =============================================================================
// CARD FOOTER
// =============================================================================

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ justify = 'end', className, children, ...props }, ref) => {
    const justifyStyles = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 pt-4 mt-4 border-t border-neutral-100',
          justifyStyles[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

// =============================================================================
// LIST
// =============================================================================

export const List = forwardRef<HTMLUListElement, ListProps>(
  ({ variant = 'simple', size = 'md', className, children, ...props }, ref) => {
    const variantStyles = {
      simple: '',
      bordered: 'border border-neutral-200 rounded-lg overflow-hidden',
      divided: 'divide-y divide-neutral-200',
    };

    return (
      <ul
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </ul>
    );
  }
);
List.displayName = 'List';

// =============================================================================
// LIST ITEM
// =============================================================================

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      leftContent,
      rightContent,
      title,
      subtitle,
      isClickable = false,
      isSelected = false,
      isDisabled = false,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <li
        ref={ref}
        className={cn(
          'flex items-center gap-4 px-4 py-3',
          isClickable && !isDisabled && 'cursor-pointer hover:bg-neutral-50',
          isSelected && 'bg-primary-50',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={!isDisabled ? onClick : undefined}
        {...props}
      >
        {leftContent && <div className="flex-shrink-0">{leftContent}</div>}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-neutral-900 truncate">{title}</div>
          {subtitle && (
            <div className="text-sm text-neutral-500 truncate">{subtitle}</div>
          )}
        </div>
        {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

// =============================================================================
// STAT
// =============================================================================

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  helpText,
  change,
  icon,
  size = 'md',
}) => {
  const sizeStyles = {
    xs: { label: 'text-xs', value: 'text-lg', help: 'text-xs' },
    sm: { label: 'text-xs', value: 'text-xl', help: 'text-xs' },
    md: { label: 'text-sm', value: 'text-2xl', help: 'text-sm' },
    lg: { label: 'text-sm', value: 'text-3xl', help: 'text-sm' },
    xl: { label: 'text-base', value: 'text-4xl', help: 'text-base' },
  };

  const changeColors = {
    increase: 'text-success-main',
    decrease: 'text-error-main',
    neutral: 'text-neutral-500',
  };

  const changeIcons = {
    increase: '↑',
    decrease: '↓',
    neutral: '→',
  };

  return (
    <div className="flex items-start gap-4">
      {icon && (
        <div className="flex-shrink-0 p-3 bg-primary-50 rounded-lg text-primary-600">
          {icon}
        </div>
      )}
      <div>
        <p className={cn('font-medium text-neutral-500', sizeStyles[size].label)}>
          {label}
        </p>
        <p className={cn('font-bold text-neutral-900', sizeStyles[size].value)}>
          {value}
        </p>
        <div className={cn('flex items-center gap-2 mt-1', sizeStyles[size].help)}>
          {change && (
            <span className={cn('font-medium', changeColors[change.type])}>
              {changeIcons[change.type]} {Math.abs(change.value)}%
            </span>
          )}
          {helpText && <span className="text-neutral-400">{helpText}</span>}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// PROGRESS BAR
// =============================================================================

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  colorScheme = 'primary',
  showValue = false,
  label,
  variant = 'solid',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5',
  };

  const colorStyles = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-success-main',
    warning: 'bg-warning-main',
    error: 'bg-error-main',
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm font-medium text-neutral-700">{label}</span>}
          {showValue && <span className="text-sm text-neutral-500">{formatPercent(percentage, 0)}</span>}
        </div>
      )}
      <div className={cn('w-full bg-neutral-200 rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            colorStyles[colorScheme],
            variant === 'striped' && 'bg-stripes',
            variant === 'animated' && 'bg-stripes animate-stripes'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

// =============================================================================
// CIRCULAR PROGRESS
// =============================================================================

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 80,
  thickness = 8,
  colorScheme = 'primary',
  showValue = true,
  label,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - thickness) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorStyles = {
    primary: 'stroke-primary-600',
    secondary: 'stroke-secondary-600',
    success: 'stroke-success-main',
    warning: 'stroke-warning-main',
    error: 'stroke-error-main',
  };

  return (
    <div className="inline-flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            className="stroke-neutral-200"
            fill="none"
            strokeWidth={thickness}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={cn('transition-all duration-300', colorStyles[colorScheme])}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-neutral-900">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="mt-2 text-sm text-neutral-500">{label}</span>
      )}
    </div>
  );
};

// =============================================================================
// TIMELINE
// =============================================================================

export const Timeline: React.FC<TimelineProps> = ({
  items,
  orientation = 'vertical',
}) => {
  const statusStyles = {
    completed: 'bg-success-main',
    current: 'bg-primary-600 ring-4 ring-primary-100',
    upcoming: 'bg-neutral-300',
    error: 'bg-error-main',
  };

  if (orientation === 'horizontal') {
    return (
      <div className="flex items-start">
        {items.map((item, index) => (
          <div key={item.id} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {index > 0 && (
                <div className={cn(
                  'flex-1 h-0.5',
                  items[index - 1]?.status === 'completed' ? 'bg-success-main' : 'bg-neutral-200'
                )} />
              )}
              <div className={cn(
                'w-4 h-4 rounded-full flex-shrink-0',
                statusStyles[item.status || 'upcoming']
              )}>
                {item.icon}
              </div>
              {index < items.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5',
                  item.status === 'completed' ? 'bg-success-main' : 'bg-neutral-200'
                )} />
              )}
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-neutral-900">{item.title}</div>
              {item.description && (
                <div className="text-xs text-neutral-500">{item.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Line */}
          {index < items.length - 1 && (
            <div className={cn(
              'absolute left-2 top-4 w-0.5 h-full -ml-px',
              item.status === 'completed' ? 'bg-success-main' : 'bg-neutral-200'
            )} />
          )}
          
          {/* Dot */}
          <div className={cn(
            'relative w-4 h-4 rounded-full flex-shrink-0 mt-0.5',
            statusStyles[item.status || 'upcoming']
          )}>
            {item.icon && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                {item.icon}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-900">{item.title}</span>
              {item.timestamp && (
                <span className="text-xs text-neutral-400">
                  {typeof item.timestamp === 'string' 
                    ? item.timestamp 
                    : formatRelativeTime(item.timestamp)}
                </span>
              )}
            </div>
            {item.description && (
              <p className="mt-1 text-sm text-neutral-500">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// TREE
// =============================================================================

export const Tree: React.FC<TreeProps> = ({
  nodes,
  onNodeClick,
  onNodeExpand,
  selectedId,
  expandedIds = [],
  showLines = true,
}) => {
  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.isExpanded ?? expandedIds.includes(node.id);
    const isSelected = node.isSelected ?? selectedId === node.id;

    return (
      <div key={node.id}>
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer',
            'hover:bg-neutral-100 transition-colors',
            isSelected && 'bg-primary-50 text-primary-700',
            node.isDisabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => {
            if (!node.isDisabled) {
              if (hasChildren) {
                onNodeExpand?.(node, !isExpanded);
              }
              onNodeClick?.(node);
            }
          }}
        >
          {hasChildren ? (
            <span className={cn('transition-transform', isExpanded && 'rotate-90')}>
              <ChevronRightIcon className="h-4 w-4 text-neutral-400" />
            </span>
          ) : (
            <span className="w-4" />
          )}
          {node.icon && <span className="text-neutral-500">{node.icon}</span>}
          <span className="text-sm truncate">{node.label}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className={cn(showLines && 'border-l border-neutral-200 ml-4')}>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="select-none">
      {nodes.map((node) => renderNode(node))}
    </div>
  );
};

// =============================================================================
// DATA LIST (Key-Value pairs)
// =============================================================================

interface DataListProps {
  items: Array<{ label: string; value: React.ReactNode }>;
  orientation?: 'horizontal' | 'vertical';
  striped?: boolean;
}

export const DataList: React.FC<DataListProps> = ({
  items,
  orientation = 'horizontal',
  striped = false,
}) => {
  if (orientation === 'vertical') {
    return (
      <dl className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              'px-4 py-3 rounded-md',
              striped && index % 2 === 0 && 'bg-neutral-50'
            )}
          >
            <dt className="text-sm text-neutral-500">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium text-neutral-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className="divide-y divide-neutral-100">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'flex justify-between px-4 py-3',
            striped && index % 2 === 0 && 'bg-neutral-50'
          )}
        >
          <dt className="text-sm text-neutral-500">{item.label}</dt>
          <dd className="text-sm font-medium text-neutral-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};

// =============================================================================
// ICON PLACEHOLDERS
// =============================================================================

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
