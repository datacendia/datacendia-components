// @ts-nocheck
// =============================================================================
// DATACENDIA DESIGN SYSTEM - PRIMITIVE COMPONENTS
// =============================================================================

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn, buttonStyles, inputStyles, badgeStyles, generateId } from '../lib/utils';
import type {
  ButtonProps,
  IconButtonProps,
  InputProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioGroupProps,
  ToggleProps,
  BadgeProps,
  AvatarProps,
  AvatarGroupProps,
  TooltipProps,
} from '../lib/types';

// =============================================================================
// BUTTON
// =============================================================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading = false,
      isDisabled = false,
      isFullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonStyles.base,
          buttonStyles.sizes[size],
          buttonStyles.variants[variant],
          isFullWidth && 'w-full',
          className
        )}
        disabled={isDisabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

// =============================================================================
// ICON BUTTON
// =============================================================================

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-11 w-11',
      xl: 'h-12 w-12',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          buttonStyles.variants[variant],
          sizeClasses[size],
          className
        )}
        disabled={isDisabled || isLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {isLoading ? <Spinner size="sm" /> : icon}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';

// =============================================================================
// INPUT
// =============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      isInvalid = false,
      isDisabled = false,
      isReadOnly = false,
      className,
      ...props
    },
    ref
  ) => {
    const hasLeftContent = leftIcon || leftAddon;
    const hasRightContent = rightIcon || rightAddon;

    return (
      <div className="relative flex">
        {leftAddon && (
          <span className="inline-flex items-center px-3 bg-neutral-100 border border-r-0 border-neutral-300 rounded-l-md text-neutral-600 text-sm">
            {leftAddon}
          </span>
        )}
        
        <div className="relative flex-1">
          {leftIcon && !leftAddon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
              {leftIcon}
            </span>
          )}
          
          <input
            ref={ref}
            className={cn(
              inputStyles.base,
              inputStyles.sizes[size],
              isInvalid && inputStyles.invalid,
              leftIcon && !leftAddon && 'pl-10',
              rightIcon && !rightAddon && 'pr-10',
              leftAddon && 'rounded-l-none',
              rightAddon && 'rounded-r-none',
              className
            )}
            disabled={isDisabled}
            readOnly={isReadOnly}
            aria-invalid={isInvalid}
            {...props}
          />
          
          {rightIcon && !rightAddon && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
              {rightIcon}
            </span>
          )}
        </div>
        
        {rightAddon && (
          <span className="inline-flex items-center px-3 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-md text-neutral-600 text-sm">
            {rightAddon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// =============================================================================
// TEXTAREA
// =============================================================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      isInvalid = false,
      isDisabled = false,
      isReadOnly = false,
      resize = 'vertical',
      className,
      ...props
    },
    ref
  ) => {
    const resizeClasses = {
      none: 'resize-none',
      both: 'resize',
      horizontal: 'resize-x',
      vertical: 'resize-y',
    };

    return (
      <textarea
        ref={ref}
        className={cn(
          inputStyles.base,
          'py-2',
          inputStyles.sizes[size],
          isInvalid && inputStyles.invalid,
          resizeClasses[resize],
          className
        )}
        disabled={isDisabled}
        readOnly={isReadOnly}
        aria-invalid={isInvalid}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

// =============================================================================
// SELECT
// =============================================================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      options,
      placeholder,
      isInvalid = false,
      isDisabled = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            inputStyles.base,
            inputStyles.sizes[size],
            isInvalid && inputStyles.invalid,
            'pr-10 appearance-none cursor-pointer',
            className
          )}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </div>
    );
  }
);
Select.displayName = 'Select';

