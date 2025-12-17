// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - WCAG ACCESSIBILITY SERVICE
// Enterprise-grade WCAG 2.1 AA/AAA compliance utilities
// =============================================================================

/**
 * WCAG Compliance Levels
 */function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
export type WCAGLevel = 'A' | 'AA' | 'AAA';

/**
 * Color contrast ratios per WCAG 2.1
 */
export const CONTRAST_RATIOS = {
  AA_NORMAL_TEXT: 4.5,
  AA_LARGE_TEXT: 3,
  AAA_NORMAL_TEXT: 7,
  AAA_LARGE_TEXT: 4.5
} as const;

/**
 * Focus indicator configurations
 */
export const FOCUS_STYLES = {
  default: 'ring-2 ring-blue-500 ring-offset-2',
  highContrast: 'ring-4 ring-black ring-offset-4',
  outline: 'outline-2 outline-offset-2 outline-blue-500'
} as const;

/**
 * Keyboard navigation keys
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
} as const;

// =============================================================================
// COLOR CONTRAST UTILITIES
// =============================================================================

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): {
  r: number;
  g: number;
  b: number;
} | null {
  const result = (stryMutAct_9fa48("11029") ? /^#?([a-f\d]{2})([a-f\d]{2})([a-f\D]{2})$/i : stryMutAct_9fa48("11028") ? /^#?([a-f\d]{2})([a-f\d]{2})([^a-f\d]{2})$/i : stryMutAct_9fa48("11027") ? /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d])$/i : stryMutAct_9fa48("11026") ? /^#?([a-f\d]{2})([a-f\D]{2})([a-f\d]{2})$/i : stryMutAct_9fa48("11025") ? /^#?([a-f\d]{2})([^a-f\d]{2})([a-f\d]{2})$/i : stryMutAct_9fa48("11024") ? /^#?([a-f\d]{2})([a-f\d])([a-f\d]{2})$/i : stryMutAct_9fa48("11023") ? /^#?([a-f\D]{2})([a-f\d]{2})([a-f\d]{2})$/i : stryMutAct_9fa48("11022") ? /^#?([^a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i : stryMutAct_9fa48("11021") ? /^#?([a-f\d])([a-f\d]{2})([a-f\d]{2})$/i : stryMutAct_9fa48("11020") ? /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i : stryMutAct_9fa48("11019") ? /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i : stryMutAct_9fa48("11018") ? /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i : (stryCov_9fa48("11018", "11019", "11020", "11021", "11022", "11023", "11024", "11025", "11026", "11027", "11028", "11029"), /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)).exec(hex);
  return result ? stryMutAct_9fa48("11030") ? {} : (stryCov_9fa48("11030"), {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }) : null;
}

/**
 * Calculate relative luminance per WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = (stryMutAct_9fa48("11032") ? [] : (stryCov_9fa48("11032"), [r, g, b])).map(c => {
    const s = stryMutAct_9fa48("11034") ? c * 255 : (stryCov_9fa48("11034"), c / 255);
    return (stryMutAct_9fa48("11038") ? s > 0.03928 : stryMutAct_9fa48("11037") ? s < 0.03928 : stryMutAct_9fa48("11036") ? false : stryMutAct_9fa48("11035") ? true : (stryCov_9fa48("11035", "11036", "11037", "11038"), s <= 0.03928)) ? stryMutAct_9fa48("11039") ? s * 12.92 : (stryCov_9fa48("11039"), s / 12.92) : Math.pow(stryMutAct_9fa48("11040") ? (s + 0.055) * 1.055 : (stryCov_9fa48("11040"), (stryMutAct_9fa48("11041") ? s - 0.055 : (stryCov_9fa48("11041"), s + 0.055)) / 1.055), 2.4);
  });
  return stryMutAct_9fa48("11042") ? 0.2126 * rs + 0.7152 * gs - 0.0722 * bs : (stryCov_9fa48("11042"), (stryMutAct_9fa48("11043") ? 0.2126 * rs - 0.7152 * gs : (stryCov_9fa48("11043"), (stryMutAct_9fa48("11044") ? 0.2126 / rs : (stryCov_9fa48("11044"), 0.2126 * rs)) + (stryMutAct_9fa48("11045") ? 0.7152 / gs : (stryCov_9fa48("11045"), 0.7152 * gs)))) + (stryMutAct_9fa48("11046") ? 0.0722 / bs : (stryCov_9fa48("11046"), 0.0722 * bs)));
}

/**
 * Calculate contrast ratio between two colors
 * Returns value from 1 to 21
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  if (stryMutAct_9fa48("11050") ? !fg && !bg : stryMutAct_9fa48("11049") ? false : stryMutAct_9fa48("11048") ? true : (stryCov_9fa48("11048", "11049", "11050"), (stryMutAct_9fa48("11051") ? fg : (stryCov_9fa48("11051"), !fg)) || (stryMutAct_9fa48("11052") ? bg : (stryCov_9fa48("11052"), !bg)))) {
    return 1;
  }
  const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
  const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);
  const lighter = stryMutAct_9fa48("11054") ? Math.min(l1, l2) : (stryCov_9fa48("11054"), Math.max(l1, l2));
  const darker = stryMutAct_9fa48("11055") ? Math.max(l1, l2) : (stryCov_9fa48("11055"), Math.min(l1, l2));
  return stryMutAct_9fa48("11056") ? (lighter + 0.05) * (darker + 0.05) : (stryCov_9fa48("11056"), (stryMutAct_9fa48("11057") ? lighter - 0.05 : (stryCov_9fa48("11057"), lighter + 0.05)) / (stryMutAct_9fa48("11058") ? darker - 0.05 : (stryCov_9fa48("11058"), darker + 0.05)));
}

/**
 * Check if color combination meets WCAG contrast requirements
 */
