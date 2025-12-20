// =============================================================================
// DATACENDIA DESIGN SYSTEM - NAVIGATION COMPONENTS
// =============================================================================

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '../lib/utils';
import type {
  SidebarProps,
  SidebarItemProps,
  SidebarSectionProps,
  HeaderProps,
  Tab as _Tab,
  TabsProps,
  BreadcrumbProps,
  PaginationProps,
  MenuItem,
  MenuProps,
} from '../lib/types';

// =============================================================================
// SIDEBAR CONTEXT
// =============================================================================

interface SidebarContextValue {
  isCollapsed: boolean;
}

const SidebarContext = createContext<SidebarContextValue>({ isCollapsed: false });

// =============================================================================
// SIDEBAR
// =============================================================================

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggle: _onToggle,
  width = 256,
  collapsedWidth = 64,
  children,
}) => {
  return (
    <SidebarContext.Provider value={{ isCollapsed }}>
      <aside
        className={cn(
          'flex flex-col h-full bg-white border-r border-neutral-200',
          'transition-all duration-300 ease-in-out'
        )}
        style={{ width: isCollapsed ? collapsedWidth : width }}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
};

// =============================================================================
// SIDEBAR HEADER
// =============================================================================

interface SidebarHeaderProps {
  logo?: React.ReactNode;
  title?: string;
  onToggle?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  logo,
  title,
  onToggle,
}) => {
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <div className="flex items-center h-16 px-4 border-b border-neutral-200">
      {logo && <div className="flex-shrink-0">{logo}</div>}
      {!isCollapsed && title && (
        <span className="ml-3 font-semibold text-neutral-900 truncate">{title}</span>
      )}
      {onToggle && (
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100',
            'transition-colors ml-auto'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronIcon className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')} />
        </button>
      )}
    </div>
  );
};

// =============================================================================
// SIDEBAR SECTION
// =============================================================================

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <div className="py-2">
      {title && !isCollapsed && (
        <h3 className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <nav className="space-y-1 px-2">{children}</nav>
    </div>
  );
};

// =============================================================================
// SIDEBAR ITEM
// =============================================================================

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  onClick,
  isActive = false,
  badge,
  children,
}) => {
  const { isCollapsed } = useContext(SidebarContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = React.Children.count(children) > 0;

  const content = (
    <>
      {icon && (
        <span className={cn('flex-shrink-0 h-5 w-5', isActive ? 'text-primary-600' : 'text-neutral-400')}>
          {icon}
        </span>
      )}
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge && <span className="ml-2">{badge}</span>}
          {hasChildren && (
            <ChevronDownIcon
              className={cn(
                'h-4 w-4 text-neutral-400 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </>
      )}
    </>
  );

  const itemClasses = cn(
    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
    'transition-colors cursor-pointer',
    isActive
      ? 'bg-primary-50 text-primary-700'
      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
  );

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    onClick?.();
  };

  const ItemComponent = href ? 'a' : 'button';

  return (
    <div>
      <ItemComponent
        href={href}
        onClick={handleClick}
        className={cn(itemClasses, 'w-full text-left')}
        title={isCollapsed ? label : undefined}
      >
        {content}
      </ItemComponent>
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="ml-8 mt-1 space-y-1">{children}</div>
      )}
    </div>
  );
};

// =============================================================================
// SIDEBAR FOOTER
// =============================================================================

interface SidebarFooterProps {
  children: React.ReactNode;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ children }) => {
  return (
    <div className="mt-auto border-t border-neutral-200 p-4">{children}</div>
  );
};

// =============================================================================
// HEADER
// =============================================================================

export const Header: React.FC<HeaderProps> = ({
  logo,
  leftContent,
  centerContent,
  rightContent,
  sticky = false,
}) => {
  return (
    <header
      className={cn(
        'flex items-center h-16 px-4 bg-white border-b border-neutral-200',
        sticky && 'sticky top-0 z-40'
      )}
    >
      <div className="flex items-center flex-shrink-0">
        {logo}
        {leftContent}
      </div>
      
      {centerContent && (
        <div className="flex-1 flex items-center justify-center px-4">
          {centerContent}
        </div>
      )}
      
      <div className="flex items-center ml-auto space-x-4">
        {rightContent}
      </div>
    </header>
  );
};

// =============================================================================
// TABS
// =============================================================================

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  size = 'md',
  orientation = 'horizontal',
}) => {
  const sizeStyles = {
    xs: 'text-xs py-1 px-2',
    sm: 'text-sm py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5',
    xl: 'text-lg py-3 px-6',
  };

  const variantStyles = {
    line: {
      container: 'border-b border-neutral-200',
      tab: (isActive: boolean) =>
        cn(
          'relative border-b-2 -mb-px transition-colors',
          isActive
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
        ),
    },
    enclosed: {
      container: 'border-b border-neutral-200',
      tab: (isActive: boolean) =>
        cn(
          'border border-b-0 rounded-t-md -mb-px transition-colors',
          isActive
            ? 'border-neutral-200 bg-white text-neutral-900'
            : 'border-transparent text-neutral-500 hover:text-neutral-700'
        ),
    },
    pills: {
      container: '',
      tab: (isActive: boolean) =>
        cn(
          'rounded-md transition-colors',
          isActive
            ? 'bg-primary-100 text-primary-700'
            : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
        ),
    },
  };

  return (
    <div
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col space-y-1' : 'space-x-1',
        variantStyles[variant].container
      )}
      role="tablist"
      aria-orientation={orientation}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          disabled={tab.disabled}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 font-medium whitespace-nowrap',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeStyles[size],
            variantStyles[variant].tab(activeTab === tab.id)
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge}
        </button>
      ))}
    </div>
  );
};