// =============================================================================
// CHECKBOX
// =============================================================================

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      label,
      description,
      isInvalid = false,
      isIndeterminate = false,
      className,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const id = providedId || generateId('checkbox');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate]);

    const sizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-7 w-7',
    };

    return (
      <div className={cn('flex items-start', className)}>
        <input
          ref={(node) => {
            (inputRef as any).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          type="checkbox"
          id={id}
          className={cn(
            sizeClasses[size],
            'rounded border-neutral-300 text-primary-600',
            'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isInvalid && 'border-error-main'
          )}
          aria-invalid={isInvalid}
          {...props}
        />
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label htmlFor={id} className="text-sm font-medium text-neutral-700 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-neutral-500">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// =============================================================================
// RADIO GROUP
// =============================================================================

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  orientation = 'vertical',
  size = 'md',
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7',
  };

  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
      )}
      role="radiogroup"
    >
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <div key={option.value} className="flex items-start">
            <input
              type="radio"
              id={id}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              disabled={option.disabled}
              className={cn(
                sizeClasses[size],
                'border-neutral-300 text-primary-600',
                'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />
            <div className="ml-3">
              <label
                htmlFor={id}
                className={cn(
                  'text-sm font-medium cursor-pointer',
                  option.disabled ? 'text-neutral-400' : 'text-neutral-700'
                )}
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-sm text-neutral-500">{option.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =============================================================================
// TOGGLE / SWITCH
// =============================================================================

export const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  onChange,
  size = 'md',
  label,
  description,
  isDisabled = false,
}) => {
  const id = generateId('toggle');

  const sizeStyles = {
    xs: { track: 'h-4 w-7', thumb: 'h-3 w-3', translate: 'translate-x-3' },
    sm: { track: 'h-5 w-9', thumb: 'h-4 w-4', translate: 'translate-x-4' },
    md: { track: 'h-6 w-11', thumb: 'h-5 w-5', translate: 'translate-x-5' },
    lg: { track: 'h-7 w-14', thumb: 'h-6 w-6', translate: 'translate-x-7' },
    xl: { track: 'h-8 w-16', thumb: 'h-7 w-7', translate: 'translate-x-8' },
  };

  return (
    <div className="flex items-start">
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        disabled={isDisabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeStyles[size].track,
          checked ? 'bg-primary-600' : 'bg-neutral-200'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow transform',
            'transition duration-200 ease-in-out',
            sizeStyles[size].thumb,
            checked ? sizeStyles[size].translate : 'translate-x-0'
          )}
        />
      </button>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'text-sm font-medium cursor-pointer',
                isDisabled ? 'text-neutral-400' : 'text-neutral-700'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-neutral-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// BADGE
// =============================================================================

export const Badge: React.FC<BadgeProps> = ({
  variant = 'subtle',
  colorScheme = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        badgeStyles.base,
        badgeStyles.sizes[size],
        badgeStyles.variants[variant][colorScheme],
        className
      )}
      {...props}
    >
      {leftIcon && <span className="mr-1 -ml-0.5">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1 -mr-0.5">{rightIcon}</span>}
    </span>
  );
};

// =============================================================================
// AVATAR
// =============================================================================

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  showStatus = false,
  fallback,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  const statusColors = {
    online: 'bg-success-main',
    offline: 'bg-neutral-400',
    busy: 'bg-error-main',
    away: 'bg-warning-main',
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const sizeClass = typeof size === 'number' 
    ? undefined 
    : sizeStyles[size];
  
  const customSize = typeof size === 'number' 
    ? { width: size, height: size } 
    : undefined;

  return (
    <div className="relative inline-flex">
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden',
          'bg-primary-100 text-primary-700 font-medium',
          sizeClass
        )}
        style={customSize}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : fallback ? (
          fallback
        ) : name ? (
          getInitials(name)
        ) : (
          <UserIcon className="h-1/2 w-1/2" />
        )}
      </div>
      
      {showStatus && status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusSizes[typeof size === 'number' ? 'md' : size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};

// =============================================================================
// AVATAR GROUP
// =============================================================================

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  spacing = -8,
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className="flex items-center">
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="relative rounded-full ring-2 ring-white"
          style={{ marginLeft: index === 0 ? 0 : spacing }}
        >
          <Avatar src={avatar.src} name={avatar.name} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative rounded-full ring-2 ring-white',
            'inline-flex items-center justify-center',
            'bg-neutral-200 text-neutral-600 font-medium text-sm',
            size === 'xs' && 'h-6 w-6 text-xs',
            size === 'sm' && 'h-8 w-8 text-xs',
            size === 'md' && 'h-10 w-10 text-sm',
            size === 'lg' && 'h-12 w-12 text-base',
            size === 'xl' && 'h-16 w-16 text-lg'
          )}
          style={{ marginLeft: spacing }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// TOOLTIP
// =============================================================================

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  isDisabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const showTooltip = () => {
    if (isDisabled) return;
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const placementStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-medium text-white',
            'bg-neutral-900 rounded shadow-lg whitespace-nowrap',
            'animate-in fade-in duration-150',
            placementStyles[placement]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SPINNER (Helper Component)
// =============================================================================

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  className,
}) => {
  const sizeStyles = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  const sizeClass = typeof size === 'number' ? undefined : sizeStyles[size];
  const customSize = typeof size === 'number' ? { width: size, height: size } : undefined;

  return (
    <svg
      className={cn('animate-spin', sizeClass, className)}
      style={customSize}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// =============================================================================
// ICON PLACEHOLDERS (Replace with actual icon library)
// =============================================================================

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