export function meetsContrastRequirements(foreground: string, background: string, level: WCAGLevel = 'AA', isLargeText: boolean = stryMutAct_9fa48("11060") ? true : (stryCov_9fa48("11060"), false)): boolean {
  const ratio = getContrastRatio(foreground, background);
  if (stryMutAct_9fa48("11064") ? level !== 'AAA' : stryMutAct_9fa48("11063") ? false : stryMutAct_9fa48("11062") ? true : (stryCov_9fa48("11062", "11063", "11064"), level === 'AAA')) {
    return isLargeText ? stryMutAct_9fa48("11070") ? ratio < CONTRAST_RATIOS.AAA_LARGE_TEXT : stryMutAct_9fa48("11069") ? ratio > CONTRAST_RATIOS.AAA_LARGE_TEXT : stryMutAct_9fa48("11068") ? false : stryMutAct_9fa48("11067") ? true : (stryCov_9fa48("11067", "11068", "11069", "11070"), ratio >= CONTRAST_RATIOS.AAA_LARGE_TEXT) : stryMutAct_9fa48("11074") ? ratio < CONTRAST_RATIOS.AAA_NORMAL_TEXT : stryMutAct_9fa48("11073") ? ratio > CONTRAST_RATIOS.AAA_NORMAL_TEXT : stryMutAct_9fa48("11072") ? false : stryMutAct_9fa48("11071") ? true : (stryCov_9fa48("11071", "11072", "11073", "11074"), ratio >= CONTRAST_RATIOS.AAA_NORMAL_TEXT);
  }
  return isLargeText ? stryMutAct_9fa48("11078") ? ratio < CONTRAST_RATIOS.AA_LARGE_TEXT : stryMutAct_9fa48("11077") ? ratio > CONTRAST_RATIOS.AA_LARGE_TEXT : stryMutAct_9fa48("11076") ? false : stryMutAct_9fa48("11075") ? true : (stryCov_9fa48("11075", "11076", "11077", "11078"), ratio >= CONTRAST_RATIOS.AA_LARGE_TEXT) : stryMutAct_9fa48("11082") ? ratio < CONTRAST_RATIOS.AA_NORMAL_TEXT : stryMutAct_9fa48("11081") ? ratio > CONTRAST_RATIOS.AA_NORMAL_TEXT : stryMutAct_9fa48("11080") ? false : stryMutAct_9fa48("11079") ? true : (stryCov_9fa48("11079", "11080", "11081", "11082"), ratio >= CONTRAST_RATIOS.AA_NORMAL_TEXT);
}

/**
 * Suggest accessible color alternatives
 */
export function suggestAccessibleColor(color: string, background: string, level: WCAGLevel = 'AA'): string {
  const targetRatio = (stryMutAct_9fa48("11087") ? level !== 'AAA' : stryMutAct_9fa48("11086") ? false : stryMutAct_9fa48("11085") ? true : (stryCov_9fa48("11085", "11086", "11087"), level === 'AAA')) ? CONTRAST_RATIOS.AAA_NORMAL_TEXT : CONTRAST_RATIOS.AA_NORMAL_TEXT;
  const rgb = hexToRgb(color);
  if (stryMutAct_9fa48("11091") ? false : stryMutAct_9fa48("11090") ? true : stryMutAct_9fa48("11089") ? rgb : (stryCov_9fa48("11089", "11090", "11091"), !rgb)) {
    return color;
  }

  // Try darkening or lightening the color
  let adjustedColor = color;
  let currentRatio = getContrastRatio(color, background);

  // Determine if we should lighten or darken
  const bgLum = hexToRgb(background);
  const isLightBg = bgLum ? stryMutAct_9fa48("11096") ? getRelativeLuminance(bgLum.r, bgLum.g, bgLum.b) <= 0.5 : stryMutAct_9fa48("11095") ? getRelativeLuminance(bgLum.r, bgLum.g, bgLum.b) >= 0.5 : stryMutAct_9fa48("11094") ? false : stryMutAct_9fa48("11093") ? true : (stryCov_9fa48("11093", "11094", "11095", "11096"), getRelativeLuminance(bgLum.r, bgLum.g, bgLum.b) > 0.5) : stryMutAct_9fa48("11097") ? false : (stryCov_9fa48("11097"), true);
  for (let i = 0; stryMutAct_9fa48("11099") ? i < 100 || currentRatio < targetRatio : stryMutAct_9fa48("11098") ? false : (stryCov_9fa48("11098", "11099"), (stryMutAct_9fa48("11102") ? i >= 100 : stryMutAct_9fa48("11101") ? i <= 100 : stryMutAct_9fa48("11100") ? true : (stryCov_9fa48("11100", "11101", "11102"), i < 100)) && (stryMutAct_9fa48("11105") ? currentRatio >= targetRatio : stryMutAct_9fa48("11104") ? currentRatio <= targetRatio : stryMutAct_9fa48("11103") ? true : (stryCov_9fa48("11103", "11104", "11105"), currentRatio < targetRatio))); stryMutAct_9fa48("11106") ? i-- : (stryCov_9fa48("11106"), i++)) {
    const factor = isLightBg ? 0.95 : 1.05;
    const newR = stryMutAct_9fa48("11108") ? Math.max(255, Math.max(0, Math.round(rgb.r * factor))) : (stryCov_9fa48("11108"), Math.min(255, stryMutAct_9fa48("11109") ? Math.min(0, Math.round(rgb.r * factor)) : (stryCov_9fa48("11109"), Math.max(0, Math.round(stryMutAct_9fa48("11110") ? rgb.r / factor : (stryCov_9fa48("11110"), rgb.r * factor))))));
    const newG = stryMutAct_9fa48("11111") ? Math.max(255, Math.max(0, Math.round(rgb.g * factor))) : (stryCov_9fa48("11111"), Math.min(255, stryMutAct_9fa48("11112") ? Math.min(0, Math.round(rgb.g * factor)) : (stryCov_9fa48("11112"), Math.max(0, Math.round(stryMutAct_9fa48("11113") ? rgb.g / factor : (stryCov_9fa48("11113"), rgb.g * factor))))));
    const newB = stryMutAct_9fa48("11114") ? Math.max(255, Math.max(0, Math.round(rgb.b * factor))) : (stryCov_9fa48("11114"), Math.min(255, stryMutAct_9fa48("11115") ? Math.min(0, Math.round(rgb.b * factor)) : (stryCov_9fa48("11115"), Math.max(0, Math.round(stryMutAct_9fa48("11116") ? rgb.b / factor : (stryCov_9fa48("11116"), rgb.b * factor))))));
    rgb.r = newR;
    rgb.g = newG;
    rgb.b = newB;
    adjustedColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    currentRatio = getContrastRatio(adjustedColor, background);
  }
  return adjustedColor;
}

