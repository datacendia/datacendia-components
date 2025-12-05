// =============================================================================
// DATACENDIA DESIGN SYSTEM - LAYOUT COMPONENTS
// =============================================================================

import React, { forwardRef } from 'react';
import { cn, spacing as getSpacing } from '../lib/utils';
import type {
  ContainerProps,
  StackProps,
  GridProps,
  FlexProps,
  DividerProps,
  SpacerProps,
} from '../lib/types';

// =============================================================================
// CONTAINER
// =============================================================================

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      maxWidth = 'xl',
      padding = true,
      center = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const maxWidthStyles = {
      sm: 'max-w-screen-sm',   // 640px
      md: 'max-w-screen-md',   // 768px
      lg: 'max-w-screen-lg',   // 1024px
      xl: 'max-w-screen-xl',   // 1280px
      '2xl': 'max-w-screen-2xl', // 1536px
      full: 'max-w-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          maxWidthStyles[maxWidth],
          padding && 'px-4 sm:px-6 lg:px-8',
          center && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = 'Container';

// =============================================================================
// STACK (Vertical or Horizontal Stack)
// =============================================================================

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'column',
      spacing = 4,
      align,
      justify,
      wrap = false,
      divider,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const alignItems = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      between: 'items-baseline',
      around: 'items-baseline',
      evenly: 'items-baseline',
    };

    const justifyContent = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      stretch: 'justify-stretch',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const childArray = React.Children.toArray(children).filter(Boolean);

    const spacingValue = typeof spacing === 'number' ? `${spacing * 0.25}rem` : spacing;

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'column' ? 'flex-col' : 'flex-row',
          align && alignItems[align],
          justify && justifyContent[justify],
          wrap && 'flex-wrap',
          className
        )}
        style={{ gap: spacingValue }}
        {...props}
      >
        {divider
          ? childArray.map((child, index) => (
              <React.Fragment key={index}>
                {child}
                {index < childArray.length - 1 && divider}
              </React.Fragment>
            ))
          : children}
      </div>
    );
  }
);
Stack.displayName = 'Stack';

// Convenience exports
export const VStack = forwardRef<HTMLDivElement, Omit<StackProps, 'direction'>>(
  (props, ref) => <Stack ref={ref} direction="column" {...props} />
);
VStack.displayName = 'VStack';

export const HStack = forwardRef<HTMLDivElement, Omit<StackProps, 'direction'>>(
  (props, ref) => <Stack ref={ref} direction="row" {...props} />
);
HStack.displayName = 'HStack';

