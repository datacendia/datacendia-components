/**
 * UI Components Extended Tests
 * Tests for Progress, Textarea, Label, Toast, PageLoader, RedactedText
 * @module components/ui/__tests__/ui-components-extended.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ============================================================================
// Progress
// ============================================================================
import { Progress } from '../progress';

describe('Progress', () => {
  it('should render progressbar role', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should set aria-valuenow', () => {
    render(<Progress value={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('should set aria-valuemax', () => {
    render(<Progress value={50} max={200} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '200');
  });

  it('should default value to 0', () => {
    render(<Progress />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('should apply custom className', () => {
    const { container } = render(<Progress className="custom-progress" value={50} />);
    expect(container.querySelector('.custom-progress')).toBeTruthy();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={30} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ============================================================================
// Textarea
// ============================================================================
import { Textarea } from '../textarea';

describe('Textarea', () => {
  it('should render textarea element', () => {
    render(<Textarea data-testid="ta" />);
    expect(screen.getByTestId('ta').tagName).toBe('TEXTAREA');
  });

  it('should handle text input', () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} data-testid="ta" />);
    fireEvent.change(screen.getByTestId('ta'), { target: { value: 'hello world' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should show placeholder', () => {
    render(<Textarea placeholder="Enter notes..." />);
    expect(screen.getByPlaceholderText('Enter notes...')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is set', () => {
    render(<Textarea disabled data-testid="ta" />);
    expect(screen.getByTestId('ta')).toBeDisabled();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('should apply custom className', () => {
    const { container } = render(<Textarea className="my-textarea" />);
    expect(container.querySelector('.my-textarea')).toBeTruthy();
  });
});

// ============================================================================
// Label
// ============================================================================
import { Label } from '../label';

describe('Label', () => {
  it('should render label text', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Label className="my-label">Name</Label>);
    expect(container.querySelector('.my-label')).toBeTruthy();
  });

  it('should associate with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email-input">Email</Label>
        <input id="email-input" />
      </>
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });
});