// =============================================================================
// FOCUS MANAGEMENT
// =============================================================================

/**
 * Focus trap for modals and dialogs
 */
export class FocusTrap {
  private container: HTMLElement;
  private previousActiveElement: Element | null = null;
  private focusableElements: HTMLElement[] = stryMutAct_9fa48("11121") ? ["Stryker was here"] : (stryCov_9fa48("11121"), []);
  constructor(container: HTMLElement) {
    this.container = container;
    this.updateFocusableElements();
  }
  private updateFocusableElements(): void {
    const selectors = stryMutAct_9fa48("11124") ? [] : (stryCov_9fa48("11124"), ['a[href]', 'button:not([disabled])', 'textarea:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])']);
    this.focusableElements = Array.from(this.container.querySelectorAll<HTMLElement>(selectors.join(', ')));
  }
  activate(): void {
    this.previousActiveElement = document.activeElement;
    this.container.addEventListener('keydown', this.handleKeyDown);

    // Focus first element
    if (stryMutAct_9fa48("11137") ? this.focusableElements.length <= 0 : stryMutAct_9fa48("11136") ? this.focusableElements.length >= 0 : stryMutAct_9fa48("11135") ? false : stryMutAct_9fa48("11134") ? true : (stryCov_9fa48("11134", "11135", "11136", "11137"), this.focusableElements.length > 0)) {
      this.focusableElements[0].focus();
    }
  }
  deactivate(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);

    // Restore focus
    if (stryMutAct_9fa48("11142") ? false : stryMutAct_9fa48("11141") ? true : (stryCov_9fa48("11141", "11142"), this.previousActiveElement instanceof HTMLElement)) {
      this.previousActiveElement.focus();
    }
  }
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (stryMutAct_9fa48("11147") ? event.key === KEYBOARD_KEYS.TAB : stryMutAct_9fa48("11146") ? false : stryMutAct_9fa48("11145") ? true : (stryCov_9fa48("11145", "11146", "11147"), event.key !== KEYBOARD_KEYS.TAB)) {
      return;
    }
    this.updateFocusableElements();
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[stryMutAct_9fa48("11149") ? this.focusableElements.length + 1 : (stryCov_9fa48("11149"), this.focusableElements.length - 1)];
    if (stryMutAct_9fa48("11152") ? event.shiftKey || document.activeElement === firstElement : stryMutAct_9fa48("11151") ? false : stryMutAct_9fa48("11150") ? true : (stryCov_9fa48("11150", "11151", "11152"), event.shiftKey && (stryMutAct_9fa48("11154") ? document.activeElement !== firstElement : stryMutAct_9fa48("11153") ? true : (stryCov_9fa48("11153", "11154"), document.activeElement === firstElement)))) {
      event.preventDefault();
      stryMutAct_9fa48("11156") ? lastElement.focus() : (stryCov_9fa48("11156"), lastElement?.focus());
    } else if (stryMutAct_9fa48("11159") ? !event.shiftKey || document.activeElement === lastElement : stryMutAct_9fa48("11158") ? false : stryMutAct_9fa48("11157") ? true : (stryCov_9fa48("11157", "11158", "11159"), (stryMutAct_9fa48("11160") ? event.shiftKey : (stryCov_9fa48("11160"), !event.shiftKey)) && (stryMutAct_9fa48("11162") ? document.activeElement !== lastElement : stryMutAct_9fa48("11161") ? true : (stryCov_9fa48("11161", "11162"), document.activeElement === lastElement)))) {
      event.preventDefault();
      stryMutAct_9fa48("11164") ? firstElement.focus() : (stryCov_9fa48("11164"), firstElement?.focus());
    }
  };
}

// =============================================================================
// SCREEN READER UTILITIES
// =============================================================================

/**
 * Create visually hidden text for screen readers only
 */
export function createScreenReaderText(text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.textContent = text;
  span.className = 'sr-only';
  span.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  return span;
}