// =============================================================================
// GRID
// =============================================================================

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 12,
      gap = 4,
      rowGap,
      columnGap,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const getColumns = () => {
      if (typeof columns === 'number') {
        return { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` };
      }
      // Responsive columns would need CSS classes, simplified here
      return { gridTemplateColumns: `repeat(${columns.lg || columns.md || columns.sm || 1}, minmax(0, 1fr))` };
    };

    const gapValue = typeof gap === 'number' ? `${gap * 0.25}rem` : gap;
    const rowGapValue = rowGap ? (typeof rowGap === 'number' ? `${rowGap * 0.25}rem` : rowGap) : gapValue;
    const columnGapValue = columnGap ? (typeof columnGap === 'number' ? `${columnGap * 0.25}rem` : columnGap) : gapValue;

    return (
      <div
        ref={ref}
        className={cn('grid', className)}
        style={{
          ...getColumns(),
          rowGap: rowGapValue,
          columnGap: columnGapValue,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Grid.displayName = 'Grid';

// =============================================================================
// GRID ITEM
// =============================================================================

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number;
  rowSpan?: number;
  colStart?: number;
  colEnd?: number;
  rowStart?: number;
  rowEnd?: number;
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          gridColumn: colSpan ? `span ${colSpan} / span ${colSpan}` : undefined,
          gridRow: rowSpan ? `span ${rowSpan} / span ${rowSpan}` : undefined,
          gridColumnStart: colStart,
          gridColumnEnd: colEnd,
          gridRowStart: rowStart,
          gridRowEnd: rowEnd,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GridItem.displayName = 'GridItem';

// =============================================================================
// FLEX
// =============================================================================

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = 'row',
      align,
      justify,
      wrap = 'nowrap',
      gap,
      flex,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const directionStyles = {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    };

    const alignItems = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      between: 'items-baseline',
      around: 'items-baseline',
      evenly: 'items-baseline',
    };

    const justifyContent = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      stretch: 'justify-stretch',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const wrapStyles = {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse',
    };

    const gapValue = gap ? (typeof gap === 'number' ? `${gap * 0.25}rem` : gap) : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directionStyles[direction],
          align && alignItems[align],
          justify && justifyContent[justify],
          wrapStyles[wrap],
          className
        )}
        style={{
          gap: gapValue,
          flex: flex,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Flex.displayName = 'Flex';

// =============================================================================
// DIVIDER
// =============================================================================

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  label,
}) => {
  const borderStyles = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'self-stretch border-l border-neutral-200',
          borderStyles[variant]
        )}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div className="relative flex items-center" role="separator">
        <div className={cn('flex-grow border-t border-neutral-200', borderStyles[variant])} />
        <span className="flex-shrink mx-4 text-sm text-neutral-500">{label}</span>
        <div className={cn('flex-grow border-t border-neutral-200', borderStyles[variant])} />
      </div>
    );
  }

  return (
    <div
      className={cn('w-full border-t border-neutral-200', borderStyles[variant])}
      role="separator"
      aria-orientation="horizontal"
    />
  );
};

// =============================================================================
// SPACER
// =============================================================================

export const Spacer: React.FC<SpacerProps> = ({
  size = 4,
  axis = 'vertical',
}) => {
  const sizeValue = typeof size === 'number' ? `${size * 0.25}rem` : size;

  if (axis === 'horizontal') {
    return <div style={{ width: sizeValue, flexShrink: 0 }} aria-hidden="true" />;
  }

  return <div style={{ height: sizeValue, flexShrink: 0 }} aria-hidden="true" />;
};

// =============================================================================
// BOX (Generic wrapper with common styling props)
// =============================================================================

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  // Note: Using string for 'as' to allow flexibility while avoiding complex polymorphic typing
  as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer' | 'nav' | 'span';
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  m?: number;
  mx?: number;
  my?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  bg?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  border?: boolean;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      as: Component = 'div',
      p, px, py, pt, pr, pb, pl,
      m, mx, my, mt, mr, mb, ml,
      bg,
      rounded,
      shadow,
      border,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const roundedStyles = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      full: 'rounded-full',
    };

    const shadowStyles = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
    };

    const spacing = (value: number | undefined) => 
      value !== undefined ? `${value * 0.25}rem` : undefined;

    // Use createElement to avoid complex polymorphic typing
    return React.createElement(
      Component,
      {
        ref: ref as any,
        className: cn(
          rounded && roundedStyles[rounded],
          shadow && shadowStyles[shadow],
          border && 'border border-neutral-200',
          className
        ),
        style: {
          padding: spacing(p),
          paddingLeft: spacing(pl) || spacing(px),
          paddingRight: spacing(pr) || spacing(px),
          paddingTop: spacing(pt) || spacing(py),
          paddingBottom: spacing(pb) || spacing(py),
          margin: spacing(m),
          marginLeft: spacing(ml) || spacing(mx),
          marginRight: spacing(mr) || spacing(mx),
          marginTop: spacing(mt) || spacing(my),
          marginBottom: spacing(mb) || spacing(my),
          backgroundColor: bg,
          ...style,
        },
        ...props,
      },
      children
    );
  }
);
Box.displayName = 'Box';

// =============================================================================
// CENTER (Centers content horizontally and vertically)
// =============================================================================

interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ inline = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center',
          inline && 'inline-flex',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Center.displayName = 'Center';

// =============================================================================
// ASPECT RATIO
// =============================================================================

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio: number; // width / height (e.g., 16/9, 4/3, 1)
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio, className, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        style={{ paddingBottom: `${(1 / ratio) * 100}%`, ...style }}
        {...props}
      >
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  }
);
AspectRatio.displayName = 'AspectRatio';

// =============================================================================
// SIMPLE GRID (Preset grid layouts)
// =============================================================================

interface SimpleGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: number;
  spacingX?: number;
  spacingY?: number;
}

export const SimpleGrid = forwardRef<HTMLDivElement, SimpleGridProps>(
  (
    {
      columns,
      spacing = 4,
      spacingX,
      spacingY,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const colCount = typeof columns === 'number' ? columns : columns.md || columns.base || 1;
    const gapX = spacingX ?? spacing;
    const gapY = spacingY ?? spacing;

    return (
      <div
        ref={ref}
        className={cn('grid', className)}
        style={{
          gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
          columnGap: `${gapX * 0.25}rem`,
          rowGap: `${gapY * 0.25}rem`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SimpleGrid.displayName = 'SimpleGrid';

// =============================================================================
// WRAP (Flexbox wrap with gap)
// =============================================================================

interface WrapProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: number;
  spacingX?: number;
  spacingY?: number;
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export const Wrap = forwardRef<HTMLDivElement, WrapProps>(
  (
    {
      spacing = 2,
      spacingX,
      spacingY,
      align = 'start',
      justify = 'start',
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const alignItems = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    };

    const justifyContent = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const gapX = spacingX ?? spacing;
    const gapY = spacingY ?? spacing;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap',
          alignItems[align],
          justifyContent[justify],
          className
        )}
        style={{
          columnGap: `${gapX * 0.25}rem`,
          rowGap: `${gapY * 0.25}rem`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Wrap.displayName = 'Wrap';