// =============================================================================
// TAB PANEL
// =============================================================================

interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tabId,
  activeTab,
  children,
}) => {
  if (activeTab !== tabId) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={tabId}
    >
      {children}
    </div>
  );
};

// =============================================================================
// BREADCRUMB
// =============================================================================

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRightIcon className="h-4 w-4 text-neutral-400" />,
  maxItems,
}) => {
  const displayItems = maxItems && items.length > maxItems
    ? [
        items[0],
        { label: '...' },
        ...items.slice(-(maxItems - 1)),
      ]
    : items;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">{separator}</span>}
            {item.href && index < displayItems.length - 1 ? (
              <a
                href={item.href}
                className="flex items-center text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  'flex items-center text-sm',
                  index === displayItems.length - 1
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-500'
                )}
                aria-current={index === displayItems.length - 1 ? 'page' : undefined}
              >
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// =============================================================================
// PAGINATION
// =============================================================================

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
  showFirstLast = true,
  size = 'md',
}) => {
  const sizeStyles = {
    xs: 'h-6 min-w-6 text-xs',
    sm: 'h-8 min-w-8 text-sm',
    md: 'h-10 min-w-10 text-sm',
    lg: 'h-11 min-w-11 text-base',
    xl: 'h-12 min-w-12 text-lg',
  };

  const generatePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingsCount;
      for (let i = 1; i <= Math.min(leftItemCount, totalPages); i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      pages.push(1);
      pages.push('ellipsis');
      const rightItemCount = 3 + 2 * siblingsCount;
      for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
        if (i > 1) pages.push(i);
      }
    } else if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const buttonClass = cn(
    'inline-flex items-center justify-center rounded-md',
    'border border-neutral-300 bg-white',
    'text-neutral-700 hover:bg-neutral-50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-colors',
    sizeStyles[size]
  );

  const activeButtonClass = cn(
    buttonClass,
    'bg-primary-50 border-primary-500 text-primary-700 hover:bg-primary-100'
  );

  const pages = generatePages();

  return (
    <nav className="flex items-center space-x-1" aria-label="Pagination">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(buttonClass, 'px-2')}
          aria-label="First page"
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </button>
      )}
      
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(buttonClass, 'px-2')}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {pages.map((page, index) => (
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-neutral-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? activeButtonClass : buttonClass}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(buttonClass, 'px-2')}
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(buttonClass, 'px-2')}
          aria-label="Last page"
        >
          <ChevronsRightIcon className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
};

// =============================================================================
// DROPDOWN MENU
// =============================================================================

export const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  placement = 'bottom',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const placementStyles = {
    top: 'bottom-full mb-1',
    bottom: 'top-full mt-1',
    left: 'right-full mr-1',
    right: 'left-full ml-1',
  };

  const renderMenuItem = (item: MenuItem, _index: number) => {
    if (item.children) {
      return (
        <Menu
          key={item.id}
          trigger={
            <button
              className={cn(
                'flex items-center justify-between w-full px-3 py-2 text-sm text-left',
                'text-neutral-700 hover:bg-neutral-100 rounded-md',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={item.disabled}
            >
              <span className="flex items-center">
                {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                {item.label}
              </span>
              <ChevronRightIcon className="h-4 w-4 text-neutral-400" />
            </button>
          }
          items={item.children}
          placement="right"
        />
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => {
          item.onClick?.();
          setIsOpen(false);
        }}
        disabled={item.disabled}
        className={cn(
          'flex items-center w-full px-3 py-2 text-sm text-left rounded-md',
          item.danger
            ? 'text-error-main hover:bg-error-light'
            : 'text-neutral-700 hover:bg-neutral-100',
          item.disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
        <span className="flex-1">{item.label}</span>
        {item.shortcut && (
          <span className="ml-4 text-xs text-neutral-400">{item.shortcut}</span>
        )}
      </button>
    );
  };

  return (
    <div ref={menuRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 min-w-48 py-1',
            'bg-white border border-neutral-200 rounded-lg shadow-lg',
            placementStyles[placement]
          )}
        >
          {items.map(renderMenuItem)}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// NAVIGATION LINKS
// =============================================================================

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  isActive = false,
  className,
}) => {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-primary-50 text-primary-700'
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
        className
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  );
};

// =============================================================================
// ICON PLACEHOLDERS
// =============================================================================

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronsLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const ChevronsRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);