/**
 * Announce text to screen readers using ARIA live region
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const liveRegion = stryMutAct_9fa48("11173") ? document.getElementById('a11y-announcer') && createLiveRegion() : stryMutAct_9fa48("11172") ? false : stryMutAct_9fa48("11171") ? true : (stryCov_9fa48("11171", "11172", "11173"), document.getElementById('a11y-announcer') || createLiveRegion());
  liveRegion.setAttribute('aria-live', priority);

  // Clear and set new message (necessary for repeat announcements)
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}
function createLiveRegion(): HTMLDivElement {
  const region = document.createElement('div');
  region.id = 'a11y-announcer';
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  region.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(region);
  return region;
}

// =============================================================================
// KEYBOARD NAVIGATION UTILITIES
// =============================================================================

/**
 * Generate keyboard event handler for arrow key navigation
 */
export function createArrowKeyHandler(items: HTMLElement[], options: {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  onSelect?: (item: HTMLElement, index: number) => void;
} = {}): (event: KeyboardEvent) => void {
  const {
    orientation = 'vertical',
    loop = stryMutAct_9fa48("11189") ? false : (stryCov_9fa48("11189"), true),
    onSelect
  } = options;
  return (event: KeyboardEvent) => {
    const currentIndex = items.findIndex(stryMutAct_9fa48("11191") ? () => undefined : (stryCov_9fa48("11191"), item => stryMutAct_9fa48("11194") ? item !== document.activeElement : stryMutAct_9fa48("11193") ? false : stryMutAct_9fa48("11192") ? true : (stryCov_9fa48("11192", "11193", "11194"), item === document.activeElement)));
    if (stryMutAct_9fa48("11197") ? currentIndex !== -1 : stryMutAct_9fa48("11196") ? false : stryMutAct_9fa48("11195") ? true : (stryCov_9fa48("11195", "11196", "11197"), currentIndex === (stryMutAct_9fa48("11198") ? +1 : (stryCov_9fa48("11198"), -1)))) {
      return;
    }
    let nextIndex = currentIndex;
    const isVertical = stryMutAct_9fa48("11202") ? orientation === 'vertical' && orientation === 'both' : stryMutAct_9fa48("11201") ? false : stryMutAct_9fa48("11200") ? true : (stryCov_9fa48("11200", "11201", "11202"), (stryMutAct_9fa48("11204") ? orientation !== 'vertical' : stryMutAct_9fa48("11203") ? false : (stryCov_9fa48("11203", "11204"), orientation === 'vertical')) || (stryMutAct_9fa48("11207") ? orientation !== 'both' : stryMutAct_9fa48("11206") ? false : (stryCov_9fa48("11206", "11207"), orientation === 'both')));
    const isHorizontal = stryMutAct_9fa48("11211") ? orientation === 'horizontal' && orientation === 'both' : stryMutAct_9fa48("11210") ? false : stryMutAct_9fa48("11209") ? true : (stryCov_9fa48("11209", "11210", "11211"), (stryMutAct_9fa48("11213") ? orientation !== 'horizontal' : stryMutAct_9fa48("11212") ? false : (stryCov_9fa48("11212", "11213"), orientation === 'horizontal')) || (stryMutAct_9fa48("11216") ? orientation !== 'both' : stryMutAct_9fa48("11215") ? false : (stryCov_9fa48("11215", "11216"), orientation === 'both')));
    switch (event.key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
        if (stryMutAct_9fa48("11218")) {} else {
          stryCov_9fa48("11218");
          if (stryMutAct_9fa48("11220") ? false : stryMutAct_9fa48("11219") ? true : (stryCov_9fa48("11219", "11220"), isVertical)) {
            nextIndex = stryMutAct_9fa48("11222") ? currentIndex - 1 : (stryCov_9fa48("11222"), currentIndex + 1);
            event.preventDefault();
          }
          break;
        }
      case KEYBOARD_KEYS.ARROW_UP:
        if (stryMutAct_9fa48("11223")) {} else {
          stryCov_9fa48("11223");
          if (stryMutAct_9fa48("11225") ? false : stryMutAct_9fa48("11224") ? true : (stryCov_9fa48("11224", "11225"), isVertical)) {
            nextIndex = stryMutAct_9fa48("11227") ? currentIndex + 1 : (stryCov_9fa48("11227"), currentIndex - 1);
            event.preventDefault();
          }
          break;
        }
      case KEYBOARD_KEYS.ARROW_RIGHT:
        if (stryMutAct_9fa48("11228")) {} else {
          stryCov_9fa48("11228");
          if (stryMutAct_9fa48("11230") ? false : stryMutAct_9fa48("11229") ? true : (stryCov_9fa48("11229", "11230"), isHorizontal)) {
            nextIndex = stryMutAct_9fa48("11232") ? currentIndex - 1 : (stryCov_9fa48("11232"), currentIndex + 1);
            event.preventDefault();
          }
          break;
        }
      case KEYBOARD_KEYS.ARROW_LEFT:
        if (stryMutAct_9fa48("11233")) {} else {
          stryCov_9fa48("11233");
          if (stryMutAct_9fa48("11235") ? false : stryMutAct_9fa48("11234") ? true : (stryCov_9fa48("11234", "11235"), isHorizontal)) {
            nextIndex = stryMutAct_9fa48("11237") ? currentIndex + 1 : (stryCov_9fa48("11237"), currentIndex - 1);
            event.preventDefault();
          }
          break;
        }
      case KEYBOARD_KEYS.HOME:
        if (stryMutAct_9fa48("11238")) {} else {
          stryCov_9fa48("11238");
          nextIndex = 0;
          event.preventDefault();
          break;
        }
      case KEYBOARD_KEYS.END:
        if (stryMutAct_9fa48("11239")) {} else {
          stryCov_9fa48("11239");
          nextIndex = stryMutAct_9fa48("11240") ? items.length + 1 : (stryCov_9fa48("11240"), items.length - 1);
          event.preventDefault();
          break;
        }
      case KEYBOARD_KEYS.ENTER:
      case KEYBOARD_KEYS.SPACE:
        if (stryMutAct_9fa48("11241")) {} else {
          stryCov_9fa48("11241");
          if (stryMutAct_9fa48("11243") ? false : stryMutAct_9fa48("11242") ? true : (stryCov_9fa48("11242", "11243"), onSelect)) {
            onSelect(items[currentIndex], currentIndex);
            event.preventDefault();
          }
          return;
        }
      default:
        if (stryMutAct_9fa48("11245")) {} else {
          stryCov_9fa48("11245");
          return;
        }
    }

    // Handle looping
    if (stryMutAct_9fa48("11247") ? false : stryMutAct_9fa48("11246") ? true : (stryCov_9fa48("11246", "11247"), loop)) {
      if (stryMutAct_9fa48("11252") ? nextIndex >= 0 : stryMutAct_9fa48("11251") ? nextIndex <= 0 : stryMutAct_9fa48("11250") ? false : stryMutAct_9fa48("11249") ? true : (stryCov_9fa48("11249", "11250", "11251", "11252"), nextIndex < 0)) {
        nextIndex = stryMutAct_9fa48("11254") ? items.length + 1 : (stryCov_9fa48("11254"), items.length - 1);
      }
      if (stryMutAct_9fa48("11258") ? nextIndex < items.length : stryMutAct_9fa48("11257") ? nextIndex > items.length : stryMutAct_9fa48("11256") ? false : stryMutAct_9fa48("11255") ? true : (stryCov_9fa48("11255", "11256", "11257", "11258"), nextIndex >= items.length)) {
        nextIndex = 0;
      }
    } else {
      nextIndex = stryMutAct_9fa48("11261") ? Math.min(0, Math.min(items.length - 1, nextIndex)) : (stryCov_9fa48("11261"), Math.max(0, stryMutAct_9fa48("11262") ? Math.max(items.length - 1, nextIndex) : (stryCov_9fa48("11262"), Math.min(stryMutAct_9fa48("11263") ? items.length + 1 : (stryCov_9fa48("11263"), items.length - 1), nextIndex))));
    }
    stryMutAct_9fa48("11264") ? items[nextIndex].focus() : (stryCov_9fa48("11264"), items[nextIndex]?.focus());
  };
}

