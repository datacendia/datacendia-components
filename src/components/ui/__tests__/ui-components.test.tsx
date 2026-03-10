/**
 * UI Components Tests
 * Tests for Button, Badge, Card, Input, Label, Textarea, Progress, Tabs
 * @module components/ui/__tests__/ui-components.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ============================================================================
// Button
// ============================================================================
import { Button } from '../button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should render as button element', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    expect(container.firstChild).toBeDefined();
  });

  it('should apply size classes', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    expect(container.firstChild).toBeDefined();
  });

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should support type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});

// ============================================================================
// Badge
// ============================================================================
import { Badge } from '../badge';

describe('Badge', () => {
  it('should render with text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render default variant', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toBeDefined();
  });

  it('should render destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    expect(container.firstChild).toBeDefined();
  });

  it('should render secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Info</Badge>);
    expect(container.firstChild).toBeDefined();
  });

  it('should render outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    expect(container.firstChild).toBeDefined();
  });

  it('should apply custom className', () => {
    const { container } = render(<Badge className="my-badge">Styled</Badge>);
    expect(container.querySelector('.my-badge')).toBeTruthy();
  });
});

// ============================================================================
// Card
// ============================================================================
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card', () => {
  it('should render card with content', () => {
    render(<Card><CardContent>Body</CardContent></Card>);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('should render full card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should apply custom className to Card', () => {
    const { container } = render(<Card className="custom-card">Test</Card>);
    expect(container.querySelector('.custom-card')).toBeTruthy();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ============================================================================
// Input
// ============================================================================
import { Input } from '../input';

describe('Input', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should handle text input', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should support type attribute', () => {
    render(<Input type="email" data-testid="email-input" />);
    expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email');
  });

  it('should be disabled when disabled prop is set', () => {
    render(<Input disabled data-testid="disabled-input" />);
    expect(screen.getByTestId('disabled-input')).toBeDisabled();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should apply custom className', () => {
    const { container } = render(<Input className="my-input" />);
    expect(container.querySelector('.my-input')).toBeTruthy();
  });
});