// =============================================================================
// WCAG COMPLIANCE CHECKER
// =============================================================================

export interface AccessibilityIssue {
  type: 'error' | 'warning';
  rule: string;
  element: string;
  message: string;
  wcagCriteria: string;
  level: WCAGLevel;
}

/**
 * Check element for accessibility issues
 */
export function checkElementAccessibility(element: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = stryMutAct_9fa48("11266") ? ["Stryker was here"] : (stryCov_9fa48("11266"), []);

  // Check for alt text on images
  if (stryMutAct_9fa48("11269") ? element.tagName !== 'IMG' : stryMutAct_9fa48("11268") ? false : stryMutAct_9fa48("11267") ? true : (stryCov_9fa48("11267", "11268", "11269"), element.tagName === 'IMG')) {
    const alt = element.getAttribute('alt');
    if (stryMutAct_9fa48("11275") ? false : stryMutAct_9fa48("11274") ? true : stryMutAct_9fa48("11273") ? alt : (stryCov_9fa48("11273", "11274", "11275"), !alt)) {
      issues.push(stryMutAct_9fa48("11277") ? {} : (stryCov_9fa48("11277"), {
        type: 'error',
        rule: 'img-alt',
        element: stryMutAct_9fa48("11280") ? element.outerHTML : (stryCov_9fa48("11280"), element.outerHTML.substring(0, 100)),
        message: 'Images must have alternative text',
        wcagCriteria: '1.1.1',
        level: 'A'
      }));
    }
  }

  // Check for button/link accessible names
  if (stryMutAct_9fa48("11286") ? element.tagName === 'BUTTON' && element.tagName === 'A' : stryMutAct_9fa48("11285") ? false : stryMutAct_9fa48("11284") ? true : (stryCov_9fa48("11284", "11285", "11286"), (stryMutAct_9fa48("11288") ? element.tagName !== 'BUTTON' : stryMutAct_9fa48("11287") ? false : (stryCov_9fa48("11287", "11288"), element.tagName === 'BUTTON')) || (stryMutAct_9fa48("11291") ? element.tagName !== 'A' : stryMutAct_9fa48("11290") ? false : (stryCov_9fa48("11290", "11291"), element.tagName === 'A')))) {
    const hasAccessibleName = stryMutAct_9fa48("11296") ? (element.textContent?.trim() || element.getAttribute('aria-label') || element.getAttribute('aria-labelledby')) && element.getAttribute('title') : stryMutAct_9fa48("11295") ? false : stryMutAct_9fa48("11294") ? true : (stryCov_9fa48("11294", "11295", "11296"), (stryMutAct_9fa48("11298") ? (element.textContent?.trim() || element.getAttribute('aria-label')) && element.getAttribute('aria-labelledby') : stryMutAct_9fa48("11297") ? false : (stryCov_9fa48("11297", "11298"), (stryMutAct_9fa48("11300") ? element.textContent?.trim() && element.getAttribute('aria-label') : stryMutAct_9fa48("11299") ? false : (stryCov_9fa48("11299", "11300"), (stryMutAct_9fa48("11302") ? element.textContent.trim() : stryMutAct_9fa48("11301") ? element.textContent : (stryCov_9fa48("11301", "11302"), element.textContent?.trim())) || element.getAttribute('aria-label'))) || element.getAttribute('aria-labelledby'))) || element.getAttribute('title'));
    if (stryMutAct_9fa48("11308") ? false : stryMutAct_9fa48("11307") ? true : stryMutAct_9fa48("11306") ? hasAccessibleName : (stryCov_9fa48("11306", "11307", "11308"), !hasAccessibleName)) {
      issues.push(stryMutAct_9fa48("11310") ? {} : (stryCov_9fa48("11310"), {
        type: 'error',
        rule: 'button-name',
        element: stryMutAct_9fa48("11313") ? element.outerHTML : (stryCov_9fa48("11313"), element.outerHTML.substring(0, 100)),
        message: 'Interactive elements must have accessible names',
        wcagCriteria: '4.1.2',
        level: 'A'
      }));
    }
  }

  // Check for form labels
  if (stryMutAct_9fa48("11319") ? (element.tagName === 'INPUT' || element.tagName === 'SELECT') && element.tagName === 'TEXTAREA' : stryMutAct_9fa48("11318") ? false : stryMutAct_9fa48("11317") ? true : (stryCov_9fa48("11317", "11318", "11319"), (stryMutAct_9fa48("11321") ? element.tagName === 'INPUT' && element.tagName === 'SELECT' : stryMutAct_9fa48("11320") ? false : (stryCov_9fa48("11320", "11321"), (stryMutAct_9fa48("11323") ? element.tagName !== 'INPUT' : stryMutAct_9fa48("11322") ? false : (stryCov_9fa48("11322", "11323"), element.tagName === 'INPUT')) || (stryMutAct_9fa48("11326") ? element.tagName !== 'SELECT' : stryMutAct_9fa48("11325") ? false : (stryCov_9fa48("11325", "11326"), element.tagName === 'SELECT')))) || (stryMutAct_9fa48("11329") ? element.tagName !== 'TEXTAREA' : stryMutAct_9fa48("11328") ? false : (stryCov_9fa48("11328", "11329"), element.tagName === 'TEXTAREA')))) {
    const id = element.getAttribute('id');
    const hasLabel = stryMutAct_9fa48("11335") ? (element.getAttribute('aria-label') || element.getAttribute('aria-labelledby')) && id && document.querySelector(`label[for="${id}"]`) : stryMutAct_9fa48("11334") ? false : stryMutAct_9fa48("11333") ? true : (stryCov_9fa48("11333", "11334", "11335"), (stryMutAct_9fa48("11337") ? element.getAttribute('aria-label') && element.getAttribute('aria-labelledby') : stryMutAct_9fa48("11336") ? false : (stryCov_9fa48("11336", "11337"), element.getAttribute('aria-label') || element.getAttribute('aria-labelledby'))) || (stryMutAct_9fa48("11341") ? id || document.querySelector(`label[for="${id}"]`) : stryMutAct_9fa48("11340") ? false : (stryCov_9fa48("11340", "11341"), id && document.querySelector(`label[for="${id}"]`))));
    if (stryMutAct_9fa48("11345") ? false : stryMutAct_9fa48("11344") ? true : stryMutAct_9fa48("11343") ? hasLabel : (stryCov_9fa48("11343", "11344", "11345"), !hasLabel)) {
      issues.push(stryMutAct_9fa48("11347") ? {} : (stryCov_9fa48("11347"), {
        type: 'error',
        rule: 'form-label',
        element: stryMutAct_9fa48("11350") ? element.outerHTML : (stryCov_9fa48("11350"), element.outerHTML.substring(0, 100)),
        message: 'Form controls must have associated labels',
        wcagCriteria: '1.3.1',
        level: 'A'
      }));
    }
  }

  // Check for heading hierarchy
  if (stryMutAct_9fa48("11355") ? false : stryMutAct_9fa48("11354") ? true : (stryCov_9fa48("11354", "11355"), (stryMutAct_9fa48("11358") ? /^H[^1-6]$/ : stryMutAct_9fa48("11357") ? /^H[1-6]/ : stryMutAct_9fa48("11356") ? /H[1-6]$/ : (stryCov_9fa48("11356", "11357", "11358"), /^H[1-6]$/)).test(element.tagName))) {
    const level = parseInt(element.tagName[1]);
    const previousHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    for (const h of previousHeadings) {
      if (stryMutAct_9fa48("11364") ? h !== element : stryMutAct_9fa48("11363") ? false : stryMutAct_9fa48("11362") ? true : (stryCov_9fa48("11362", "11363", "11364"), h === element)) {
        break;
      }
      previousLevel = parseInt(h.tagName[1]);
    }
    if (stryMutAct_9fa48("11368") ? previousLevel > 0 || level > previousLevel + 1 : stryMutAct_9fa48("11367") ? false : stryMutAct_9fa48("11366") ? true : (stryCov_9fa48("11366", "11367", "11368"), (stryMutAct_9fa48("11371") ? previousLevel <= 0 : stryMutAct_9fa48("11370") ? previousLevel >= 0 : stryMutAct_9fa48("11369") ? true : (stryCov_9fa48("11369", "11370", "11371"), previousLevel > 0)) && (stryMutAct_9fa48("11374") ? level <= previousLevel + 1 : stryMutAct_9fa48("11373") ? level >= previousLevel + 1 : stryMutAct_9fa48("11372") ? true : (stryCov_9fa48("11372", "11373", "11374"), level > (stryMutAct_9fa48("11375") ? previousLevel - 1 : (stryCov_9fa48("11375"), previousLevel + 1)))))) {
      issues.push(stryMutAct_9fa48("11377") ? {} : (stryCov_9fa48("11377"), {
        type: 'warning',
        rule: 'heading-order',
        element: stryMutAct_9fa48("11380") ? element.outerHTML : (stryCov_9fa48("11380"), element.outerHTML.substring(0, 100)),
        message: `Heading level skipped: h${previousLevel} to h${level}`,
        wcagCriteria: '1.3.1',
        level: 'A'
      }));
    }
  }

  // Check for empty links
  if (stryMutAct_9fa48("11386") ? element.tagName === 'A' || element.getAttribute('href') : stryMutAct_9fa48("11385") ? false : stryMutAct_9fa48("11384") ? true : (stryCov_9fa48("11384", "11385", "11386"), (stryMutAct_9fa48("11388") ? element.tagName !== 'A' : stryMutAct_9fa48("11387") ? true : (stryCov_9fa48("11387", "11388"), element.tagName === 'A')) && element.getAttribute('href'))) {
    const isEmpty = stryMutAct_9fa48("11394") ? !element.textContent?.trim() && !element.querySelector('img[alt]') || !element.getAttribute('aria-label') : stryMutAct_9fa48("11393") ? false : stryMutAct_9fa48("11392") ? true : (stryCov_9fa48("11392", "11393", "11394"), (stryMutAct_9fa48("11396") ? !element.textContent?.trim() || !element.querySelector('img[alt]') : stryMutAct_9fa48("11395") ? true : (stryCov_9fa48("11395", "11396"), (stryMutAct_9fa48("11397") ? element.textContent?.trim() : (stryCov_9fa48("11397"), !(stryMutAct_9fa48("11399") ? element.textContent.trim() : stryMutAct_9fa48("11398") ? element.textContent : (stryCov_9fa48("11398", "11399"), element.textContent?.trim())))) && (stryMutAct_9fa48("11400") ? element.querySelector('img[alt]') : (stryCov_9fa48("11400"), !element.querySelector('img[alt]'))))) && (stryMutAct_9fa48("11402") ? element.getAttribute('aria-label') : (stryCov_9fa48("11402"), !element.getAttribute('aria-label'))));
    if (stryMutAct_9fa48("11405") ? false : stryMutAct_9fa48("11404") ? true : (stryCov_9fa48("11404", "11405"), isEmpty)) {
      issues.push(stryMutAct_9fa48("11407") ? {} : (stryCov_9fa48("11407"), {
        type: 'error',
        rule: 'link-name',
        element: stryMutAct_9fa48("11410") ? element.outerHTML : (stryCov_9fa48("11410"), element.outerHTML.substring(0, 100)),
        message: 'Links must have discernible text',
        wcagCriteria: '2.4.4',
        level: 'A'
      }));
    }
  }
  return issues;
}

/**
 * Run full page accessibility audit
 */
export function runAccessibilityAudit(container: HTMLElement = document.body): {
  issues: AccessibilityIssue[];
  summary: {
    errors: number;
    warnings: number;
    passed: number;
  };
} {
  const allElements = container.querySelectorAll('*');
  const issues: AccessibilityIssue[] = stryMutAct_9fa48("11416") ? ["Stryker was here"] : (stryCov_9fa48("11416"), []);
  allElements.forEach(el => {
    if (stryMutAct_9fa48("11419") ? false : stryMutAct_9fa48("11418") ? true : (stryCov_9fa48("11418", "11419"), el instanceof HTMLElement)) {
      issues.push(...checkElementAccessibility(el));
    }
  });
  return stryMutAct_9fa48("11421") ? {} : (stryCov_9fa48("11421"), {
    issues,
    summary: stryMutAct_9fa48("11422") ? {} : (stryCov_9fa48("11422"), {
      errors: stryMutAct_9fa48("11423") ? issues.length : (stryCov_9fa48("11423"), issues.filter(stryMutAct_9fa48("11424") ? () => undefined : (stryCov_9fa48("11424"), i => stryMutAct_9fa48("11427") ? i.type !== 'error' : stryMutAct_9fa48("11426") ? false : stryMutAct_9fa48("11425") ? true : (stryCov_9fa48("11425", "11426", "11427"), i.type === 'error'))).length),
      warnings: stryMutAct_9fa48("11429") ? issues.length : (stryCov_9fa48("11429"), issues.filter(stryMutAct_9fa48("11430") ? () => undefined : (stryCov_9fa48("11430"), i => stryMutAct_9fa48("11433") ? i.type !== 'warning' : stryMutAct_9fa48("11432") ? false : stryMutAct_9fa48("11431") ? true : (stryCov_9fa48("11431", "11432", "11433"), i.type === 'warning'))).length),
      passed: stryMutAct_9fa48("11435") ? allElements.length + issues.length : (stryCov_9fa48("11435"), allElements.length - issues.length)
    })
  });
}

// =============================================================================
// REDUCED MOTION PREFERENCE
// =============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Subscribe to reduced motion preference changes
 */
export function onReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = stryMutAct_9fa48("11440") ? () => undefined : (stryCov_9fa48("11440"), (() => {
    const handler = (event: MediaQueryListEvent) => callback(event.matches);
    return handler;
  })());
  mediaQuery.addEventListener('change', handler);
  return stryMutAct_9fa48("11442") ? () => undefined : (stryCov_9fa48("11442"), () => mediaQuery.removeEventListener('change', handler));
}

// =============================================================================
// HIGH CONTRAST MODE
// =============================================================================

/**
 * Check if user has high contrast mode enabled
 */
export function prefersHighContrast(): boolean {
  return stryMutAct_9fa48("11447") ? window.matchMedia('(prefers-contrast: more)').matches && window.matchMedia('(-ms-high-contrast: active)').matches : stryMutAct_9fa48("11446") ? false : stryMutAct_9fa48("11445") ? true : (stryCov_9fa48("11445", "11446", "11447"), window.matchMedia('(prefers-contrast: more)').matches || window.matchMedia('(-ms-high-contrast: active)').matches);
}

/**
 * Get appropriate color scheme based on system preferences
 */
export function getPreferredColorScheme(): 'light' | 'dark' | 'high-contrast' {
  if (stryMutAct_9fa48("11452") ? false : stryMutAct_9fa48("11451") ? true : (stryCov_9fa48("11451", "11452"), prefersHighContrast())) {
    return 'high-contrast';
  }
  if (stryMutAct_9fa48("11456") ? false : stryMutAct_9fa48("11455") ? true : (stryCov_9fa48("11455", "11456"), window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    return 'dark';
  }
  return 'light';
}

// =============================================================================
// SKIP LINKS
// =============================================================================

/**
 * Create skip link element
 */
export function createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = `#${targetId}`;
  link.textContent = text;
  link.className = 'sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600 focus:underline';
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (stryMutAct_9fa48("11469") ? false : stryMutAct_9fa48("11468") ? true : (stryCov_9fa48("11468", "11469"), target)) {
      target.focus();
      target.scrollIntoView(stryMutAct_9fa48("11471") ? {} : (stryCov_9fa48("11471"), {
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      }));
    }
  });
  return link;
}

// =============================================================================
// WCAG SERVICE CLASS
// =============================================================================

class WCAGService {
  private static instance: WCAGService;
  private initialized = stryMutAct_9fa48("11474") ? true : (stryCov_9fa48("11474"), false);
  static getInstance(): WCAGService {
    if (stryMutAct_9fa48("11478") ? false : stryMutAct_9fa48("11477") ? true : stryMutAct_9fa48("11476") ? WCAGService.instance : (stryCov_9fa48("11476", "11477", "11478"), !WCAGService.instance)) {
      WCAGService.instance = new WCAGService();
    }
    return WCAGService.instance;
  }

  /**
   * Initialize WCAG service with global accessibility enhancements
   */
  initialize(): void {
    if (stryMutAct_9fa48("11482") ? false : stryMutAct_9fa48("11481") ? true : (stryCov_9fa48("11481", "11482"), this.initialized)) {
      return;
    }

    // Add live region for announcements
    createLiveRegion();

    // Add skip link if main content exists
    const mainContent = stryMutAct_9fa48("11486") ? document.querySelector('main[id]') && document.getElementById('main-content') : stryMutAct_9fa48("11485") ? false : stryMutAct_9fa48("11484") ? true : (stryCov_9fa48("11484", "11485", "11486"), document.querySelector('main[id]') || document.getElementById('main-content'));
    if (stryMutAct_9fa48("11491") ? mainContent || mainContent.id : stryMutAct_9fa48("11490") ? false : stryMutAct_9fa48("11489") ? true : (stryCov_9fa48("11489", "11490", "11491"), mainContent && mainContent.id)) {
      const skipLink = createSkipLink(mainContent.id);
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Listen for reduced motion preference
    onReducedMotionChange(prefersReduced => {
      document.documentElement.classList.toggle('reduce-motion', prefersReduced);
    });

    // Apply initial reduced motion class
    if (stryMutAct_9fa48("11496") ? false : stryMutAct_9fa48("11495") ? true : (stryCov_9fa48("11495", "11496"), prefersReducedMotion())) {
      document.documentElement.classList.add('reduce-motion');
    }

    // Apply high contrast mode class
    if (stryMutAct_9fa48("11500") ? false : stryMutAct_9fa48("11499") ? true : (stryCov_9fa48("11499", "11500"), prefersHighContrast())) {
      document.documentElement.classList.add('high-contrast');
    }
    this.initialized = stryMutAct_9fa48("11503") ? false : (stryCov_9fa48("11503"), true);
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    announceToScreenReader(message, priority);
  }

  /**
   * Run accessibility audit on element or page
   */
  audit(container?: HTMLElement) {
    return runAccessibilityAudit(container);
  }

  /**
   * Check color contrast
   */
  checkContrast(foreground: string, background: string, level: WCAGLevel = 'AA') {
    const ratio = getContrastRatio(foreground, background);
    const passes = meetsContrastRequirements(foreground, background, level);
    return stryMutAct_9fa48("11509") ? {} : (stryCov_9fa48("11509"), {
      ratio,
      passes,
      level
    });
  }

  /**
   * Create focus trap for modal/dialog
   */
  createFocusTrap(container: HTMLElement): FocusTrap {
    return new FocusTrap(container);
  }

  /**
   * Get user's accessibility preferences
   */
  getPreferences() {
    return stryMutAct_9fa48("11512") ? {} : (stryCov_9fa48("11512"), {
      prefersReducedMotion: prefersReducedMotion(),
      prefersHighContrast: prefersHighContrast(),
      colorScheme: getPreferredColorScheme()
    });
  }
}
export const wcagService = WCAGService.getInstance();
export default wcagService;